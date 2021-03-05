const User = require("../models/user");
const Questions = require("../models/questions");
const db = require("../index");
const Mongoose = require("mongoose");

//for storing questions
exports.store=async(req, res)=>{
  const question = new Questions(req.body)
    await question.save((err, question) => {
        if(err){
            return res.status(400).json({
                err: "NOT able to save question in DB"
            })
        }
        res.json({
            questionId: question.questionId,
            answer: question.answer
        });
        
    })
}

//for getting leaderboard
exports.leaderboard = async (req, res)=>{
    var user=Mongoose.model('User');
      await user
      .find({}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      })
      .limit().sort({ Score: -1, updatedAt:1 });

};


