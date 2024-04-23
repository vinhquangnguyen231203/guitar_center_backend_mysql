import express from "express";
import bodyParser from "body-parser";
import productRouter from "./boundaries/ProductRouter";

const api = express.Router();
api.use(bodyParser.json())

api.use(`/products`, productRouter);

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
