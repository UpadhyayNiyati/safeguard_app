# 🗄️ SafeGuard Database Setup Guide

Complete guide to setting up your database (MySQL or SQLite).

## 🎯 Quick Choice

**Are you:**
- ✅ **Testing/Learning?** → Use **SQLite** (no setup needed)
- ✅ **Going to Production?** → Use **MySQL** (follow setup below)
- ✅ **Not sure?** → Start with **SQLite**, upgrade to MySQL later

---

## 📊 SQLite (Simplest - Recommended for Development)

### No Setup Required! 🎉

SQLite database is automatically created when Flask starts.

```bash
python app.py
```

That's it! The file `safety_app.db` will be created automatically.

### ✅ Pros
- Zero setup
- Perfect for development
- Portable (single file)
- No server to manage

### ❌ Cons
- Limited concurrent users
- Not ideal for production
- No network access

### Verify SQLite is Working
```bash
# After running Flask, you should see:
# Database created at: safety_app.db

# Check the database file exists:
ls -lh safety_app.db
```

---

## 🔧 MySQL (Recommended for Production)

### System Requirements
- **MySQL Server 8.0+** installed and running
- **Database name**: `accident_finder_2`
- **Username**: `root`
- **Password**: `Niya@1820`
- **Connection URL**: `mysql+pymysql://root:Niya%401820@localhost/accident_finder_2`

### Installation

#### Windows
```bash
# Download from: https://dev.mysql.com/downloads/mysql/
# Or use Chocolatey:
choco install mysql

# Verify installation:
mysql --version
```

#### macOS
```bash
# Using Homebrew:
brew install mysql

# Start MySQL:
brew services start mysql

# Verify:
mysql --version
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install mysql-server

# Start MySQL:
sudo systemctl start mysql

# Verify:
mysql --version
```

### Setup Steps

#### Step 1: Connect to MySQL
```bash
mysql -u root -p
```
You'll be prompted for password. Enter: `Niya@1820`

#### Step 2: Create Database
In MySQL console, run:
```sql
CREATE DATABASE IF NOT EXISTS accident_finder_2;
USE accident_finder_2;
EXIT;
```

#### Step 3: Verify Tables
```bash
mysql -u root -p accident_finder_2 -e "SHOW TABLES;"
```

Expected output (after first Flask run):
```
+----------------------------+
| Tables_in_accident_finder_2|
+----------------------------+
| user                       |
| emergency_contact          |
| safety_log                 |
+----------------------------+
```

### Configuration

Ensure `.env` has:
```env
DATABASE_URI=mysql+pymysql://root:Niya%401820@localhost/accident_finder_2
FLASK_ENV=development
```

### Start Flask with MySQL
```bash
python app.py
```

Flask will automatically create tables on first run.

### Verify Connection
```bash
# In MySQL console:
mysql -u root -p accident_finder_2

# List all tables:
SHOW TABLES;

# Describe users table:
DESCRIBE user;

# See data:
SELECT * FROM user;
```

---

## 🔄 Switching Between Databases

### From SQLite to MySQL

1. **Update `.env`:**
```bash
# Change this line:
DATABASE_URI=sqlite:///safety_app.db

# To this:
DATABASE_URI=mysql+pymysql://root:Niya%401820@localhost/accident_finder_2
```

2. **Create MySQL database** (follow MySQL setup above)

3. **Restart Flask:**
```bash
python app.py
```

### From MySQL to SQLite

1. **Update `.env`:**
```bash
# Change this line:
DATABASE_URI=mysql+pymysql://root:Niya%401820@localhost/accident_finder_2

# To this:
DATABASE_URI=sqlite:///safety_app.db
```

2. **Restart Flask:**
```bash
python app.py
```

---

## 📋 Database Schema

### Users Table
```sql
CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(120) UNIQUE NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  last_otp_sent DATETIME
);
```

### Emergency Contacts Table
```sql
CREATE TABLE emergency_contact (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(120),
  relationship VARCHAR(50),
  user_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id)
);
```

### Safety Logs Table
```sql
CREATE TABLE safety_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  lat FLOAT NOT NULL,
  lon FLOAT NOT NULL,
  status VARCHAR(50) DEFAULT 'Alert Triggered',
  amenity_type VARCHAR(50) DEFAULT 'police',
  FOREIGN KEY (user_id) REFERENCES user(id)
);
```

---

## 🧹 Database Cleanup & Maintenance

### View Database Size
```bash
# MySQL:
mysql -u root -p accident_finder_2 -e \
  "SELECT table_name, round(((data_length + index_length) / 1024 / 1024), 2) as size_mb FROM information_schema.TABLES WHERE table_schema = 'accident_finder_2';"

# SQLite:
ls -lh safety_app.db
```

### Delete All Records
```bash
# MySQL:
mysql -u root -p accident_finder_2 -e \
  "DELETE FROM safety_log; DELETE FROM emergency_contact; DELETE FROM user;"

# SQLite:
rm safety_app.db
python app.py  # Will recreate empty database
```

