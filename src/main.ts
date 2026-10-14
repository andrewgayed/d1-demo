// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
// import tileUrl from "./assets/tile.svg?no-inline";

const heading = document.createElement("h1");
heading.textContent = "D1 project";

// variables
let score: number = 0;
let displayedScore: number = -1; // how much the score increases per click
let growthRate: number = 1; // how much the score increases per click
let progress: number = 0; // remaining fraction between frames
let lastUpdateTime: number | null = null; // timestamp of the last update
let clickpower: number = 1; // how much the score increases per click

const startX = 48; // starting X coordinate of the grid
const spacingX = 36; // horizontal gap between buttons

// create a button
const button = document.getElementById("mainButton");
button?.addEventListener("click", () => {
  console.log("Button clicked!");
  incrementCounter(clickpower);
  displayNumbers();
});

// intialize an array to hold the image URLs for the numbers 0-9
const numImgCol: string[] = [];
for (let i = 0; i < 10; i++) {
  numImgCol.push(`/images/button${i}.png`);
}

// increment the counter
function incrementCounter(increment: number) {
  score += increment;
}

// increment the click power
function incrementClickPower(increment: number) {
  clickpower += increment;
}

// increment the growth rate
function incrementGrowthRate(increment: number) {
  growthRate += increment;
}

// converts the score to a string and displays each digit as an image
function displayNumbers() {
  const whole = Math.floor(score);
  
  // if the score has not changed since the last display do nothing
  if (whole === displayedScore) {
    return;
  }

  displayedScore = whole;

  // remove all existing score digit images
  document.querySelectorAll(".score-digit").forEach((el) => el.remove());

  // parse the score into individual digits and display each digit as an image
  const strScore: string = score.toString();

  for (let index = 0; index < strScore.length; index++) {
    const digitChar = strScore[index];
    const digitNum = parseInt(digitChar, 10);

    // properties for img
    const img = document.createElement("img");
    img.src = numImgCol[digitNum];
    img.alt = `Digit ${digitChar}`;
    img.className = "score-digit";
    img.style.filter = "invert(1)";

    img.style.position = "absolute";
    img.style.left = `${startX + (index * spacingX)}px`;
    img.style.top = `150px`;
    img.style.width = "40px";

    document.body.appendChild(img);
  }
}

// increases the score by a specified amount at regular intervals
function frame(timestamp: number) {
  if (lastUpdateTime !== null) {
    const dt = Math.min((timestamp - lastUpdateTime) / 1000, 1 / 15); // limit dt to 1/15th of a second

    // increases the score by only whole numbers, and keeps the fractional part for the next frame
    progress += dt * growthRate;
    const wholeProgress = Math.floor(progress);
    if (wholeProgress > 0) {
      incrementCounter(wholeProgress);
      progress -= wholeProgress;
    }
  }
  lastUpdateTime = timestamp;
  displayNumbers();
  requestAnimationFrame(frame);
}

displayNumbers();
requestAnimationFrame(frame);
