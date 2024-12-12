const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const mongoUrl = process.env.MONGO_CONNECTION_STRING;

// app
const app = express();

// connect database
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // .connect("mongodb://127.0.0.1:27017/online_ict")
  .then(() => console.log("db is running"))
  .catch((err) => console.log(err));

// load routers
const authRoutes = require("./routes/api/authRoutes");
const questionRoutes = require("./routes/api/questionRoutes");
const paperRoutes = require("./routes/api/paperRoutes");
const lessonRoutes = require("./routes/api/lessonRoutes");
const markRoutes = require("./routes/api/markRoutes");
const paymentRoutes = require("./routes/api/paymentRoutes");
const userRoutes = require("./routes/api/userRoutes");
const dashboardRoutes = require("./routes/api/dashboardRoutes");

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cors
app.use(cors());

// routes middleware
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/questions", questionRoutes);
app.use("/api/v1/papers", paperRoutes);
app.use("/api/v1/lessons", lessonRoutes);
app.use("/api/v1/marks", markRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// port
const PORT = process.env.PORT || 8000;

// run server
app.listen(PORT, () => console.log(`server is running in Port ${PORT}`));
