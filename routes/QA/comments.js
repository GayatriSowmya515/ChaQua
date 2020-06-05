var express = require("express");
var router = express.Router({mergeParams: true});
var QA = require("../../models/QA");
var Answer = require("../../models/answer");
var Comment = require("../../models/comment");
var middleware = require("../../middleware");

//=======================================//
//========COMMENT ROUTE==================//
//=======================================//
//comments new
router.get("/",middleware.isLoggedIn,function(req,res){
	QA.findById(req.params.id,function(err,Ques){
		if(err){
			console.log(err);
		}
		else{
			Answer.findById(req.params.answer_id,function(err,answer){
		       if(err){
			      console.log(err);
		       }
		       else{
			      res.render("QA/showComment",{Ques:Ques,answer:answer});
		       }
	        });
		}
	});
	
	

});

//comments create
router.post("/",middleware.isLoggedIn,function(req,res){
	QA.findById(req.params.id,function(err,qa){
		if(err){
			console.log(err);
			res.redirect("/QA/"+ req.params.id);
		}
		else{
			Answer.findById(req.params.answer_id,function(err,answer){
		        if(err){
			         console.log(err);
			         res.redirect("/QA/"+req.params.id+"/answers/"+req.params.answers_id);
		        }
		        else{
			        //var text = req.body.text;
			        //var author = {
			        //	id: req.user._id,
			        //	username: req.user._id
			        //}
			        //var newComment = { text : text,author:author};
			        Comment.create(req.body.comment,function(err,comment){
				    if(err){
					    req.flash("error","Something went wrong");
					    console.log(err);
				    }
				    else{
					    //add username and id to comment
					    comment.author.id = req.user._id;
					    comment.author.username = req.user.username;
					    comment.save();
					    console.log("New comment's username will be: " +req.user.username);
					    console.log(comment);
					    answer.comments.push(comment._id);
					    answer.save();
					    req.flash("success","Successfully added comment");
					    res.redirect("/QA/" + qa._id + "/answers/"+answer._id);
				    } 
			    });
		    }
	    });
		}
	});
	
});
//edit comments
router.get("/comments/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id,function(err, foundComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.render("comments/Aedit",{QA_id:req.params.id,answer_id: req.params.id,comment: foundComment});
		}
	});
	
});
//update comments

router.put("/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/QA/" + req.params.id+"/answers/"+req.params.answers_id);
		}
	})
});

//COMMENT DESTROY ROUTE
router.delete("/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	//findByIdAndRemove
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","Comment deleted");
			res.redirect("/QA/"+req.params.id+"/answers/"+req.params.answers_id);
		}
	})
});



module.exports = router;