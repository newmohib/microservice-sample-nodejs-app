const express = require("express");
const cors = require("cors");
const app = express();

//
app.use(express.json());
app.use(cors());

const port = 8002;

//api

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Example app listening on port port!", port);
});

//Run app, then load http://localhost:port in a browser to see the output.
