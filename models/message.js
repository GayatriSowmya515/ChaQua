const mongoose= require("mongoose");


var messageSchema = new mongoose.Schema({
			id:{
			  type: mongoose.Schema.Types.ObjectId,
			  ref:"User"
	         },
	         username: String,
	         friends:[{
	            type: mongoose.Schema.Types.ObjectId,
				 ref:"Friend"
             }],
	         add_id: String,
	         add_name: String
		
});

module.exports = mongoose.model("Message",messageSchema);