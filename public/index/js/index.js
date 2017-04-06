var randomCode=false; var host=false; var currentQuestion=1; var correctAnswer; var answerWasCorrect; var correctAnswerText; var howManyQuestions; var howManyPlayairs=0;
var playair; var playairCode; var sessionCode; var hostKey; var score=0;
var progressBar;
var ref = new Firebase("https://playairone.firebaseio.com/"); var sessionsRef; var playairsRef; var questionsRef; var questionScoresRef; var totalScoresRef;

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
    sessionsRef = ref.child("sessions");
    var pushedData = sessionsRef.push({
        "playairs":{
            "0":{
                "nickname":nickname
            }
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
    sessionsRef = ref.child("sessions");
    sessionsRef.once('value', function(snapshot) {
        if (!snapshot.hasChild(customCode)) {
            document.getElementById("customCodeMessage").style.display="none";
            var playairsRef = sessionsRef.child(customCode).child('playairs');
            var pushedData = playairsRef.push({
                "nickname":nickname
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
    sessionsRef = ref.child("sessions");
    sessionsRef.once('value', function(snapshot) {
        if (snapshot.hasChild(code)) {
            document.getElementById("codeMessage").style.display="none";
            var playairsRef = sessionsRef.child(code).child('playairs');
            var pushedData = playairsRef.push({
                    "nickname":nickname
            }, function(error) {
                if (error) {
                    console.log("Data could not be saved." + error);
                } else {
                    console.log("Data saved successfully.");
                    playairCode=pushedData.key();
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
    document.getElementById('gameContainer').innerHTML='<div class="row" id="gameZone"> <div class="col-lg-12"> <div class="intro-text"> <span class="name">ACCESS CODE:</span> <h2><span class="label label-warning" style="color:#000; font-size:6vw; text-transform:none">'+code+'</span></h2> </div> <div class="intro-text" style="padding:2vw; font-size:4vh"> Playairs: </div> <div class="col-lg-12" id="playairs" style=" width:95%; left:2.5%"> </div> </div> </div> <div class="container" id="footer" style="padding:8px; position:absolute; bottom:0; left:0; right:0; font-size:2.5vh"> <div class="row"> <div class="col-lg-12"> <a class="btn btn-lg btn-outline" id="startButton" style="font-size:5vh" onclick="startButton()"> <i class="fa fa-thumbs-up"></i> Start! </a> </div> </div> </div>';
    if(!host){
        document.getElementById('startButton').style.display="none";
    }
    
    playairsRef = ref.child('sessions').child(code).child('playairs');
    playairsRef.limitToFirst(1).on("child_added", function(snapshot) {
        hostKey=snapshot.key();
        if(host) playairCode=hostKey;
    });
    playairsRef.on("child_added", function(snapshot) {
        howManyPlayairs++;
        var session = snapshot.val();
        $("#playairs").append('<button type="button" class="btn-lg btn-primary" style="position:relative; padding:1px">'+session.nickname+'</button>');
        $("#toggleStats").append('<li class="page-scroll"><a>'+session.nickname+': <span id="'+session.nickname+'Points">'+0+'</span></a></li>');
        numJellies++;
    });
    playairsRef.on("child_changed", function(snapshot) {
        var changedChild = snapshot.val();
//        console.log("CHILD_CHANGED"); console.log(changedChild); console.log("___");
        console.log(changedChild.question);
        if(changedChild.question>1){
            showCorrectAnswer();
            answerWasCorrect=false;
        }
        else{ 
            // for this to happen, question=1
            console.log('session start!');
            startCounter(5);
        }
    });
};

function startButton(){
    var sessionHostRef = playairsRef.child(hostKey);
    sessionHostRef.once("value", function(snapshot) {
        sessionHostRef.update({
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

function startCounter(num){
    console.log("startCounter");
    document.getElementById('gameContainer').style.paddingTop="165px"; document.getElementById('gameContainer').style.height="100vh";
    document.getElementById('gameContainer').innerHTML='<div class="intro-text" style="width:100%; height:100%; "> <span class="name" id="counter" style="font-size:50vh; position:absolute; top:15vh; right:0; left:0">'+num+'</span> </div>';
    for (var i = 0; i <= num; i++) {
        (function(index) {
            setTimeout(function() { 
                if(index!=num){
                    document.getElementById('counter').innerHTML=num-index;
                }else{
                    startSession();
                } 
              }, i*1000);
        })(i);
    }
};

function startSession(){
    console.log("startSession");
    document.getElementById('gameContainer').style.paddingTop="165px"; document.getElementById('gameContainer').style.height="100vh";
//    document.getElementById('gameContainer').innerHTML='<div class="row" id="gameZone" style="visibility:hidden"> <div class="col-lg-12"> <div class="intro-text"> <div class="progress" style="visibility:hidden"> <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"> <span class="sr-only">0% Complete</span> </div> </div> <span class="name">Question</span> <hr class="question"> <span class="skills" id="options" style="visibility:hidden"> <a class="btn btn-lg btn-outline"> Option one </a> <a class="btn btn-lg btn-outline"> Opción dos </a> <br> <a class="btn btn-lg btn-outline"> Opzione tre </a> <a class="btn btn-lg btn-outline"> Option vier </a> </span> </div> </div> </div>';
//    $('header').append('<div style="position:absolute; bottom:0; left:0; right:0; font-size:2.5vh"> Session Code: <span id="sessionCode">'+code+'</span> </div>');
//    $('#gameZone').css('visibility','visible').hide().fadeIn('slow');
//    setTimeout("startQuestion()",2000);
    questionScoresRef = sessionsRef.child(sessionCode).child('questionScores');
    
    totalScoresRef = sessionsRef.child(sessionCode).child('totalScores');
    totalScoresRef.on("child_changed", function(snapshot) {
        console.log(snapshot.key()+"->");
        console.log(snapshot.val());
        document.getElementById(snapshot.key()+"Points").innerHTML=snapshot.val();
    });
    
    questionsRef = ref.child('games').child('Quiz').child('questions');
    questionsRef.once("value").then(function(snapshot){
        howManyQuestions = snapshot.numChildren();
    });
    updateQuestion(currentQuestion);
};

function showCorrectAnswer(){
    $('.progress').css('visibility','visible').hide().fadeOut('slow');
    window.clearInterval(progressBar);
    $('#nextButton').css("display","none");
    $('#options').css('visibility','visible').hide().fadeOut('slow');
    $('#correctAnswerFirst').css('visibility','visible').hide().fadeIn('slow');
    if(answerWasCorrect){
        document.getElementById('correctAnswerIcon').className="fa fa-check fa-4x";
    }else{
        document.getElementById('correctAnswerIcon').className="fa fa-times fa-4x";
    }
    document.getElementById('correctAnswerText').innerHTML=correctAnswerText;
    
    var second = setTimeout(function(){
        $('#correctAnswerFirst').css('visibility','visible').hide().fadeOut('slow');
        $('#correctAnswerFirst').css('display','none');
        $('#correctAnswerSecond').css('visibility','visible').hide().fadeIn('slow');
    }, 800);
    var third = setTimeout(function(){
        console.log("NOW");
        console.log("cQ:"+currentQuestion);
        console.log("hM:"+howManyQuestions);
        if(currentQuestion<=howManyQuestions){
            $('#correctAnswerSecond').css('display','none');
            $('#correctAnswerSecond').css('visibility','visible').hide().fadeOut('slow');
            updateQuestion(++currentQuestion);
        }
    }, 3000);
}

function updateDatabaseQuestion(){
    var sessionsRef = ref.child('sessions').child(sessionCode).child('playairs').child(hostKey);
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

function updateQuestion(number){
    // update score history, adding the score for the current question
    if(currentQuestion>1){
        var currentQuestionRef = questionScoresRef.child(playair);
        currentQuestionRef.once("value", function(snapshot) {
            var objToWrite=new Object();
            objToWrite[currentQuestion-1]=score;
            currentQuestionRef.update(objToWrite,function(error) {
                if (error) {
                    console.log("Data could not be saved." + error);
                } else {
                    console.log("Data saved successfully.");
                    if(currentQuestion==howManyQuestions+1){
                        startFinalResults();
                        questionScoresRef.on("child_changed", function(snapshot) {
                            console.log("CHILD CHANGED!!");
                            console.log(snapshot.val());
                            startFinalResults();
                        });
                    }
                }
            });
        });
    }
    totalScoresRef.once("value", function(snapshot) {
        var objToWrite=new Object();
        objToWrite[playair]=score;
        totalScoresRef.update(objToWrite,function(error) {
            if (error) {
                console.log("Data could not be saved." + error);
            } else {
                console.log("Data saved successfully.");
            }
        });
    });
    questionsRef.child(currentQuestion).on("child_added", function(question) {
        console.log(question.key());
        console.log(question.val());
        var answers=question.val();
        correctAnswer=answers[0];
        correctAnswerText=answers[correctAnswer];
        document.getElementById('gameContainer').innerHTML='<div class="row" id="gameZone" style="visibility:hidden"> <div class="col-lg-12"> <div class="intro-text"> <div class="progress" style="visibility:hidden"> <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"> <span class="sr-only">0% Complete</span> </div> </div> <span class="name">'+question.key()+'</span> <hr class="question"> <span class="skills" id="options" style="visibility:hidden"> <a class="btn btn-lg btn-outline" onclick="updateScore(1);"> '+answers[1]+' </a> <a class="btn btn-lg btn-outline" onclick="updateScore(2);"> '+answers[2]+' </a> <br> <a class="btn btn-lg btn-outline" onclick="updateScore(3);"> '+answers[3]+' </a> <a class="btn btn-lg btn-outline" onclick="updateScore(4);"> '+answers[4]+' </a> </span> </div> </div> <div id="correctAnswerDiv" style="position:absolute; bottom:18vh; left:0; right:0; font-size:3vh"> <div id="correctAnswerFirst" style="visibility:hidden; display:none"> <i id="correctAnswerIcon" class="fa fa-times fa-4x" aria-hidden="true"></i> </div> <div id="correctAnswerSecond" style="visibility:hidden; display:none"> ANSWER:<br> <a class="btn btn-lg btn-outline"> <span id="correctAnswerText">text</span> </a> </div> </div> </div>';
        //if(host){
            $('header').append('<div style="position:absolute; bottom:0; left:0; right:0; font-size:2.5vh"> <div class="row" id="nextButtonDiv"> <div class="col-lg-12"> <div id="nextButton" style="display:none"> <a class="btn btn-lg btn-outline" style="font-size:5vh" onclick="updateDatabaseQuestion()"> <i class="fa fa-arrow-circle-right"></i> next </a> </div> </div> </div> Session Code: <span id="sessionCode">'+sessionCode+'</span> </div>');
        //}
        /*else{
            $('header').append('<div style="position:absolute; bottom:0; left:0; right:0; font-size:2.5vh"> <div class="row" id="nextButtonDiv"> <div class="col-lg-12"> </div> </div> Session Code: <span id="sessionCode">'+code+'</span> </div>');
        }*/
        $('#gameZone').css('visibility','visible').hide().fadeIn('slow');
        setTimeout("startQuestion()",2000);
    });
};

function updateScore(choice){
    document.getElementById('options').innerHTML='<p style="position:absolute; top:30vh; left:0; right:0; font-size:5vh;"> waiting for other playairs...</p>';
    $('#options').css('visibility','visible').hide().fadeIn('slow');
    if(choice==correctAnswer){
        score+=500;
        console.log("s:"+score);
        answerWasCorrect=true;
    }else{
        answerWasCorrect=false;
    }
    checkHost();
};

function checkHost(){
    if(host){
        $('#nextButton').css("display","block");
    }
}

function startQuestion(){
    $('.progress').css('visibility','visible').hide().fadeIn('slow');
    $('#options').css('visibility','visible').hide().fadeIn('slow');
    var barPercentage = 0;
    progressBar = setInterval(function () {
        barPercentage++;
        if (barPercentage < 101) {
            $('.progress-bar').css('width', barPercentage + '%');
        } else {
            window.clearInterval(progressBar);
        }
    }, 100);
};

function startFinalResults(){
    console.log("startFinalResults()");
    document.getElementById('gameContainer').innerHTML='<div class="row" id="gameZone" style="visibility:hidden"> <div class="col-lg-12"> <div class="intro-text"> <span class="name">WINNER:</span> <h1><span id="winningPlayair" class="label label-warning" style="color:#000; font-size:7vh; text-transform:none">playair</span></h1> </div> <div id="resultsGraph" style="padding-top:50px;"> <div class="ct-chart"></div> <div class="ct-pie"></div> </div> </div> </div>';
    $('#gameZone').css('visibility','visible').hide().fadeIn('slow');
    var dataLabels=[]; 
    var dataSeries=[howManyPlayairs];
    var count=0;
    
    questionScoresRef.on("value",function(snapshot){
        count = snapshot.numChildren();
        console.log("COUNT->"+count);
        
        if(count==howManyPlayairs){
            console.log("TRUE!!");
            totalScoresRef.orderByValue().limitToLast(1).on("child_added", function(snapshot) {
                document.getElementById('winningPlayair').innerHTML=snapshot.key();
            });
            var legendNames=[howManyPlayairs];
            var counting = 1;
            totalScoresRef.orderByValue().on("child_added", function(snapshot) {
                var playairNickname = snapshot.key();
                console.log("ORDEEER: ");
                console.log(snapshot.key());
                console.log("______");
                legendNames[howManyPlayairs-counting]=playairNickname;
                
                questionScoresRef.child(playairNickname).on("value",function(snapshot){
                    var scores = snapshot.val();
                    var arrToAdd=[0];
                    for(i=1; i<scores.length; i++){
                        console.log("run");
                        arrToAdd.push(scores[i]);
                    }
                    dataSeries[howManyPlayairs-counting] = arrToAdd;
                });
                counting++;
            });
            console.log("FINAL LEGEND:");
            console.log(legendNames);
            for(i=0; i<howManyQuestions+1; i++){
                dataLabels.push(i);
            }
            console.log(dataLabels);
            console.log(dataSeries);
            lineChart= new Chartist.Line('.ct-chart', {
                // ["preg1","preg2","preg3"]
                labels: dataLabels,
                //[ [500,1500,1500],[1000,1500,3000],[0,2000,3500],[300,600,900] ]
                series: dataSeries
            },{
                //showPoint: false,
                width: "80vw",
                height: "30vh",
                low:0,
                plugins: [
                    Chartist.plugins.legend({
                        legendNames: legendNames,
                        //clickable: false
                    })
                ]
            });
            animateLineGraph(); // from chartistAnimation.js
        }
    });
}