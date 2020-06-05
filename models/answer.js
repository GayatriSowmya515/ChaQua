var mongoose = require("mongoose");
 
var answerSchema = new mongoose.Schema({
    text: String,
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
 
module.exports = mongoose.model("Answer", answerSchema);