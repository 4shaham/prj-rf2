
const mongoose = require('mongoose');

// Define the product schema

const schema = new mongoose.Schema({
 userId:{
    type:ObjectId,
    required:true
 },
 orderItems:[{
    productId:{
        type:ObjectId,
        required:true,
    },
    quantity:{
        type:Number,
        required:true
        
    },
    price:{
        type:Number,
        required:true,

    },
    mrp:{
        type:Number,
        required:true
    },
    orderStatus:{
        type:String,
        default:"ordered",
        required:true
    }
 }],
 paymentMethod:{
    type:String,
    required:true
 },
 orderDate:{
    type:Date,
    default:Date.now()
 },
 addressId:{
    type:objectId,
    required:true
 }

});

// Create a mongoose model using the product schema

const order = mongoose.model('order',schema);

// Export the Product model
module.exports = order;