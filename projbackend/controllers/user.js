//import the model here
const User = require("../models/user");
const Order = require("../models/order");

//These below all methods are middleware/controller

// This method is same as router.param() in express documentation
exports.getUserById = (req,res, next,id) =>{   //next is call back,id is 
//coming from the url in the route
    User.findById(id).exec((err, user) => { //Database call back
        if(err || !user){  // No user found
            return res.status(400).json({
                error: "No user found in DB"
            });
        }
        //user found here
        // create object inside req called profile
        //we store value inside profile object
        req.profile = user; // req.profile we got all the informationthat we have needed
        next();
    });
};
// above method work as middleware, getUserById() method works with params bcoz of id

//export another method
exports.getUser = (req, res) => {
    //TODO:get back here for password
    req.profile.salt = undefined;   //it will not show to the user for security purpose
    req.profile.encry_password = undefined;  //it will not show to the user for security purpose
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined; 
    return res.json(req.profile);
};

//Commenting this controller as well as route in route user.js file 
//bcoz don't want to expose my entire database of users to someone
/* exports.getAllUsers = (req, res) => {
    User.find().exec((err,users) => {
        if(err || !users){
            return res.status(400).json({
                error: "No users found"
            });
        }
        res.json(users);
    })
}; */


//update an existing user in database
exports.updateUser = (req,res) => {
    User.findByIdAndUpdate(
        {_id : req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err,user) =>{
            if(err){
                return res.status(400).json({
                    error:"you are not authorized to update this user"
                });
            }
            user.salt = undefined;   //it will not show to the user for security purpose
            user.encry_password = undefined;  //it will not show to the user for security purpose
            user.createdAt = undefined;
            user.updatedAt = undefined; 
            res.json(user);
        }
    );
};

//we are pulling information from order model 
exports.userPurchaseList = (req,res) => {
    Order.find({user: req.profile._id})
    .populate("user", "_id name")
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error: "No Order in this account"
            });
        }
        return res.json(order);
    });
};

//middleware, here we are receiving some information from
//frontend looping through it, creating object from it,storing object by using push()
//into purchases array finally using model User and finding and updating one thing based on
//id, updated purchases and handling error part and error not here so moving from here by next() 
exports.pushOrderInPurchaseList = (req,res,next) => {

    let purchases = [];  //an empty array

    //products is entire list from them product is one of them
    req.body.order.products.forEach(product =>{
        purchases.push({       //push information here
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        });
    });

    //store above information which is in purchases array in DB
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true},
        (err,purchases) => {
            if(err){
                return res.status(400).json({
                    error: "Unable to save purchase list "
                });
            }
            next();  
        }
    );

};