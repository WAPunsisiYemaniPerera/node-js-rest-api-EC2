//import { use } from "react";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function getAllUsers(req,res){
    User.find().then((users)=>{
        res.json(users)
    }).catch(()=>{
        res.status(500).json({
            message : "Users not found"
        })
    })
}

export function saveUser(req,res){
    //check if the user is an admin
    if(req.body.role == "admin"){
        if(req.user == null){
            res.status(403).json({
                message : "Please login as admin before creating an admin account"
            })
            return;
        }
        if(req.user.role != "admin"){
            res.status(403).json({
                message : "You are not authorized to create an admin account"
            })
            return;
        }
    }


    //create hash the password for the password that comes 
    // in the http request body
    //10 for hash the password 10 times to get more secure
    //you can change that number
    const hashedPassword = bcrypt.hashSync(req.body.password,10);
    const user = new User({
        email : req.body.email,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        password : hashedPassword,
        role : req.body.role
    })

    user.save().then(()=>{
        res.json({
            message : "User saved successfully"
        })
    }).catch(()=>{
        res.status(500).json({
            message : "User not saved"
        })
    })
}

//user login
export function loginUser(req,res){
    const email = req.body.email;
    const password = req.body.password;

    //findone == find one person
    User.findOne({
        //the finded email should save to the email 
        // that in http request body
        email : email
    }).then((user)=>{
        //check if the user is null or 
        // there is no such user in the db
        if(user == null){
            res.status(404).json({
                message : "Invalid Email"
            })
        }else{
            //compare the passwords that we have got and the
            //db saved password
            const isPasswordCorrect = bcrypt.compareSync(password, user.password)
            if(isPasswordCorrect){
                //res.json({
                    //message : "Login Successful"
                //})
                
                //gather user data as a new object 
                const userData = {
                    email : user.email,
                    firstName : user.firstName,
                    lastName : user.lastName,
                    role : user.role,
                    phone : user.phone,
                    isDisabled : user.isDisabled,
                    isEmailVerified : user.isEmailVerified
                }

                //create a token for the above userData
                //random456 = key
                const token = jwt.sign(userData,"random456");

                res.json({
                    message : "Login successful",
                    token : token
                })

            }else{
                res.status(403).json({
                    message : "Invalid Password"
                })
            }
        }
    })
}

export async function addAddress(req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.addresses.push(req.body.address);
        await user.save();

        res.status(200).json({ message: 'Address added successfully', addresses: user.addresses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add address', error: error.message });
    }
}

export async function updateAddress(req, res) {
     try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

         // Assuming you pass the index of the address to update in the request body
        const addressIndex = req.body.index;

        if (addressIndex === undefined || addressIndex < 0 || addressIndex >= user.addresses.length) {
            return res.status(400).json({ message: 'Invalid address index' });
        }

        user.addresses[addressIndex] = req.body.newAddress;
        await user.save();

        res.status(200).json({ message: 'Address updated successfully', addresses: user.addresses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update address', error: error.message });
    }
}

export async function deleteAddress(req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Assuming you pass the index of the address to delete in the request body
        const addressIndex = req.body.index;

        if (addressIndex === undefined || addressIndex < 0 || addressIndex >= user.addresses.length) {
            return res.status(400).json({ message: 'Invalid address index' });
        }

        user.addresses.splice(addressIndex, 1);
        await user.save();

        res.status(200).json({ message: 'Address deleted successfully', addresses: user.addresses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete address', error: error.message });
    }
}

export function blockUser(req, res) {
    if (req.user == null || req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not authorized to block users" });
    }

    const userId = req.params.id;

    User.findByIdAndUpdate(userId, { isDisabled: true }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json({ message: "User blocked successfully" });
        })
        .catch(err => {
            res.status(500).json({ message: "Failed to block user", error: err });
        });
}
