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
// app.use("/shopping", proxy("localhost:8004"));
app.use(
  "/shopping",
  proxy("http://localhost:8004", {
    proxyErrorHandler: function (err, res, next) {
      console.error("Proxy error:", err);

      // Check for specific error codes and respond accordingly
      if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
        res
          .status(502)
          .json({ message: "Target server not found or unavailable" });
      } else {
        // Handle other errors
        res
          .status(500)
          .json({ message: "An error occurred while processing your request" });
      }
    },
  })
);
app.use("/", proxy("localhost:8003")); // product

// listerning port
app.listen(port, () => {
  console.log("Example app listening on port port!", port);
});

//Run app, then load http://localhost:port in a browser to see the output.
