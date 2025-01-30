const express=require("express")
const jwt=require("jsonwebtoken")
const mongoose=require('./db')
const bcrypt = require('bcryptjs');

const Users=require('./Schema')
const cors=require("cors")
const port =3222
const app=express()
const dotenv=require("dotenv") //mandatory if using ".env" file
const middleware=require('./middlewareAuth')
app.use(cors());
app.use(express.json())
dotenv.config() //mandatory to called if using ".env" file 

app.post("/register", async (req, res) => {
  const { userName, emailId, password, confirmPassword } = req.body;

  // Check if all required fields are provided
  if (!userName || !emailId || !password || !confirmPassword) {
    return res.status(400).json("All fields are mandatory to fill.");
  }

  // Check if the passwords match
  if (password !== confirmPassword) {
    return res.status(400).json("Passwords do not match.");
  }

  // Check if email already exists
  let existEmailId = await Users.findOne({ emailId });
  if (existEmailId) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "This emailId is already registered, try registering with a different emailId.",
    });
  }

  // Hash the password using bcrypt
  try {
    // Ensure password and saltRounds are properly set
    if (!password) {
      return res.status(400).json("Password is required.");
    }

    const saltRounds = 10; // Ensure saltRounds is a valid number
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Hashed password:", hashedPassword); // Optional: Log the hashed password for debugging

    // Create a new user with hashed password
    const userSaved = new Users({
      userName,
      emailId,
      password: hashedPassword,
    });

    // Save the user to the database
    await userSaved.save();
    res.json({
      success: true,
      status: 200,
      message: "User successfully registered",
    });
  } catch (error) {
    console.error("Error while saving user:", error);
    res.status(500).json("Error while registering user.");
  }
});


app.post("/login", async(req,res)=>{

const {emailId,password}=req.body
 
  if( !emailId || !password){
    //make sure use "!" operator for both emailId & password
     //checking if user not given any inputs user will get error 
    res.send({
      success:false,
      status:404,
      message:"All fields are mandatory to fill don't keep empty "
    })
   }

 //checking if user enter a emailId it will register are not , if not will show error
 const existUser= await Users.findOne({emailId})
 if(!existUser){
 return res.send({
    success:false,
    status:" 400 Bad request",
    message:"This emailId not registered please register and try again to login"
  })
 }

 

const decodePassword= await bcrypt.compare(password,existUser.password)
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
