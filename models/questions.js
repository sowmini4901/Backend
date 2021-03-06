var Mongoose = require("mongoose");
const Bcrypt = require("bcryptjs");
/*const conn2=Mongoose.connect(process.env.COLLECTION,
    {useNewUrlParser: true,
       useUnifiedTopology:true,
       useCreateIndex:true
   }).then(()=>{
    console.log("DB is CONNECTED")
  })
  */
  var questionSchema = new Mongoose.Schema({
   questionId:{
       type: Number,
       required: true,
       maxlength: 32,
       trim: true
   },
   
   answer: {
       type: String,
       required: true
       
   },
   cheat: {
       type: Array
   }
});
questionSchema.pre("save", function(next) {
    if(!this.isModified("answer")) {
        return next();
    }
    this.answer = Bcrypt.hashSync(this.answer, 10);
    next();
});


questionSchema.methods.compareAnswer = function(plaintext, callback) {
    return callback(null, Bcrypt.compareSync(plaintext, this.answer));
};
module.exports = Mongoose.model("Questions",questionSchema);