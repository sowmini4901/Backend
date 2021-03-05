
var countDownDate = new Date("Mar 7, 2021 12:00:00").getTime();


var x = setInterval(function() {

var currentTime = new Date();

var currentOffset = currentTime.getTimezoneOffset();

var ISTOffset = 330;   // IST offset UTC +5:30 

var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);

// ISTTime now represents the time in IST coordinates

var hoursIST = ISTTime.getHours()
var minutesIST = ISTTime.getMinutes()
var secIST = ISTTime.getSeconds()


  // var now = new Date().getTime();
  // var distance = countDownDate - ISTTime;
    
  // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  // var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  // var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
  document.getElementById("timer").innerHTML = hoursIST  + "h "
  + minutesIST + "m " + secIST + "s ";
    
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("timer").innerHTML = "TIMEOUT";
    var url= "../api/timeup"; 
    window.location = url; 

  }
}, 1000);

  function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        // display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

window.onload = function () {
    var fiveMinutes = 60 * 5,
        display = document.querySelector('#time');
    startTimer(fiveMinutes, display);
};