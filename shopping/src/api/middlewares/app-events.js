const ShoppingService = require("../../services/shopping-service");

module.exports = (app) => {
  const service = new ShoppingService();
  app.post("/app-events", async (req, res, next) => {
    console.log("====== Shopping Service  Received Event =======");
    try {
      const { payload } = req.body;
      if (payload) {
        service.SubscribeEvents(payload);
        return res.status(200).json(payload);
      } else {
        console.log("Payload is empty", { payload });
        return res.status(200).json({});
      }
    } catch (err) {
      // Need to modify for error handling
      // next(err);
      console.log({ err });
      return res.status(400).json(payload || {});
    }
  });
};
