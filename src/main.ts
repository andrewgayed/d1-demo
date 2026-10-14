// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/tile.svg?no-inline";

const heading = document.createElement("h1");
heading.textContent = "D1 project";

const button = document.getElementById("mainButton");

button?.addEventListener("click", () => {
  console.log("Button clicked!");
});
