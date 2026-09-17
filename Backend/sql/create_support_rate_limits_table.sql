CREATE TABLE IF NOT EXISTS support_rate_limits (
    bucket_key VARCHAR(64) NOT NULL,
    window_start BIGINT NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    PRIMARY KEY (bucket_key, window_start),
    INDEX support_window_cleanup (window_start)
) ENGINE=InnoDB;
