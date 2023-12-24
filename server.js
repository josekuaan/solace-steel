const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
var helmet = require("helmet");
const cors = require("cors");
const Inventory = require("./Model/inventory");

const app = express();

app.use(helmet());

const DBConnect = require("./DB/ConnectDb");
const inventory = require("./routes/inventory");
const customer = require("./routes/customers");
const auth = require("./routes/auth");

// Load Env Vars
dotenv.config({ path: "./config/config.env" });

// Initialize DB
DBConnect();

app.use(express.json());

app.use(cors());
app.use(fileUpload());
app.use(
  // [
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'self'"],
      childSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com/"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: [
        "'self'",
        "https://maxcdn.bootstrapcdn.com",
        "https: data:",
        "https://fonts.googleapis.com",
      ],
      imgSrc: ["'self'", "data:"],
      baseUri: ["'self'"],
    },
  })
  // ]
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.ORIGIN || "*");
  next();
});

app.use("/api/user/auth", auth);
app.use("/api/customers", customer);
app.use("/api/inventory", inventory);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/client/build")));
// }
// app.get("/*", (req, res) => {
//   return res.sendFile(
//     path.join(__dirname + "/client", "/build", "/index.html")
//   );
// });
//source /home2/solacest/nodevenv/public_html/api/16/bin/activate && cd /home2/solacest/public_html/api
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(` app listening at http://localhost:${port}`);
});
