import { Request, Response } from "express";
import Order from "../entities/Order";
import OrderDetails from "../entities/OrderDetails";
import { error } from "console";

export const getAllOrders = async (req: Request,res:Response): Promise<any> => {
    try {
        const orders: Order[] = await Order.getAllOrder();

        return res.json(orders);
    } catch (error: any) {
        return res
                .status(404)
                .json({error: error.message})
    }
}

export const getOrderByUsernameWithSession = async (req: Request, res: Response): Promise<any> => {
    try {
        const username = (req.session as any).user;

        console.log(username)

        if(!username){
            return res
                    .status(401)
                    .json({error: "User not logged in" })
        }

        try {
            const orders = await Order.getOrderByUsername(username);
            return res.json(orders)
        } catch (error: any) {
            return res
                .status(404)
                .json({error: error.message})
                    
        }

    } catch (error: any) {
        return res
                .status(404)
                .json({error: error.message})
    }
}

export const getOrderDetailsByOrderIdWithSession = async (req: Request, res: Response): Promise<any> => {
    const username = (req.session as any).user;
    const {orderId} = req.params;

    //Kiểm tra xem người dùng đã đăng nhập chưa
    if (!username){
        return res
                .status(401)
                .json({error: "User not logged in" })
    }

    try {
        const orderDetails = await OrderDetails.getOrderDetailsByOrderId(orderId);
        if (orderDetails) {
            return res.json(orderDetails);
        }
    } catch (error: any) {
        return res
                .status(404)
                .json({error: error.message})
    }
}
export const insertOrderWithSession = async (req: Request, res: Response): Promise<any> => {
    const {order, orderDetails} = req.body;

    const username = (req.session as any).user;

    //orderDetails phải là một mảng
    if(!orderDetails || !Array.isArray(orderDetails)){
        return res
                .status(401)
                .json({error: "Order details cannot be empty"})
    }

    //Kiểm tra login
    if (!username){
        return res
                .status(400)
                .json({error: "User not logged in" })
    }

    //Phân rã từ order trong body
    const {address, phone} = order;

    //Ngày tạo đơn hàng
    const datetime = new Date();
    
    const orderDate = new Date(datetime.getFullYear(),datetime.getMonth(),datetime.getDay())

    const orderId = `${datetime.getDate()}${datetime.getMonth() + 1}${datetime.getFullYear()}${datetime.getHours()}${datetime.getMinutes()}${datetime.getSeconds()}`;


    // lặp qua mảng  orderDetails để thêm mã đơn hàng cho mỗi orderDetail
    const orderDetailHaveOrderId = orderDetails.map(
        (detail) => {
            const { price, unit, productId} = detail;
            return {price, unit, orderId, productId}
        }
    );

    //Cho trạng thái đơn hàng mới đặt là đang xử lý
    const status = "Đang xử lý";

    let totalPrice = 0;

    for (const detail of orderDetailHaveOrderId) {
        const price = detail.price;
        const unit = detail.unit;

        const productTotalPrice = price * unit;
        totalPrice += productTotalPrice;
    }
    
    const orderData = new Order({ orderId, address, orderDate, phone, status, totalPrice, username });

    try {
        const reuslt = await Order.insertOrder(orderData);

        const orderDetailsToInsert: OrderDetails[] = orderDetailHaveOrderId.map(
            (detail) => {
                return new OrderDetails(detail);
            }
        );

        const resultDetails = await orderDetailsToInsert.map(
            async (detail) => {
                return await OrderDetails.insertOrderDetails(detail);
            }
        );

        if(reuslt && resultDetails){
            return res
                    .json({ insertOrder: true })
        }
        return res
            .status(404)
            .json({insertOrder: false})
    } catch (error: any) {
        return res
                .status(404)
                .json({error: error.message})
    }
}
export const updateOrderStatus = async (req: Request, res: Response): Promise<any> => {
    try {
        const {orderId} = req.params;
        const {status} = req.body;

        const orderExist = await Order.getOrderById(orderId);

        if(!req.body || !status){
            return res
                    .status(400)
                    .json({error: "Request body must fill in all information"})
        }

        if(!orderExist){
            return res
                    .status(404)
                    .json({error: `Order ${orderId} does not exist`})
        }
        
        const result = await Order.updateStatusOrder(orderId, status);

        if(result){
            return res
                    .json({update: true})
        }
        else
        {
            return res
                    .status(404)
                    .json({update: false})
        }



    } catch (error: any) {
        return res
                .status(404)
                .json({error: error.message})
    }
}

