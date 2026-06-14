# Setup Guide (macOS)

Complete steps to run TrustSphere locally on a Mac.

---

## Prerequisites

### 1. Install Homebrew (if not already installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After installation, follow the terminal instructions to add Homebrew to your PATH:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### 2. Install Python 3

```bash
brew install python@3.11
```

Verify installation:

```bash
python3 --version   # Should show 3.11.x
pip3 --version
```

### 3. Install Node.js (v18+ recommended)

```bash
brew install node@18
```

Verify:

```bash
node --version   # Should show v18.x
npm --version
```

### 4. Install MySQL

```bash
brew install mysql
```

Start MySQL service:

```bash
brew services start mysql
```

Secure the installation (set root password):

```bash
mysql_secure_installation
```

Create the database:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE trustsphere;
CREATE USER 'trustsphere_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON trustsphere.* TO 'trustsphere_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Important:** MySQL's event scheduler must be enabled for OTP auto-cleanup:

```sql
SET GLOBAL event_scheduler = ON;
```

---

## Backend Setup

### 1. Navigate to backend directory

```bash
cd Backend
```

### 2. Create and activate a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### 3. Install Python dependencies

```bash
pip install -r requirements.txt
```

**Note:** `Flask-MySQLdb` requires the MySQL client library. If installation fails:

```bash
brew install mysql-client pkg-config
export PKG_CONFIG_PATH="/opt/homebrew/opt/mysql-client/lib/pkgconfig"
pip install mysqlclient
pip install -r requirements.txt
```

### 4. Create environment file

Create a `.env` file in the `Backend/` directory:

```env
# MySQL
MYSQL_USER=trustsphere_user
MYSQL_PASSWORD=your_password
MYSQL_HOST=localhost
MYSQL_DB=trustsphere

# JWT
JWT_SECRET_KEY=your_jwt_secret_key_here

# Flask-Mail (for OTP emails)
MAIL_SERVER=smtp.gmail.com
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Cloudinary (for image/video uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Gmail App Password:** Go to Google Account > Security > 2-Step Verification > App passwords. Generate a password for "Mail".

**Cloudinary:** Sign up at https://cloudinary.com (free tier). Get credentials from the Dashboard.

### 5. Run the backend

```bash
python app.py
```

Backend will start at `http://localhost:5000`. Tables are auto-created on startup.

---

## Frontend Setup

### 1. Navigate to frontend directory

```bash
cd Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env.local` file in the `Frontend/` directory:

```env
NEXT_PUBLIC_FLASK_API_URL=http://localhost:5000
```

### 4. Run the frontend

```bash
npm run dev
```

Frontend will start at `http://localhost:3000`.

---

## Running Both Together

Open two terminal tabs:

**Tab 1 - Backend:**
```bash
cd Backend
source venv/bin/activate
python app.py
```

**Tab 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| `mysqlclient` install fails | Run `brew install mysql-client pkg-config` and set `PKG_CONFIG_PATH` |
| CORS errors in browser | Ensure backend is running on port 5000 and frontend on port 3000 |
| OTP email not sending | Check Gmail app password; ensure 2FA is enabled on Gmail account |
| Cloudinary upload fails | Verify `CLOUDINARY_*` env vars are set correctly |
| `access_token` cookie not set | Ensure `withCredentials: true` in axios and CORS `supports_credentials=True` |
| MySQL event scheduler off | Run `SET GLOBAL event_scheduler = ON;` in MySQL |

---

## Useful Commands

```bash
# Lint frontend
cd Frontend && npm run lint

# Build frontend for production
cd Frontend && npm run build

# Activate backend venv
cd Backend && source venv/bin/activate

# Check MySQL service status
brew services list | grep mysql

# Connect to MySQL
mysql -u trustsphere_user -p trustsphere
```
