const { ShoppingRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-errors");

// All Business logic will be here
class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }

  async getCart({ _id }) {
    try {
      const cartItems = await this.repository.Cart(_id);
      return FormateData(cartItems);
    } catch (err) {
      throw err; // new APIError("Data Not found", err);
    }
  }

  async PlaceOrder(userInput) {
    const { _id, txnNumber } = userInput;

    // Verify the txn number with payment logs

    try {
      const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
      console.log({ orderResult });
      return FormateData(orderResult);
    } catch (err) {
      console.log("PlaceOrder", { err });
      throw err; // new APIError("Data Not found", err);
    }
  }

  async GetOrders(customerId) {
    try {
      const orders = await this.repository.Orders(customerId);
      return FormateData(orders);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async ManageCart(customerId, item, qty, isRemove) {
    try {
      const cartResult = await this.repository.AddCartItem(
        customerId,
        item,
        qty,
        isRemove
      );
      console.log({ cartResult });
      return FormateData(cartResult);
    } catch (error) {
      throw error;
    }
  }

  async SubscribeEvents(payload) {

    payload = JSON.parse(payload)
    console.log("payload into shopping service SubscribeEvents", payload);
    

    const { event, data } = payload;

    const { userId, product, qty } = data;

    switch (event) {
      case "ADD_TO_CART":
        this.ManageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.ManageCart(userId, product, qty, true);
        break;
      case "TEST":
        console.log("working.... Subscribe Events to Shopping Service");
        break;
      default:
        break;
    }
  }

  async GetOrderPayload(userId, order, event) {
    try {
      if (order) {
        const payload = {
          data: { userId, order },
          event: event,
        };
        return FormateData(payload);
      } else {
        return FormateData("No Order  is available");
      }
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }
}

module.exports = ShoppingService;
