# GPT 기반 채용공고 추천 Slack 봇

이 프로젝트는 OpenAI의 GPT API를 활용하여 사용자의 기술 스택, 경력, 프로젝트 정보를 기반으로 채용공고와의 적합도를 분석하고, 그 중 점수가 높은 공고를 Slack으로 자동 전송하는 시스템입니다.  
Node.js를 기반으로 하며, `.env` 설정을 통해 OpenAI API Key 및 Slack Webhook URL을 환경변수로 관리합니다.

---

## 📁 프로젝트 구조

```
job-recommend-bot/
├── data/
│   └── userProfile.json         # 사용자 정보 정의(JSON)
├── gpt/
│   └── matchEvaluator.js        # GPT API를 이용한 채용공고 적합도 평가
├── notify/
│   └── slackNotifier.js         # Slack Webhook을 통해 메시지 전송
├── jobs/
│   └── wanted.js                # 채용공고 수집 (크롤링 또는 API 요청)
├── .env                         # GPT/Slack 환경 변수 저장
├── .gitignore                   # 민감 파일 무시 설정
├── main.js                      # 전체 실행 흐름 컨트롤러
└── package.json                 # 프로젝트 메타 정보 및 의존성
```

---

## ⚙️ 동작 방식

1. `data/userProfile.json`에 사용자의 정보(기술 스택, 경력, 프로젝트, 선호 조건 등)를 저장합니다.
2. `jobs/wanted.js`에서 채용공고를 수집하고 텍스트 형태로 정리합니다.
3. 수집된 공고는 `gpt/matchEvaluator.js`로 전달되어, GPT를 통해 사용자와의 적합도를 분석합니다.
4. 분석 결과가 일정 기준 점수 이상이면 `notify/slackNotifier.js`를 통해 Slack 채널로 전송합니다.
5. 전체 흐름은 `main.js`에서 순차적으로 제어됩니다.

---

## 🔄 실행 흐름 요약

1. `.env` 파일에 필요한 키를 설정합니다.
2. `npm install`을 통해 의존 패키지를 설치합니다.
3. `node main.js` 실행 시 전체 파이프라인이 동작하며 Slack으로 결과가 전송됩니다.

---

## 📝 환경 변수 설정 (.env)

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxxxxxxxxxxxxx
```

※ `.env`는 `.gitignore`에 포함되어 있어야 하며 GitHub에 업로드되지 않도록 주의합니다.

---

## 📌 주요 기능

- 사용자 프로필 기반 채용공고 적합도 평가
- OpenAI GPT API를 활용한 분석 기반 매칭
- 적합도 점수화 및 필터링
- Slack Webhook을 이용한 자동 알림 기능
- 구조화된 모듈 기반 설계로 유지보수 용이

---

## 🧰 사용 기술 스택

- Node.js
- OpenAI GPT API (`openai` npm 패키지)
- Slack Webhook
- dotenv
- axios

---

## 🔧 향후 개선 방향

- 다양한 채용 플랫폼에 대한 수집기 추가 (로켓펀치, 사람인 등)
- 사용자 선호도 기반 가중치 설정 기능 추가
- GPT 응답 템플릿 개선 및 요약 정보 강화
- 분석 결과 저장용 데이터베이스 도입 (예: MongoDB)
- 주기적 실행을 위한 스케줄링 기능 추가 (node-cron 또는 GitHub Actions)

---

## 📎 시작하기

```bash
git clone https://github.com/lirongzzuin/job-recommend-bot.git
cd job-recommend-bot
npm install
touch .env  # OPENAI_API_KEY, SLACK_WEBHOOK_URL 입력
node main.js
```