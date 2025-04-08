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