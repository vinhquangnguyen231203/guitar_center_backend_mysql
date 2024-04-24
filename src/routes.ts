import express from "express";
import bodyParser from "body-parser";
import productRouter from "./boundaries/ProductRouter";
import userRouter from "./boundaries/UserRouter";


const api = express.Router();
api.use(bodyParser.json())

api.use(`/products`, productRouter);

api.use(`/users`, userRouter);


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
