import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId : {
        type : String,
        required : true,
        unique : true
    },
    date : {
        type : Date,
        required : true,
        default : Date.now  //to get the current date
    },
    email : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    phoneNumber : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true,
        default : "Pending"
    },
    billItems : {
        type : [
            {
                //why we hardcode this things in here
                //because the product images, prices are vary from time to time
                //so we have to make it dynamic
                //if a user come and see an old order, the prices should be the old prices
                productId : String,
                productName : String,
                image : String,
                quantity : Number,
                price : Number
            }
        ],
        required : true
    },
    total : {
        type : Number,
        required : true
    }
})

const Order = mongoose.model("Order",orderSchema);
export default Order;