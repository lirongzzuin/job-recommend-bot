const puppeteer = require("puppeteer");

/**
 * 프로그래머스 채용 공고 수집 함수
 * @param {string} keyword - 검색 키워드 (예: "백엔드")
 * @param {number} limit - 최대 공고 수
 * @returns {Promise<Array<{ title: string, company: string, link: string, description: string }>>}
 */
async function fetchProgrammersJobs(keyword = "백엔드", limit = 5) {
  const url = `https://career.programmers.co.kr/job?tags=${encodeURIComponent(keyword)}`;
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });
    await page.waitForSelector(".position-item"); // 기존 .list-position에서 수정
    await new Promise((res) => setTimeout(res, 2000)); // ensure JS-rendered content loads

    const jobs = await page.evaluate((limit) => {
      const jobCards = Array.from(document.querySelectorAll(".position-item")).slice(0, limit);
      return jobCards
        .map((card) => {
          const title = card.querySelector(".position-title")?.innerText.trim() || "";
          const company = card.querySelector(".company-name")?.innerText.trim() || "";
          const link = "https://career.programmers.co.kr" + (card.querySelector("a")?.getAttribute("href") || "#");
          const description = card.querySelector(".position-desc")?.innerText.trim() || "";

          const isSenior = /시니어|수석|10년 이상/.test(title + description);
          if (isSenior) return null;

          return { title, company, link, description };
        })
        .filter(Boolean);
    }, limit);

    return jobs;
  } catch (err) {
    console.error("프로그래머스 크롤링 실패:", err.message);
    return [];
  } finally {
    await browser.close();
  }
}

module.exports = { fetchProgrammersJobs };
