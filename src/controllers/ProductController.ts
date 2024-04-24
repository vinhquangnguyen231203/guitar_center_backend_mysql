import Product from "../entities/Product";
import { Request, Response } from 'express';


export const getAllProducts = async (req: Request, res: Response): Promise<any> => {
    try {
      const products = await Product.getAllProduct();
      res.json(products);
    } catch (error :any) {
    return res.status(400).json({ error: error.message });
    };
};

export const getProductById = async (req: Request, res: Response): Promise<any> => {
    try {
        const {productId} = req.params;

        const product: Product | null = await Product.getProductById(productId);
        if(!product){
        return  res.status(404).json({ error: `Product ${productId} does not exist` });
        }
     return   res.json(product);
    } catch (error:any) {
       return  res.status(400).json({ error: error.message });
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
        const result =  await Product.insertProduct(productData);
        if(result){
            return res.json({inserSuccess:true});
        }else{
            return res.status(401).json(`Failed to insert product ${productId}`);
        }
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
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

            const productData : Product = new Product({productId, productName, unit, price, image, categoryId, description});
            if (!req.body || !productId || !productName || !unit || !price || !image || !categoryId || !description) {
                return res
                  .status(400)
                  .json({ error: "Request body must fill in all information" });
              };
              
        const productNewData = new Product({productId,productName, unit, price, image, categoryId, description});
       const result = await Product.updateProduct(productNewData);
        if(result){
            return res.json({updateSuccess:true});
        }else{
            return res.status(401).json(`Failed to update product ${productId}`);
        }
    } catch (error:any) {
        return res.status(400).json({ error: error.message });

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
        if(productInOrder){
            return res.status(400).json({ error: `Existing products in an order.` });
        }
        await Product.deleteProduct(productId);
       return res.json({delete: true});
    } catch (error:any) {
        return res.status(400).json({ error: error.message });
    };
};

export const getProductByCategoryId = async (req: Request, res: Response): Promise<any> =>{
    try {
        const {categoryId} = req.params;

        const productsInCategory : Product|any = await Product.findByCategory(categoryId);

     if(!productsInCategory){
    return  res.status(404).json({ error: `Product in category ${categoryId} does not exist` });
    }
    res.json(productsInCategory);
    } catch (error:any) {
        return res.status(400).json({ error: error.message });
    }
}

export const getImage = async (req: Request, res: Response): Promise<any> =>{
    try {
        const {productId} = req.params;
        const productExist : Product|any = await Product.getProductById(productId);
        if(!productExist){
             res.status(404).json({ error: `Product ${productId} does not exists` });
        }
        const imageProduct: string| any = await Product.getProductImage(productId);
        
        const imagePath =  `${__dirname}/img/${imageProduct}`

      return  res.sendFile(imagePath);
  
    } catch (error:any) {
        return res.status(400).json({ error: error.message });
    };
};