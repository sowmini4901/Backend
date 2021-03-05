
  var button1 = document.getElementById("clickme1");

  count1 = 8;
  count2 = 30;
  count3 = 50;
button1.onclick = function() {
  count1 += 1;
  if (count1===11) {
    alert("You are close to your answer!");
  }
  button1.innerHTML =  count1;
};
var btn2 = document.getElementById("clickme2");
btn2.onclick = function() {
  count2 += 1;
  if (count2===60) {
    count2=0;
  } else if(count2===2 & count1===11 ){
    alert("The first programming language ever");
  }
  btn2.innerHTML = count2;
};

  var button3 = document.getElementById("clickme3");
button3.onclick = function() {
  count3 += 1;
  if (count3===60) {
    count3=0;
  }
  button3.innerHTML =  count3;
};
