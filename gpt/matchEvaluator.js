const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");
require("dotenv").config();

/**
 * GPT 기반 채용공고 적합도 평가 모듈
 * 사용자 프로필과 채용공고를 비교하여 점수와 사유를 GPT로부터 받아옴
 */

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * 사용자 프로필 + 채용공고 내용을 기반으로 GPT가 적합도 분석
 * @param {string} jobDescription - 채용공고 전체 텍스트
 * @returns {Promise<{score: number, reason: string}>}
 */
async function evaluateJobMatch(jobDescription) {
  const profilePath = path.join(__dirname, "../data/userProfile.json");
  const userProfile = JSON.parse(fs.readFileSync(profilePath, "utf-8"));

  const prompt = `
다음은 한 개발자의 정보입니다:

[개발자 정보]
- 경력: ${userProfile.experience}
- 현재 업무: ${userProfile.currentWork.description}
- 사용 기술 스택: ${userProfile.techStack.join(", ")}
- 진행한 주요 프로젝트:
${userProfile.projects.map(p => `  • ${p.name}: ${p.summary}`).join("\n")}
- 선호 포지션: ${userProfile.preferredRoles.join(", ")}
- 선호 근무지: ${userProfile.preferredLocations.join(", ")}
- 희망 연봉: ${userProfile.salaryExpectation.min} ${userProfile.salaryExpectation.currency} (${userProfile.salaryExpectation.type})
- 커리어 목표: ${userProfile.goals.join(" / ")}

[채용 공고]
${jobDescription}

위 채용공고가 개발자에게 얼마나 적합한지 100점 만점 기준으로 평가해줘.
아래 형식으로 JSON으로만 응답해줘:
{ "score": 정수, "reason": "이유 설명" }
`;

  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });

  try {
    const jsonText = res.choices[0].message.content.trim();
    return JSON.parse(jsonText);
  } catch (e) {
    console.error("❗ GPT 응답 파싱 실패. 응답 내용을 확인하세요.");
    console.error("응답 원문:", res.choices[0].message.content);
    throw new Error("GPT 응답을 JSON으로 파싱할 수 없습니다. 응답 형식을 다시 확인해주세요.");
  }
}

module.exports = { evaluateJobMatch };