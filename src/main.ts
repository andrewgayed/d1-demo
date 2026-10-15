// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"

const heading = document.createElement("h1");
heading.textContent = "D1 project";

// variables
let score: number = 0;
let growthRate: number = 0; // how much the score increases per click
let lastUpdateTime: number | null = null; // timestamp of the last update
let clickpower: number = 1; // how much the score increases per click

interface WorkerConfig {
  id: string;
  baseCost: number;
  growthRate: number;
  level: number;
}

const workers: WorkerConfig[] = [
  { id: "upgradeWorker1", baseCost: 10, growthRate: 1, level: 0 },
  { id: "upgradeWorker2", baseCost: 100, growthRate: 25, level: 0 },
  { id: "upgradeWorker3", baseCost: 3000, growthRate: 1000, level: 0 },
  { id: "upgradeWorker4", baseCost: 10000, growthRate: 5000, level: 0 },
  { id: "upgradeWorker5", baseCost: 25000, growthRate: 15000, level: 0 },
];

const displayedScore: number = -1; // how much the score increases per click
const displayedrevS: number = -1; // how much the score increases per click
const spacingX = 36; // horizontal gap between buttons
const intX = 240;

// create the main button
const button = document.getElementById("mainButton");
button?.addEventListener("click", () => {
  console.log("Button clicked!");
  incrementCounter(clickpower);
  displayDynamicInfo();
});

//change the brightness of the mainbutton to 0.75 when hovered over, and reset it to 1 when the mouse moves away
button?.addEventListener("mouseover", () => {
  button.style = "filter: brightness(0.75)";
});
button?.addEventListener("mouseleave", () => {
  button.style = "filter: brightness(1)";
});

// create an upgrade button
const upgradeButton = document.getElementById("upgradeClicker");
upgradeButton?.addEventListener("click", () => {
  const upgradeCost = Math.ceil(Math.pow(4, clickpower)); // cost increases with each level
  if (score >= upgradeCost) {
    console.log("Upgrade button clicked!");
    incrementClickPower(1); // increase click power by 1
    incrementCounter(-upgradeCost); // deduct the cost from the score
    displayDynamicInfo();
  } else {
    console.log("Not enough score to upgrade!");
  }
});

// create an upgrade button for the first worker/passive income generator
for (let i = 0; i < workers.length; i++) {
  const purchaseWorkerButton = document.getElementById(`upgradeWorker${i + 1}`);
  purchaseWorkerButton?.addEventListener("click", () => {
    const upgradeCost = Math.ceil(
      workers[i].baseCost * Math.pow(1.2, workers[i].level),
    );
    // cost increases with each level by 20%
    if (score >= upgradeCost) {
      console.log("Upgrade button clicked!");
      incrementGrowthRate(workers[i].growthRate); // increase growth rate by the worker's base growth rate
      incrementCounter(-upgradeCost); // deduct the cost from the score
      displayDynamicInfo();
      incrementWorkerLevel(i); // increase the clicker level
      displayWorkerInfo(); // update the display of the worker info
    } else {
      console.log("Not enough score to upgrade!");
    }
  });
}

// array to hold the image URLs for the numbers 0-9
const numImgCol: string[] = [];
for (let i = 0; i < 10; i++) {
  numImgCol.push(`/images/button${i}.png`);
}

// create the plus signs for the growth rate display
for (let i = 0; i < workers.length; i++) {
  const plusImg = document.createElement("img");
  plusImg.src = `/images/plus.png`;
  plusImg.alt = "Plus";
  plusImg.className = `plus${i + 1}`;
  // plusImg.style.filter = "invert(1)";
  plusImg.style.position = "absolute";
  plusImg.style.left = `${intX - 235}px`; // right of the cost
  plusImg.style.top = `${250 + (i * 100)}px`;
  plusImg.style.width = "40px";
  document.body.appendChild(plusImg);
}

// start the animation loop
requestAnimationFrame(frame);

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

function incrementWorkerLevel(workerIndex: number) {
  workers[workerIndex].level += 1;
}

// converts the score to a string and displays each digit as an image

function displayNumbers(
  num: number, // the number to display
  initX: number, // the initial X coordinate for the first digit
  gapX: number, // the horizontal gap between digits
  initY: number, // the initial Y coordinate for the digits
  groupName: string,
  displayedNum?: number, // whether the number is dynamic or static
) {
  if (displayedNum !== undefined) {
    const whole = Math.floor(num);
    // if the score has not changed since the last display do nothing
    if (whole === displayedNum) {
      return;
    }
  }
  document.querySelectorAll(`.${groupName}`).forEach((el) => el.remove());
  // parse the score into individual digits and display each digit as an image
  const strNum: string = num.toString();

  for (let index = 0; index < strNum.length; index++) {
    const digitChar = strNum[index];
    const digitNum = parseInt(digitChar, 10);

    // properties for img
    const img = document.createElement("img");
    img.src = numImgCol[digitNum];
    img.alt = `Digit ${digitChar}`;
    img.className = groupName;
    img.style.filter = "invert(1)";

    img.style.position = "absolute";
    img.style.left = `${initX + (index * gapX)}px`;
    img.style.top = `${initY}px`;
    img.style.width = "40px";

    document.body.appendChild(img);
  }
}

// display current click power and upgrade code
function displayClickerPowerAndCost() {
  displayNumbers(
    clickpower,
    intX,
    spacingX,
    150,
    "clicker-power-digit",
  );
  const upgradeCost = Math.ceil(Math.pow(4, clickpower));
  displayNumbers(
    upgradeCost,
    intX + 260,
    spacingX,
    150,
    "clicker-cost-digit",
  );
}

// display revenue and revenue/s
function displayDynamicInfo() {
  displayNumbers(score, intX, spacingX, 60, "score-digit", displayedScore);
  displayNumbers(
    growthRate,
    intX,
    spacingX,
    750,
    "revS-digit",
    displayedrevS,
  );
}

// display worker growth increase, level and upgrade cost
function displayWorkerInfo() {
  for (let i = 0; i < workers.length; i++) {
    displayNumbers(
      workers[i].level,
      intX,
      spacingX,
      250 + i * 100,
      `worker${i + 1}-level-digit`,
    );
    displayNumbers(
      Math.ceil(workers[i].baseCost * Math.pow(1.2, workers[i].level)),
      intX + 260,
      spacingX,
      250 + i * 100,
      `worker${i + 1}-cost-digit`,
    );
    displayNumbers(
      workers[i].growthRate,
      intX - 200,
      spacingX,
      250 + i * 100,
      `worker${i + 1}-growth-digit`,
    );
  }
}

// increases the score by a specified amount at regular intervals
const tickLength = 1;
let tickTimer = 0;

function frame(timestamp: number) {
  if (lastUpdateTime !== null) {
    const dt = Math.min((timestamp - lastUpdateTime) / 1000, 1 / 15); // limit dt to 1/15th of a second
    tickTimer += dt;
    while (tickTimer >= tickLength) {
      incrementCounter(growthRate); // the whole amount, once per tick
      tickTimer -= tickLength;
    }
  }

  lastUpdateTime = timestamp;

  displayWorkerInfo();
  displayClickerPowerAndCost();
  displayDynamicInfo();
  requestAnimationFrame(frame);
}
