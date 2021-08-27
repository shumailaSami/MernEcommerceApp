var express = require("express");
var router = express.Router();
const { check, validationResult } = require('express-validator');
const { signout, signup,signin, isSignedIn } = require("../controllers/auth");

router.post(
    "/signup",
    [  // validation part 1
    check("name","name should be at least 3 char")
    .isLength({ min: 3 }),
    check("email","email is required")
    .isEmail(),
    check("password","password should be at least 3 char")
    .isLength({min: 3}),
], 
signup
);

router.post(
    "/signin",
    [  // validation part 1    
    check("email","email is required")
    .isEmail(),
    check("password","password field is required")
    .isLength({min: 1}),
], 
signin    // it's controller
);


router.get("/signout", 
signout
);

/*router.get("/testroute", isSignedIn, (req,res) => {
   // res.send("A protected route");
   res.json(req.auth);
}); */

module.exports = router;
