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
     question.compareAnswer(((req.body.answer).toLowerCase()), async (err, match) => {
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
                        return res.sendFile(path.join(__dirname, '../errors/congrats.html'));
                       }
                       else{
                   return res.redirect('/question/'+(id+1));
                       }


                   /*
                   else if(req.params.id==2){
                    if(user.attempted==1 && user.Score==1){
                      user.attempted=2;
                      user.Score=user.Score+1;
                      user.save(function(err){
                        if(err) return ("err");
                      });
                      }
                      res.cookie('attempt',2,{maxAge:maxAge*1000});
                      const token1= createToken(req.params.id,2);
                      res.cookie('jwt',token1,{maxAge:maxAge*1000});
                        return res.redirect('/question/3');
                  }

                  else if(req.params.id==3){
                    if(user.attempted==2 && user.Score==2){
                      user.attempted=3;
                      user.Score=user.Score+1;
                      user.save(function(err){
                        if(err) return ("err");
                      });
                      }
                      res.cookie('attempt',3,{maxAge:maxAge*1000});
                      const token1= createToken(req.params.id,3);
                      res.cookie('jwt',token1,{maxAge:maxAge*1000});
                        return res.redirect('/question/4');
                  }

                  else if(req.params.id==4){
                    if(user.attempted==3 && user.Score==3){
                      user.attempted=4;
                      user.Score=user.Score+1;
                      user.save(function(err){
                        if(err) return ("err");
                      });
                      }
                      res.cookie('attempt',4,{maxAge:maxAge*1000});
                      const token1= createToken(req.params.id,4);
                      res.cookie('jwt',token1,{maxAge:maxAge*1000});
                        return res.redirect('/question/5');
                  }
                  
                  else if(req.params.id==5){
                    if(user.attempted==4 && user.Score==4){
                      user.attempted=5;
                      user.Score=user.Score+1;
                      user.save(function(err){
                        if(err) return ("err");
                      });
                      }
                      res.cookie('attempt',5,{maxAge:maxAge*1000});
                      const token1= createToken(req.params.id,5);
                      res.cookie('jwt',token1,{maxAge:maxAge*1000});
                        return res.redirect('/question/6');
                  }

                  else if(req.params.id==6){
                    if(user.attempted==5 && user.Score==5){
                      user.attempted=6;
                      user.Score=user.Score+1;
                      user.save(function(err){
                        if(err) return ("err");
                      });
                      }
                      res.cookie('attempt',6,{maxAge:maxAge*1000});
                      const token1= createToken(req.params.id,6);
                      res.cookie('jwt',token1,{maxAge:maxAge*1000});
                        return res.redirect('/question/7');
                  }

                  else if(req.params.id==7){
                    if(user.attempted==6 && user.Score==6){
                      user.attempted=7;
                      user.Score=user.Score+1;
                      user.save(function(err){
                        if(err) return ("err");
                      });
                      }
                      res.cookie('attempt',7,{maxAge:maxAge*1000});
                      const token1= createToken(req.params.id,7);
                      res.cookie('jwt',token1,{maxAge:maxAge*1000});
                        return res.redirect('/question/8');
                  }

                  else if(req.params.id==8){
                    if(user.attempted==7 && user.Score==7){
                      user.attempted=8;
                      user.Score=user.Score+1;
                      user.save(function(err){
                        if(err) return ("err");
                      });
                      }
                      res.cookie('attempt',8,{maxAge:maxAge*1000});
                      const token1= createToken(req.params.id,8);
                      res.cookie('jwt',token1,{maxAge:maxAge*1000});
                        return res.redirect('/question/9');
                  }

                  else if(req.params.id==9){
                    if(user.attempted==8 && user.Score==8){
                      user.attempted=9;
                      user.Score=user.Score+1;
                      user.save(function(err){
                        if(err) return ("err");
                      });
                      }
                      res.cookie('attempt',9,{maxAge:maxAge*1000});
                      const token1= createToken(req.params.id,9);
                      res.cookie('jwt',token1,{maxAge:maxAge*1000});
                        return res.redirect('/question/10');
                  }

                  else if(req.params.id==10){
                    if(user.attempted==9 && user.Score==9){
                      user.attempted=10;
                      user.Score=user.Score+1;
                      user.save(function(err){
                        if(err) return ("err");
                      });
                      }
                      res.cookie('attempt',10,{maxAge:maxAge*1000});
                      const token1= createToken(req.params.id,10);
                      res.cookie('jwt',token1,{maxAge:maxAge*1000});
                        return res.redirect('/question/11');
                  }

                  else if(req.params.id==11){
                    if(user.attempted==10 && user.Score==10){
                      user.attempted=11;
                      user.Score=user.Score+1;
                      user.save(function(err){
                        if(err) return ("err");
                      });
                      }
                      res.cookie('attempt',11,{maxAge:maxAge*1000});
                      const token1= createToken(req.params.id,11);
                      res.cookie('jwt',token1,{maxAge:maxAge*1000});
                        return res.redirect('/question/12');
                  }

                  else if(req.params.id==12){
                    if(user.attempted==11 && user.Score==11){
                      user.attempted=12;
                      user.Score=user.Score+1;
                      user.save(function(err){
                        if(err) return ("err");
                      });
                      }
                      res.cookie('attempt',12,{maxAge:maxAge*1000});
                      const token1= createToken(req.params.id,12);
                      res.cookie('jwt',token1,{maxAge:maxAge*1000});
                        return res.redirect('/question/13');
                  }

                  else if(req.params.id==13){
                    if(user.attempted==12 && user.Score==12){
                      user.attempted=13;
                      user.Score=user.Score+1;
                      user.save(function(err){
                        if(err) return ("err");
                      });
                      }
                      res.cookie('attempt',13,{maxAge:maxAge*1000});
                      const token1= createToken(req.params.id,13);
                      res.cookie('jwt',token1,{maxAge:maxAge*1000});
                        return res.redirect('/question/14');
                  }

                  else if(req.params.id==14){
                    if(user.attempted==13 && user.Score==13){
                      user.attempted=14;
                      user.Score=user.Score+1;
                      user.save(function(err){
                        if(err) return ("err");
                      });
                      }
                      res.cookie('attempt',14,{maxAge:maxAge*1000});
                      const token1= createToken(req.params.id,14);
                      res.cookie('jwt',token1,{maxAge:maxAge*1000});
                        return res.redirect('/question/15');
                  }

                  else if(req.params.id==15){
                    if(user.attempted==14 && user.Score==14){
                      user.attempted=15;
                      user.Score=user.Score+1;
                      user.save(function(err){
                        if(err) return ("err");
                      });
                      }
                      res.cookie('attempt',15,{maxAge:maxAge*1000});
                      const token1= createToken(req.params.id,15);
                      res.cookie('jwt',token1,{maxAge:maxAge*1000});
                        return res.redirect('/question/16');
                  }
                 
                  else if(req.params.id==16){
                    if(user.attempted==15 && user.Score==15){
                      user.attempted=16;
                      user.Score=user.Score+1;
                      user.save(function(err){
                        if(err) return ("err");
                      });
                      }
                      res.cookie('attempt',16,{maxAge:maxAge*1000});
                      const token1= createToken(req.params.id,16);
                      res.cookie('jwt',token1,{maxAge:maxAge*1000});
                        return res.redirect('/question/17');
                  }

                  else if(req.params.id==17){
                    if(user.attempted==16 && user.Score==16){
                      user.attempted=17;
                      user.Score=user.Score+1;
                      user.save(function(err){
                        if(err) return ("err");
                      });
                      }
                      res.cookie('attempt',17,{maxAge:maxAge*1000});
                      const token1= createToken(req.params.id,17);
                      res.cookie('jwt',token1,{maxAge:maxAge*1000});
                        return res.redirect('/question/18');
                  }

                  else if(req.params.id==18){
                    if(user.attempted==17 && user.Score==17){
                      user.attempted=18;
                      user.Score=user.Score+1;
                      user.save(function(err){
                        if(err) return ("err");
                      });
                      }
                      res.cookie('attempt',18,{maxAge:maxAge*1000});
                      const token1= createToken(req.params.id,18);
                      res.cookie('jwt',token1,{maxAge:maxAge*1000});
                        return res.redirect('/question/19');
                  }

                  else if(req.params.id==19){
                    if(user.attempted==18 && user.Score==18){
                      user.attempted=19;
                      user.Score=user.Score+1;
                      user.save(function(err){
                        if(err) return ("err");
                      });
                      }
                      res.cookie('attempt',19,{maxAge:maxAge*1000});
                      const token1= createToken(req.params.id,19);
                      res.cookie('jwt',token1,{maxAge:maxAge*1000});
                        return res.redirect('/question/20');
                  }

                  else if(req.params.id==20){
                    if(user.attempted==19 && user.Score==19){
                      user.attempted=20;
                      user.Score=user.Score+1;
                      user.save(function(err){
                        if(err) return ("err");
                      });
                      }
                      res.cookie('attempt',20,{maxAge:maxAge*1000});
                      const token1= createToken(req.params.id,20);
                      res.cookie('jwt',token1,{maxAge:maxAge*1000});
                        return res.sendFile(path.join(__dirname, '../Questions/html/thankyou.html'));
                  }
                  */








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
