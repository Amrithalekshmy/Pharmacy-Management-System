
var medicines = [
  { id:1,  name:"Paracetamol 500mg",   mfr:"Cipla Ltd.",       category:"Analgesic",            price:15, qty:320, batch:"A1182", expiry:"2025-08-10", intake:"Take 1–2 tablets every 4–6 hours. Max 8 tablets per day. Can be taken with or without food." },
  { id:2,  name:"Amoxicillin 500mg",   mfr:"Sun Pharma",        category:"Antibiotic",           price:45, qty:120, batch:"B2041", expiry:"2025-06-15", intake:"Take 1 capsule every 8 hours for 5–7 days. Take with food. Complete the full course." },
  { id:3,  name:"Ibuprofen 400mg",     mfr:"Abbott India",      category:"Analgesic",            price:22, qty:0,   batch:"C3320", expiry:"2025-03-11", intake:"Take 1 tablet every 6–8 hours with food. Max 3 tablets per day." },
  { id:4,  name:"Metformin 500mg",     mfr:"Torrent Pharma",    category:"Antidiabetic",         price:7,  qty:200, batch:"C1045", expiry:"2025-11-20", intake:"Take 1 tablet twice daily with meals. Monitor blood sugar regularly." },
  { id:5,  name:"Omeprazole 20mg",     mfr:"Dr. Reddys",        category:"Antacid",              price:12, qty:15,  batch:"D0221", expiry:"2025-05-14", intake:"Take 1 capsule 30–60 minutes before breakfast. Do not crush." },
  { id:6,  name:"Cetirizine 10mg",     mfr:"Mankind Pharma",    category:"Antihistamine",        price:8,  qty:45,  batch:"D0091", expiry:"2025-09-28", intake:"Take 1 tablet once daily at bedtime. May cause drowsiness." },
  { id:7,  name:"Azithromycin 250mg",  mfr:"Cipla Ltd.",        category:"Antibiotic",           price:80, qty:80,  batch:"B2090", expiry:"2026-03-10", intake:"Take 1 tablet once daily for 3–5 days on an empty stomach. Complete the full course." },
  { id:8,  name:"Atorvastatin 10mg",   mfr:"Sun Pharma",        category:"Cardiovascular",       price:70, qty:0,   batch:"E1133", expiry:"2025-09-01", intake:"Take 1 tablet once daily. Avoid grapefruit juice." },
  { id:9,  name:"Vitamin D3 1000IU",   mfr:"Abbott India",      category:"Vitamin / Supplement", price:30, qty:30,  batch:"G0774", expiry:"2026-06-01", intake:"Take 1 tablet once daily with a meal containing fat." },
  { id:10, name:"Amlodipine 5mg",      mfr:"Cipla Ltd.",        category:"Cardiovascular",       price:25, qty:150, batch:"H0330", expiry:"2025-12-31", intake:"Take 1 tablet once daily. Monitor blood pressure regularly." }
];



function getStockBadge(qty) {
  if (qty === 0)  return '<span class="badge badge-r">Out of Stock</span>';
  if (qty < 50)   return '<span class="badge badge-a">Low Stock</span>';
  return                 '<span class="badge badge-g">In Stock</span>';
}



function showToast(msg) {
  var t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function() { t.classList.remove("show"); }, 3000);
}


function showPage(name) {
  document.querySelectorAll(".page").forEach(function(p) {
    p.classList.remove("active");
  });
  document.querySelectorAll(".nav-links button").forEach(function(b) {
    b.classList.remove("active");
  });

  document.getElementById("page-" + name).classList.add("active");
  document.getElementById("nav-" + name).classList.add("active");

  if (name === "addstock")  renderRestockTable();
  if (name === "available") { renderStats(); renderGrid(); }
}



var selectedMed = null;
var orderQty    = 1;

var searchInput = document.getElementById("search-input");
var clearBtn    = document.getElementById("clear-btn");
var suggestBox  = document.getElementById("suggestions");
var resultArea  = document.getElementById("result-area");



function showSuggestions(query) {
  var matches = medicines.filter(function(m) {
    return m.name.toLowerCase().includes(query.toLowerCase());
  });

  if (matches.length === 0) {
    suggestBox.innerHTML = '<div class="sugg-item"><div class="sugg-name" style="color:var(--text-dim)">No results found</div></div>';
    suggestBox.classList.add("show");
    return;
  }

  var html = "";
  for (var i = 0; i < Math.min(matches.length, 6); i++) {
    var m = matches[i];
    var stockColor = m.qty === 0 ? "var(--red)" : m.qty < 50 ? "var(--amber)" : "var(--green)";
    var stockText  = m.qty === 0 ? "Out of Stock" : m.qty + " units";

    html += '<div class="sugg-item" onclick="selectMedicine(' + m.id + ')">';
    html +=   '<div>';
    html +=     '<div class="sugg-name">' + m.name + '</div>';
    html +=     '<div class="sugg-cat">'  + m.category + '</div>';
    html +=   '</div>';
    html +=   '<div style="font-size:12px; font-weight:600; color:' + stockColor + '">' + stockText + '</div>';
    html += '</div>';
  }

  suggestBox.innerHTML = html;
  suggestBox.classList.add("show");
}



