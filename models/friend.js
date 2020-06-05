const mongoose= require("mongoose");

var friendSchema = new mongoose.Schema({
	    chats:[{
			type: mongoose.Schema.Types.ObjectId,
			ref:"Chat"

	    }],
		
		other_id :{
	        type: mongoose.Schema.Types.ObjectId,
	        ref:"User"
	    },
	   other_username: String,
	   mid : String
	
});


module.exports = mongoose.model("Friend",friendSchema);