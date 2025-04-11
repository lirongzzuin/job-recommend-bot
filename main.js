const { evaluateJobMatch } = require("./gpt/matchEvaluator");
const { sendSlackMessage } = require("./notify/slackNotifier");
const { fetchWantedJobs } = require("./jobs/wanted");
const { fetchRocketJobs } = require("./jobs/rocketpunch");
const { fetchProgrammersJobs } = require("./jobs/programmers");
require("dotenv").config();

async function main() {
  try {
    const wantedJobs = await fetchWantedJobs("백엔드", 50);
    console.log("🟢 원티드 크롤링 결과:", wantedJobs);

    const rocketJobs = await fetchRocketJobs("백엔드", 50);
    console.log("🟢 로켓펀치 크롤링 결과:", rocketJobs);

    const programmersJobs = await fetchProgrammersJobs("백엔드", 50);
    console.log("🟢 프로그래머스 크롤링 결과:", programmersJobs);
    
    const jobs = [...wantedJobs, ...rocketJobs, ...programmersJobs];

    console.log(`📦 원티드 공고: ${wantedJobs.length}개, 로켓펀치 공고: ${rocketJobs.length}개, 프로그래머스 공고: ${programmersJobs.length}개`);
    console.log(`📊 총 분석 대상 공고 수: ${jobs.length}`);

    if (jobs.length === 0) {
      console.log("⚠️ 플랫폼 모두에서 채용공고를 가져오지 못했습니다.");
      return;
    }

    for (const job of jobs) {
      console.log(`\n🔍 [${job.title}] 공고 분석 시작...`);
      const jobText = `
회사명: ${job.company}
포지션: ${job.title}
설명: ${job.description}
링크: ${job.link}
      `;

      const result = await evaluateJobMatch(jobText);

      if (!result || typeof result.score !== "number" || !result.reason) {
        console.log("⚠️ GPT 응답 형식이 잘못되었거나 누락된 필드가 있습니다. 응답:", result);
        continue;
      }

      console.log("🧠 GPT 응답 원문:", result);
      console.log(`\n=== [${job.title}] GPT 적합도 분석 결과 ===`);
      console.log(`점수: ${result.score}`);
      console.log(`이유: ${result.reason}`);

      if (result.score >= 85) {
        const slackMessage = `🔥 GPT 채용공고 추천\n🏢 회사: ${job.company}\n💼 포지션: ${job.title}\n✅ 점수: ${result.score}점\n📌 사유: ${result.reason}\n🔗 공고 링크: ${job.link}`;
        await sendSlackMessage(slackMessage);
      } else {
        console.log("ℹ️ 점수가 기준 미만이므로 Slack 전송 생략");
      }
    }
  } catch (err) {
    console.error("분석 중 오류 발생:", err.message);
  }
}

main();
