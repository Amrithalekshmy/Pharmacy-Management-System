import sqlite3
conn = sqlite3.connect('pharmacy.db')
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)''')
c.execute('''CREATE TABLE IF NOT EXISTS medicines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    category TEXT,
    manufacturer TEXT,
    price REAL NOT NULL,
    expiry_date TEXT,
    stock INTEGER NOT NULL DEFAULT 0
)''')
c.execute('''CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount REAL
)''')
c.execute('''CREATE TABLE IF NOT EXISTS sale_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER,
    medicine_name TEXT,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (medicine_name) REFERENCES medicines(name)
)''')
c.execute("DELETE FROM sale_items")
c.execute("DELETE FROM sales")
c.execute("DELETE FROM medicines")
c.execute("DELETE FROM users")
c.execute("INSERT INTO users (username, password, role) VALUES ('admin@gmail.com', 'admin123', 'admin')")
c.execute("INSERT INTO users (username, password, role) VALUES ('jeevan@gmail.com', 'jeevan', 'user')")
c.execute("INSERT INTO medicines (name, category, manufacturer, price, expiry_date, stock) VALUES ('Paracetamol', 'Tablet', 'Cipla', 10.50, '2027-01-01', 200)")
c.execute("INSERT INTO medicines (name, category, manufacturer, price, expiry_date, stock) VALUES ('Amoxicillin', 'Capsule', 'Sun Pharma', 20.00, '2026-06-01', 100)")
c.execute("INSERT INTO medicines (name, category, manufacturer, price, expiry_date, stock) VALUES ('Cough Syrup', 'Liquid', 'Dabur', 50.00, '2026-12-01', 50)")
conn.commit()
conn.close()
print("Database initialized successfully.")
