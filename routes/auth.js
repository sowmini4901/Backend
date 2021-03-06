var express = require('express')
var router = express.Router();
//var app = require("../index");
//var app1= express();
var cookieParser = require('cookie-parser');
//app.use(cookieParser("null_chapter_is_the_best"));
const User = require("../models/user");
var jwt = require('jsonwebtoken');
const path=require('path');
const {signout, signup, timeup} = require("../controllers/auth");



const maxAge = 3*24*60*60;

router.post("/signup", signup);
router.post("/signout",signout);
router.get("/timeup",timeup);

//for signing in
router.post("/signin",async(req, res)=>{
    try {
       
        var user = await User.findOne({ teamID: req.body.teamID }).exec();

        if(!user) {
            return res.status(400).sendFile(path.join(__dirname,'../errors/team.html'));
        }
        user.comparePassword(req.body.password, (err, match) => {
            try{
            if(!match) {
                return res.status(401).sendFile(path.join(__dirname ,'../errors/invalid.html'));
            }
        
        }catch (err) {
            res.status(501).sendFile(path.join(__dirname, '../errors/server.html'));
        }
        
        if(match && user){
        User.findOne({teamID: req.body.teamID}, function(err, user){
            if(err)return ("err");
            user.loggedIn = true;
           // console.log("loggedin");
           
            user.save(function(err){
                if(err)return ("err");
              });

              res.cookie('loggedin',true,{maxAge:maxAge*1000});
            //console.log("attempted"+user.attempted);
             res.cookie('teamID', req.body.teamID,{ maxAge:maxAge*1000});
             var loginChecking=Number(req.cookies['attempt'])+1;
            // console.log(loginChecking);
             return res.redirect('/question/'+loginChecking);
             
            
            
           });
        }
    });
    } catch (error) {
        res.status(501).sendFile(path.join(__dirname,'../errors/server.html'));
    }
    
});

module.exports = router;