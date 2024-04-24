import express from "express";
import * as orderController from "../controllers/OrderController";

const orderRouter = express.Router();

// admin xem danh sach tat ca đơn hàng
orderRouter.get(`/`, orderController.getAllOrders)

// người dùng đặt hàng với session
orderRouter.post("/add", orderController.insertOrderWithSession);


//người dùng xem danh sách đơn hàng của mình bằng session
orderRouter.get(`/my-orders`, orderController.getOrderByUsernameWithSession)



//người dùng xem chi tiết đơn  với session
orderRouter.get(`/my-orders/:orderId`, orderController.getOrderDetailsByOrderIdWithSession)


//admin cập nhật trạng thái đơn hàng
orderRouter.put(`/:orderId`, orderController.updateOrderStatus);

export default orderRouter;
