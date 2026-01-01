const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },

    items:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity:{
                type: Number,
                default: 1,
                min: 1
            }
        }
    ],

    updatedAr: {
        type: Date,
        default: Date.now
    }
});

mongoose.exports = mongoose.model('Cart', CartSchema);