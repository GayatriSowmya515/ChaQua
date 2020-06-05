const express = require("express");
const app = express();
const request = require("request");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");

//var http = require("http").Server(app);


//MONGOOSE MODELS
const Index = require("./models/index");
 const Blog = require("./models/blogs");
const Comment = require("./models/comment");
const User = require("./models/user");
const QA = require("./models/QA");
const Answer = require("./models/answer");
const Message = require("./models/message");
const Friend = require("./models/friend");
const Other = require("./models/other");
const Chat = require("./models/chat");

 
 //requiring routes
const indexRoutes = require("./routes/index");
 const blogRoutes = require("./routes/blogs/blogs");
const qaRoutes = require("./routes/QA/QA");
const BcommentRoutes = require("./routes/blogs/comments");
const answerRoutes = require("./routes/QA/answers");
const AcommentRoutes = require("./routes/QA/comments");
const messageRoutes = require("./routes/messages/message");

mongoose.connect("mongodb://localhost:27017/chaqua", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//passport configuration
app.use(require("express-session")({
	secret: "i'm bored :( ",
	resave : false,
	saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});



//////////////////////////////////

app.use("/",indexRoutes);
app.use("/blogs",blogRoutes);
app.use("/blogs/:id",BcommentRoutes);
app.use("/QA",qaRoutes);
app.use("/QA/:id",answerRoutes);
app.use("/QA/:id/answers/:answer_id",AcommentRoutes);
app.use("/messages",messageRoutes);


//var Blog = mongoose.model("Blog",blogSchema);
/*
Blog.create({
	title: "How to become LingLing",
	description: "Practice each and every instrument 40 hours a day and don't forget  to study. Hence practice and study each and every subject 40 hours a day. Work hard every day to be perfect at everything. REMEMBER IF YOU CAN PRACTICE SLOWLY YOU CAN PRACTICE FASTLY."
},function(err,blog){
	if(err){
		console.log("ERROR!!!!");
		console.log(err);
	}
	else{
		console.log(blog);
	}
});*/


//////////////////////////////////


app.listen(3000, function(){
	console.log("Server lisiting on port 3000");
});