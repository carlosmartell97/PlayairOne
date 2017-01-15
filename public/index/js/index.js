console.log("now working");

// ACTIVATING FULL SCREEN:
// Find the right method, call on correct element
function launchIntoFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
};
// launchIntoFullscreen(document.documentElement); -> the whole page
// launchIntoFullscreen(document.getElementById("videoElement")); -> any individual element

function startJoin(nickname,code){
    console.log(nickname);
    document.getElementById('portfolio').style.display="none"; document.getElementById('about').style.display="none"; document.getElementById('footer').style.display="none";
    document.getElementById('gameContainer').style.paddingTop="165px";
//    document.getElementById('canvasZone').innerHTML='<canvas id="canvas" resize></canvas> <script src="index/js/paperJS-and-jelly.js"></script> <script src="index/js/tentacle.js"></script> <script src="index/js/nardove.js"></script>';
    $('canvasZone').html('<canvas id="canvas" resize></canvas> <script src="index/js/paperJS-and-jelly.js"></script> <script src="index/js/tentacle.js"></script> <script src="index/js/nardove.js"></script>');
    var scr = '<canvas id="canvas" resize></canvas> <script src="index/js/paperJS-and-jelly.js"></script> <script src="index/js/tentacle.js"></script> <script src="index/js/nardove.js"></script>';
//    window.onload = function(){
        var n = document.createElement("div");
        n.innerHTML = scr;
        $('canvasZone').append(n);
//    }
    console.log(document.getElementById('canvasZone').innerHTML);
    document.getElementById('gameContainer').innerHTML='<div class="row" id="gameZone"> <div class="col-lg-12"> <div class="intro-text"> <span class="name">ACCESS CODE:</span> <h1><span class="label label-warning" style="color:#000; font-size:6vw">-KLYeQ-39PXcPc0rbkxE</span></h1> </div> <div class="intro-text" style="padding:2vw; font-size:4vh"> Playairs: </div> <div class="col-lg-12" style=" width:95%; left:2.5%"> <button type="button" class="btn-lg btn-primary" style="position:relative; padding:1px">Default</button> <button type="button" class="btn-lg btn-primary" style="position:relative; padding:1px">Primary</button> <button type="button" class="btn-lg btn-primary" style="position:relative; padding:1px">Success</button> <button type="button" class="btn-lg btn-primary" style="position:relative; padding:1px">Primasdfsdfdary</button> <button type="button" class="btn-lg btn-primary" style="position:relative; padding:1px">Sucasdfdfcess</button> <button type="button" class="btn-lg btn-primary" style="position:relative; padding:1px">Primary</button> <button type="button" class="btn-lg btn-primary" style="position:relative; padding:1px">Success</button> <button type="button" class="btn-lg btn-primary" style="position:relative; padding:1px">Primasdfsdfdary</button> <button type="button" class="btn-lg btn-primary" style="position:relative; padding:1px">Success</button> <button type="button" class="btn-lg btn-primary" style="position:relative; padding:1px">Primasdfsdfdary</button> <button type="button" class="btn-lg btn-primary" style="position:relative; padding:1px">Primary</button> <button type="button" class="btn-lg btn-primary" style="position:relative; padding:1px">Primasdfsdfdary</button> <button type="button" class="btn-lg btn-primary" style="position:relative; padding:1px">Primary</button> <button type="button" class="btn-lg btn-primary" style="position:relative; padding:1px">Success</button> </div> </div> </div> <div class="container" id="gameContainer" style="padding:8px; position:absolute; bottom:0; left:0; right:0; font-size:2.5vh"> <div class="row" id="gameZone"> <div class="col-lg-12"> <a class="btn btn-lg btn-outline" style="font-size:5vh" onclick="startSession(nickname,code)"> <i class="fa fa-thumbs-up"></i> Start! </a> </div> </div> </div>';
}

function startSession(nickname,code){
    console.log(nickname);
    document.getElementById('portfolio').style.display="none"; document.getElementById('about').style.display="none"; document.getElementById('footer').style.display="none";
    document.getElementById('gameContainer').style.paddingTop="165px"; document.getElementById('gameContainer').style.height="100vh";
    document.getElementById('gameContainer').innerHTML='<div class="row" id="gameZone"> <div class="col-lg-12"> <div class="intro-text"> <div class="progress" style="visibility:hidden"> <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"> <span class="sr-only">0% Complete</span> </div> </div> <span class="name">Question</span> <hr class="question"> <span class="skills"> <a class="btn btn-lg btn-outline"> Option one </a> <a class="btn btn-lg btn-outline"> Opción dos </a> <br> <a class="btn btn-lg btn-outline"> Opzione tre </a> <a class="btn btn-lg btn-outline"> Option vier </a> </span> </div> </div> </div>';
    $('header').append('<div style="position:absolute; bottom:0; left:0; right:0; font-size:2.5vh"> Session Code: <span id="sessionCode">'+code+'</span> </div>');
    setTimeout("startProgressBar()",2000);
};

//setTimeout("startProgressBar()",2000); // esto debe ir dentro de startSession()

function startProgressBar(){
    $('.progress').css('visibility','visible').hide().fadeIn('slow');
    var i = 0;
    var progressBar = setInterval(function () {
        i++;
        if (i > 0) {
            $('.progress-bar').css('width', i + '%');
        } else {
            clearInterval(counterBack);
        }
    }, 100);
};

