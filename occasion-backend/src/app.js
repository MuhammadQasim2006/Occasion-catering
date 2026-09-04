const express = require("express");
const cors = require("cors");

const packageRoutes = require("./routes/packageRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Occasion Catering API is running",
  });
});

app.use("/api/packages", packageRoutes);

module.exports = app;