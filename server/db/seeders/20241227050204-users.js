'use strict';
const bcrypt = require("bcrypt");

module.exports = {
  up: (models, mongoose) => {

      let password = "admin01";
      let salt = bcrypt.genSaltSync(10);
      const hashed_pass = bcrypt.hashSync(password,salt);
    
      return models.users.insertMany([
        {  "name" : "admin",
          "email" : "admin@gmail.com",
          "password" : hashed_pass,
          "user_type" : "67472a35659bfab478d1ef7e"
          
        }
        
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
  },

  down: (models, mongoose) => {
   
    return models.users.deleteMany({
      _id: "66f41c79384f7819814abf15"
    }).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
  }
};
