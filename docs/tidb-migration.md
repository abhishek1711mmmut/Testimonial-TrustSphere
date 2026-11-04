# TiDB Cloud connection

TrustSphere can use a MySQL-compatible TiDB Cloud Starter instance without
changing its SQL services. Configure the backend from TiDB's Connect dialog:

```dotenv
MYSQL_USER=instance_prefix.root
MYSQL_PASSWORD=...
MYSQL_HOST=gateway01.<region>.prod.aws.tidbcloud.com
MYSQL_PORT=4000
MYSQL_DB=test
MYSQL_SSL=true
```

The username must include TiDB's instance prefix. `MYSQL_DB` should be an
application database such as `test` or `trustsphere`; `sys` is a system schema
and should only be used as the default schema in a database client. Create the
application database in TiDB before deploying if it does not already exist.

The backend enables `VERIFY_IDENTITY` when `MYSQL_SSL=true` and uses the runtime
system CA bundle. Set `MYSQL_SSL_CA` when the deployment image does not expose a
usable CA bundle. Never commit the password or the CA certificate to the repo.

TiDB Cloud Starter public connections require TLS. Public endpoint connections
can be terminated after an idle timeout or during maintenance, so the backend
must tolerate a reconnect on a later request. The application should not depend
on one permanent connection. The free tier also has usage quotas and connection
limits.

## Migration

1. Export the existing database schema and rows.
2. Create the target application database in TiDB.
3. Import the schema and data through TiDB SQL Shell, `mysql`, or DBeaver.
4. Configure the backend deployment variables above and restart it.
5. Verify `/api`, login, space creation, testimonial submission, and embeds.

The backend initialization creates missing TrustSphere tables and seeds plans, but
it does not migrate existing rows automatically.

The OTP schema intentionally does not create a MySQL scheduled event. TiDB does
not support MySQL Events, so expired OTP rows are cleaned up when a new OTP is
requested; verification still enforces the ten-minute expiration window.

## macOS error 2059

If the backend reports:

```text
Authentication plugin 'mysql_native_password' cannot be loaded
```

check which client library the virtual environment uses. Homebrew MySQL 9.x no
longer ships this client plugin, while TiDB may request it during authentication.
Install the MySQL 8 client and rebuild `mysqlclient` so it links to that library:

```bash
brew install mysql-client@8.0
cd Backend
source venv/bin/activate
MYSQL8_PREFIX="$(brew --prefix mysql-client@8.0)"
export PATH="$MYSQL8_PREFIX/bin:$PATH"
export LDFLAGS="-L$MYSQL8_PREFIX/lib"
export CPPFLAGS="-I$MYSQL8_PREFIX/include"
python -m pip uninstall -y mysqlclient
python -m pip install --no-cache-dir mysqlclient
python app.py
```

Run `python app.py` from the `Backend` directory. If the prompt already ends in
`Backend %`, do not run `cd Backend` again. The `mysqlclient` package is compiled
against a native library, so installing the older command-line client alone is
not enough; it must be reinstalled with the MySQL 8 paths exported.

To verify the library after installation:

```bash
otool -L venv/lib/python3.9/site-packages/MySQLdb/_mysql*.so
```

The output should reference `mysql-client@8.0`, rather than Homebrew MySQL 9.x.
