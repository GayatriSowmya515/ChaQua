const mongoose = require("mongoose");

var chatSchema = new mongoose.Schema({
	text: String,
	id:{
		type: mongoose.Schema.Types.ObjectId,
		ref:"User"
	},
	username: String,
	//fid : String
});

module.exports = mongoose.model("Chat",chatSchema);