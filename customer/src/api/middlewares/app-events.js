const CustomerService = require("../../services/customer-service");

module.exports = (app) => {
  const service = new CustomerService();
  app.post("/app-events", async (req, res, next) => {
    try {
      console.log("====== Customer App Event is working ========");
      const { payload } = req.body;
      if (payload) {
        await service.SubscribeEvents(payload);
        return res.status(200).json(payload);
      } else {
        await service.SubscribeEvents({});
        return res.status(200).json({});
      }
    } catch (err) {
      // Need to modify for error handling
      // next(err);
      console.log({ err });
      return res.status(400).json(payload);
    }
  });
};
