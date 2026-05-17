const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redis');

// this middleware will check whether the user is authenticated or not by verifying the JWT token and also check whether the token is blocked or not by checking in redis
const adminMiddleware = async(req,res,next)=>{

  const { token } = req.cookies;

  if(!token){
    return res.status(401).send("Unauthorized Access");
  }

  const payload = jwt.verify(token,process.env.JWT_KEY);

  if(!payload){
    return res.status(401).send("Invalid Token-No Payload");
  }

  const { id } = payload;

  if(!id){
    return res.status(401).send("Invalid Token-No ID");
  }

  if(payload.role !== 'admin'){
    return res.status(401).send("Invalid Token-Not an admin");
  }

  const result = await User.findById(id);

  if(!result){
    return res.status(401).send("Admin Not Found");
  }

  if(result.role !== 'admin'){
    return res.status(401).send("Invalid Token-User is not an admin");
  }

  const isBlocked = await redisClient.exists(`token:${token}`);

  if(isBlocked){
    return res.status(401).send("Invalid Token");
  }

  // if the token is valid and not blocked then we will allow the user to access the admin routes and also we will pass the user details in the request object for further use in the controllers
  req.result = result;

  next();
};

module.exports = adminMiddleware;