const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');


exports.signup = (req, res) => {
  const errors = validationResult(req); //validation part 2

  if (!errors.isEmpty()) {   //if error is not empty
    return res.status(422).json({
      "error" : [errors.array()[0].param,
      errors.array()[0].msg]
    });
  }

  //saving user into database, object user of class User 
  // which further being created from class mongoose we can 
  //all database methods which MongoDb provide us

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB"
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id
    });
  });
};


exports.signin =(req,res)=>{
  const errors = validationResult(req);
  const {email, password} = req.body;  //extracting email and password from req.body , it's destructuring

  if (!errors.isEmpty()) {   //if error is not empty
    return res.status(422).json({
      "error" : [errors.array()[0].param,
      errors.array()[0].msg]
    });
  }

  User.findOne({email}, (err,user) => {
    if(err || !user){
      return res.status(400).json({
        error: "User email does not exists"
      })
    }

    if(!user.autheticate(password)){
      return res.status(401).json({
        error: "Email and password do not match"
      })      
    }

    //create token
    const token = jwt.sign({_id: user._id}, process.env.SECRET)

    //put token in user cookie
    res.cookie("token", token, {expire: new Date() + 9999});

    //send response to front end
    const{_id, name, email, role} = user;
    return res.json({token, user:{_id,name,email,role}});
  });
};

exports.signout = (req, res) => {
// clear the cookie
res.clearCookie("token"); // cookieparser allowing this method
res.json({
    message: "User signout successfully"
  });
};


//protected routes
exports.isSignedIn = expressJwt({   // it automatically check 
  //token generated is of loggedin user or not
  secret: process.env.SECRET,
  //set some properties in user browser
  userProperty: "auth" 
});


//custom middlewares
exports.isAuthenticated = (req,res,next) => { //next is middleware
  //creating variable checker, req.profile setup from frontend,
  //req.auth setup from above middleware, then checking profile id is
  //set from frontend is eqall to the auth id which is setbyabove 
  //middle ware by this authentication user can change things 
  //in his own account, ITS CHECKING FOR AUTHENTICATED
  let checker = req.profile && req.auth && 
  req.profile._id == req.auth._id;
  if(!checker){  // if checker is false
return res.status(403).json({
    error: "ACCESS DENIED"
})
}
  next();
};

exports.isAdmin = (req,res,next) => { //next is middleware
  //profile is going to set from frontend
  if(req.profile.role === 0){ // for 0 is regular user not admin
      return res.status(403).json({
        error: " You are not Admin.Access is denied"
      })
  }  
  next();
}

