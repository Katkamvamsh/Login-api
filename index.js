const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require('./db');
const bcrypt = require('bcryptjs');
const Users = require('./Schema');
const cors = require("cors");
const dotenv = require("dotenv"); // mandatory if using ".env" file
const middleware = require('./middlewareAuth');

const port = 3222;
const app = express();

// Use dotenv to load environment variables
dotenv.config();
app.use(cors());
app.use(express.json());

// POST /register route
app.post("/register", async (req, res) => {
  try {
    const { Username, Email, Password, ConfirmPassword } = req.body;

    // Check if all required fields are provided
    if (!Username || !Email || !Password || !ConfirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });
    }

    // Check if passwords match
    if (Password !== ConfirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    // Check if email already exists
    let existEmailId = await Users.findOne({ Email });
    if (existEmailId) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Save user data
    const userSaved = new Users({
      Username,
      Email,
      Password: hashedPassword,
    });
    await userSaved.save();

    res.status(200).json({
      success: true,
      message: "User successfully registered.",
    });
  } catch (error) {
    console.error("Error while registering user:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
});

app.post("/login", async(req,res)=>{

const {Email,Password}=req.body
 
  if( !Email || !Password){
    //make sure use "!" operator for both emailId & password
     //checking if user not given any inputs user will get error 
    res.send({
      success:false,
      status:404,
      message:"All fields are mandatory to fill don't keep empty "
    })
   }

 //checking if user enter a emailId it will register are not , if not will show error
 const existUser= await Users.findOne({Email})
 if(!existUser){
 return res.send({
    success:false,
    status:" 400 Bad request",
    message:"This emailId not registered please register and try again to login"
  })
 }

 

const decodePassword= await bcrypt.compare(Password,existUser.Password)
//make sure don't  use hashedPassword  in login at bcrypt.compare()
// cuz of its already stored in db with a key password been in model
// so bcrypt.compare(password,existUser.password) write this only
//note" password is 1st existUser.password is 2nd" 
//cuz we are comparing plain password with db password 
//not db password is comparing with the plain password

//if password is not matched error will be appear incorrect password
if(!decodePassword){
  return res.send({
    success:false,
    status:400,
    message:"Password is incorrect"
  })
}
// finding user id after successfully login in database
const payload={
  id:existUser.id
}

// generatingToken for login user and adding expiry for login period
const generatingToken= jwt.sign(payload, process.env.jwt_key, {expiresIn:50000})
if(generatingToken){
  return res.send({
    success:true,
    status:201,
    token:generatingToken
  })
}


})



app.get('/yourRoute',middleware,(req, res) => {
  res.json('Hi vamshi, how are you,your data is safe , authenticated person is accessed ');
});


// server created with port number 
app.listen(port,(error)=>{
    if(error){
        console.log("Server not connected ")
    }
    else{
        console.log(`server started at port number ${port} `)
    }
})
