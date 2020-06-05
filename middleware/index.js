var Blog = require("../models/blogs");
var Comment = require("../models/comment");
var QA = require("../models/QA");
var Answer = require("../models/answer");
const flash = require("connect-flash");
//all the middle goes here
var middlewareObj = {};

middlewareObj.checkBlogOwnership=function(req,res,next){
	//is user logged findById?
	  if(req.isAuthenticated()){  
		  Blog.findById(req.params.id, function(err, foundBlog){
		    if(err){
			  console.log(err);
			  req.flash("error","Not found");
			  res.redirect("back");
		     }
		   else{
			   //does user own the campgrounds?
			   if(foundBlog.author.id.equals(req.user._id)){
				   next();
			   } else{
				   req.flash("error","You don't have permission to do that");
				   res.redirect("back");
			   }
		     }
	       });
		}
	  else{
		  req.flash("error","Please Login First!");
		  res.redirect("back");
	  }
	
}

middlewareObj.checkQAOwnership=function(req,res,next){
	//is user logged findById?
	  if(req.isAuthenticated()){  
		  QA.findById(req.params.id, function(err, foundQA){
		    if(err){
			  console.log(err);
			  req.flash("error","Not found");
			  res.redirect("back");
		     }
		   else{
			   //does user own the campgrounds?
			   if(foundQA.author.id.equals(req.user._id)){
				   next();
			   } else{
				   req.flash("error","You don't have permission to do that");
				   res.redirect("back");
			   }
		     }
	       });
		}
	  else{
		  req.flash("error","Please Login First!");
		  res.redirect("back");
	  }
	
}
middlewareObj.checkAnsOwnership=function(req,res,next){
	//is user logged findById?
	  if(req.isAuthenticated()){  
		  Answer.findById(req.params.answer_id, function(err, foundAns){
		    if(err){
			  console.log(err);
			  req.flash("error","Not found");
			  res.redirect("back");
		     }
		   else{
			   //does user own the campgrounds?
			   if(foundAns.author.id.equals(req.user._id)){
				   next();
			   } else{
				   req.flash("error","You don't have permission to do that");
				   res.redirect("back");
			   }
		     }
	       });
		}
	  else{
		  req.flash("error","Please Login First!");
		  res.redirect("back");
	  }
	
}


middlewareObj.checkCommentOwnership=function(req,res,next){
	//is user logged findById?
	  if(req.isAuthenticated()){  
		  Comment.findById(req.params.comment_id, function(err, foundComment){
		    if(err){
			  console.log(err);
			  res.redirect("back")
		     }
		   else{
			   //does user own the comment?
			   if(foundComment.author.id.equals(req.user._id)){
				   next();
			   } else{
				   req.flash("error","You don't have permission to do that");
				   res.redirect("back")
			   }
		     }
	       });
		}
	  else{
		  req.flash("error","You don't have permission to do that");
		  res.redirect("back");
	  }
	
}

middlewareObj.isLoggedIn=function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login First!");
	res.redirect("/login");
}

module.exports = middlewareObj;