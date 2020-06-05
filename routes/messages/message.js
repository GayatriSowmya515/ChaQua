var express=require("express");
var router = express.Router({mergeParams: true});
var Message = require("../../models/message");
var Friend = require("../../models/friend");
var Chat = require("../../models/chat");
var Other = require("../../models/other");
var Index = require("../../models/index");

var middleware = require("../../middleware");

var http = require("http").Server(router);
var io = require("socket.io")(http);

io.on("connection", () =>{
 console.log("a user is connected");
});


//index route

router.get("/",middleware.isLoggedIn,function(req,res){
	console.log("//index route//4.userID : " + req.user.username);
	
	Message.find({username : req.user.username},function(err,message){
		if(err){
			console.log("Error at index route");
		   console.log(err);
		}
		else if(message.length == 0){
			console.log("Not Found");
		}
		else{
			console.log("messageID : " + message[0]._id);
			console.log("//index route//");
		   res.redirect("/messages/"+message[0]._id);
	    }
    });
});

router.get("/:id",middleware.isLoggedIn,function(req,res){
	Message.findById(req.params.id).populate("friends").exec(function(err,message){
		if(err){
			console.log("Errorr!!!");
			console.log(err);
		}
		else{
			console.log("list :  " + message);
			res.render("messages/message",{message:message,Id:req.user._id,name:req.user.username});	
		}
	});
});

router.get("/:id/add-friend",function(req,res){
	Message.find({},function(err,messages){
		if(err){
			console.log(err);
		}
		else{
			res.render("messages/findfriend",{messages:messages, Id:req.params.id, name:req.user.username});
		}
	});
	
});



//add friend

router.post("/:id/add-friend/:friend_id/:name",middleware.isLoggedIn,function(req,res){
	Message.findById(req.params.id, function(err, message){
		if(err){
			console.log(err);
		}
		else{
			var friend = {};
			var	other = {};
             console.log("add friend route message : ");
			Friend.create(friend.prototype,function(err,friend){
				if(err){
					console.log(err);
				}
				else{
					
					friend.other_id = req.params.friend_id;
					friend.other_username = req.params.name;
					friend.mid = "" + message._id + "" + req.params.friend_id;
					friend.save();
					console.log(message);
					message.friends.push(friend);
					message.save();
					console.log(req.params.name);
					console.log("Added!!!! :"+friend);
					console.log("Updated List" +  message);
					res.redirect("/messages/"+req.params.id);
				}
			});
		}
	});
});

/*router.get("/:id/add-friend/:friend_id",middleware.isloggedIn,function(req,res){
	Message.findById(req.params.id, function(err, message){
		if(err){
			console.log(err);
		}
		else{
			Friend.findById(req.params.friend_id, function(err,friend){
				if(err){
					console.log(err);
				}
				else{
					res.render("messages/detail" ,{friend:friend});
				}
			});
		}
	});
});
*/


// //
router.get("/:id/chat/:friendid",middleware.isLoggedIn,function(req,res){
	Message.findById(req.params.id).populate("friends").exec(function(err,message){
		if(err){
			console.log("Error!!!!");
			console.log(err);
		}
		else{
			
			
			Friend.findById(req.params.friendid).populate("chats").exec(function(err,friend){
				if(err){
					console.log("ERROR!!!");
					console.log(err);
				}
				else{
					
			res.render("messages/message",{message:message,friend:friend,Id:req.user.username,name: req.user.username});
				}
			});
		
			
		}
	});
});



router.post("/:id/chat/:friendid",function(req,res){
	Message.findById(req.params.id,function(err,message){
		if(err){
			console.log("ERROR!!!!");
			console.log(err);
		}
		else{
			Friend.findById(req.params.friendid,function(err,friend){
				if(err){
					console.log("ERROR!!!!");
					console.log(err);
				}
				else{
					var friend_name = friend.other_username;
					var friend_id = friend.other_id;
					Chat.create(req.body.chat,function(err,chat){
				        if(err){
						 	req.flash("error","Somethimg Went Wrong!!");
							console.log(err);
						}
						else{
							
							chat.id = req.user._id;
							chat.username = req.user.username;
							//chat.fid = req.params.friendid;
							io.emit('chat', req.body.chat);
							chat.save();
							console.log("New comment's username will be: " +req.user.username);
							friend.chats.push(chat);
							friend.save();
							message.save();
							console.log(message);
							Message.find({username:friend_name},function(err,message2){
								if(err){
									console.log("Error!!");
									console.log(err);
								}
								else{
									var message1 = message2[0];
									console.log(message1);
									Friend.find({mid:""+message1._id +""+ req.user._id},function(err,friend2){
										if(err){
											console.log("Error");
											console.log(err);
										}
										else{
											var friend1 = friend2[0];
											console.log(friend1);
											Chat.create(req.body.chat, function(err,chat1){
												if(err){
													console.log("Error");
											        console.log(err);
												}
												else{
													chat1.id = req.user.id;
							                        chat1.username = req.user.username;
													//chat1.fid = friend1._id;
							
							 						io.emit('chat', req.body);
													chat1.save();
													console.log("New comment's username will be: " +friend_name);
													friend1.chats.push(chat1);
													friend1.save();
													message1.save();
													console.log(message1);
												}
											})
										}
									})
								}
							});
							req.flash("success","Successfully added message");
							res.redirect("/messages/"+req.params.id+"/chat/"+req.params.friendid);
						}
					});
				}
			});
			
		}
	});
});



module.exports = router;