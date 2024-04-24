import e from "express";
import connectToSqlServer from "./ConnectToDB";
import { get } from "http";

export default class Order {

    //Fields
    private orderId: string;
    private address: string;
    private orderDate: Date;
    private phone: string;
    private status: string;
    private totalPrice: number;
    private username: string;

    

    //Constructors
    public constructor({orderId, address, orderDate, phone, status, totalPrice, username}: {orderId: string, address: string, orderDate: Date, phone: string, status: string, totalPrice: number, username: string}) {
        this.orderId = orderId;
        this.address = address;
        this.orderDate = orderDate;
        this.phone = phone;
        this.status = status;
        this.totalPrice = totalPrice;
        this.username = username;
    }
    

    static async getAllOrder(): Promise<Order[]> {
        try {
            const pool = await connectToSqlServer();

            const result = await pool.request().query(`SELECT * FROM Orders`);

            const orders: Order[] = result.recordset.map(
                (item: any) => {
                    return new Order(item);
                }
            );

            await pool.close();

            return orders;
        } catch (error) {
            throw error;
        }
    }
    static async getOrderByUsername(username: string): Promise<Order[] | null> {
        try {
            const pool = await connectToSqlServer();
            
            const result = await pool.request()
                .input('username', username)
                .query('SELECT * FROM Orders WHERE username = @username');
            
            if(result.recordset.length > 0) {
                const orders: Order[] = result.recordset.map(
                    (item: any) => {
                        return new Order(item);
                    }
                );
                return orders;
            }
            return null;


        } catch (error) {
            throw error;
        }
    }
    static async getOrderById(orderId: string): Promise<Order | null> {
        try {
            const pool = await connectToSqlServer();

            const result = await pool.request()
                .input('orderId', orderId)
                .query('SELECT * FROM Orders WHERE orderId = @orderId');
            
            if(result.recordset.length > 0) {
                const orderData = result.recordset[0];
                const orders: Order = new Order(orderData);
                return orders;
            }
            return null;
        } catch (error) {
            throw error;
        }
    }
    static async insertOrder(order: Order): Promise<boolean> {
        try {
            const pool = await connectToSqlServer();
            
            // Chèn đơn hàng vào cơ sở dữ liệu
            const result = await pool.request()
                .input('orderId', order.orderId)
                .input('address', order.address)
                .input('orderDate', order.orderDate)
                .input('phone', order.phone)
                .input('status', order.status)
                .input('totalPrice', order.totalPrice)
                .input('username', order.username)
                .query(`INSERT INTO Orders (orderId, address, orderDate, phone, status, totalPrice, username) 
                        VALUES (@orderId, @address, @orderDate, @phone, @status, @totalPrice, @username)`);
    
            await pool.close();
    
            // Kiểm tra xem có lỗi trả về từ truy vấn không
            if (result.rowsAffected || result.rowsAffected[0] === 1) {
                return true;
            }

            return false;


        } catch (error) {
            throw error;
        }
    }
    static async updateStatusOrder(orderId: string, status: string): Promise<boolean> {
        try {
            const pool = await connectToSqlServer();
            
            // Cập nhật trạng thái của đơn hàng trong cơ sở dữ liệu
            const result = await pool.request()
                .input('orderId', orderId)
                .input('status', status) // Giả sử trạng thái của đơn hàng được lưu trong thuộc tính status của đối tượng Order
                .query(`UPDATE Orders SET status = @status WHERE orderId = @orderId`);
    
            await pool.close();

            if(result.rowsAffected || result.rowsAffected[0] === 1) {
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }

    static async deleteOrder(orderId: string): Promise<boolean> {
        try {
            const pool = await connectToSqlServer();
            
            const result = await pool.request()
                .input('orderId', orderId)
                .query(`DELETE FROM Orders WHERE orderId = @orderId`);
            
            await pool.close();
            
            if(result.rowsAffected || result.rowsAffected[0] === 1){
                return true;
            }
            
            return false;
        } catch (error) {
            throw error;
        }
    }
    
}
