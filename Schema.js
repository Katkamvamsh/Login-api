const mongoose = require('mongoose');

// Define the schema for the user
const registeredUsersList= new mongoose.Schema({
    Username: {
        required: true,  // 'required' instead of 'require'
        type: String,
       
    },
    Email:{
        required: true,  // 'required' instead of 'require'
        type: String,
        unique: true
    },
   Password:{
      required: true,  // 'required' instead of 'require'
        type: String,  
    },
  
    
});

// Create and export the user model
module.exports = mongoose.model('Users', registeredUsersList);

