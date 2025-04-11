const puppeteer = require("puppeteer");

/**
 * 원티드 채용공고를 키워드 기반으로 검색하여 수집하는 함수 (Puppeteer 기반)
 * @param {string} keyword - 예: '백엔드', 'Java'
 * @param {number} limit - 최대 수집할 공고 수
 * @returns {Promise<Array<{ title: string, company: string, link: string, description: string }>>}
 */
async function fetchWantedJobs(keyword = "백엔드", limit = 5) {
  const searchUrl = `https://www.wanted.co.kr/search?query=${encodeURIComponent(keyword)}&tab=position`;
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    await page.goto(searchUrl, { waitUntil: "networkidle2" });
    await new Promise((res) => setTimeout(res, 2000)); // wait for JS content to render

    const jobs = await page.evaluate((limit) => {
      const anchors = Array.from(document.querySelectorAll("a")).filter((a) =>
        a.href.includes("/wd/") &&
        a.innerText.includes("백엔드") &&
        !/시니어|수석|10년|10\s+years|10\+/.test(a.innerText)
      );
      const results = [];
      const seenLinks = new Set();

      for (const a of anchors) {
        const lines = a.innerText.split("\n").map(line => line.trim()).filter(Boolean);
        const title = lines[0] || "제목 없음";
        const company = lines[1] || "회사명 없음";
        const link = a.href.startsWith("http") ? a.href : "https://www.wanted.co.kr" + a.getAttribute("href");
        const description = lines.slice(2, 5).join(" ").trim();

        if (!seenLinks.has(link)) {
          seenLinks.add(link);
          results.push({ title, company, link, description });
        }
        
        if (results.length >= limit) break;
      }
      return results;
    }, limit);

    return jobs;
  } catch (err) {
    console.error("원티드 크롤링 실패:", err.message);
    return [];
  } finally {
    await browser.close();
  }
}

module.exports = { fetchWantedJobs };
