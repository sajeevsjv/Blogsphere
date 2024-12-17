const mongoose = require('mongoose');
const categories = mongoose.Schema({
   category : String,
   sub_categories : Array

})
module.exports = mongoose.model("categories",categories);