const express = require("express");
const app = express();
const mongoose = require("mongoose");
const urlRoute = require("./routes/urlRouter");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");

const port = 5656;

//mongoose connection
connectToMongoDB("mongodb://127.0.0.1:27017/url-shortner")
  .then(() => {
    console.log("DataBase is connected succssfully");
  })
  .catch((error) => {
    console.log(error);
  });

//middleware connections
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parses URL-encoded bodies
app.use("/url", urlRoute);

app.get("/test", async (req, res) => {
  const allUrls = await URL.find({});
  return res.end(`<html>
            <head></head>
            <body>
  <ol>
  ${allUrls
    .map(
      (url) =>
        `<li>${url.shortId} - ${url.redirectURL}  -  ${url.visitHistory.length}</li>`
    )
    .join("")}
  </ol>

            </body>
            </html>`);
});

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

app.get("/", (req, res) => {
  res.json("welcome to custom url");
});

app.listen(port, () => {
  console.log(`custom url shortner ser is working at ${port}`);
});
