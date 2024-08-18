// Monolithic Microservice architecture

const express = require("express");
const proxy = require("express-http-proxy");
const cors = require("cors");
const app = express();

//port for run the server
const port = 8000;

// middleware
app.use(express.json());
app.use(cors());

// Proxy to microservices for using one end point from web app

// app.use("/customer", proxy("localhost:8001", { proxyReqOptDecorator: () => ({ timeout: 10000 }) }));
app.use("/customer", proxy("localhost:8002"));
app.use("/shopping", proxy("localhost:8003"));
app.use("/", proxy("localhost:8004")); // product

// listerning port
app.listen(port, () => {
  console.log("Example app listening on port port!", port);
});

//Run app, then load http://localhost:port in a browser to see the output.
