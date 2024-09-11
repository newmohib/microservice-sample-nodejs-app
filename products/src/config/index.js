const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
  CUSTOMER_SERVICE_URL: process.env.CUSTOMER_SERVICE_URL,
  PRODUCT_SERVICE_URL: process.env.PRODUCT_SERVICE_URL,
  SHOPPING_SERVICE_URL: process.env.SHOPPING_SERVICE_URL,
  // broker config
  
  MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  SHOPPING_BINDING_KEY: process.env.SHOPPING_BINDING_KEY,
  CUSTOMER_BINDING_KEY: process.env.CUSTOMER_BINDING_KEY,
  QUEUE_NAME: "SHOPPING_QUEUE"
};
