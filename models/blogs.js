const mongoose = require("mongoose");

//MODELS

var blogSchema = new mongoose.Schema({
	title : String,
	description : String,
	author : {
		id:{
			type: mongoose.Schema.Types.ObjectId,
		    ref: "User"
		},
		username : String
	},
	comments:[{
		type:mongoose.Schema.Types.ObjectId,
		    ref: "Comment"
	}]
});

module.exports = mongoose.model("Blog",blogSchema);