CREATE TABLE IF NOT EXISTS spaces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spaceName VARCHAR(255) NOT NULL,
    companyLogo VARCHAR(255),
    headerTitle VARCHAR(255),
    customMessage TEXT,
    questions TEXT,  -- Store as a serialized string (e.g., JSON) for multiple questions
    text_review_count INT DEFAULT 0,
    video_review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
