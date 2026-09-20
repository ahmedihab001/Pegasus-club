const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema({
  name:String,
  sport:String,
  image:String,
  slots:[
    {
      time:String,
      available:Boolean
    }
  ]
});

module.exports = mongoose.model("Coach",coachSchema);
