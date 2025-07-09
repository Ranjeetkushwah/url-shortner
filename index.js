const express = require("express");
const app = express();
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const path = require('path')
const cookieParser = require('cookie-parser')
const { restrictToLoggedinUserOnly, checkAuth } = require('./middlewares/auth')


const staticRouter = require('./routes/staticRouter')
const urlRoute = require("./routes/urlRouter");
const userRoute = require('./routes/userRouter')

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
app.use(cookieParser());


app.use("/url", restrictToLoggedinUserOnly, urlRoute);      //restrictToLoggedinUserOnly is inline middleware
app.use('/', checkAuth, staticRouter)
app.use('/user', userRoute)


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
  console.log(`custom url shortner is working at http://localhost:${port}/`);
});
