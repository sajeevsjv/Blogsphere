const mongoose = require('mongoose');
const categories = mongoose.Schema({
   category : String,

})
module.exports = mongoose.model("categories",categories);