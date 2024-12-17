'use strict';

const user_types = require("../models/user_types");

module.exports = {
  up: (models, mongoose) => {
  
      return models.user_types.insertMany([
       {
        _id : "67472a0c659bfab478d1ef7c",
        user_type : "user" 
       },
       {
        _id : "67472a35659bfab478d1ef7e",
        user_type : "admin" 
       }
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
  },

  down: (models, mongoose) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return models.Test.bulkWrite([
        {
          deleteOne: {
            filter: {
              name: 'first test'
            }
          }
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
    */
  }
};
