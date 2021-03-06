jQuery(document).ready(function($){
  animateDiv('.a');
  animateDiv('.b');
  animateDiv('.c');
  animateDiv('.d');
  animateDiv('.e');
  animateDiv('.f');
  animateDiv('.z');
});

function makeNewPosition(){
  
  // Get viewport dimensions (remove the dimension of the div)
  var h = $(window).height() - 50;
  var w = $(window).width() - 50;
  
  var nh = Math.floor(Math.random() * h);
  var nw = Math.floor(Math.random() * w);
  
  return [nh,nw];    
  
}

function animateDiv(myclass){
  var newq = makeNewPosition();
  $(myclass).animate({ top: newq[0], left: newq[1] }, 3500,   function(){
    animateDiv(myclass);        
  });
  
};

function geturl2() {
  window.location.href = "https://miro.medium.com/max/970/0*wtpc2GhEV8SVqfMj.png"
// location.replace("https://miro.medium.com/max/970/0*wtpc2GhEV8SVqfMj.png")
}