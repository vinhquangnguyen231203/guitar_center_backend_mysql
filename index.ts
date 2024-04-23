import express, { Express, Request, Response} from "express";
import bodyParser from "body-parser";




const port = 3000;
const app: Express = express();





//Lắng nghe trên cổng
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});