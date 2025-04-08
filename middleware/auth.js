import jwt from "jsonwebtoken";
export default function verifyJWT(req,res,next){

    const header =req.header("Authorization");
    
    //check whether there is a header
    if(header != null){
        //can replace in the header with what i want
        const token = header.replace("Bearer ","");

        //console.log(token);
        jwt.verify(token,"random456",(err, decoded)=>{
            console.log(decoded);

            if(decoded != null){
                //put the decoded details to the user which is
                //the user build in req
                req.user = decoded
            }
        })
    }
    //inbuilt function that pass the request to the other
    next()
}