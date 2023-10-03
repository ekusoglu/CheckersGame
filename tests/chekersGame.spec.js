// @ts-check
const { test, expect } = require("@playwright/test");

test("Checkers game", async ({ page }) => {
  await page.goto("https://www.gamesforthebrain.com/game/checkers/");
  await page.waitForSelector("#message");

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

//
// Test...
//
test("Checkers Game", async ({ page }) => {
  // Test data
  const actualMessage = "Select an orange piece to move.";
  const moves = [
    { from: "space62", to: "space53" },
    { from: "space51", to: "space62" },
    { from: "space53", to: "space44" },
    { from: "space62", to: "space44" },
    { from: "space42", to: "space53" },
  ];
  
  await page.goto("https://www.gamesforthebrain.com/game/checkers/");
  const message = await page.locator("#message").textContent();
  const header = await page.locator(".page h1").textContent();

  async function clickAndVerifyMove(from, to) {
    await page.locator(`[name='${from}']`).click();
    await page.locator(`[name='${to}']`).click();
    await page.waitForTimeout(2000);
    const move = await page.locator("#message").textContent();
    await expect(move).toEqual("Make a move.");
  }

  
  for (const move of moves) {
    await clickAndVerifyMove(move.from, move.to);
  }

  const blueChip = await page.locator(`[src='me1.gif']`).count();

  await page.locator('a:has-text("Restart...")').click();
  await page.waitForTimeout(1500);
  const messageRestart = await page.locator("#message").textContent();

  await expect(page).toHaveTitle("Checkers - Games for the Brain");
  await expect(header).toEqual("Checkers");
  await expect(message).toEqual(actualMessage);
  await expect(blueChip).toBeLessThan(12);
  await expect(messageRestart).toEqual(actualMessage);
});
