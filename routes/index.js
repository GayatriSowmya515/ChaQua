var express=require("express");
var router = express.Router();
var passport = require("passport");
var Message = require("../models/message");
var User = require("../models/user");
var Other = require("../models/other");
var Index = require("../models/index");
const flash = require("connect-flash");

//root route
router.get("/", function(req,res){
	res.render("index",{currentUser:req.user});//No need to write home.ejs
});

//=============//
//AUTH ROUTES
//=============//

//SHOW register form
router.get("/register", function(req,res){
	res.render("register");
});

//handle signup logic
router.post("/register",function(req,res){
	var newUser = new User({username: req.body.username});
	
	User.register(newUser,req.body.password, function(err,user){
		if(err){
			console.log(err);
			req.flash("error",err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to ChaQua "+ user.username);
			res.redirect("/");
		});
		
			var message = new Message({id:user._id,username: req.body.username});
			Message.create(message,function(err,message){
		       if(err){
			       console.log(err);
		        }
		        else{
			        
					console.log("1.account created!!!!");
					console.log("2.Name : "+ req.body.username);
					console.log("3._id : " + user._id);
		        }
	        });
		

	});
	
	
	
});

//show logIn form
router.get("/login", function(req,res){
	res.render("login");
});
//handling login logic//middleware
router.post("/login",passport.authenticate("local",{
	successRedirect: "/",
	failureRedirect: "/login"
}), function(req,res){
});

//logout route
router.get("/logout",function(req,res){
	req.logout();
    req.flash("success","Logged you out!");
	res.redirect("/");
});


module.exports=router;