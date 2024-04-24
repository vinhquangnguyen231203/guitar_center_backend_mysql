import connectToSqlServer from "./ConnectToDB";
import Product from "./Product";

export default class OrderDetails {
    //Fields
    private price: number;
    private unit: number;
    private orderId: string;
    private productId: string;

    //Constructor
    public constructor({price, unit, orderId, productId}: {price: number, unit: number, orderId: string, productId: string}) {
        this.price = price;
        this.unit = unit;
        this.orderId = orderId;
        this.productId = productId;
    }

    //Methods:
    static async getOrderDetailsByOrderId(orderId: string): Promise<OrderDetails[] | null>{
        try {
            const pool = await connectToSqlServer();

            const result = await pool.request()
                .input('orderId',orderId)
                .query('SELECT * FROM OrderDetails WHERE orderId = @orderId');
            
            await pool.close();

            if(result.recordset.length > 0) {
                const orderDetails: OrderDetails[] = result.recordset.map((item: any) => {
                    return new OrderDetails(item);
                })
                return orderDetails;
            }
            
            return null;
        } catch (error) {
            throw error;
        }
    }

    static async insertOrderDetails(orderDetails: OrderDetails): Promise <boolean> {
        try {
            const pool = await connectToSqlServer();

            
            const result = await pool.request()
                .input('price',orderDetails.orderId)
                .input('unit',orderDetails.unit)
                .input('orderId',orderDetails.orderId)
                .input('productId',orderDetails.productId)
                .query('INSERT INTO OrderDetails (price, unit, orderId, productId) VALUES (@price, @unit, @orderId, @productId)');
            
            await pool.close();

            if(result.rowsAffected || result.rowsAffected[0] === 1) {
                return true;
            }

            return false;
        } catch (error) {
            throw error;
        }
    }
    
    
}