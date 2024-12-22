const mongoose = require ('mongoose');

const blogs = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
        },
    category : {
        type : String,
        required : true
    },
    tags : [
        {
            type : String,
            required : true
        }
    ],
    image : String,
    likes : Number,
    comments : Array
})

module.exports = mongoose.model("blogs",blogs);