const Category = require("../models/category");


exports.getCategoryById = (req,res,next,id) => {

    Category.findById(id).exec((err,cate) => {
            if(err){
                return res.status(400).json({
                    error: "Category not found in DB"
                })
            }
            req.category = cate;
            next();
        });
    };

    exports.createCategory = (req,res) => {
        const category = new Category(req.body); //creating new object of Category class
        category.save((err,category)=> {
            if(err){
                return res.status(400).json({
                    error: "Not able to save category in DB"
                });
            }
            res.json({category});
        });
    };

exports.getCategory = (req, res) => {
    return res.json(req.category);  //here using above middleware getCategoryById
};

exports.getAllCategory = (req, res) => {
    Category.find().exec((err,categories) =>{
        if(err){
            return res.status(400).json({
                error: "No categories found"
            });
        }
        res.json(categories);  //json throw all the items that we located in the database
    });
};

exports.updateCategory = (req,res) => {
        const category = req.category;  
        //req.category grabing from above middleware i.e getCategoryById
        category.name = req.body.name;  //this line is responsible  for grabing 
        //the category namewhich is been sent from frontend or postman

        category.save((err, updatedCategory) => {
            if(err){
                return res.status(400).json({
                    error: "Failed to update category"
                });
            } 
            res.json(updatedCategory);          

        });
};


exports.removeCategory = (req, res) => {
    const category = req.category;


    category.remove((err,category) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete this category"
            });
        }
        //successfully getting json message 
        res.json({
            message: "Successfully deleted"
        });
       
    });   //remove() method got from mongoose
};
   