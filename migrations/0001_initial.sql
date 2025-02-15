-- 短链表
CREATE TABLE links (
  slug TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  expires INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- 管理员表
CREATE TABLE admins (
  username TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL
);

-- 访问日志
CREATE TABLE access_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT,
  ip TEXT,
  user_agent TEXT,
  timestamp INTEGER DEFAULT (strftime('%s', 'now'))
);
