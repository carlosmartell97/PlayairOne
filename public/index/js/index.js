var randomCode=false; var host=false; var currentQuestion=1; var correctAnswer; var howManyQuestions;
var playair; var sessionCode; var hostKey; var score=0;

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
            createCustomSession(nickname,code);
        }
        else{
            createRandomSession(nickname);
        }
    }
    else{
//        console.log('nopeInput');
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
    //WRITING DATA
    var ref = new Firebase("https://playairone.firebaseio.com/");
    var sessionsRef = ref.child("sessions");
    var pushedData = sessionsRef.push({
            "0":{
                "nickname":nickname,
                "score":0
            }
    }, function(error) {
        if (error) {
            console.log("Data could not be saved." + error);
        } else {
            console.log("Data saved successfully.");
            $('#hostModal').modal('hide');
            host=true;
            startJoin(nickname,pushedData.key());
        }
    });
};

function createCustomSession(nickname,customCode){
    //WRITING DATA
    var ref = new Firebase("https://playairone.firebaseio.com/sessions/");
    ref.once('value', function(snapshot) {
        if (!snapshot.hasChild(customCode)) {
            document.getElementById("customCodeMessage").style.display="none";
            var sessionsRef = ref.child(customCode);
            var pushedData = sessionsRef.push({
                    "nickname":nickname,
                    "score":0
            }, function(error) {
                if (error) {
                    console.log("Data could not be saved." + error);
                } else {
                    console.log("Data saved successfully.");
                }
            });
            $('#hostModal').modal('hide');
            host=true;
            startJoin(nickname,customCode);
        }
        else{
            console.log('codeAlreadyExists');
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
                    "nickname":nickname,
                    "score":0
            }, function(error) {
                if (error) {
                    console.log("Data could not be saved." + error);
                } else {
                    console.log("Data saved successfully.");
                    $('#joinModal').modal('hide');
                }
            });
            host=false;
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
    playair=nickname;
    sessionCode=code;
    document.getElementById('portfolio').style.display="none"; document.getElementById('about').style.display="none"; document.getElementById('footer').style.display="none";
    document.getElementById('gameContainer').style.paddingTop="165px";
    document.getElementById('toggleButton').innerHTML="STATS";
    document.getElementById('toggleStats').innerHTML="";
    document.getElementById('gameContainer').innerHTML='<div class="row" id="gameZone"> <div class="col-lg-12"> <div class="intro-text"> <span class="name">ACCESS CODE:</span> <h1><span class="label label-warning" style="color:#000; font-size:6vw; text-transform:none">'+code+'</span></h1> </div> <div class="intro-text" style="padding:2vw; font-size:4vh"> Playairs: </div> <div class="col-lg-12" id="playairs" style=" width:95%; left:2.5%"> </div> </div> </div> <div class="container" id="footer" style="padding:8px; position:absolute; bottom:0; left:0; right:0; font-size:2.5vh"> <div class="row"> <div class="col-lg-12"> <a class="btn btn-lg btn-outline" id="startButton" style="font-size:5vh" onclick="startButton('+"'"+nickname+"'"+','+"'"+code+"'"+')"> <i class="fa fa-thumbs-up"></i> Start! </a> </div> </div> </div>';
    if(!host){
        document.getElementById('startButton').style.display="none";
    }
    var ref = new Firebase("https://playairone.firebaseio.com/");
    var sessionsRef = ref.child('sessions').child(code);
    sessionsRef.limitToFirst(1).on("child_added", function(snapshot) {
      hostKey=snapshot.key();
    });
    sessionsRef.on("child_added", function(snapshot) {
        var session = snapshot.val();
        $("#playairs").append('<button type="button" class="btn-lg btn-primary" style="position:relative; padding:1px">'+session.nickname+'</button>');
        $("#toggleStats").append('<li class="page-scroll"><a>'+session.nickname+': <span id="'+session.nickname+'points">'+0+'</span></a></li>');
        numJellies++;
    });
    sessionsRef.on("child_changed", function(snapshot) {
        console.log(snapshot.val());
        var changedChild = snapshot.val();
//        console.log("CHILD_CHANGED"); console.log(changedChild); console.log("___");
        console.log(changedChild.question);
        if(changedChild.question>1){
            updateQuestion(++currentQuestion,playair,sessionCode);
        }
        if(changedChild.question==1 && snapshot.hasChild('start')){
            console.log('session start!');
            startCounter(playair,sessionCode,5);
        }
    });
};

function startButton(nickname,code){
    var ref = new Firebase("https://playairone.firebaseio.com/");
    var sessionsRef = ref.child('sessions').child(code).child(hostKey);
    sessionsRef.once("value", function(snapshot) {
        sessionsRef.update({
            "start":true,
            "question":1
        },function(error) {
            if (error) {
                console.log("Data could not be saved." + error);
            } else {
                console.log("Data saved successfully.");
                /*console.log('session start!');
                startCounter(playair,sessionCode,5);*/
            }
        });
    });
}

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
//    document.getElementById('gameContainer').innerHTML='<div class="row" id="gameZone" style="visibility:hidden"> <div class="col-lg-12"> <div class="intro-text"> <div class="progress" style="visibility:hidden"> <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"> <span class="sr-only">0% Complete</span> </div> </div> <span class="name">Question</span> <hr class="question"> <span class="skills" id="options" style="visibility:hidden"> <a class="btn btn-lg btn-outline"> Option one </a> <a class="btn btn-lg btn-outline"> Opción dos </a> <br> <a class="btn btn-lg btn-outline"> Opzione tre </a> <a class="btn btn-lg btn-outline"> Option vier </a> </span> </div> </div> </div>';
//    $('header').append('<div style="position:absolute; bottom:0; left:0; right:0; font-size:2.5vh"> Session Code: <span id="sessionCode">'+code+'</span> </div>');
//    $('#gameZone').css('visibility','visible').hide().fadeIn('slow');
//    setTimeout("startQuestion()",2000);
    
    updateQuestion(currentQuestion,nickname,code);
};

