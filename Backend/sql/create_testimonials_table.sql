CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rating INT NOT NULL,
    reviewer_name VARCHAR(255) NOT NULL,
    reviewer_email VARCHAR(255) NOT NULL,
    reviewer_image VARCHAR(255),
    review TEXT,
    attached_images TEXT,  -- Store as a serialized string (e.g., JSON array) for multiple image URLs
    video VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    space_id INT NOT NULL,
    type ENUM('text', 'video') NOT NULL,
    FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE
);
