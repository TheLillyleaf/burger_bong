CREATE TABLE IF NOT EXISTS orders (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  burger     TEXT    NOT NULL,
  status     TEXT    NOT NULL DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