function updateDatabaseQuestion(playair,sessionCode){
    if(currentQuestion<=howManyQuestions){
        //updateQuestion(++currentQuestion,playair,sessionCode);
        /*console.log('session start!');
        startCounter(playair,sessionCode,5);*/
        var ref = new Firebase("https://playairone.firebaseio.com/");
        var sessionsRef = ref.child('sessions').child(sessionCode).child(hostKey);
        sessionsRef.once("value", function(snapshot) {
            sessionsRef.update({
                "question":currentQuestion+1
            },function(error) {
                if (error) {
                    console.log("Data could not be saved." + error);
                } else {
                    console.log("Data saved successfully.");
                }
            });
        });
    }
}

function updateQuestion(number,nickname,code){
    var ref = new Firebase("https://playairone.firebaseio.com/");
    var ref = new Firebase("https://playairone.firebaseio.com/");
    if(currentQuestion>1){
        var currentQuestionRef = ref.child('sessions').child(sessionCode).child('questionScores');
        currentQuestionRef.once("value", function(snapshot) {
            var objToWrite=new Object();
            objToWrite[currentQuestion-1]=score;
            currentQuestionRef.update(objToWrite,function(error) {
                if (error) {
                    console.log("Data could not be saved." + error);
                } else {
                    console.log("Data saved successfully.");
                }
            });
        });
    }
    ref.child('games').child('Quiz').child('questions').once("value").then(function(snapshot){
        howManyQuestions = snapshot.numChildren();
    });
    var questionsRef = ref.child('games').child('Quiz').child('questions').child(currentQuestion);
    questionsRef.on("child_added", function(question) {
        console.log(question.key());
        console.log(question.val());
        var answers=question.val();
        correctAnswer=answers[0];
        document.getElementById('gameContainer').innerHTML='<div class="row" id="gameZone" style="visibility:hidden"> <div class="col-lg-12"> <div class="intro-text"> <div class="progress" style="visibility:hidden"> <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"> <span class="sr-only">0% Complete</span> </div> </div> <span class="name">'+question.key()+'</span> <hr class="question"> <span class="skills" id="options" style="visibility:hidden"> <a class="btn btn-lg btn-outline" onclick="if(correctAnswer==1) updateScore();"> '+answers[1]+' </a> <a class="btn btn-lg btn-outline" onclick="if(correctAnswer==2) updateScore();"> '+answers[2]+' </a> <br> <a class="btn btn-lg btn-outline" onclick="if(correctAnswer==3) updateScore();"> '+answers[3]+' </a> <a class="btn btn-lg btn-outline" onclick="if(correctAnswer==4) updateScore();"> '+answers[4]+' </a> </span> </div> </div> </div>';
        if(host){
            $('header').append('<div style="position:absolute; bottom:0; left:0; right:0; font-size:2.5vh"> <div class="row" id="nextButtonDiv"> <div class="col-lg-12"> <a class="btn btn-lg btn-outline" style="font-size:5vh" onclick="updateDatabaseQuestion(playair,sessionCode)"> <i class="fa fa-arrow-circle-right"></i> next </a> </div> </div> Session Code: <span id="sessionCode">'+code+'</span> </div>');
        }else{
            $('header').append('<div style="position:absolute; bottom:0; left:0; right:0; font-size:2.5vh"> <div class="row" id="nextButtonDiv"> <div class="col-lg-12"> </div> </div> Session Code: <span id="sessionCode">'+code+'</span> </div>');
        }
        $('#gameZone').css('visibility','visible').hide().fadeIn('slow');
        setTimeout("startQuestion()",2000);
    });
};

function updateScore(){
    score+=500;
    console.log("s:"+score);
    /*var ref = new Firebase("https://playairone.firebaseio.com/");
    var sessionsRef = ref.child('sessions').child(sessionCode).child(hostKey);
    sessionsRef.once("value", function(snapshot) {
        sessionsRef.update({
            "question":currentQuestion+1
        },function(error) {
            if (error) {
                console.log("Data could not be saved." + error);
            } else {
                console.log("Data saved successfully.");
            }
        });
    });*/
};

function startQuestion(){
    $('.progress').css('visibility','visible').hide().fadeIn('slow');
    $('#options').css('visibility','visible').hide().fadeIn('slow');
    var i = 0;
    var progressBar = setInterval(function () {
        i++;
        if (i < 99) {
            $('.progress-bar').css('width', i + '%');
        } else {
            clearInterval(progressBar);
        }
    }, 100);
};