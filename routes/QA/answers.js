var express=require("express");
var router = express.Router({mergeParams: true});
var QA = require("../../models/QA");
var Answer = require("../../models/answer"); 
var middleware = require("../../middleware");



//CREATE answers
router.post("/",middleware.isLoggedIn,function(req,res){
	//var text = req.body.text;
	QA.findById(req.params.id, function(err, qa){
		if(err){
			console.log(err);
		}
		else{
			Answer.create(req.body.answers,function(err,ans){
				if(err){
					req.flash("error","Something went wrong");
					console.log(err);
				}
				else{
					//add username and id to comment
					ans.author.id = req.user._id;
					ans.author.username = req.user.username;
					ans.save();
					console.log("New answer's username will be: " +ans.author.username);
					console.log("text: "+ req.body.answers.text);
					qa.answers.push(ans);
				    qa.save();
					console.log(qa.answers);
					req.flash("success","Successfully added");
					res.redirect("/QA/" + qa._id);
				}
			});
		}
	});
});
//NEW answers ROUTE
router.get("/Anew",middleware.isLoggedIn,function(req,res){
	QA.findById(req.params.id, function(err,foundQues){
		res.render("QA/Anew",{Ques: foundQues});
	});
	
});

//show route
router.get("/answers/:answer_id",function(req,res){
	QA.findById(req.params.id,function(err,foundQues){
		if(err){
			console.log(err);
		}
		else{
			               Answer.findById(req.params.answer_id).populate("comments").exec(function(err,foundAnswer){
		if(err){
	        console.log(err);
		}
       else{
		   console.log(foundAnswer);
	       res.render("QA/showComment",{Ques:foundQues,answer:foundAnswer});
	   }
	});
		}
	});
	
		
});


//EDIT ROUTE
router.get("/answers/:answer_id/edit",middleware.checkAnsOwnership,function(req,res){
	Answer.findById(req.params.answer_id, function(err,foundAnswer){
		if(err){
			console.log(err);
			res.redirect("/QA/"+ req.params.id);
		}
		else{
			res.render("QA/Aedit",{QA_id: req.params.id ,answer: foundAnswer});
		}
		
	});
});



//update route

router.put("/answers/:answer_id",middleware.checkAnsOwnership,function(req,res){
	//find and update the correct campground
	Answer.findByIdAndUpdate(req.params.answer_id,req.body.answers,function(err,updatedAnswer){
		if(err){
			res.redirect("/QA");
		}
		else{
			res.redirect("/QA/" + req.params.id);
		}
	});
	//redirect
});

// DESTROY ROUTE
router.delete("/answers/:answer_id",middleware.checkAnsOwnership,function(req,res){
	//findByIdAndRemove
	Answer.findByIdAndRemove(req.params.answer_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","Answer deleted");
			res.redirect("/QA/"+req.params.id);
		}
	})
});




module.exports = router;