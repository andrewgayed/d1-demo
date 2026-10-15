// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"

// import tileUrl from "./assets/tile.svg?no-inline"; <---- commented out to satisfy the linter, since this is not used in the code

const heading = document.createElement("h1");
heading.textContent = "D1 project";

// variables
let score: number = 0;
let growthRate: number = 0; // how much the score increases per click
let lastUpdateTime: number | null = null; // timestamp of the last update
let clickpower: number = 1; // how much the score increases per click

const workerBaseCosts: number[] = [10, 100, 3000, 10000, 25000]; // array to hold the base costs of each worker
const workerGrowthRates: number[] = [1, 25, 1000, 5000, 15000]; // array to hold the growth rates of each worker
const workerLevels: number[] = [0, 0, 0, 0, 0]; // array to hold the levels of each worker

const displayedScore: number = -1; // how much the score increases per click
const displayedrevS: number = -1; // how much the score increases per click
const spacingX = 36; // horizontal gap between buttons
const intX = 240;

// create the main button
const button = document.getElementById("mainButton");
button?.addEventListener("click", () => {
  console.log("Button clicked!");
  incrementCounter(clickpower);
  displayNumbers(score, intX + 90, spacingX, 60, "score-digit", displayedScore);
});

// create an upgrade button
const upgradeButton = document.getElementById("upgradeClicker");
upgradeButton?.addEventListener("click", () => {
  const upgradeCost = Math.ceil(Math.pow(4, clickpower)); // cost increases with each level
  if (score >= upgradeCost) {
    console.log("Upgrade button clicked!");
    console.log(`Upgrade cost: ${upgradeCost}`);
    console.log(`Current score: ${clickpower}`);
    incrementClickPower(1); // increase click power by 1
    incrementCounter(-upgradeCost); // deduct the cost from the score
    displayNumbers(
      score,
      intX,
      spacingX,
      60,
      "score-digit",
      displayedScore,
    );
    displayNumbers(
      growthRate,
      intX,
      spacingX,
      750,
      "revS-digit",
      displayedrevS,
    );
  } else {
    console.log("Not enough score to upgrade!");
  }
});

// create an upgrade button for the first worker/passive income generator
for (let i = 0; i < 5; i++) {
  const purchaseWorkerButton = document.getElementById(`upgradeWorker${i + 1}`);
  purchaseWorkerButton?.addEventListener("click", () => {
    const upgradeCost = Math.ceil(
      workerBaseCosts[i] * Math.pow(1.2, workerLevels[i]),
    );
    // cost increases with each level by 20%
    if (score >= upgradeCost) {
      console.log("Upgrade button clicked!");
      incrementGrowthRate(workerGrowthRates[i]); // increase growth rate by the worker's base growth rate
      incrementCounter(-upgradeCost); // deduct the cost from the score
      displayNumbers(
        score,
        intX + 90,
        spacingX,
        60,
        "score-digit",
        displayedScore,
      );
      displayNumbers(
        growthRate,
        intX + 90,
        spacingX,
        750,
        "revS-digit",
        displayedrevS,
      );
      incrementWorkerLevel(i); // increase the clicker level
      displayWorkerInfo();
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
  workerLevels[workerIndex] += 1;
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

    displayedNum = whole;
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

for (let i = 0; i < 5; i++) {
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

  displayNumbers(score, intX, spacingX, 60, "score-digit", displayedScore);
  displayNumbers(
    growthRate,
    intX,
    spacingX,
    750,
    "revS-digit",
    displayedrevS,
  );

  displayWorkerInfo();
  displayClickerPowerAndCost();

  requestAnimationFrame(frame);
}

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

function displayWorkerInfo() {
  for (let i = 0; i < 5; i++) {
    displayNumbers(
      workerLevels[i],
      intX,
      spacingX,
      250 + i * 100,
      `worker${i + 1}-level-digit`,
    );

    displayNumbers(
      Math.ceil(workerBaseCosts[i] * Math.pow(1.2, workerLevels[i])),
      intX + 260,
      spacingX,
      250 + i * 100,
      `worker${i + 1}-cost-digit`,
    );

    displayNumbers(
      workerGrowthRates[i],
      intX - 200,
      spacingX,
      250 + i * 100,
      `worker${i + 1}-growth-digit`,
    );
  }
}

displayNumbers(score, intX, spacingX, 60, "score-digit", displayedScore);
displayNumbers(
  growthRate,
  intX,
  spacingX,
  750,
  "revS-digit",
  displayedrevS,
);

requestAnimationFrame(frame);
