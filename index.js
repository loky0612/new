const http = require('http');
var docxConverter = require("docx-pdf");
const express = require("express");
const multer = require("multer");


var path = require("path");

const bodyparser = require("body-parser");
const { hostname } = require('os');

const app = express();

const port = process.env.PORT || 5000;
const server = http.createServer(app);

app.use(express.static("uploads"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

var upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/docxtopdf", upload.single("file"), (req, res) => {
  let outputpath = Date.now() + "output.pdf";
  docxConverter(req.file.path, outputpath, function (err, result) {
    if (err) {
      console.log(err);
    }
    res.download(outputpath,() => {

    })
  });
});

server.listen(port, () => {
    console.log(`started on port ${port}`);
})

