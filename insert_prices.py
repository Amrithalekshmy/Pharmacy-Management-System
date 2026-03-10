from flask import Flask
from models import db, MedicinePrice

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///pharmacy.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():

    medicines = [
        MedicinePrice(name="Paracetamol", price=10),
        MedicinePrice(name="Anti-inflammatory drugs", price=12),
        MedicinePrice(name="Anti-inflammatory derivatives", price=11),
        MedicinePrice(name="Salicylic acid analgesics", price=15),
        MedicinePrice(name="Anxiolytics", price=20),
        MedicinePrice(name="Sedatives", price=18),
        MedicinePrice(name="Asthma medicines", price=25),
        MedicinePrice(name="Antihistamines", price=14)
    ]

    db.session.add_all(medicines)
    db.session.commit()

    print("Medicine prices inserted!")