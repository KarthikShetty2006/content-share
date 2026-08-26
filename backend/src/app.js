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

const allowedOrigins = [
   "https://content-share-24a9.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman and requests without an Origin
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);

      return callback(
        new Error("Not allowed by CORS")
      );
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
  })
);

// ======================================================
// HANDLE PREFLIGHT REQUESTS
// ======================================================

app.options("*", cors());

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cookieParser());

app.use(express.json());

// ======================================================
// TEST ROUTE
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

// ======================================================
// EXPORT
// ======================================================

module.exports = app;