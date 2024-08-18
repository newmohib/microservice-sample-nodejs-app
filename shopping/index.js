const express = require("express");
const app = express();

//
app.use(express.json());

const port = 8004;

//api

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Example app listening on port port!", port);
});

//Run app, then load http://localhost:port in a browser to see the output.
