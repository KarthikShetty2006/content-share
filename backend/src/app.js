const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());


// ======================================================
// TEST ROUTE
// ======================================================

app.get("/", (req, res) => {
  res.send("Content Share API is running");
});


// ======================================================
// ROUTES
// ======================================================

app.use("/api/auth", authRoutes);

app.use("/api/food", foodRoutes);

app.use(
  "/api/food-partner",
  foodPartnerRoutes
);


module.exports = app;