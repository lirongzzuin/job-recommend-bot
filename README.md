# GPT 기반 채용공고 추천 Slack 봇

이 프로젝트는 OpenAI의 GPT API를 활용하여 사용자의 기술 스택, 경력, 프로젝트 정보를 기반으로 채용공고와의 적합도를 분석하고,  
그 중 점수가 높은 공고를 Slack으로 자동 전송하는 시스템입니다.  
Node.js 기반이며 `.env` 설정을 통해 OpenAI API Key 및 Slack Webhook URL을 환경변수로 관리합니다.

---

## 📁 프로젝트 구조

```
job-recommend-bot/
├── data/
│   └── userProfile.json             # 사용자 정보 정의(JSON)
├── gpt/
│   └── matchEvaluator.js            # GPT API를 이용한 채용공고 적합도 평가
├── notify/
│   └── slackNotifier.js             # Slack Webhook을 통한 메시지 전송
├── jobs/
│   ├── wanted.js                    # 원티드 채용공고 크롤러 (Puppeteer 기반)
│   ├── rocketpunch.js               # 로켓펀치 채용공고 크롤러 (Puppeteer 기반)
│   └── programmers.js               # 프로그래머스 채용공고 크롤러 (Puppeteer 기반)
├── .env                             # GPT/Slack 환경 변수 저장
├── .gitignore
├── main.js                          # 전체 실행 흐름 컨트롤러
└── package.json
```

---

## ⚙️ 동작 방식

1. `userProfile.json`에 기술 스택, 경력, 프로젝트, 선호 조건 등 사용자 정보를 저장합니다.
2. `jobs/` 하위의 크롤러(wanted.js, rocketpunch.js, programmers.js)에서 채용공고를 최대 50건 수집합니다.
3. 공고 제목/내용에 "시니어", "수석", "10년 이상" 등의 키워드를 포함한 고경력 공고는 크롤링 단계에서 제외됩니다.
4. `matchEvaluator.js`에서 각 공고와 사용자 프로필을 GPT에 전달하여 적합도를 분석합니다.
5. 점수가 일정 기준(예: 85점) 이상일 경우 Slack 채널로 알림을 전송합니다.
6. 전체 흐름은 `main.js`에서 순차적으로 제어됩니다.

---

## 🔄 실행 흐름 요약

1. `.env`에 API 키와 Webhook URL을 설정합니다.
2. `npm install`로 의존성 패키지를 설치합니다.
3. `node main.js` 실행 시 모든 플랫폼에서 공고를 수집하고, GPT 분석 후 Slack으로 전송합니다.

---

## 📝 환경 변수 (.env)

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxxxxxxxxxxxxx
```

※ `.env`는 `.gitignore`에 포함되어야 하며 GitHub에 업로드되지 않도록 주의합니다.

---

## 📌 주요 기능

- 사용자 프로필 기반 채용공고 적합도 분석
- GPT 기반 자연어 매칭 및 점수화
- Slack 알림 자동 전송 (조건: 점수 기준 이상)
- 3개 채용 플랫폼 크롤링:
  - 원티드: 렌더링된 링크 기반 수집 + 필터링
  - 로켓펀치: 포지션/회사명 추출 보완 + 필터링
  - 프로그래머스: `.position-item` 기반 크롤링 + 필터링
- 불필요한 시니어급 공고 제외 로직 포함 (정규식 기반 필터링)

---

## 🧰 사용 기술 스택

- Node.js
- OpenAI GPT API (`openai` npm 패키지)
- Slack Webhook
- Puppeteer
- dotenv
- axios

---

## 🔧 향후 개선 방향

- 크롤링된 공고 분석 결과를 DB에 저장하여 중복 알림 방지
- 주기적 실행을 위한 스케줄링 (node-cron or GitHub Actions)
- Slack 메시지 템플릿 사용자 설정화
- GPT 응답 내 요약 정리 및 공고별 핵심 키워드 추출
- 프로필 기반 가중치 점수 설정 기능 (선호 지역, 연봉 등)

---

## 📎 시작하기

```bash
git clone https://github.com/lirongzzuin/job-recommend-bot.git
cd job-recommend-bot
npm install
touch .env  # OPENAI_API_KEY, SLACK_WEBHOOK_URL 입력
node main.js
```