const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/user/user");

const register = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password || !mobile) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields missing" });
    }

   

    const existing = await User.findOne( { where : { email } });
    if(existing){
        return res.status(409).json({ success : false, message : "User already exists, please login"})
    }

     const hashPassword = await bcrypt.hash(password, saltRounds);



    const user = await User.create({
        name,
        email,
        password : hashPassword,
        mobile
  });

    const safeUser = {
        id : user.id,
        name : user.name,
        email : user.email,
        mobile : user.mobile
    }

    return res
      .status(201)
      .json({
        success: true,
        data: safeUser,
        message: "User registered successfully",
      });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email , password } = req.body
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    
      const  user = await User.findOne( { where : { email } } )
 
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found , please register" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials, Please check once",
      });
    }

       const safeUser = {
        id : user.id,
        name : user.name,
        email : user.email,
        mobile : user.mobile
    }


    return res
      .status(200)
      .json({ success: true, data : safeUser, message: "Login Successfull" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
};
