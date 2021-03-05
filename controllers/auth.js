const User = require("../models/user");
const express = require('express');
const app = express();
const path = require('path');
var cookieParser = require('cookie-parser');
//app.use(cookieParser("null_chapter_is_the_best"));
const maxAge = 3*24*60*60;

exports.signup= async(req, res)=>{
    const user = new User(req.body)
    await user.save((err, user) => {
        if(err){
            return res.status(400).json({
                err: "NOT able to save user in DB"
            })
        }
        res.json({
            teamID: user.teamID,
            id: user._id,
            score: user.Score
        });
        
    })
};

exports.timeup = async(req, res)=>{
    
    try {
       
        var user = await User.findOne({ teamID: req.cookies.teamID }).exec();

        if(!user) {
            return res.status(400).sendFile(path.join(__dirname, '../errors/team.html'));
        }
        else{
            user.loggedin=false;
            user.save(function(err){
                if(err)return ("err");
              });
           
              res.cookie('attempt',{maxAge:0});
              res.cookie('teamID',{maxAge:0});
              res.cookie('jwt',{maxAge:0});
              res.cookie('loggedin',{maxAge:0});
              res.cookie('timeup',true,{maxAge:maxAge*1000});
            return res.sendFile(path.join(__dirname ,'../Questions/html/thankyou.html'));
        }
    } catch(error) {
        res.status(501).sendFile(path.join(__dirname , '../errors/server.html'));

    }

}


exports.signout = async(req, res)=>{
    try {
       
        var user = await User.findOne({ teamID: req.cookies.teamID }).exec();

        if(!user) {
            return res.status(400).sendFile(path.join(__dirname,'../errors/team.html'));
        }
        else{
            
            user.save(function(err){
                if(err)return ("err");
              });
           console.log('error');
              res.cookie('loggedin',false,{maxAge:maxAge*1000});
            return res.redirect('/signin');
        }
    } catch(error) {
        res.status(501).sendFile(path.join(__dirname,'../errors/server.html'));
    }

    
    
};