### Backup Database

#### MySQL Backup
```bash
# Create backup:
mysqldump -u root -p accident_finder_2 > backup.sql

# Restore backup:
mysql -u root -p accident_finder_2 < backup.sql
```

#### SQLite Backup
```bash
cp safety_app.db safety_app.backup.db
```

### Export Data

```bash
# Export users to CSV:
mysql -u root -p accident_finder_2 -e \
  "SELECT * FROM user;" > users.csv

# Export all contacts:
mysql -u root -p accident_finder_2 -e \
  "SELECT * FROM emergency_contact;" > contacts.csv
```

---

## 🐛 Troubleshooting

### MySQL Connection Error
```
Error: Can't connect to MySQL server on 'localhost'
```

**Solutions:**
```bash
# Check if MySQL is running:
mysql -u root -p -e "SELECT 1;"

# Start MySQL:
# Windows: net start MySQL80
# macOS: brew services start mysql
# Linux: sudo systemctl start mysql

# Check credentials:
mysql -u root -pNiya@1820 -e "SELECT 1;"
```

### Database Not Found
```
Error: Unknown database 'accident_finder_2'
```

**Solution:**
```bash
mysql -u root -p -e "CREATE DATABASE accident_finder_2;"
```

### Table Not Created
```
Error: Table 'accident_finder_2.user' doesn't exist
```

**Solution:**
1. Delete database and recreate:
```bash
mysql -u root -p -e "DROP DATABASE accident_finder_2; CREATE DATABASE accident_finder_2;"
```

2. Restart Flask (will auto-create tables):
```bash
python app.py
```

### Permission Denied (SQLite)
```
Error: attempt to write a readonly database
```

**Solution:**
```bash
# Check file permissions:
ls -l safety_app.db

# Fix permissions:
chmod 644 safety_app.db

# Or delete and recreate:
rm safety_app.db
python app.py
```

### Database Locked (SQLite)
```
Error: database is locked
```

**Solution:**
1. Close all other applications using the database
2. Restart Flask
3. If persists, delete and recreate:
```bash
rm safety_app.db
python app.py
```

---

## 📊 Monitoring

### Check Database Health (MySQL)
```bash
mysql -u root -p accident_finder_2 -e \
  "SELECT TABLE_NAME, TABLE_ROWS, AVG_ROW_LENGTH 
   FROM information_schema.TABLES 
   WHERE TABLE_SCHEMA = 'accident_finder_2';"
```

### View Recent Activity (SQLite)
```bash
# Open database viewer:
# Use: DBeaver, SQLite Browser, or VS Code SQLite extension
```

### Query Examples
```sql
-- Count total users:
SELECT COUNT(*) as total_users FROM user;

-- Count contacts per user:
SELECT u.email, COUNT(ec.id) as contact_count 
FROM user u 
LEFT JOIN emergency_contact ec ON u.id = ec.user_id 
GROUP BY u.id;

-- List recent safety logs:
SELECT * FROM safety_log 
ORDER BY timestamp DESC 
LIMIT 10;
```

---

## ✅ Verification Checklist

After setup:

- [ ] Database connection works
- [ ] Tables created successfully
- [ ] Can insert test data
- [ ] Can query data
- [ ] Flask backend starts without errors
- [ ] Emergency contacts can be added
- [ ] Email notifications send

### Test Insert
```bash
mysql -u root -p accident_finder_2 -e \
  "INSERT INTO user (email, is_verified) VALUES ('test@example.com', 1);"

# Verify:
mysql -u root -p accident_finder_2 -e \
  "SELECT * FROM user WHERE email = 'test@example.com';"
```

---

## 🚀 Production Recommendations

1. **Use MySQL** in production
2. **Enable automatic backups** (daily)
3. **Use strong password** (change from default)
4. **Limit user permissions** (not root)
5. **Enable logging** for auditing
6. **Monitor database size** and performance
7. **Use connection pooling** (configured in Flask)
8. **Regular maintenance** (optimize tables, vacuum logs)

### Production Database User
```sql
CREATE USER 'safeguard'@'localhost' IDENTIFIED BY 'strong-password-here';
GRANT ALL PRIVILEGES ON accident_finder_2.* TO 'safeguard'@'localhost';
FLUSH PRIVILEGES;
```

Then use in production:
```env
DATABASE_URI=mysql+pymysql://safeguard:strong-password-here@localhost/accident_finder_2
```

---

## 📞 Need Help?

- Check Flask logs: Look at terminal where Flask is running
- Database tool: Use [DBeaver](https://dbeaver.io/) or [MySQL Workbench](https://www.mysql.com/products/workbench/)
- See [Troubleshooting Guide](./README.md#-troubleshooting)

---

**Database setup complete! 🎉**

Now run Flask and start building:
```bash
python app.py
```
