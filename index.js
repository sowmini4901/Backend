//Required packages
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app =  express();
var jwt = require('jsonwebtoken');
const path = require('path');
//const auth=require("./sample");
const authRoutes = require("./routes/auth");
const leader = require("./routes/leaderboard");
//Middle wares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use(express.static(__dirname + '/Questions'));
app.use(express.static(__dirname+ '/landingpage'));
app.use(express.static(__dirname+ '/Questions/images'));
app.use(express.static(__dirname+ '/Questions/css'));



app.use(cors());
//cookies
app.use(cookieParser('null_chapter_is_the_best'));
//app.use(auth);
//db connection
const db = async()=> {mongoose.connect(process.env.DATABASE2,
 {useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log("DB CONNECTED")
})
};
db();


//My Routes
app.use("/api", authRoutes);
app.use("/api/leader",leader);

//PORT
const PORT = process.env.PORT || 8080;

//Starting a server
 app.listen(PORT,()=>{
    console.log(`app is running at ${PORT}`);
})


 
const maxAge = 3*24*60*60;
const createToken = (id,answered) => {
    return jwt.sign({ id, answered}, process.env.SECRET1, {
      expiresIn: maxAge
    });
  };


  
  app.get('/',function(req, res){
    if(req.cookies['timeup']==undefined){
      if(req.cookies['loggedin']=="false" && req.cookies['attempt']!=undefined){
        return res.sendFile(path.join(__dirname , '/landingpage/sam.html'));
        //return res.sendFile(path.join(__dirname , '/webhunt3.0.html'));
      }
    if(req.cookies['attempt']==undefined){
      res.cookie('attempt',0,{maxAge:maxAge*1000});
      return res.sendFile(path.join(__dirname , '/landingpage/sam.html'));
      //return res.sendFile(path.join(__dirname , '/webhunt3.0.html'));
    }
    else if(req.cookies['loggedin']=="true"){
      console.log("logged");
      if(req.cookies['attempt']==20){
        return res.sendFile(path.join(__dirname,'/Questions/html/congrats.html'));
      }
      var attemptChecking= Number(req.cookies['attempt'])+1;
      console.log(attemptChecking);
      return res.redirect('/question/'+attemptChecking);
     
    
    
  } 
}

  else{
    return res.sendFile(path.join(__dirname+'/errors/nolonger.html'));
  }
    

  
  
  })

  app.get('/signin', function(req, res) {
    if(req.cookies['timeup']==undefined){
    if(req.cookies['loggedin']=="true"){
      if(req.cookies['attempt']==20){
        return res.sendFile(path.join(__dirname,'/Questions/html/congrats.html'));
      }
      var attemptChecking= Number(req.cookies['attempt'])+1;
      return res.redirect('/question/'+attemptChecking);
      
    }
else{
 return res.sendFile(path.join(__dirname , '/landingpage/signin.html'));
 //return res.sendFile(__dirname + '/welcome.html');
}
    } 
    else{
      return res.sendFile(path.join(__dirname , '/errors/nolonger.html'));
    }
});


app.get('/congratulations',(req, res)=>{
  res.sendFile(path.join(__dirname+"/Questions/html/congrats.html"));
});

app.get('/question/:id',(req,res)=>{
  const token=req.cookies.jwt;
  //for 1st question
  if(req.cookies['loggedin']=="true"){
  
    if(req.params.id==1){
   
      const token1= createToken(req.params.id,0);
      res.cookie('jwt',token1,{maxAge:maxAge*1000});
      return res.sendFile(__dirname+'/Questions/html/challenge1.html');
      //return res.sendFile(__dirname+'/Questions/html/question1.html');
   }
  
    
    
    //for 2nd question
    else if(req.params.id!=1){
     
    var newid = Number(req.params.id);
   // console.log("id"+newid);
    if (token) {
     // console.log(token);
            jwt.verify(token, process.env.SECRET1, (err, decodedToken) => {
              if (err) {
               
                console.log(err.message);
                res.redirect('/signin');
                
              } else if(((newid)>=decodedToken.id) && (decodedToken.answered==newid-1)){
                //console.log(decodedToken);
                const token1= createToken(newid,newid-1);
                res.cookie('jwt',token1,{maxAge:maxAge*1000});
                //return res.sendFile(__dirname,'/Questions/html/challenge1.html');
                return res.sendFile(__dirname+'/Questions/html/challenge'+ newid+'.html');
            
              }
              else{
                return res.sendFile(path.join(__dirname,'/errors/notauth.html'));
              }
            });
          }
        
        else {
            res.redirect('/signin');
          }
    }

  } else{
    return res.sendFile(__dirname+'/errors/login.html');
  }  
    
});


module.exports = app;