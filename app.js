//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect("mongodb://localhost:27017/userDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
});

const secret = process.env.secret;

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.post("/login", (req, res) => {
	let eee = req.body.username;
	let pppp = req.body.password;
	User.findOne({ email: eee }, (err, foundUser) => {
		if (foundUser) {
			if (pppp === foundUser.password) {
				res.render("secrets");
			} else {
				res.send("wrong password");
			}
		} else {
			console.log(err);
		}
	});
});

app.get("/register", (req, res) => {
	res.render("register");
});

app.post("/register", (req, res) => {
	const newUser = new User({
		email: req.body.username,
		password: req.body.password,
	});

	newUser.save((err) => {
		if (err) {
			console.log(err);
		} else {
			res.render("secrets");
		}
	});
});

app.listen(3000);
