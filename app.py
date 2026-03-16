from flask import Flask, render_template, request, redirect, session, flash
import sqlite3

app = Flask(__name__)
# standard beginner secret key
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
            # Not part of the assignment to do admin backend
            flash("Admin login successful. (Admin backend not implemented here)")
            return redirect('/admin')
    else:
        flash("Incorrect username or password")
        return redirect('/')

@app.route('/admin')
def admin():
    if 'username' in session and session['role'] == 'admin':
        return "<h3>Admin Dashboard - To be developed by the rest of the team.</h3> <a href='/logout'>Logout</a>"
    return redirect('/')

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

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)
