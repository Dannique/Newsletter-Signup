//jshint esversion:6

const express = require("express");
const https = require("https");
require('dotenv').config();
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({
  extended: true
}));

mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: "us2"
});

app.route("/")

.get((req, res) => {
  res.sendFile(__dirname + "/signup.html");
})

.post( (req, res) => {
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",

      merge_fields: {
        FNAME: fName,
        LNAME: lName
      }
    }]
  };

  const jsonData = JSON.stringify(data);
  const url = process.env.URL;

  const options = {
    method: "POST",
    auth: process.env.AUTH
  }

  const request = https.request(url, options, (response) => {
    response.statusCode == 200 ? res.sendFile(__dirname + "/success.html") :
      res.sendFile(__dirname + "/failure.html");

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
})

app.post("/failure", (req, res) => {
  res.redirect("/")
});

app.listen(process.env.PORT || 3000, () => {
  console.log("running.");
});