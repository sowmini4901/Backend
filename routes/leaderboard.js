var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var expressJwt=require('express-jwt');
var sleep = require('system-sleep');
//var popup=require('popups');
/*const popup=require('node-popup');
const alert = popup.alert;
*/
const app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser('null_chapter_is_the_best'));
const User = require("../models/user");
const Questions = require("../models/questions");
const {leaderboard,store} = require("../controllers/leaderboard");
const path = require('path');
//for storing questions
router.post("/store",store);


//for json leaderboard
router.get("/leaderboard", leaderboard);

// for displaying leaderboard
router.get("/display", async (req, res)=>{
  return res.sendFile(path.join(__dirname , '../Questions/html/leaderboard.html'));
});

//token creation method
const maxAge = 3*24*60*60;
const createToken = (id, answered) => {
    return jwt.sign({ id,answered }, process.env.SECRET1, {
      expiresIn: maxAge
    });
  };



//for validating answer
/*
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}  */

router.post("/validate/:id", async(req, res)=>{
  var id =req.params.id;
    try {
        var team = await User.findOne({ teamID: req.cookies['teamID']}).exec();
        
        //checking if team exists
        
        if(team){
           
            var question = await Questions.findOne({ questionId: req.params.id }).exec();
      if(!question) {
          return res.status(400).sendFile(path.join(__dirname,'../errors/questionnot.html'));
      }
     // console.log(JSON.parse(req.query.answer));
     var ans = (req.body.answer).toLowerCase();
     question.compareAnswer((ans).replace(/\s+/g,'').trim(), async (err, match) => {
          try{
          if(!match) {
               
             res.sendFile(path.join(__dirname ,'../errors/wrong.html'));
            // await sleep(3000);
            //await new Promise(resolve => setTimeout(resolve, 5000));
           // sleep(3*1000);
              //res.redirect('/question/'+id);
             /*return res.send(popup.alert({
                 content:'Wrong Answer :( Hunter. Try Again'
             }));
             */
              }
            }catch (err) {
          res.status(501).sendFile(path.join(__dirname , '../errors/server.html'));
      }
     
      if(match && question){
      User.findOne({teamID: req.cookies['teamID']}, function(err, user){
          if(err) return ("err");
     
          
          //user.Score=user.Score+1;
          user.save(function(err){
             if(err) return ("err");
           });

           //creating token
          const token=req.cookies['jwt'];

          //console.log(token);
            if (token) {
              
                jwt.verify(token, process.env.SECRET1, (err, decodedToken) => {
                 //console.log("hello");
                  if (err) {
                    console.log(err.message);
                    res.sendFile(path.join(__dirname , '../errors/token.html'));

                  } else  if(decodedToken.id==req.params.id && req.params.id-1==decodedToken.answered){
                   // console.log(decodedToken);
                   var id = Number(req.params.id);
                   if(user.attempted==id-1 && user.Score==id-1){
                   user.attempted=id;
                   user.Score=user.Score+1;
                    user.save(function(err){
                              if(err) return ("err");
                              });
                            }
                    res.cookie('attempt',id,{maxAge:maxAge*1000});
                    const token1= createToken(id,id);
                       res.cookie('jwt',token1,{maxAge:maxAge*1000});
                       if(id==20){
                        return res.redirect('/congratulations');
                       }
                       else{
                   return res.redirect('/question/'+(id+1));
                       }


                }
             });
              } else {
                res.json({
                  message:'not found'
                })
              }
            
              
        
         });
      }
  });
  } 
  else{
      res.status(404).sendFile(path.join(__dirname ,'../errors/login.html'));
  }
        }
        catch (error) {
            res.status(501).sendFile(path.join(__dirname, '../errors/server.html'));
        }
  });

module.exports = router;
