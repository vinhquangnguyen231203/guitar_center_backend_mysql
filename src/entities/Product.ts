import e from "express";
import connectToSqlServer from "./ConnectToDB";
export default class Product{
    //Fields
    private productId: string;
    private productName: string;
    private unit: number;
    private price: number;
    private image: string;
    private categoryId: string;
    private description: string;

    //Constructor
    public constructor({productId, productName, unit, price, image, categoryId, description}: {productId: string, productName: string, unit: number, price: number, image: string, categoryId: string, description: string}) {
        this.productId = productId;
        this.productName = productName;
        this.unit = unit;
        this.price = price;
        this.image = image;
        this.categoryId = categoryId;
        this.description = description;
    }

    //Methods
    public static async getAllProduct(): Promise<Product[] | null> {
        try {
            const pool = await connectToSqlServer();

            const result = await pool.request()
                .query('SELECT * FROM Product');

            await pool.close();

            if(result.recordset.length > 0){
                const products: Product[] = result.recordset.map(
                    (item: any) => {
                        return new Product(item);
                    }
                );
                return products;
            }
            return null;

        } catch (error) {
            throw error;
        }
    }
    public static async getProductById(productId: string): Promise<Product | null> {
        try {
            const pool = await connectToSqlServer();

            const result = await pool.request()
                .input('productId', productId )
                .query('SELECT * FROM Product WHERE productId = @productId');
            
            await pool.close();

            if(result.recordset.length > 0){
                const product: Product = new Product(result.recordset[0]);
                return product;
            }
            return null;
        } catch (error) {
            throw error;
        }
    }
    public static async insertProduct(product: Product): Promise<boolean> {
        try {
            const pool = await connectToSqlServer();

            const result = await pool.request()
                .input('productId', product.productId)
                .input('productName', product.productName)
                .input('unit', product.unit)
                .input('price', product.price)
                .input('image', product.image)
                .input('categoryId', product.categoryId)
                .input('description', product.description)
                .query('INSERT INTO PRODUCT (productId, productName, unit, price, image, categoryId, description) VALUES (@productId, @productName, @unit, @price, @image, @categoryId, @description)');

            await pool.close();

            if(result.rowsAffected || result.rowsAffected[0] === 1){
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }

    public static async updateProduct(product: Product): Promise<boolean> {
        try {
            const pool = await connectToSqlServer();

            const result = await pool.request()
                .input('productId', product.productId)
                .input('productName', product.productName)
                .input('unit', product.unit)
                .input('price', product.price)
                .input('image', product.image)
                .input('categoryId', product.categoryId)
                .input('description', product.description)
                .query('UPDATE PRODUCT SET productName = @productName, unit = @unit, price = @price, image = @image, categoryId = @categoryId, description = @description WHERE productId = @productId');
        
            await pool.close();

            if(result.rowsAffected || result.rowsAffected[0] === 1){
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }
    public static async deleteProduct(productId: string): Promise<boolean>{
        try {
            const pool = await connectToSqlServer();

            const result = await pool.request()
                .input('productId', productId)
                .query('DELETE FROM Product WHERE productId = @productId');

            await pool.close();

            if(result.rowsAffected || result.rowsAffected[0] === 1){
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }
    public static async findByCategory(categoryId: string): Promise<Product[]| null> {
        try {
            const pool = await connectToSqlServer();

            const result = await pool.request()
                .input('categoryId', categoryId)
                .query('SELECT * FROM Product WHERE categoryId = @categoryId');
            
            await pool.close();
            
            
            if(result.recordset.length > 0){
                const products: Product[] = result.recordset.map(
                    (item: any) => {
                        return new Product(item);
                    }
                );
                return products;
            }
            return null;

        } catch (error) {
            throw error;
        }
    }

    public static async findByOrderId(productId: string): Promise<Product[]|null>{
        try {
            const pool = await connectToSqlServer();
            const result = await pool.request()
            .input(`productId`,productId)
            .query('SELECT * FROM OrderDetails WHERE productId = @productId');
            await pool.close();

              
            if(result.recordset.length > 0){
                const products: Product[] = result.recordset.map(
                    (item: any) => {
                        return new Product(item);
                    }
                );
                return products;
            }
            return null;

        } catch (error) {
            throw error;
        }
    }

    public static async getProductImage(productId: string): Promise<string | null> {
        try {
            const pool = await connectToSqlServer();

            const result = await pool.request()
                .input('productId',productId)
                .query('SELECT * FROM Product WHERE productId = @productId');
            
            await pool.close();
            
            if(result.recordset.length > 0){

                return result.recordset[0].image;
            }
            return null; 
        } catch (error) {
            throw error;
        }
    }
}