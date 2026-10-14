// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"

// import tileUrl from "./assets/tile.svg?no-inline"; <---- commented out to satisfy the linter, since this is not used in the code

const heading = document.createElement("h1");
heading.textContent = "D1 project";

// variables
let score: number = 0;
let displayedScore: number = -1; // how much the score increases per click
let growthRate: number = 0; // how much the score increases per click
let lastUpdateTime: number | null = null; // timestamp of the last update
let clickpower: number = 1; // how much the score increases per click

let clickerLvl: number = 1; // current level of the clicker
let worker1Lvl: number = 0; // current level of the first worker

const startX = 140; // starting X coordinate of the grid
const spacingX = 36; // horizontal gap between buttons

// create the main button
const button = document.getElementById("mainButton");
button?.addEventListener("click", () => {
  console.log("Button clicked!");
  incrementCounter(clickpower);
  displayScoreNumbers();
});

// create an upgrade button
const upgradeButton = document.getElementById("upgradeClicker");
upgradeButton?.addEventListener("click", () => {
  const upgradeCost = Math.ceil(Math.pow(4, clickerLvl)); // cost increases with each level
  if (score >= upgradeCost) {
    console.log("Upgrade button clicked!");
    incrementClickPower(1); // increase click power by 1
    incrementCounter(-upgradeCost); // deduct the cost from the score
    clickerLvl++; // increase the clicker level
    displayScoreNumbers();
  } else {
    console.log("Not enough score to upgrade!");
  }
});

// create an upgrade button for the first worker/passive income generator
const purchaseWorkerButton = document.getElementById("upgradeWorker1");
purchaseWorkerButton?.addEventListener("click", () => {
  const upgradeCost = 10 * Math.ceil(Math.pow(1.2, worker1Lvl)); // cost increases with each level by 20%
  if (score >= upgradeCost) {
    console.log("Upgrade button clicked!");
    incrementGrowthRate(1); // increase growth rate by 1
    incrementCounter(-upgradeCost); // deduct the cost from the score
    worker1Lvl++; // increase the clicker level
    displayScoreNumbers();
  } else {
    console.log("Not enough score to upgrade!");
  }
});

type NewUpgrade = {
  name: string;
  icon: string;
  description: string;
  baseCost: number;
  growthAmount: number;
  owned: number;
  button?: HTMLButtonElement;
};

const newUpgrades: NewUpgrade[] = [
  {
    name: "Auto Generator",
    icon: "⚡",
    description: "+1 point per second",
    baseCost: 20,
    growthAmount: 1,
    owned: 0,
  },
  {
    name: "Power Factory",
    icon: "🏭",
    description: "+5 points per second",
    baseCost: 100,
    growthAmount: 5,
    owned: 0,
  },
];

function getNewUpgradeCost(upgrade: NewUpgrade): number {
  return Math.ceil(upgrade.baseCost * Math.pow(1.5, upgrade.owned));
}

function buyNewUpgrade(upgrade: NewUpgrade): void {
  const cost = getNewUpgradeCost(upgrade);

  if (score < cost) {
    return;
  }

  incrementCounter(-cost);
  incrementGrowthRate(upgrade.growthAmount);
  upgrade.owned++;

  updateUpgradeShop();
  displayScoreNumbers();
}

const upgradeShop = document.createElement("section");
upgradeShop.className = "upgrade-shop";

const shopTitle = document.createElement("h2");
shopTitle.textContent = "Upgrade Shop";
upgradeShop.appendChild(shopTitle);

const productionInfo = document.createElement("p");
upgradeShop.appendChild(productionInfo);

for (const upgrade of newUpgrades) {
  const upgradeButton = document.createElement("button");
  upgradeButton.className = "shop-button";
  upgradeButton.addEventListener("click", () => {
    buyNewUpgrade(upgrade);
  });

  upgrade.button = upgradeButton;
  upgradeShop.appendChild(upgradeButton);
}

document.body.appendChild(upgradeShop);

function updateUpgradeShop(): void {
  productionInfo.textContent = `Production: ${growthRate} points/sec`;

  for (const upgrade of newUpgrades) {
    if (!upgrade.button) {
      continue;
    }

    const cost = getNewUpgradeCost(upgrade);
    const affordable = score >= cost;

    upgrade.button.disabled = !affordable;
    upgrade.button.textContent =
      `${upgrade.icon} ${upgrade.name} | Cost: ${cost} | ` +
      `Owned: ${upgrade.owned} | ${upgrade.description}`;
  }
}

updateUpgradeShop();

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
function displayScoreNumbers() {
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

    // properties for img which are 96 x 96 pixels
    const img = document.createElement("img");
    img.src = numImgCol[digitNum];
    img.alt = `Digit ${digitChar}`;
    img.className = "score-digit";
    img.style.filter = "invert(1)";

    img.style.position = "absolute";
    img.style.left = `${startX + (index * spacingX)}px`;
    img.style.top = `60px`;
    img.style.width = "40px";

    document.body.appendChild(img);
  }
}

function displayNumbers(
  num: number, // the number to display
  initX: number, // the initial X coordinate for the first digit
  gapX: number, // the horizontal gap between digits
  initY: number,
  groupName: string, // the initial Y coordinate for the digits
) {
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
  displayScoreNumbers();
  updateUpgradeShop();

  // display the level
  displayNumbers(clickerLvl, 10, 36, 150, "clicker-level-digit");

  displayNumbers(
    Math.pow(4, clickerLvl),
    320,
    36,
    150,
    "clicker-cost-digit",
  );

  displayNumbers(worker1Lvl, 10, 36, 250, "worker-level-digit");

  displayNumbers(
    Math.ceil(10 * Math.pow(1.2, worker1Lvl)),
    320,
    36,
    250,
    "worker-cost-digit",
  );

  requestAnimationFrame(frame);
}

displayScoreNumbers();
requestAnimationFrame(frame);
