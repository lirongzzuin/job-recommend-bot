const axios = require("axios");
require("dotenv").config();

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

/**
 * 슬랙 메시지를 전송하는 함수
 * @param {string} message - 전송할 메시지 내용
 */
async function sendSlackMessage(message) {
  if (!SLACK_WEBHOOK_URL) {
    console.error("❗ SLACK_WEBHOOK_URL이 설정되어 있지 않습니다.");
    return;
  }

  try {
    await axios.post(SLACK_WEBHOOK_URL, {
      text: message,
    });
    console.log("✅ Slack 메시지 전송 완료");
  } catch (error) {
    console.error("❌ Slack 메시지 전송 실패:", error.message);
  }
}

module.exports = { sendSlackMessage };
