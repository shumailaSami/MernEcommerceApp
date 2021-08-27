const express = require("express")
const router = express.Router();  //object of express router is created

const {getCategoryById, 
    createCategory,
    getCategory,
    getAllCategory,
    updateCategory,
    removeCategory
} = require("../controllers/category");
const {isSignedIn,isAdmin,isAuthenticated} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");

//params 
router.param("userId",getUserById);
router.param("categoryId", getCategoryById);

//actual routes goes here

//create route
router.post(
"/category/create/:userId",
isSignedIn,                 //middleware
isAuthenticated,            //middleware
isAdmin,                    //middleware
createCategory              //method
); 


//read route
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);

//update route
router.put(
    "/category/:categoryId/:userId",
    isSignedIn,                 //middleware
    isAuthenticated,            //middleware
    isAdmin,                    //middleware
    updateCategory              //method
    ); 
    

//delete route
router.delete(
    "/category/:categoryId/:userId",
    isSignedIn,                 //middleware
    isAuthenticated,            //middleware
    isAdmin,                    //middleware
    removeCategory              //method
    ); 




module.exports = router; //exporting all the route in the router