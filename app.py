from flask import Flask, render_template, request, redirect, session, flash
import sqlite3

app = Flask(__name__)
app.secret_key = 'pharmacy_secret_key'

def get_db_connection():
    conn = sqlite3.connect('pharmacy.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    if 'username' in session:
        if session['role'] == 'user':
            return redirect('/dashboard')
        else:
            return redirect('/admin')
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    uname = request.form['username']
    pwd = request.form['password']
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE username = ? AND password = ?', (uname, pwd)).fetchone()
    conn.close()
    if user:
        session['username'] = user['username']
        session['role'] = user['role']
        if user['role'] == 'user':
            return redirect('/dashboard')
        else:
            return redirect('/admin')
    else:
        flash("Incorrect username or password")
        return redirect('/')

@app.route('/admin')
def admin():
    if 'username' not in session or session['role'] != 'admin':
        return redirect('/')
    conn = get_db_connection()
    medicines = conn.execute('SELECT * FROM medicines ORDER BY stock ASC').fetchall()
    conn.close()
    medicines_list = [dict(m) for m in medicines]
    low_stock = [m for m in medicines_list if m['stock'] < 40]
    restock = [m for m in medicines_list if 0 < m['stock'] < 20]
    top_selling = sorted(medicines_list, key=lambda x: x['stock'], reverse=True)
    highest_priced = sorted(medicines_list, key=lambda x: float(x['price']), reverse=True)
    total_value = sum(float(m['price']) * m['stock'] for m in medicines_list)
    return render_template('admin_dashboard.html',
                           username=session['username'],
                           medicines=medicines_list,
                           low_stock=low_stock,
                           restock=restock,
                           top_selling=top_selling,
                           highest_priced=highest_priced,
                           total_value=total_value)

@app.route('/dashboard')
def dashboard():
    if 'username' not in session or session['role'] != 'user':
        return redirect('/')
    conn = get_db_connection()
    medicines = conn.execute('SELECT * FROM medicines').fetchall()
    conn.close()
    return render_template('dashboard.html', username=session['username'], medicines=medicines, query='')

@app.route('/buy/<int:med_id>')
def buy_medicine(med_id):
    if 'username' not in session or session['role'] != 'user':
        return redirect('/')
    conn = get_db_connection()
    med = conn.execute('SELECT * FROM medicines WHERE id = ?', (med_id,)).fetchone()
    if med is None:
        flash("Medicine not found!")
        conn.close()
        return redirect('/dashboard')
    if med['stock'] > 0:
        new_stock = med['stock'] - 1
        conn.execute('UPDATE medicines SET stock = ? WHERE id = ?', (new_stock, med_id))
        conn.commit()
        flash(f"Successfully purchased 1 unit of {med['name']}! (₹{med['price']} deducted)")
    else:
        flash(f"Sorry, {med['name']} is currently out of stock.")
    conn.close()
    return redirect('/dashboard')

@app.route('/search', methods=['GET', 'POST'])
def search():
    if 'username' not in session or session['role'] != 'user':
        return redirect('/')
    if request.method == 'POST':
        query = request.form['query']
        conn = get_db_connection()
        medicines = conn.execute("SELECT * FROM medicines WHERE name LIKE ?", ('%' + query + '%',)).fetchall()
        conn.close()
        return render_template('dashboard.html', username=session['username'], medicines=medicines, query=query)
    return redirect('/dashboard')

@app.route('/add-medicine', methods=['POST'])
def add_medicine():
    if 'username' not in session or session['role'] != 'admin':
        return redirect('/')
    name = request.form['name']
    category = request.form['category']
    manufacturer = request.form['manufacturer']
    price = request.form['price']
    expiry_date = request.form['expiry_date']
    stock = request.form['stock']
    conn = get_db_connection()
    try:
        conn.execute(
            'INSERT INTO medicines (name, category, manufacturer, price, expiry_date, stock) VALUES (?, ?, ?, ?, ?, ?)',
            (name, category, manufacturer, price, expiry_date, stock)
        )
        conn.commit()
        flash(f"Medicine '{name}' added successfully!")
    except sqlite3.IntegrityError:
        flash(f"Medicine '{name}' already exists in the database.")
    conn.close()
    return redirect('/admin')

@app.route('/delete-medicine/<int:med_id>')
def delete_medicine(med_id):
    if 'username' not in session or session['role'] != 'admin':
        return redirect('/')
    conn = get_db_connection()
    conn.execute('DELETE FROM medicines WHERE id = ?', (med_id,))
    conn.commit()
    conn.close()
    flash("Medicine deleted successfully.")
    return redirect('/admin')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)
