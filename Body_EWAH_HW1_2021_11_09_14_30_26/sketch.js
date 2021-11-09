

//Images:
let catImage;
let dogImage; 
let giraffeImage;
let chosenImagePixels = [];
let choice = -1;

// Video Player
let myVideo;
let bgPixels = [];
let mask = [];
const videoThreshhold = 125;

let canStart = false;
let gameStates = {START: 'START', PLAYING: 'PLAYING', END: 'END'};
let currState = gameStates.START;

let pixelsRevealed = 0;
let winThreshhold = 0;
const winPercentNeeded = 0.9;


// preload() is a p5 function
function preload() {
  catImage = loadImage('./Cat.png');
  dogImage = loadImage('./Dog.png');
  giraffeImage = loadImage('./Giraffe.png');
  
}

function startGame() {
  canStart = true;
  console.log("Starting game");
  myVideo.loadPixels();
  // see documentation above on spread operator
  bgPixels = [...myVideo.pixels];
  myVideo.pixels.forEach((val, i)=>{
    mask.push(0);
  });
  document.getElementById("start").classList.add("hidden");
  currState = gameStates.PLAYING;
}


function setup() {
  // create a p5 canvas at the dimensions of my webcam
  createCanvas(640, 480);
  
  const start = document.getElementById("start");
  
  catImage.loadPixels();
  dogImage.loadPixels();
  giraffeImage.loadPixels();

  //Randomly choose an image 
  choice = Math.floor(random(0,3));
  
  console.log(`${choice}`);
  switch(choice){
    case 0: 
      catImage.loadPixels();
      chosenImagePixels = [...catImage.pixels];
      break;
    case 1: 
      dogImage.loadPixels();
      chosenImagePixels = [...dogImage.pixels];
       break;
    case 2:
      giraffeImage.loadPixels();
      chosenImagePixels = [...giraffeImage.pixels];
      break;
    default: 
      break;
     }
  
  myVideo = createCapture(VIDEO);
  myVideo.size(width, height);
  myVideo.hide();
  
  winThreshhold = Math.floor((chosenImagePixels.length/4) * winPercentNeeded);
  
  //winThreshhold = 10000;
  console.log(`Win threshhold: ${winThreshhold}`);
  console.log(`Video threshhold: ${videoThreshhold}`);
  
  start.onclick = () => {
    startGame();
  }

}

function drawGame(){
  
  myVideo.loadPixels();

  const currentPixels = myVideo.pixels;
  
  // reset the pixelsRevealed each frame
  pixelsRevealed = 0;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      
      const i = (y * width + x) * 4;
      if(mask[i]>0){
        mask[i] -= 1
      }
      
      // for each channel of the image: r, g, b, channels
      const diffR = abs(currentPixels[i + 0] - bgPixels[i + 0]);
      const diffG = abs(currentPixels[i + 1] - bgPixels[i + 1]);
      const diffB = abs(currentPixels[i + 2] - bgPixels[i + 2]);

      const avgDiff = (diffR + diffB + diffG) / 3;
      // if the difference between frames is less than the threshold value
      if (avgDiff >=  videoThreshhold) {
        mask[i] = 100; 
      }
      if(mask[i]>0){
        currentPixels[i + 0] = chosenImagePixels[i + 0];
        currentPixels[i + 1] = chosenImagePixels[i + 1];
        currentPixels[i + 2] = chosenImagePixels[i + 2];
      }
      else{
        currentPixels[i + 0] = 0;
        currentPixels[i + 1] = 0;
        currentPixels[i + 2] = 0;
      }
      if(mask[i] > 0) {
        pixelsRevealed += 1
      }
    }//end of second for
  }//end of first for
  
  console.log(pixelsRevealed);
    if(pixelsRevealed >= winThreshhold){
      console.log("has hit win threshhold");
      currState = gameStates.END;
      myVideo.hide();
    }
  
  
  myVideo.updatePixels();
  push();
  translate(width, 0);
  scale(-1, 1);
  image(myVideo, 0, 0, width, height);
  pop();
  
}

function draw() {
  switch(currState){
    case gameStates.START: 
      background(0,0,0)
      let startText = `Reveal the image before it disappears.\n\nPress Start to begin!`;
      textSize(24);
      fill(255, 255, 255)
      text(startText, 100, 100, 300, 300);
      break;
      case gameStates.PLAYING:
        drawGame();
      break;
      case gameStates.END:
      
      switch(choice){
        case 0:
          push();
          translate(width, 0);
          scale(-1, 1);
          image(catImage, 0, 0, width, height);
          pop(); 
          fill(255, 0, 0)
          break;
        case 1: 
          push();
          translate(width, 0);
          scale(-1, 1);
          image(dogImage, 0, 0, width, height);
          pop();
          fill(0, 255, 255)
          break;
        case 2:
          push();
          translate(width, 0);
          scale(-1, 1);
          image(giraffeImage, 0, 0, width, height)
          pop();
          fill(0, 102, 0)
          break;
        default: 
          break;
         }//end of switch
      let endText = `Congrats! You Did it!`;
        textSize(24);
        text(endText, 0, 20, 300, 300);
    }
  
}

