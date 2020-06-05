var express=require("express");
var router = express.Router();
var QA = require("../../models/QA");
var middleware = require("../../middleware");

//INDEX

router.get("/",function(req,res){
	 QA.find({},function(err,allQues){
	   if(err){
		  console.log("ERROR!!!!!!");
		  console.log(err);
	   }else{
		  console.log("QAs!!!!");
		  console.log(allQues);
		  res.render("QA/QAs",{Ques:allQues, currentUser: req.user});
	   }
    });
});


//CREATE
router.post("/",middleware.isLoggedIn,function(req,res){
	//var text = req.body.text;
	QA.create(req.body.qas, function(err, newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			newlyCreated.author.id = req.user._id;
			newlyCreated.author.username = req.user.username;
			newlyCreated.text = req.body.text;
			newlyCreated.save();
			console.log("added!!");
			console.log(newlyCreated);
			console.log("username :" + req.user.username);
			console.log("question :" + req.body.text);
			
			res.redirect("/QA");
		}
	});
});

//NEW ROUTE
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("QA/Qnew");
});

//show route
router.get("/:id", function(req,res){
	QA.findById(req.params.id).populate("answers").exec(function(err,foundQues){
		if(err){
			console.log(err);
		}
		else{
			console.log("author: ");
			console.log(foundQues);
			res.render("QA/show", {Ques : foundQues});
		}
	});
});



//EDIT ROUTE
router.get("/:id/edit",middleware.checkQAOwnership,function(req,res){
	QA.findById(req.params.id, function(err,foundQues){
		res.render("QA/Qedit",{Ques: foundQues});
	});
});

//update route

router.put("/:id",middleware.checkQAOwnership,function(req,res){
	//find and update the correct campground
	QA.findByIdAndUpdate(req.params.id,req.body.qas,function(err,updatedQues){
		if(err){
			res.redirect("/QA");
		}
		else{
			res.redirect("/QA/" + req.params.id);
		}
	});
	//redirect
});

//DELETE ROUTE

router.delete("/:id",middleware.checkQAOwnership, function(req,res){
	QA.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log("ERRORR!!!!!");
			res.redirect(err);
		}else{
			res.redirect("/QA");
		}
	});
});

module.exports = router;