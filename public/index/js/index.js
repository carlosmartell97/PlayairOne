var randomCode;

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

function checkInput(code,nickname){
    console.log('checkHost:'+nickname);
    if((document.getElementById('nickname').value!="" && randomCode) || (document.getElementById('nickname').value!="" && document.getElementById('customCode').value!="")){
        if(!randomCode){
            createSession(nickname,code);
        }
        else{
            createRandomSession(nickname);
        }
    }
    else{
        console.log('nopeInput');
    }
};
function checkInput2(code,nickname){
    console.log('checkJoin:'+code);
    if(document.getElementById('code').value!=""){
        joinSession(code,nickname);
    }
    else{
//        console.log('nopeInput');
    }
};

function createRandomSession(nickname){
    console.log('create RANDOM');
    //WRITING DATA
    var ref = new Firebase("https://playairone.firebaseio.com/");
    var sessionsRef = ref.child("sessions");
    var pushedData = sessionsRef.push({
            "0":{"nickname":nickname}
    }, function(error) {
        if (error) {
            console.log("Data could not be saved." + error);
        } else {
            console.log("Data saved successfully.");
//            console.log('created:'+pushedData.key());
            $('#hostModal').modal('hide');
            startJoin(nickname,pushedData.key());
        }
    });
};

function createSession(nickname,customCode){
    console.log('create CUSTOM');
    //WRITING DATA
    var ref = new Firebase("https://playairone.firebaseio.com/sessions/");
    ref.once('value', function(snapshot) {
        if (!snapshot.hasChild(customCode)) {
            document.getElementById("customCodeMessage").style.display="none";
            var sessionsRef = ref.child(customCode);
            var pushedData = sessionsRef.push({
                    "nickname":nickname
            }, function(error) {
                if (error) {
                    console.log("Data could not be saved." + error);
                } else {
                    console.log("Data saved successfully.");
//                    console.log('joined:'+pushedData.key());
                }
            });
            startJoin(nickname,customCode);
            $('#hostModal').modal('hide');
        }
        else{
            console.log('not Child');
            document.getElementById("customCodeMessage").style.display="block";
        }
    });
};

function joinSession(code,nickname){
    //WRITING DATA
    var ref = new Firebase("https://playairone.firebaseio.com/sessions/");
    ref.once('value', function(snapshot) {
        if (snapshot.hasChild(code)) {
            document.getElementById("codeMessage").style.display="none";
            var sessionsRef = ref.child(code);
            var pushedData = sessionsRef.push({
                    "nickname":nickname
            }, function(error) {
                if (error) {
                    console.log("Data could not be saved." + error);
                } else {
                    console.log("Data saved successfully.");
//                    console.log('joined:'+pushedData.key());
                    $('#joinModal').modal('hide');
                }
            });
            startJoin(document.getElementById('nickname2').value,code);
        }
        else{
            console.log('not Child');
            document.getElementById("codeMessage").style.display="block";
        }
    });
};

function startJoin(nickname,code){
    console.log("startJoin");
    document.getElementById('portfolio').style.display="none"; document.getElementById('about').style.display="none"; document.getElementById('footer').style.display="none";
    document.getElementById('gameContainer').style.paddingTop="165px";
    document.getElementById('gameContainer').innerHTML='<div class="row" id="gameZone"> <div class="col-lg-12"> <div class="intro-text"> <span class="name">ACCESS CODE:</span> <h1><span class="label label-warning" style="color:#000; font-size:6vw; text-transform:none">'+code+'</span></h1> </div> <div class="intro-text" style="padding:2vw; font-size:4vh"> Playairs: </div> <div class="col-lg-12" id="playairs" style=" width:95%; left:2.5%"> </div> </div> </div> <div class="container" id="gameContainer" style="padding:8px; position:absolute; bottom:0; left:0; right:0; font-size:2.5vh"> <div class="row" id="gameZone"> <div class="col-lg-12"> <a class="btn btn-lg btn-outline" style="font-size:5vh" onclick="startCounter('+"'"+nickname+"'"+','+"'"+code+"'"+',5)"> <i class="fa fa-thumbs-up"></i> Start! </a> </div> </div> </div>';
    var ref = new Firebase("https://playairone.firebaseio.com/");
    var sessionsRef = ref.child('sessions').child(code);
    sessionsRef.on("child_added", function(snapshot) {
        var session = snapshot.val();
        console.log(session.nickname);
        $("#playairs").append('<button type="button" class="btn-lg btn-primary" style="position:relative; padding:1px">'+snapshot.val().nickname+'</button>');
        numJellies++;
    });
};

//window.onload=function() {
//  startCounter("","",5);
//};

function startCounter(nickname,code,num){
    console.log("startCounter");
    document.getElementById('gameContainer').style.paddingTop="165px"; document.getElementById('gameContainer').style.height="100vh";
    document.getElementById('gameContainer').innerHTML='<div class="intro-text" style="width:100%; height:100%; "> <span class="name" id="counter" style="font-size:50vh; position:absolute; top:15vh; right:0; left:0">'+num+'</span> </div>';
    for (var i = 0; i <= num; i++) {
        (function(index) {
            setTimeout(function() { 
                if(index!=num){
                    document.getElementById('counter').innerHTML=num-index;
                }else{
                    startSession(nickname,code);
                } 
              }, i*1000);
        })(i);
    }
};

function startSession(nickname,code){
    console.log("startSession");
    document.getElementById('gameContainer').style.paddingTop="165px"; document.getElementById('gameContainer').style.height="100vh";
    document.getElementById('gameContainer').innerHTML='<div class="row" id="gameZone" style="visibility:hidden"> <div class="col-lg-12"> <div class="intro-text"> <div class="progress" style="visibility:hidden"> <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"> <span class="sr-only">0% Complete</span> </div> </div> <span class="name">Question</span> <hr class="question"> <span class="skills" id="options" style="visibility:hidden"> <a class="btn btn-lg btn-outline"> Option one </a> <a class="btn btn-lg btn-outline"> Opción dos </a> <br> <a class="btn btn-lg btn-outline"> Opzione tre </a> <a class="btn btn-lg btn-outline"> Option vier </a> </span> </div> </div> </div>';
    $('header').append('<div style="position:absolute; bottom:0; left:0; right:0; font-size:2.5vh"> Session Code: <span id="sessionCode">'+code+'</span> </div>');
    $('#gameZone').css('visibility','visible').hide().fadeIn('slow');
    setTimeout("startQuestion()",2000);
};

function startQuestion(){
    $('.progress').css('visibility','visible').hide().fadeIn('slow');
    $('#options').css('visibility','visible').hide().fadeIn('slow');
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