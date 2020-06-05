const mongoose= require("mongoose");


var otherSchema = new mongoose.Schema({
	id:{
	   type: mongoose.Schema.Types.ObjectId,
	   ref:"User"
	},
	username: String
});

module.exports = mongoose.model("Other",otherSchema);