// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser 
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");
  let timestamps = await page.$$eval('.age', elements => elements.map(el => el.getAttribute("title")));

  while (timestamps.length < 100){
    
    const moreButton = await page.$('a.morelink');
    if(moreButton){
      await moreButton.click();
      await page.waitForTimeout(2000);
    } else {
      console.log("No Button here!");
      break;
    }

    const newTimestamps = await page.$$eval('.age', elements => elements.map(el => el.getAttribute("title")));
    if(newTimestamps.length === 0){
      break;
    }else {
      //add to the old timestamp, the new timestamp
      timestamps = [...timestamps, ...newTimestamps].slice(0, 100);
    }

  }
  
  const dates = timestamps.map(time => new Date(time));
  let isSorted = true;
  for(let i = 0; i < dates.length; i++){
    if(dates[i] < dates[i + 1]){
      isSorted = false;
      break;
    }
  }

  //Output results
  if (isSorted) {
    console.log('Articles are correctly sorted from newest to oldest');
  } else {
    console.error('Articles are not sorted from newest to oldest');
  }

  await browser.close();

}

(async () => {
  await sortHackerNewsArticles();
})();
