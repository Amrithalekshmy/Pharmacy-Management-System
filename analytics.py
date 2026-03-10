from sqlalchemy import func

# eda Backend Developer sreenandaa,function and variable name correct aakanam, allengi ithile change cheynam. ketto.. 
# Import these in app.py and call them inside your routes to get the data.
# Make sure to pass the db object and the Models (Sale, Medicine) to the functions.

def get_total_revenue(db, Sale):
    # Calculates the total revenue ever
    total = db.session.query(func.sum(Sale.total_price)).scalar()
    if total is None:
        return 0.0
    return round(total, 2)

def get_most_sold_medicine(db, Sale, Medicine):
    # I used a python dictionary to count sales because complex SQL joins were confusing
    sales = Sale.query.all()
    
    count_dict = {}
    for sale in sales:
        # Assuming the field is called medicine_id and quantity
        if sale.medicine_id in count_dict:
            count_dict[sale.medicine_id] += sale.quantity
        else:
            count_dict[sale.medicine_id] = sale.quantity
            
    if not count_dict:
        return "Nothing sold yet"
        
    # Find the medicine_id with the highest quantity
    best_id = max(count_dict, key=count_dict.get)
    best_qty = count_dict[best_id]
    
    # Get the name of that medicine
    med = Medicine.query.get(best_id)
    return f"{med.name} ({best_qty} sold)"

def get_stock_analysis(db, Medicine):
    # Finds total medicines in stock and which ones are almost empty
    medicines = Medicine.query.all()
    
    total_stock = 0
    low_stock = []
    
    for med in medicines:
        total_stock += med.quantity
        
        # if stock is less than 15, we should warn them
        if med.quantity < 15:
            low_stock.append({"name": med.name, "stock": med.quantity})
            
    return {
        "total_items": total_stock,
        "low_stock_list": low_stock
    }

def get_monthly_sales_report(db, Sale):
    # Groups sales by month
    sales = Sale.query.all()
    
    monthly_report = {}
    for sale in sales:
        # Assuming sale.date is a datetime object, slice out 'YYYY-MM'
        month = str(sale.date)[0:7] 
        
        if month in monthly_report:
            monthly_report[month] += sale.total_price
        else:
            monthly_report[month] = sale.total_price
            
    return monthly_report
