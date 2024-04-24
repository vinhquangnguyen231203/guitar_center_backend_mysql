import connectToSqlServer from "./ConnectToDB";

export default class User{
    //Fields
    private username: string;
    private password: string;
    private fullname: string;
    private phone: string;
    private address: string;
    private gender: string;
    private birth: Date;
    private role: string;

    //Constructor
    public constructor({username, password, fullname, phone, address, gender, birth, role}: {username: string, password: string, fullname: string, phone: string, address: string, gender: string, birth: Date, role: string}) {
        this.username = username;
        this.password = password;
        this.fullname = fullname;
        this.phone = phone;
        this.address = address;
        this.gender = gender;
        this.birth = birth;
        this.role = role;
    }

    public static async getAllUsers(): Promise<User[] | null> {
        try {
            const pool = await connectToSqlServer();
            
            const result = await pool.request()
                .query('SELECT * FROM Users');

            await pool.close();

            if(result.recordset.length > 0){
                const users: User[] = result.recordset.map(
                    (item: any) => {
                        return new User(item);
                    }
                );
                return users;
            };
            return null;
        } catch (error) {
            throw error;
        }
    }
    public static async getUserByUsername(username: string): Promise<User | null> {
        try {
            const pool = await connectToSqlServer();

            const result = await pool.request()
                .input('username', username)
                .query('SELECT * FROM Users WHERE username = @username');

            await pool.close();

            if(result.recordset.length > 0){
                const users: User = new User(result.recordset[0]);
                return users;
            }
            return null;

        } catch (error) {
            throw error;
        }
    }
    public static async createUser(user: User): Promise<boolean>{
        try {
            const pool = await connectToSqlServer();

            const result = await pool.request()
                .input('username', user.username)
                .input('password', user.password)
                .input('fullname', user.fullname)
                .input('phone', user.phone)
                .input('address', user.address)
                .input('gender', user.gender)
                .input('birth', user.birth)
                .input('role', user.role)
                .query('INSERT INTO Users (username, password, fullname, phone, address, gender, birth, role) VALUES (@username, @password, @fullname, @phone, @address, @gender, @birth, @role)');

                if(result.rowsAffected || result.rowsAffected[0] === 1){
                    return true;
                }
                return false;
        } catch (error) {
            throw error;
        }
    }

    public static async checkPassword(username: string, password: string): Promise<boolean>{
        const pool = await connectToSqlServer();

        const result = await pool.request()
            .input('username', username)
            .input('password',password)
            .query('SELECT * FROM Users WHERE username = @username AND password = @password');

        await pool.close();

        if(result.rowsAffected || result.rowsAffected[0] === 1){
            return true;
        }
        return false;
            
    }
    
    public static async updateUserInfo(user: User): Promise <boolean>{
        try {
            const pool = await connectToSqlServer();
            

            const result = await pool.request()
                .input('username', user.username)
                .input('password', user.password)
                .input('fullname', user.fullname)
                .input('phone', user.phone)
                .input('address', user.address)
                .input('gender', user.gender)
                .input('birth', user.birth)
                .query('UPDATE Users SET password = @password, fullname = @fullname,phone = @phone, address = @address, gender = @gender, birth = @birth WHERE username = @username');

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