var mongoose = require("mongoose");

var indexSchema = new mongoose.Schema({
	
	messages:[{
		type: mongoose.Schema.Types.ObjectId,
	    ref: "Message"
	}],
	
		others:[{
				 type: mongoose.Schema.Types.ObjectId,
				 ref: "Other"
			 }]

});


module.exports = mongoose.model("Index", indexSchema);