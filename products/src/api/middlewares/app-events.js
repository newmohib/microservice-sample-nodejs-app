module.exports = (app) => {
  app.post("/app-events", async (req, res, next) => {
    console.log("====== Product Service  Received Event =======");
    try {
      const { payload } = req.body;
      if (payload) {
        // return res.status(200).json(payload);
        return res.status(200).json({ message: "notified!" });
      } else {
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
