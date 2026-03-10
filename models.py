from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class SalesDaily(db.Model):
    __tablename__ = "sales_daily"

    id = db.Column(db.Integer, primary_key=True)

    datum = db.Column(db.String(20))

    Anti_inflammatory_drugs = db.Column(db.Float)
    Anti_inflammatory_derivatives = db.Column(db.Float)
    Salicylic_acid_analgesics = db.Column(db.Float)
    Paracetamol = db.Column(db.Float)
    Anxiolytics_anti_anxiety_drugs = db.Column(db.Float)
    Sedatives_sleeping_pills = db.Column(db.Float)
    Asthma_medicines = db.Column(db.Float)
    Antihistamines = db.Column(db.Float)
    leftover = db.Column(db.Float)

    year = db.Column(db.Integer)
    month = db.Column(db.Integer)
    hour = db.Column(db.Integer)

    weekdayname = db.Column(db.String(20))

    def __repr__(self):
        return f"<SalesDaily {self.datum}>"
class MedicinePrice(db.Model):
    __tablename__ = "medicine_price"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    price = db.Column(db.Float)