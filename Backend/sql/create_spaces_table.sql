CREATE TABLE IF NOT EXISTS spaces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spaceName VARCHAR(255) NOT NULL UNIQUE,
    companyLogo VARCHAR(255),
    headerTitle VARCHAR(255),
    customMessage TEXT,
    questions TEXT,  -- Store as a serialized string (e.g., JSON) for multiple questions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