function selectMedicine(id) {
  var med = medicines.find(function(m) { return m.id === id; });
  if (!med) return;

  selectedMed       = med;
  orderQty          = 1;
  searchInput.value = med.name;
  clearBtn.classList.add("show");
  suggestBox.classList.remove("show");
  showResultCard(med);
}



function showResultCard(med) {
  var isAvail = med.qty > 0;

  var html = '<div class="result-card ' + (isAvail ? "available" : "out-of-stock") + '">';

  html += '<div class="result-header">';
  html +=   '<div>';
  html +=     '<div class="result-name">' + med.name + '</div>';
  html +=     '<div class="result-mfr">' + med.mfr + ' &nbsp;·&nbsp; Batch: <span class="mono">' + med.batch + '</span></div>';
  html +=   '</div>';
  html +=   getStockBadge(med.qty);
  html += '</div>';

  html += '<div class="result-details">';
  html +=   '<div class="detail-item"><div class="lbl">Price</div><div class="val price">₹' + med.price + '</div></div>';
  html +=   '<div class="detail-item"><div class="lbl">In Stock</div><div class="val">' + med.qty + ' units</div></div>';
  html +=   '<div class="detail-item"><div class="lbl">Category</div><div class="val" style="font-size:13px">' + med.category + '</div></div>';
  html +=   '<div class="detail-item"><div class="lbl">Expiry</div><div class="val" style="font-size:13px">' + med.expiry + '</div></div>';
  html +=   '<div class="detail-item"><div class="lbl">Batch</div><div class="val"><span class="mono">' + med.batch + '</span></div></div>';
  html +=   '<div class="detail-item"><div class="lbl">Manufacturer</div><div class="val" style="font-size:13px">' + med.mfr + '</div></div>';
  html += '</div>';

  html += '<div class="intake-box">';
  html +=   '<div class="intake-lbl">Dosage / Intake Instructions</div>';
  html +=   med.intake;
  html += '</div>';

  if (isAvail) {
    html += '<div class="order-section">';
    html +=   '<div class="qty-wrap">';
    html +=     '<button onclick="changeQty(-1)">−</button>';
    html +=     '<div class="qty-num" id="qty-num">1</div>';
    html +=     '<button onclick="changeQty(1)">+</button>';
    html +=   '</div>';
    html +=   '<button class="btn btn-green" onclick="placeOrder()" style="flex:1; justify-content:center;">';
    html +=     'Order &nbsp;·&nbsp; ₹<span id="total-price">' + med.price + '</span>';
    html +=   '</button>';
    html += '</div>';
  } else {
    html += '<div class="out-msg">This medicine is out of stock and cannot be ordered.</div>';
  }

  html += '</div>';
  resultArea.innerHTML = html;
}



function changeQty(delta) {
  if (!selectedMed) return;
  orderQty = Math.max(1, Math.min(orderQty + delta, selectedMed.qty));
  document.getElementById("qty-num").textContent     = orderQty;
  document.getElementById("total-price").textContent = selectedMed.price * orderQty;
}



function placeOrder() {
  if (!selectedMed || selectedMed.qty === 0) return;

  selectedMed.qty -= orderQty;


  showToast("Ordered " + orderQty + "x " + selectedMed.name + " — ₹" + (selectedMed.price * orderQty));
  orderQty = 1;
  showResultCard(selectedMed);
}


searchInput.addEventListener("input", function() {
  var q = this.value.trim();
  clearBtn.classList.toggle("show", q.length > 0);

  if (q.length >= 2) {
    showSuggestions(q);
  } else {
    suggestBox.classList.remove("show");
    resultArea.innerHTML = "";
    selectedMed = null;
  }
});


searchInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    var first = suggestBox.querySelector(".sugg-item");
    if (first) first.click();
  }
});


clearBtn.addEventListener("click", function() {
  searchInput.value = "";
  clearBtn.classList.remove("show");
  suggestBox.classList.remove("show");
  resultArea.innerHTML = "";
  selectedMed = null;
  searchInput.focus();
});


document.addEventListener("click", function(e) {
  if (!e.target.closest(".search-wrap")) {
    suggestBox.classList.remove("show");
  }
});



function renderRestockTable() {
  var tbody   = document.getElementById("restock-table");
  var lowList = medicines.filter(function(m) { return m.qty < 50; });

  if (lowList.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty">All medicines are well stocked!</td></tr>';
    return;
  }

  var html = "";
  lowList.forEach(function(m) {
    html += '<tr>';
    html +=   '<td><strong>' + m.name + '</strong></td>';
    html +=   '<td><span class="mono">' + m.batch + '</span></td>';
    html +=   '<td>' + m.qty + ' units</td>';
    html +=   '<td>' + getStockBadge(m.qty) + '</td>';
    html +=   '<td><input class="restock-input" type="number" id="add-' + m.id + '" value="50" min="1" /></td>';
    html +=   '<td><button class="btn btn-green btn-sm" onclick="restockMedicine(' + m.id + ')">+ Add Stock</button></td>';
    html += '</tr>';
  });

  tbody.innerHTML = html;
}



