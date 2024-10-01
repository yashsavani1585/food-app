import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) =>{
    const {token} = req.headers;
    if(!token){
        return res.status(401).json({success: false, message:"No Authorized Login Again"});
    }
    try {
        const token_decode = jwt.verify(token,process.env.jwt_secret);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, message:"ERROR"});
    }

}

export default authMiddleware;