const puppeteer = require("puppeteer");

/**
 * 로켓펀치에서 개발자 채용공고를 수집하는 함수
 * @param {string} keyword - 검색어 (예: '백엔드', 'Java')
 * @param {number} limit - 최대 수집 공고 수
 * @returns {Promise<Array<{ title: string, company: string, link: string, description: string }>>}
 */
async function fetchRocketJobs(keyword = "백엔드", limit = 5) {
  const searchUrl = `https://www.rocketpunch.com/jobs?keywords=${encodeURIComponent(keyword)}`;
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    await page.goto(searchUrl, { waitUntil: "networkidle2" });
    await page.waitForSelector("div.job-card");

    const jobs = await page.evaluate((limit) => {
      const cards = Array.from(document.querySelectorAll("div.job-card")).slice(0, limit);
      return cards
        .map(card => {
          const title = card.querySelector("h3.job-title")?.innerText.trim()
            || card.querySelector("a")?.innerText.trim().split("\n")[0]
            || "제목 없음";
          const company = card.querySelector(".company-detail .name")?.innerText.trim()
            || "회사명 없음";
          const link = "https://www.rocketpunch.com" + (card.querySelector("a")?.getAttribute("href") || "#");
          const description = card.querySelector(".job-stat-info")?.innerText.trim()
            || card.querySelector("a")?.innerText.trim().split("\n").slice(1).join(" ")
            || "";

          const combinedText = `${title} ${description}`.toLowerCase();
          const isSenior = /시니어|수석|tech lead|10년|10\s+years|10\+/.test(combinedText);
          const isJuniorSuitable = /주니어|3년|2년|1년/.test(combinedText);
          if (isSenior || !isJuniorSuitable) return null;

          return { title, company, link, description };
        })
        .filter(Boolean);
    }, limit);

    return jobs;
  } catch (err) {
    console.error("로켓펀치 크롤링 실패:", err.message);
    return [];
  } finally {
    await browser.close();
  }
}

module.exports = { fetchRocketJobs };
