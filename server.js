const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const vehicalSchema = require("./models/vehical");
const dotenv = require("dotenv");
dotenv.config();

const accountSid = process.env.ACCOUND_SID;
const authToken = process.env.AUT_TOKEN;
const apiSid = process.env.apiSid
const client = require("twilio")(accountSid, authToken);

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URL;

// db connection

mongoose
  .connect(uri)
  .then(() => {
    console.log("Database Connect Successfully");
  })
  .catch((error) => {
    console.log("Database Side ERROR", error);
  });

// route code

app.get("/api/vehical", (req, res) => {
  vehicalSchema
    .find({})
    .then((result) => {
      res.status(201).send({
        message: "Get All Vehical Data..",
        success: true,
        getVehicalData: result,
      });
    })
    .catch((error) => {
      res.status(501).send({
        message: "Server Side Error",
        success: false,
        error,
      });
    });
});

app.post("/api/vehical/post-data", (req, res) => {
  const vehicalData = new vehicalSchema({
    "vehicalNumber":req.body.vehicalNumber,
    "ownerNumber":req.body.ownerNumber,
    "price":req.body.price,
    "commingTiming":mongoose.now(),
    "markOutTime":""
  });
  vehicalData
    .save()
    .then(() => {
      res.status(201).send({
        message: "Vehical Data Add Successfully",
        success: true,
        data: vehicalData,
      });
      console.log(`+91${req.body.ownerNumber}`)
      console.log(`+91${process.env.PHONE_NUMBER}`)
      client.messages
        .create({
          body: `
          Hello ${req.body.vehicalNumber}.Welcome in number one parking centerYour token number is ${ req.body.vehicalNumber + req.body.ownerNumber}your parking charge as Rupees ${req.body.price} only.`,
          from: `${process.env.PHONE_NUMBER}`,
          to: `+91${req.body.ownerNumber}`,
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      res.status(501).send({
        message: "Server Side Error",
        success: false,
        error,
      });
    });
  // sms sending code
});

app.put("/api/vehical/post-data/:id", (req, res) => {
  console.log(req.params.id);
  const date = new Date();
  vehicalSchema
    .findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          vehicalNumber: req.body.vehicalNumber,
          ownerNumber: req.body.ownerNumber,
          price: req.body.price,
          commingTiming: req.body.commingTiming,
          markOutTime: mongoose.now(),
        },
      }
    )
    .then((result) => {
      res.status(201).json({
        data: result,
      });
      console.log(`+91${req.body.ownerNumber}`)
      console.log(`+91${process.env.PHONE_NUMBER}`)
      client.messages
        .create({
          body: `
            ${req.body.vehicalNumber}.Thank You for the visit parking center Your token number is ${ req.body.vehicalNumber + req.body.ownerNumber}your parking charge as Rupees ${req.body.price} will be Paided .Thankyou and Happy Journey.`,
          from: `${process.env.PHONE_NUMBER}`,
          to: `+91${req.body.ownerNumber}`,
        })
        .catch((error) => {
          console.log(error);
        });
    })
    
    .catch((err) => {
      res.status(500).json({
        message: "not found any relative data",
      });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on Port ${process.env.PORT}`);
});
