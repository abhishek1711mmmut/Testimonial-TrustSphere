from flask_mysqldb import MySQL

mysql = MySQL()

def init_db(app):
    """Initialize the MySQL extension and ensure tables are created."""
    mysql.init_app(app)
    with app.app_context():
        create_tables_if_not_exist()

def create_tables_if_not_exist():
    """Create tables if they don't exist."""
    cursor = mysql.connection.cursor()
    with open('sql/create_plans_table.sql', 'r') as sql_file:
        sql_script = sql_file.read()
        cursor.execute(sql_script)
    with open('sql/create_otp_table.sql', 'r') as sql_file:
        sql_script = sql_file.read()
        cursor.execute(sql_script)
    with open('sql/create_users_table.sql', 'r') as sql_file:
        sql_script = sql_file.read()
        cursor.execute(sql_script)
    with open('sql/create_spaces_table.sql', 'r') as sql_file:
        sql_script = sql_file.read()
        cursor.execute(sql_script)
    with open('sql/create_testimonials_table.sql', 'r') as sql_file:
        sql_script = sql_file.read()
        cursor.execute(sql_script)
    mysql.connection.commit()
    seed_plans(cursor)
    cursor.close()


def seed_plans(cursor):
    """Seed default plans if the table is empty."""
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM plans")
    count = cursor.fetchone()[0]
    if count == 0:
        cursor.execute("""
            INSERT INTO plans (name, max_spaces, max_text_reviews_per_space, max_video_reviews_per_space)
            VALUES ('Free', 10, 10, 5), ('Premium', NULL, NULL, NULL)
        """)
        mysql.connection.commit()