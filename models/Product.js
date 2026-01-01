const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'Product name is required'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 chars']
    },
    price:{
        type:Number,
        required:[true,'Price is required'],
        default: 0,
    },
    stock:{
        type:Number,
        required: true,
        default: 0,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;