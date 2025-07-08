const express = require("express");
const app = express();
const mongoose = require("mongoose");
const urlRoute = require("./routes/urlRouter");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const path = require('path')
const staticRouter = require('./routes/staticRouter')

const port = 5656;

//mongoose connection
connectToMongoDB("mongodb://127.0.0.1:27017/url-shortner")
  .then(() => {
    console.log("DataBase is connected succssfully");
  })
  .catch((error) => {
    console.log(error);
  });

app.set("view engine", "ejs")
app.set('views', path.resolve("./views"))


//middleware connections
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parses URL-encoded bodies
app.use("/url", urlRoute);
app.use('/', staticRouter)

// app.get("/test", async (req, res) => {
//   const allUrls = await URL.find({});
//     return res.render('home', {
//         urls: allUrls,

//     })
// });

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

// app.get("/", (req, res) => {
//   res.json("welcome to custom url");
// });

app.listen(port, () => {
  console.log(`custom url shortner ser is working at ${port}`);
});
