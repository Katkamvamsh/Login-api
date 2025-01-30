const mongoose = require('mongoose');

// Define the schema for the user
const registeredUsersList= new mongoose.Schema({
    userName: {
        required: true,  // 'required' instead of 'require'
        type: String,
       
    },
    emailId:{
        required: true,  // 'required' instead of 'require'
        type: String,
        unique: true
    },
    password:{
      required: true,  // 'required' instead of 'require'
        type: String,  
    },
  
    
});

// Create and export the user model
module.exports = mongoose.model('Users', registeredUsersList);

