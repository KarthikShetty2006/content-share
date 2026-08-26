const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");

const app = express();

// ======================================================
// CORS
// ======================================================

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://content-share-24a9.vercel.app",
    ];

    // Postman / server-to-server
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("CORS blocked:", origin);

    return callback(null, false);
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// ======================================================
// PREFLIGHT
// ======================================================

app.options(/.*/, cors(corsOptions));

// ======================================================
// BODY / COOKIE MIDDLEWARE
// ======================================================

app.use(cookieParser());

app.use(express.json());

// ======================================================
// TEST
// ======================================================

app.get("/", (req, res) => {
  res.status(200).send(
    "Content Share API is running"
  );
});

// ======================================================
// ROUTES
// ======================================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/food",
  foodRoutes
);

app.use(
  "/api/food-partner",
  foodPartnerRoutes
);

module.exports = app;