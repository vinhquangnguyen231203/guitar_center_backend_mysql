import * as sql from 'mssql';

async function connectToSqlServer() : Promise<sql.ConnectionPool> {
    try{
        const config = {
            user: 'vinhquang',
            password: '231203',
            server: 'localhost',
            database: 'GuitarCenter',
            port: 1433,
            options: {
                encrypt: false
            }
        }
    
        //Kết nối đến Sql Server và trả về đối tượng kết nối
        const pool: sql.ConnectionPool = await sql.connect(config);
        console.log('Connected to SQL Server');
    
        // Trả về đối tượng kết nối
        return pool;
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
    
}

async function testConnector() {
    try {
        // Kết nối đến sql server
        const pool = await connectToSqlServer();
        // Nếu kết nối thành công, in ra thông báo và đóng kết nối
        console.log('Connection successful!');

        // Đóng kết nối sau khi hoàn thành các thao tác
        await pool.close();
        console.log('Connection closed');
    } catch (error) {
        console.log('Error: ', error);
    }
}
testConnector();

export default connectToSqlServer;
