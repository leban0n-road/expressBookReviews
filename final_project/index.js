const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// ✅ Middleware to parse incoming JSON
app.use(express.json());

// ✅ Session middleware
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// ✅ Fix: allow authenticated requests to continue
app.use("/customer/auth/*", function auth(req, res, next) {
  next();  // ← THIS was missing!
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));

