import Product from "../models/product.js";

export async function createProduct(req,res){
    if(req.user == null){
        res.status(403).json({
            message : "You need to login first"
        })
        return;
    }

    if(req.user.role != "admin"){
        res.status(403).json({
            message : "You are not authorized to create a product"
        })
        return;
    }

    const product = new Product(req.body);

    //product.save().then(
        //()=>{
            //res.json({
                //message : "Product saved successfully"
            //})
        //}
    //).catch(
       //(err)=>{
            //res.status(500).json({
                //message : "Product not saved"
            //})
        //}
    //)

    //add async await
    try{
        await product.save()
        res.json({
            message : "Product created successfully"
        })
    }catch{
        res.status(500).json({
            message : "Product not created"
        })
    }
}

const defaultProducts = [
  {
    name: 'Matte Touch Lipstick',
    description: 'Our paraben free lip products will feels like a whisper of luxury and elegance.',
    image: 'https://example.com/lipstick.jpg'
  },
  {
    name: 'Fashion Nail Polish',
    description: 'The only 21 Toxin Free Nail Polish in Sri Lanka, now in over 50 colours.',
    image: 'https://example.com/nailpolish.jpg'
  },
  {
    name: 'Hair Thickening & Volumizing',
    description: 'The secret weapon to transform your locks from limp to lavish.',
    image: 'https://example.com/hairproduct.jpg'
  }
];

export async function getProducts(req,res){
  try {
    let products = await Product.find();
    if (products.length === 0) {
      // If no products exist, create the default products
      await Product.insertMany(defaultProducts);
      products = await Product.find(); // Retrieve the newly created products
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: "Products not found"
    });
  }
}

export function deleteProduct(req,res){
    if(req.user == null){
        res.status(403).json({
            message : "You need to login first"
        })
        return;
    }

    if(req.user.role != "admin"){
        res.status(403).json({
            message : "You are not authorized to delete a product"
        })
        return;
    }

    //find one = find one and delete
    Product.findOneAndDelete({
        productId : req.params.productId
    }).then(
        ()=>{
            res.json({
                message : "Product deleted successfully"
            })
        }
    ).catch(
        (err)=>{
            res.status(500).json({
                message : "Product not deleted"
            })
        }
    )
}

export function updateProduct(req,res){
    if(req.user == null){
        res.status(403).json({
            message : "You need to login first"
        })
        return;
    }

    if(req.user.role != "admin"){
        res.status(403).json({
            message : "You are not authorized to update a product"
        })
        return;
    }

    Product.findOneAndUpdate({
        productId : req.params.productId
    },req.body).then(
        ()=>{
            res.json({
                message : "Product updated successfully"
            })
        }
    ).catch(
        (err)=>{
            res.status(500).json({
                message : "Product not updated"
            })
        }
    )
}
