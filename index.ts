import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import api from "./src/routes";
import session from "express-session";
import cors from "cors";
import path from 'path';





const port = 3333;
const app: Express = express();

// Sử dụng express-session trước bất kỳ middleware nào khác
app.use(session({
    secret: 'abc', // Khóa bí mật để mã hóa session
    resave: false, // Không lưu lại session nếu không có sự thay đổi
    saveUninitialized: false, // Không tạo session cho người dùng chưa đăng nhập
}));

// Sử dụng bodyParser để xử lý dữ liệu JSON gửi từ client
app.use(bodyParser.json());

// Sử dụng CORS middleware
app.use(cors({
    origin: (requestOrigin, callback) => {
        callback(null, requestOrigin);
    },
    credentials: true
}));

// Sử dụng các tuyến đường API
app.use('/api', api);

//lấy chỉ mục img
export const imgDirectory = path.resolve(__dirname, '..', 'img');
console.log(imgDirectory);
// Lắng nghe trên cổng
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});