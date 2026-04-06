"""
Initialize the SafeGuard database with all required tables.
Run this script once to set up the database schema.
"""

import sqlite3
from pathlib import Path

# Create database directory
db_dir = Path(__file__).parent.parent / 'backend' / 'instance'
db_dir.mkdir(parents=True, exist_ok=True)
db_path = db_dir / 'safeguard.db'

conn = sqlite3.connect(str(db_path))
cursor = conn.cursor()

# Create Users table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email VARCHAR(120) UNIQUE NOT NULL,
        username VARCHAR(80) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        city VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')

# Create SearchRecord table for tracking all searches
cursor.execute('''
    CREATE TABLE IF NOT EXISTS search_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        
        -- WHAT was searched
        service_type VARCHAR(50) NOT NULL,
        
        -- WHERE was searched from
        search_location_name VARCHAR(255),
        user_lat REAL NOT NULL,
        user_lon REAL NOT NULL,
        search_address VARCHAR(255),
        
        -- WHAT was found
        found_service_id INTEGER,
        found_service_name VARCHAR(255),
        found_service_type VARCHAR(50),
        found_service_lat REAL,
        found_service_lon REAL,
        found_service_phone VARCHAR(20),
        found_service_address VARCHAR(255),
        
        -- Additional details
        distance_km REAL,
        search_results_count INTEGER DEFAULT 1,
        
        -- WHEN was searched
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- Device/IP tracking
        ip_address VARCHAR(45),
        device_info VARCHAR(255),
        
        -- Metadata
        is_deleted BOOLEAN DEFAULT 0,
        
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
''')

# Create index for faster queries
cursor.execute('CREATE INDEX IF NOT EXISTS idx_search_user_time ON search_records(user_id, timestamp)')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_search_service_type ON search_records(service_type)')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_search_timestamp ON search_records(timestamp)')

conn.commit()
conn.close()

print(f"✓ Database initialized at: {db_path}")
print("✓ Tables created: users, search_records")
print("✓ Indexes created for optimal performance")
