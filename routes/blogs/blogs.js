var express=require("express");
var router = express.Router();
var Blog = require("../../models/blogs");
var middleware = require("../../middleware");


//ROUTES!!!!!!


 //INDEX ROUTE

router.get("/",function(req,res){
	 Blog.find({},function(err,allBlogs){
	   if(err){
		  console.log("ERROR!!!!!!");
		  console.log(err);
	   }else{
		  console.log("BLOGS!!!!");
		  console.log(allBlogs);
		  res.render("blog/blogs",{blogs:allBlogs, currentUser: req.user});
	   }
    });
});

//CREATE
router.post("/",middleware.isLoggedIn,function(req,res){
	Blog.create(req.body.blogs, function(err, newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			newlyCreated.author.id = req.user._id;
			newlyCreated.author.username = req.user.username;
			newlyCreated.save();
			console.log("added!!");
			console.log(newlyCreated);
			console.log("username :" + req.user.username);
			res.redirect("/blogs");
		}
	});
});

//NEW ROUTE
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("blog/new");
});

//show route
router.get("/:id", function(req,res){
	Blog.findById(req.params.id).populate("comments").exec(function(err,foundBlog){
		if(err){
			console.log(err);
		}
		else{
			console.log("author: ");
			console.log(foundBlog.author);
			console.log(foundBlog);
			
			res.render("blog/show", {blog : foundBlog});
		}
	});
});

//EDIT ROUTE
router.get("/:id/edit",middleware.checkBlogOwnership,function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog){
		res.render("blog/edit",{blog: foundBlog});
	});
});



//update route

router.put("/:id",middleware.checkBlogOwnership,function(req,res){
	//find and update the correct campground
	Blog.findByIdAndUpdate(req.params.id,req.body.blogs,function(err,updatedBlogs){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
	//redirect
});

//DELETE ROUTE

router.delete("/:id",middleware.checkBlogOwnership, function(req,res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log("ERRORR!!!!!");
			res.redirect(err);
		}else{
			res.redirect("/blogs");
		}
	});
});




module.exports = router;