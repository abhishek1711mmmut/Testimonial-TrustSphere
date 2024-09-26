CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rating INT NOT NULL,
    reviewer_name VARCHAR(255),
    reviewer_email VARCHAR(255),
    reviewer_image VARCHAR(255),
    review TEXT NOT NULL,
    attached_images TEXT,  -- Store as a serialized string (e.g., JSON array) for multiple image URLs
    video VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    space_id INT,
    FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE
);
