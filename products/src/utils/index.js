const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const axios = require("axios");
const amqplib = require("amqplib");

const {
  APP_SECRET,
  // CUSTOMER_SERVICE_URL,
  // SHOPPING_SERVICE_URL,
  MESSAGE_BROKER_URL,
  EXCHANGE_NAME,
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

// module.exports.FormateData = (data) => {
//   if (data) {
//     return { data };
//   } else {
//     throw new Error("Data Not found!");
//   }
// };

// module.exports.PublishCustomerEvent = (data) => {
//   axios.post(`${CUSTOMER_SERVICE_URL}/app-events`, { payload: data });
// };

// module.exports.PublishShoppingEvent = (data) => {
//   axios.post(`${SHOPPING_SERVICE_URL}/app-events`, { payload: data });
// };



// ===============Message broker=========


// crate a channel
module.exports.CreateChannel = async ()=>{

  try {
    const conn = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await conn.createChannel();
    await channel.assertQueue(EXCHANGE_NAME, 'direct', false);
    return channel
    
  } catch (error) {
    console.log("CreateChannel error", {error});
    
    throw error
  }


}

// publish message
module.exports.PublishMessage = async (channel, binding_key, message)=>{
  try {
    await channel.publish(EXCHANGE_NAME, binding_key, Buffer(message))

  } catch (error) {
    throw error
  }

}

// subscribe message
module.exports.SubscribeMessage = async (channel, service, binding_key)=>{
  const QUEUE_NAME = "QUEUE_NAME"
  try {

    const appQueue = await channel.assertQueue(QUEUE_NAME);
    channel.bindQueue(appQueue.queue, EXCHANGE_NAME,binding_key)
    channel.cosume(appQueue.queue, (data) =>{
      console.log("received data");
      console.log(data.content.toString());
      channel.ack(data)
      
      
    })
  } catch (error) {
    
  }

}