var Mongoose = require("mongoose");
const Bcrypt = require("bcryptjs");
  var userSchema = new Mongoose.Schema({
   teamID:{
       type: Number,
       required: true
   },
   
   password: {
        type: String,
        required: true
   },
   attempted:{
     type: Number,
     default:0
   },
   Score: {
    type: Number,
    default: 0
  },
  loggedIn: {
    type: Boolean,
    default: false
  },
  cheat:{
    type:Number,
    default:0
  }
  },
  {timestamps:true}
  );

  userSchema.pre("save", function(next) {
    if(!this.isModified("password")) {
        return next();
    }
    this.password = Bcrypt.hashSync(this.password, 10);
    next();
});


userSchema.methods.comparePassword = function(plaintext, callback) {
    return callback(null, Bcrypt.compareSync(plaintext, this.password));
};
  module.exports = Mongoose.model("User",userSchema)