import express, { Express, Request, Response} from "express";
import bodyParser from "body-parser";
import api from "./src/routes";
import { fileURLToPath } from "url";
import { dirname } from "path";
const port = 3333;
const app: Express = express();


app.use('/api', api);



//Lắng nghe trên cổng
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});