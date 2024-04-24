
import Category from "../entities/Category.js";
import { Request, Response } from "express";
import Product from "../entities/Product.js";

export const getAllCategory = async (req: Request, res: Response): Promise<any> => {
    try {
        const categories = await Category.getAllCategory();
        return res
                .json(categories);
    } catch (error: any) {
        return res
                .status(404)
                .json({error: error.message});
    }
}

export const insertCategory = async (req: Request, res: Response): Promise<any> =>{
    try {
        const {categoryId, categoryName} = req.body;
        
        
        const categoryData: Category = new Category({categoryId, categoryName});

        if(!req.body || !categoryId || !categoryName){
            return res
                    .status(400)
                    .json({error: "Category cannot be empty"})
        }

        if (!categoryId){
            return res
                    .status(400)
                    .json({error: "Category ID cannot be empty"})
        }

        const categoryExist: Category | null = await Category.getCategoryById(categoryId);

        if (categoryExist){
            return res
                    .status(404)
                    .json({error: `Category ${categoryId} already exist`})
        }

        await Category.insertCategory(categoryData);
        return res.json({success: true})
    } catch (error: any) {
        return res
                .status(404)
                .json({error: error.message});
    }
}
export const updateCategory = async (req: Request, res: Response): Promise<any> =>{
    try {
        const {id} = req.params;

        const categoryExist: Category | null = await Category.getCategoryById(id);

        if(!categoryExist){
            return res
                    .status(404)
                    .json(`Category ${id} does not exist`)
        }

        const {categoryName} = req.body;

        const categoryNewData = new Category({categoryId: id, categoryName: categoryName});

        const result = await Category.updateCategory(categoryNewData);

        if(result){
            return res
                    .status(200)
                    .json({update: true})
        }
        else{
            return res
                    .status(400)
                    .json({update: false})
                    
        }
    } catch (error: any) {
        return res
                .status(404)
                .json({error: error.message});
    }
}

export const deleteCategory = async (req: Request, res: Response): Promise<any> =>{
    try {
        const {id} = req.params;
        
        const categoryExist = await Category.getCategoryById(id);

        if(!categoryExist){
            return res
                    .status(404)
                    .json({error: `Category ${id} does not exist`})
        }

        const productInCategory: Product[] | null = await Product.findByCategory(id);

        if(productInCategory){
            return res
                    .status(400)
                    .json({error: `Existing products in the category ${id}.` })
        }
        const result = await Category.deleteCategory(id)

        if(result){
            return res.json({delete: true})
        }
        else
        {
            return res
                    .status(404)
                    .json({delete: false})
        }
    } catch (error: any) {
        return res
                .status(404)
                .json({error: error.message});
    }
}