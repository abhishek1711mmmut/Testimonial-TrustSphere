CREATE TABLE IF NOT EXISTS plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    max_spaces INT,
    max_text_reviews_per_space INT,
    max_video_reviews_per_space INT
);

-- INSERT INTO plans (name, max_spaces, max_text_reviews_per_space, max_video_reviews_per_space) 
-- VALUES 
-- ('Free', 10, 10, 5), 
-- ('Premium', NULL, NULL, NULL); -- NULL implies unlimited
