import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productId : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    //array for other names
    altNames : {
        type : [String],
        //if some one do not give any alt names 
        // it shows as an empty array
        default : []
    },
    price : {
        type : Number,
        required : true
    },
    labeledPrice : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    images : {
        type : [String],
        required : true,
        default : ["https://th.bing.com/th/id/OIP.Arq3Sgysus2VLaKcj0NO7QHaEK?rs=1&pid=ImgDetMain"]
    },
    stock : {
        type : Number,
        required : true
    }
    
})

const Product = mongoose.model("products",productSchema);
export default Product;