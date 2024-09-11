const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");

const {
  APP_SECRET,
  // CUSTOMER_SERVICE_URL,
  // SHOPPING_SERVICE_URL,
  MESSAGE_BROKER_URL,
  EXCHANGE_NAME,
  QUEUE_NAME,
  CUSTOMER_BINDING_KEY
} = require("../config");


//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};



// ===============Message broker=========
// Create a channel
module.exports.CreateChannel = async () => {
  try {
    const conn = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await conn.createChannel();
    
    // Declare an exchange
    await channel.assertExchange(EXCHANGE_NAME, 'direct', false);
    
    return channel;
  } catch (error) {
    console.log("CreateChannel error", { error });
    throw error;
  }
};

// Publish message to the exchange
module.exports.PublishMessage = async (channel, binding_key, message) => {
  try {
    // Publish message to the specified exchange
    await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    console.log("Data is sent for", message);
  } catch (error) {
    console.log("PublishMessage error", { error });
    throw error;
  }
};

// Subscribe to messages from the queue
module.exports.SubscribeMessage = async (channel, service, binding_key) => {
  // const QUEUE_NAME = "QUEUE_NAME"; // Replace with your actual queue name

  try {
    // Assert a queue
    const appQueue = await channel.assertQueue(QUEUE_NAME, {
      durable: true // Set to true if you want the queue to be persistent
    });

    // Bind the queue to the exchange with a binding key
    channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);

    // Consume messages from the queue
    channel.consume(appQueue.queue, (data) => {
      console.log("Received data into Customer Service");
      console.log(data.content.toString());
      channel.ack(data); // Acknowledge message after processing
    }, {
      noAck: false // Set to true if you don't want to manually acknowledge messages
    });
  } catch (error) {
    console.log("SubscribeMessage error", { error });
    throw error;
  }
};


