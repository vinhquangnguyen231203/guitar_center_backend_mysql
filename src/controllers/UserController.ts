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
    const {  password, fullname, phone, address, gender, birth }
    :{  password: string,
        fullname: string, 
        phone: string, 
        address: string, 
        gender: string, 
        birth: Date}
     = req.body;
     if (!req.body || !password || !fullname || !phone || !address || !gender || !birth) {
      return res
        .status(400)
        .json({ error: "Request body must fill in all information" });
    }
    const userData = new User( { username, password, fullname, phone, address, gender, birth, role:`U` });
    try {
      const updateUser = await User.updateUserInfo( userData );

      if(updateUser){
        return res.json({updateSuccess:true});
      }else{
        return res.status(401).json(`Failed to update user ${username}`);
      }
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