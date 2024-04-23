import Product from "../entities/Product";
import { Request, Response } from 'express';


export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await Product.getAllProduct();
      res.json(products);
    } catch (error :any) {
      throw error;
    };
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.params;

        const product: Product | null = await Product.getProductById(id);
        if(!product){
            res.status(404).json({ error: `Product ${id} does not exist` });
        }
        res.json(product);
    } catch (error:any) {
        throw error;
    }
}

export const insertProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const {productId, productName, unit, price, image, categoryId, description} 
        :{productId:string, 
            productName:string, 
            unit: number, 
            price: number, 
            image: string, 
            categoryId: string, 
            description: string} = req.body;
        const productData : Product = new Product({productId, productName, unit, price, image, categoryId, description});
            if (!req.body || !productId || !productName || !unit || !price || !image || !categoryId || !description) {
                return res
                  .status(400)
                  .json({ error: "Request body must fill in all information" });
              };
            const productExist : Product|any = await Product.getProductById(productId);
            if(productExist){
                return res.status(404).json({ error: `Product ${productId} already exists` });
            }
            await Product.insertProduct(productData)
    } catch (error: any) {
        throw error;
    };
};

export const updateProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const {productId} = req.params;
        const productExist : Product|any = await Product.getProductById(productId);
        if(!productExist){
            return res.status(404).json({ error: `Product ${productId} does not exists` });
        }
        const { productName, unit, price, image, categoryId, description} 
        :{ productName:string, 
            unit: number, 
            price: number, 
            image: string, 
            categoryId: string, 
            description: string} = req.body;

        const productNewData = new Product({productId,productName, unit, price, image, categoryId, description});
        await Product.updateProduct(productNewData);
    } catch (error:any) {
        throw error;
    };
};

export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const {productId} = req.params;
        const productExist : Product|any = await Product.getProductById(productId);
        if(!productExist){
            return res.status(404).json({ error: `Product ${productId} does not exists` });
        }
        const productInOrder : Product|any = await Product.findByOrderId(productId);
        if(productInOrder.length > 0){
            return res.status(400).json({ error: `Existing products in an order.` });
        }
        await Product.deleteProduct(productId);
        res.json({delete: true});
    } catch (error:any) {
        throw error;
    };
};

export const getProductByCategoryId = async (req: Request, res: Response): Promise<void> =>{
    try {
        const {productId} = req.params;
        const productsInCategory : Product|any = await Product.findByCategory(productId);

     if(!productsInCategory){
      res.status(404).json({ error: `Product in category ${productId} does not exist` });
    }
    res.json(productsInCategory);
    } catch (error:any) {
        throw error;
    }
}

export const getImage = async (req: Request, res: Response): Promise<void> =>{
    try {
        const {productId} = req.params;
        const productExist : Product|any = await Product.getProductById(productId);
        if(!productExist){
             res.status(404).json({ error: `Product ${productId} does not exists` });
        }
        const imageProduct: string| any = await Product.getProductImage(productId);
        
        const imagePath =  `${__dirname}/img/${imageProduct}`

        res.sendFile(imagePath);
  
    } catch (error:any) {
        throw error;
    };
};