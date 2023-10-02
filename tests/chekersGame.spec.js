// @ts-check
const { test, expect } = require("@playwright/test");

test("Checkers game", async ({ page }) => {
  await page.goto("https://www.gamesforthebrain.com/game/checkers/");
 
  const header = await page.locator(".page h1").textContent();

  
  const values = ["02", "22", "42", "62"];
  let previousRandomX = null;

  //
  async function getRandomUniqueValue() {
    let randomX;

    do {
      randomX = values[Math.floor(Math.random() * values.length)];
    } while (randomX === previousRandomX);

    previousRandomX = randomX;
    return randomX;
  }
  const randomX = await getRandomUniqueValue();
  const orangeSelector = await page.locator(`[name='space${randomX}']`);

  // moves left
  async function leftMove(orangeSelector, orangeLanding) {
    const newLocation = parseFloat(orangeLanding) + 11;
    const leftLocator = await page.locator(`[name='space${newLocation}']`);
    await orangeSelector.click();
    await leftLocator.click();
  }

  // moves right
  async function rightMove(orangeSelector, orangeLanding) {
    const newLocation = parseFloat(orangeLanding) - 9;
    const rightLocator = await page.locator(`[name='space${newLocation}']`);

    await orangeSelector.click();

    await rightLocator.click();
  }
  //
  function moveRandomDirection(randomX, value) {
    const randomValue = Math.round(Math.random());

    if (randomX === value) {
      return leftMove(orangeSelector, value);
    } else {
      if (randomValue === 1) {
        return leftMove(orangeSelector, value);
      } else {
        return rightMove(orangeSelector, value);
      }
    }
  }

  //
  await moveRandomDirection(randomX, "02");

  const message = await page.locator("#message").textContent();
  if (message === "Make a move.") {
  }


  await expect(page).toHaveTitle("Checkers - Games for the Brain");
  await expect(header).toEqual("Checkers");

});




