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

function startSession(nickname){
    console.log(nickname);
    document.getElementById('gameZone').innerHTML=nickname;
    document.getElementById('gameContainer').style.paddingTop="165px";
    document.getElementById('portfolio').style.display="none";
    document.getElementById('about').style.display="none";
    document.getElementById('footer').style.display="none";
}