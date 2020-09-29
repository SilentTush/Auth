//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;

mongoose.connect("mongodb://localhost:27017/userDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const userSchema = {
	email: String,
	password: String,
};

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
			bcrypt.compare(pppp, foundUser.password, (err, result) => {
				if (result === true) {
					res.render("secrets");
				}
			});
		} else {
			res.send("wrong password");
		}
	});
});

app.get("/register", (req, res) => {
	res.render("register");
});

app.post("/register", (req, res) => {
	bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
		const newUser = new User({
			email: req.body.username,
			password: hash,
		});

		newUser.save((err) => {
			if (err) {
				console.log(err);
			} else {
				res.render("secrets");
			}
		});
	});
});

app.listen(3000);
