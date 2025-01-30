const mongoose = require('mongoose');
const schema=require('./Schema')

// MongoDB URI with special characters URL-encoded in the password
const uri = "mongodb+srv://katkamvamshi:Katkamvamshi%2A%2399@cluster0.f7py0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Connect to MongoDB using promises and handle the result using then() and catch()
mongoose.connect(uri)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);  // Log the error
  });
   module.exports=mongoose



