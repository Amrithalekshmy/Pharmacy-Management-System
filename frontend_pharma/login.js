// ================================================
//  login.js — PharmaCare Frontend Auth Logic
//  Designed to connect to a Flask backend
// ================================================


// ╔══════════════════════════════════════════════╗
// ║         🔧 FLASK CONFIG — EDIT THIS          ║
// ╚══════════════════════════════════════════════╝
const CONFIG = {
  // TODO: Change this to your Flask server URL
  // When running locally:   "http://127.0.0.1:5000"
  // When deployed:          "https://your-domain.com"
  API_BASE_URL: "http://127.0.0.1:5000",

  // TODO: Change this to match your Flask login route
  // Example routes:  "/login"  or  "/api/login"  or  "/auth/login"
  LOGIN_ENDPOINT: "/login",

  // The page to go to after successful login
  // Change this to match your friend's dashboard filename
  DASHBOARD_PAGE: "Dashboard.html",

  // The localStorage key used to store the session
  // Your friend's dashboard reads this same key
  SESSION_KEY: "pharmaUser",
};
// ╚══════════════════════════════════════════════╝


// ── AUTO-REDIRECT IF ALREADY LOGGED IN ────────────
// If the user is already logged in and visits login.html,
// skip straight to the dashboard
(function checkAlreadyLoggedIn() {
  const existing = localStorage.getItem(CONFIG.SESSION_KEY);
  if (existing) {
    window.location.href = CONFIG.DASHBOARD_PAGE;
  }
})();


// ── HELPERS ───────────────────────────────────────

function showFieldError(inputEl, errorEl, show) {
  inputEl.classList.toggle("error-input", show);
  errorEl.style.display = show ? "block" : "none";
}

function showAlert(message, type) {
  const box = document.getElementById("alertBox");
  box.textContent   = message;
  box.className     = `alert-box ${type}`;
  box.style.display = "block";
}

function hideAlert() {
  document.getElementById("alertBox").style.display = "none";
}


// ── VALIDATION ────────────────────────────────────

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validatePassword(value) {
  return value.length >= 6;
}

// Show error when user leaves a field
document.getElementById("email").addEventListener("blur", function () {
  showFieldError(this, document.getElementById("emailError"), !validateEmail(this.value));
});

document.getElementById("password").addEventListener("blur", function () {
  showFieldError(this, document.getElementById("passwordError"), !validatePassword(this.value));
});

// Clear errors as user types
["email", "password"].forEach(function (id) {
  document.getElementById(id).addEventListener("input", function () {
    this.classList.remove("error-input");
    document.getElementById(id + "Error").style.display = "none";
    hideAlert();
  });
});


// ── PASSWORD TOGGLE ────────────────────────────────
document.getElementById("togglePw").addEventListener("click", function () {
  const pw = document.getElementById("password");
  const isText = pw.type === "text";
  pw.type          = isText ? "password" : "text";
  this.textContent = isText ? "👁️" : "🙈";
});


// ── FORM SUBMIT — CALLS FLASK BACKEND ─────────────
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const emailVal    = document.getElementById("email").value;
  const passwordVal = document.getElementById("password").value;
  const btn         = document.getElementById("submitBtn");

  // Step 1: Validate fields first
  const emailOk    = validateEmail(emailVal);
  const passwordOk = validatePassword(passwordVal);

  showFieldError(document.getElementById("email"),    document.getElementById("emailError"),    !emailOk);
  showFieldError(document.getElementById("password"), document.getElementById("passwordError"), !passwordOk);

  if (!emailOk || !passwordOk) return;

  // Step 2: Show loading state
  btn.classList.add("loading");
  btn.disabled = true;
  hideAlert();

  try {
    // ╔══════════════════════════════════════════════╗
    // ║        🔌 FLASK API CALL — DO NOT CHANGE     ║
    // ║   This sends email+password to your Flask    ║
    // ║   backend and waits for a response.          ║
    // ╚══════════════════════════════════════════════╝
    const response = await fetch(CONFIG.API_BASE_URL + CONFIG.LOGIN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email:    emailVal.trim(),
        password: passwordVal,
      }),
    });

    // Parse the JSON response from Flask
    const data = await response.json();
    // ╚══════════════════════════════════════════════╝


    btn.classList.remove("loading");
    btn.disabled = false;

    if (response.ok) {
      
      const sessionData = {
        name:      data.user.name,
        email:     data.user.email,
        role:      data.user.role,

        // TODO: If Flask returns a JWT token, save it here too:
        // token: data.token,

        loginTime: new Date().toISOString(),
      };
      localStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(sessionData));

      showAlert(`✅ Welcome, ${data.user.name}! Redirecting…`, "success");

      // Redirect to dashboard after short delay
      setTimeout(function () {
        window.location.href = CONFIG.DASHBOARD_PAGE;
      }, 1200);

    } else {
      // ══════════════════════════════════════════════
      // ❌ LOGIN FAILED
      // Flask returned 401 or other error
      //
      // TODO (Flask side): On failed login return:
      // { "message": "Invalid email or password" }
      // with HTTP status 401
      // ══════════════════════════════════════════════
      showAlert("❌ " + (data.message || "Invalid email or password."), "error");
    }

  } catch (err) {
    // ══════════════════════════════════════════════
    // 🔴 NETWORK ERROR — Flask server not reachable
    // This fires if Flask isn't running or URL is wrong
    // ══════════════════════════════════════════════
    btn.classList.remove("loading");
    btn.disabled = false;
    showAlert("🔴 Cannot reach server. Is Flask running?", "error");
    console.error("Flask connection error:", err);
  }
});