function restockMedicine(id) {
  var med = medicines.find(function(m) { return m.id === id; });
  if (!med) return;

  var amount = parseInt(document.getElementById("add-" + id).value);
  if (!amount || amount <= 0) { alert("Enter a valid quantity."); return; }

  med.qty += amount;

  showToast("Added " + amount + " units to " + med.name);
  renderRestockTable();
}



document.getElementById("add-form").addEventListener("submit", function(e) {
  e.preventDefault(); // remove this line when connecting to Flask

  var newMed = {
    id:       medicines.length + 1,
    name:     document.getElementById("f-name").value,
    mfr:      document.getElementById("f-mfr").value,
    category: document.getElementById("f-cat").value,
    qty:      parseInt(document.getElementById("f-qty").value),
    price:    parseFloat(document.getElementById("f-price").value),
    batch:    document.getElementById("f-batch").value,
    expiry:   document.getElementById("f-expiry").value,
    intake:   document.getElementById("f-intake").value || "No intake instructions provided."
  };

  medicines.push(newMed);

  showToast(newMed.name + " added successfully!");
  this.reset();
  renderRestockTable();
});



var activeFilter = "all";
var activeSearch = "";
var activeCat    = "";



function renderStats() {
  var total   = medicines.length;
  var inStock = medicines.filter(function(m) { return m.qty >= 50; }).length;
  var low     = medicines.filter(function(m) { return m.qty > 0 && m.qty < 50; }).length;
  var out     = medicines.filter(function(m) { return m.qty === 0; }).length;

  document.getElementById("stat-row").innerHTML =
    '<div class="stat-box g"><div class="lbl">Total</div><div class="val">'        + total   + '</div></div>' +
    '<div class="stat-box g"><div class="lbl">In Stock</div><div class="val">'     + inStock + '</div></div>' +
    '<div class="stat-box a"><div class="lbl">Low Stock</div><div class="val">'    + low     + '</div></div>' +
    '<div class="stat-box r"><div class="lbl">Out of Stock</div><div class="val">' + out     + '</div></div>';
}



function renderGrid() {
  var data = medicines;

  if (activeSearch !== "") data = data.filter(function(m) { return m.name.toLowerCase().includes(activeSearch); });
  if (activeCat    !== "") data = data.filter(function(m) { return m.category === activeCat; });
  if (activeFilter === "in")  data = data.filter(function(m) { return m.qty >= 50; });
  if (activeFilter === "low") data = data.filter(function(m) { return m.qty > 0 && m.qty < 50; });
  if (activeFilter === "out") data = data.filter(function(m) { return m.qty === 0; });

  var grid = document.getElementById("med-grid");

  if (data.length === 0) {
    grid.innerHTML = '<div class="empty" style="grid-column:1/-1">No medicines found.</div>';
    return;
  }

  var html = "";
  data.forEach(function(m) {
    html += '<div class="med-card ' + (m.qty === 0 ? "out-card" : "") + '">';
    html +=   '<div class="med-name">' + m.name + '</div>';
    html +=   '<div class="med-mfr">'  + m.mfr  + '</div>';
    html +=   '<div class="med-row"><span>Price</span>    <span class="price-val">₹' + m.price + '</span></div>';
    html +=   '<div class="med-row"><span>Stock</span>    <strong>' + m.qty + ' units</strong></div>';
    html +=   '<div class="med-row"><span>Batch</span>    <span class="mono">' + m.batch + '</span></div>';
    html +=   '<div class="med-row"><span>Expiry</span>   <span>' + m.expiry + '</span></div>';
    html +=   '<div class="med-row"><span>Category</span> <span>' + m.category + '</span></div>';
    html +=   '<br/>' + getStockBadge(m.qty);
    if (m.qty > 0) {
      html += ' &nbsp;<button class="btn btn-outline btn-sm" onclick="goSearch(\'' + m.name + '\')">View &amp; Order</button>';
    }
    html += '</div>';
  });

  grid.innerHTML = html;
}



function goSearch(name) {
  showPage("search");
  searchInput.value = name;
  clearBtn.classList.add("show");
  showSuggestions(name);
  var med = medicines.find(function(m) { return m.name === name; });
  if (med) selectMedicine(med.id);
}



document.getElementById("search-filter").addEventListener("input", function() {
  activeSearch = this.value.trim().toLowerCase();
  renderGrid();
});


document.getElementById("cat-filter").addEventListener("change", function() {
  activeCat = this.value;
  renderGrid();
});


document.querySelectorAll(".filter-btn").forEach(function(btn) {
  btn.addEventListener("click", function() {
    document.querySelectorAll(".filter-btn").forEach(function(b) { b.classList.remove("active"); });
    this.classList.add("active");
    activeFilter = this.getAttribute("data-f");
    renderGrid();
  });
});
