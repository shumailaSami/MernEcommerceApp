const express = require("express");

const app = express();

const port = 8000;

app.get("/", (req, res) => {
    return res.send("Home Page");
  });

  const admin = (req, res) => {
    return res.send("This is admin dashboard");
  };

  const isAdmin = (req, res, next) => {
    console.log("isAdmin is running");
    next();
  };
  
  const isLoggedIn = (req, res, next)=>{
const login = true;

if(login){
    next();
}else{
    console.log("Unable to login");
}
  };

app.get("/admin",isLoggedIn,isAdmin,admin );// rout admin here, middleware(checking something),response



app.get("/login", (req, res) => {
    return res.send("you are visiting login route");
  });

//,,,,,,,,,,,,,,,,,,,,,,

app.get("/signup", (req, res) => {
  return res.send("You are visiting signup route");
});

app.listen(port, () => {
  console.log("Server is up and running...");
});

// cost port = 3000   its const

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))
