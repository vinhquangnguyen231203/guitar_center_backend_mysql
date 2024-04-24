import express from "express";
import * as categoryController from "../controllers/CategoryController";

const categoryRouter = express.Router();


// người dùng xem danh sách category
categoryRouter.get(`/`, categoryController.getAllCategory);

// admin thêm mới category
categoryRouter.post(`/add`, categoryController.insertCategory);

//admin update category
categoryRouter.put(`/:id`, categoryController.updateCategory);

//admin xóa category
categoryRouter.delete(`/:id`, categoryController.deleteCategory);


export default categoryRouter;
