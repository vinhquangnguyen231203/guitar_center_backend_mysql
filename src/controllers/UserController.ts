import User from "../entities/User";
import { Request, Response } from 'express';


export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
    try {
      const users:User[]|any = await User.getAllUsers();
      res.json(users);
    } catch (error :any) {
    return res.status(400).json({ error: error.message });
    };
};
// Hàm để chuyển đổi định dạng ngày tháng
function convertDateFormat(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const getUserByUserNameWithSession = async (req: Request, res: Response): Promise<any> => {
  try {
    const username = (req.session as any).user;

    //kiểm tra người dùng đã nhập chưa 
    if(!username){
      return res.status(401).json({ error: "User not logged in" });
    }
    const user:User|any = await User.getUserByUsername(username);
    if(!user){
      return  res.status(404).json({ error: `Username ${username} does not exist` });

    }    
    // Chuyển đổi định dạng ngày tháng
      user.birth = convertDateFormat(user.birth);
     
    return res.json(user);
  } catch (error:any) {
    return res.status(400).json({ error: error.message });
  }
}


export const getUserByUsername = async (req: Request, res: Response): Promise<any> => {
  try {
    const {username} = req.params;

    //kiểm tra người dùng đã nhập chưa 
    if(!username){
      return res.status(401).json({ error: "Username connot be empty" });
    }
    const user:User|any = await User.getUserByUsername(username);
    if(!user){
      return  res.status(404).json({ error: `Username ${username} does not exist` });

    }    
    // Chuyển đổi định dạng ngày tháng
      user.birth = convertDateFormat(user.birth);
     
    return res.json(user);
  } catch (error:any) {
    return res.status(400).json({ error: error.message });
  }
}



export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const {  username, password, fullname, phone, address, gender, birth }
    :{  username: string,
        password: string,
        fullname: string, 
        phone: string, 
        address: string, 
        gender: string, 
        birth: Date}
     = req.body;
     if (!req.body || !username || !password || !fullname || !phone || !address || !gender || !birth) {
      return res
        .status(400)
        .json({ error: "Request body must fill in all information" });
    }
    if(!username){
      return res.status(400).json({ error: "Username cannot be empty" });
    }
    const userExist = await User.getUserByUsername(username);
    if(userExist){
      return res.status(404).json({ error: `Username ${username} already exists` });
    }

    const userData = new User( { username, password, fullname, phone, address, gender, birth, role:`U` });
    const user = await User.createUser(userData);
    if(user){
      return res.json({insertSuccess:true});
    }else{
      return res.status(401).json(`Failed to create user ${username}`);
    }
  } catch (error:any) {
    return res.status(400).json({ error: error.message });
  }
}

export const updateUserWithSession = async (req: Request, res: Response): Promise<any> => {

  const username = (req.session as any).user;

    // Kiểm tra xem người dùng đã đăng nhập chưa
if (!username) {
  return res.status(401).json({ error: "User not logged in" });
}
  console.log(req.body);
    const {  password, fullname, phone, address, gender, birth }
    :{  password: string,
        fullname: string, 
        phone: string, 
        address: string, 
        gender: string, 
        birth: string}
     = req.body;

    console.log(typeof(birth))
     if (!req.body || !password || !fullname || !phone || !address || !birth) {
      return res
        .status(404)
        .json({ error: "Request body must fill in all information" });
    }
    // const datetime = new Date(birth)
    // const birthtime = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate());
    // console.log(birth); // Chuyển đổi birth từ kiểu string sang kiểu Date
    const birthDate: Date = new Date(birth);

    console.log(typeof(birthDate))
    // Tạo đối tượng User với kiểu birth là Date
    const userData = new User({ username, password, fullname, phone, address, gender, birth: birthDate, role: 'U' });
     try {
      const updateUser = await User.updateUserInfo( userData );

      if(updateUser){
        return res.status(200).json({updateSuccess:true});
      }else{
        return res.status(401).json(`Failed to update user ${username}`);
      }
  } catch (error:any) {
    return res.status(400).json({ error: error.message });

  }
}

export const updateUser = async (req: Request, res: Response): Promise<any> => {

  const {username} = req.params;

    // Kiểm tra xem người dùng đã đăng nhập chưa
if (!username) {
  return res.status(401).json({ error: "Username connot be empty" });
}
  console.log(req.body);
    const {  password, fullname, phone, address, gender, birth }
    :{  password: string,
        fullname: string, 
        phone: string, 
        address: string, 
        gender: string, 
        birth: string}
     = req.body;

    console.log(typeof(birth))
     if (!req.body || !password || !fullname || !phone || !address || !birth) {
      return res
        .status(404)
        .json({ error: "Request body must fill in all information" });
    }
    const birthDate: Date = new Date(birth);

    console.log(typeof(birthDate))
    // Tạo đối tượng User với kiểu birth là Date
    const userData = new User({ username, password, fullname, phone, address, gender, birth: birthDate, role: 'U' });
     try {
      const updateUser = await User.updateUserInfo( userData );

      if(updateUser){
        return res.status(200).json({updateSuccess:true});
      }else{
        return res.status(401).json(`Failed to update user ${username}`);
      }
  } catch (error:any) {
    return res.status(400).json({ error: error.message });

  }
}

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username } = req.params;
    const userExist:User|any = await User.getUserByUsername(username);
    if(!userExist){
      return res.status(404).json({ error: `User ${username} does not exists` });
    }
    await User.deleteUser(username);
    return res.json({deleteSuccess:true});
  } catch (error:any) {
    return res.status(400).json({ error: error.message });
  }
}

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { username, password }: { username: string; password: string } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Request body must fill in all information" });
  }
   // Kiểm tra xem tài khoản tồn tại và mật khẩu đúng không
   const user:User|any = await User.getUserByUsername(username);
   if (!user) {
     return res.status(401).json({ error: "Invalid username or password" });
   }

   try {
    const isValidPassword = await User.checkPassword(username, password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    console.log(`Login succes usename : ${user.username}`);
    (req.session as any).user = user.username;
    if(  (req.session as any).user){
      return res.json(user);
    }else{
      return res.status(401).json(`Failed to login user ${username}`);
    }
   } catch (error:any) {
    return res.status(400).json({ error: error.message });
   }
}

export const logoutUser = async (req: Request, res: Response): Promise<any> => {
  try {
    (req.session as any).destroy((err: Error) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.clearCookie('connect.sid'); // Xóa session cookie
      res.json({ message: 'Logout successful' });
    });
  } catch (error:any) {
    return res.status(400).json({ error: error.message });
  }
}

export const checkLoginStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const username = (req.session as any).user;

    if(username){
      return res.status(200).json({loginStatus:true});
    }else{
      return res.status(404).json({loginStatus:false});
    }
    
  } catch (error:any) {
    return res.status(400).json({ error: error.message });

  }
}

