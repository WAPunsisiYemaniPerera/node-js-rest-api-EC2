import Order from "../models/order.js";

export async function createOrder(req,res){

    if (req.user == null) {
        res.status(401).json({
            message : "Unauthorized"
        })
        return;
    }

    const body = req.body;

    //the user do not need to send the email, because it is 
    // already in the token
    const orderData = {
        orderId: "",
        email: req.user.email,
        name: body.name,
        address: body.address, // Default address, will be updated below
        phoneNumber: body.phoneNumber,
        billItems: [],
        total: 0
    };

    // If addressIndex is provided, use the address from the user's saved addresses
    if (body.addressIndex !== undefined && body.addressIndex >= 0) {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (body.addressIndex < user.addresses.length) {
            orderData.address = user.addresses[body.addressIndex];
        } else {
            return res.status(400).json({ message: 'Invalid address index' });
        }
    }

    // Calculate total price
    let totalPrice = 0;
    if (body.billItems && Array.isArray(body.billItems)) {
        body.billItems.forEach(item => {
            totalPrice += item.price * item.quantity;
        });
    }
    orderData.total = totalPrice;

    //generate the order id for the order
    Order.find()
    .sort({
        date: -1 //last date first
    }).limit(1).then((lastBills)=>{
        //if there are no orders
        if(lastBills.length == 0){
            orderData.orderId = "ORD0001";
        }else{ //if there are orders
            const lastBill = lastBills[0];

            //get the last order id as a string
            const lastOrderId = lastBill.orderId; //"ORD0061"
            //remove the "ORD" from the order id
            const lastOrderNumber = lastOrderId.replace("ORD",""); //"0061"
            //convert it to a number
            const lastOrderNumberInt = parseInt(lastOrderNumber); //61
            //add 1 to the last order number
            const newOrderNumberInt = lastOrderNumberInt + 1; //62
            //add 0s to the new order number to make it 4 digits
            const newOrderNumberStr = newOrderNumberInt.toString().padStart(4,'0'); //"0062"
            //add "ORD" to the new order number
            orderData.orderId = "ORD" + newOrderNumberStr; //"ORD0062"
        }

        //loop for each item in the cart to check the data
        //for(let i = 0; i<body.billItems.length; i++){
            //access the items one by one
            //const billItem = body.billItems[i];

            //check those bill details
        //}

        const order = new Order(orderData);

        order.save().then(
            () => {
                res.json({
                    message : "Order saved successfully"
                })
            }
        ).catch(
            (err) => {
                res.status(500).json({
                    message : "Order not saved"
                })
            }
        )
        })
    
}

//function to get all the orders
export function getOrders(req,res){
    //check if the user is null
    if(req.user == null){
        res.status(401).json({
            message : "Unauthorized"
        })
        return;
    }

    //if role==admin
    if(req.user.role == "admin"){
        Order.find().then(
            (orders) => {
                res.json(orders)
            }
        ).catch(
            (err) => {
                res.status(500).json({
                    message : "Orders not found"
                })
            }
        )

    }else{
        Order.find({
            //adding a filter
            email : req.user.email //get the order data of the requested user
        }).then(
            (orders) => {
                res.json(orders)
            }
        ).catch(
            (err) => {
                res.status(500).json({
                    message : "Orders not found"
                })
            }
        )
    }
}

export async function updateOrderStatus(req, res) {
    if (req.user == null || req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not authorized to update order status" });
    }

    const orderId = req.params.id;
    const newStatus = req.body.status;

    try {
        const order = await Order.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json({ message: "Order status updated successfully", order: order });
    } catch (err) {
        res.status(500).json({ message: "Failed to update order status", error: err });
    }
}
