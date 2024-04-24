import express from "express";
import * as productController from "../controllers/ProductController";

const productRouter = express.Router();

// productRouter.use("/:productId/image", express.static("./img"));

// người dùng xem danh sach product
productRouter.get("/", productController.getAllProducts);

//người dùng xem chi tiết sản phẩm hoặc xem  ở chi tiết đơn hàng
productRouter.get(`/:productId`, productController.getProductById);

// admin thêm mới san pham
productRouter.post(`/add`, productController.insertProduct);

// admin sửa thông tin san pham
productRouter.put(`/:productId`, productController.updateProduct);

// lấy hình ảnh của sản phẩm
productRouter.get(`/:productId/image`, productController.getImage)
// admin xóa  san pham
productRouter.delete(`/:productId`,productController.deleteProduct);

//người dùng xem product trong category
productRouter.get(`/category/:categoryId`, productController.getProductByCategoryId);



export default productRouter;
