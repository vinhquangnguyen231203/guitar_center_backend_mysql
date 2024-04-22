import connectToSqlServer  from "./ConnectToDB";

export default class Category{
    //Fields
    private categoryId: string;
    private categoryName: string;
    
    //Constructor
    public constructor({categoryId, categoryName}: {categoryId: string, categoryName: string})
    {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    static async getAllCategory(): Promise<Category[]>
    {
        try{
            //Kết nối đến cơ sở dữ liệu
            const pool =  await connectToSqlServer();
            
            // Thực hiện truy vấn để lấy tất cả danh mục
            const result = await pool.request().query(`SELECT * FROM Category`);

            // Chuyển đổi kết quả thành mảng đối tượng
            const categories: Category[] = result.recordset.map(
                (category: any ) => {
                    return new Category(category);
                }
            );
            
            //Ngắt kết nối sau khi hoàn thành
            await pool.close();
            
            return categories;

        } catch(error) {
            throw error;
        }
    }

    static async getCategoryById(categoryId: string): Promise<Category | null>
    {
        try {
            // Kết nối đến cơ sở dữ liệu
            const pool = await connectToSqlServer();

            const result = await pool.request()
                .input('categoryId', categoryId)
                .query('SELECT * FROM Category WHERE categoryId = @categoryId');
            if(result.recordset.length > 0)
            {
                const categoryData = result.recordset[0];
                const categories: Category = new Category(categoryData);
                return categories;
            }
            return null;

        } catch (error) {
            throw error;
        }
    }
}