const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
	console.log("Connected to MongoDB");
});

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(function (err, req, res, next) {
	if (err.name === "UnauthorizedError") {
		res.status(401).json({ error: "Unauthorized!" });
	}
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.listen(5000, () => {
	console.log("Test server is running on port 5000");
});
