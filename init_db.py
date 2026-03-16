import sqlite3
conn = sqlite3.connect('pharmacy.db')
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role TEXT NOT NULL)''')
c.execute('''CREATE TABLE IF NOT EXISTS medicines (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                stock INTEGER NOT NULL)''')
c.execute("DELETE FROM users")
c.execute("DELETE FROM medicines")
c.execute("INSERT INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin')")
c.execute("INSERT INTO users (username, password, role) VALUES ('user1', 'pass123', 'user')")
c.execute("INSERT INTO users (username, password, role) VALUES ('jeevan', '1234', 'user')")
c.execute("INSERT INTO medicines (name, description, price, stock) VALUES ('Paracetamol', 'Fever and pain relief', 15.50, 100)")
c.execute("INSERT INTO medicines (name, description, price, stock) VALUES ('Amoxicillin', 'Antibiotic', 45.00, 50)")
c.execute("INSERT INTO medicines (name, description, price, stock) VALUES ('Cough Syrup', 'Dry cough relief', 85.00, 30)")
c.execute("INSERT INTO medicines (name, description, price, stock) VALUES ('Vitamin C', 'Immunity booster', 20.00, 200)")
conn.commit()
conn.close()
print("Database initialized successfully.")
