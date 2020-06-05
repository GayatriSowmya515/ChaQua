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
	         
		
});

module.exports = mongoose.model("Message",messageSchema);