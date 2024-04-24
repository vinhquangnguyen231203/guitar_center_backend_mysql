import express from "express";
import bodyParser from "body-parser";
import productRouter from "./boundaries/ProductRouter";
import userRouter from "./boundaries/UserRouter";
import categoryRouter from "./boundaries/CategoryRouter";
import orderRouter from "./boundaries/OrderRouter";

const api = express.Router();
api.use(bodyParser.json())
api.use(`/users`, userRouter);

api.use(`/products`, productRouter);

api.use(`/categories`, categoryRouter);

api.use(`/orders`, orderRouter);



api.all("/*", (req, res) => {
    let data = {
      method: req.method,
      path: req.url,
      query: req.query,
      body: req.body,
    };
    console.log(data);
    res.status(500).json({ error: "API does not exist" });
  });
export default api;
