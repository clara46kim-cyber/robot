# 로봇의 몸을 눌러 푸는 온라인 활동지

## 실행 방법

```bash
npm install
npm run dev
```

## Vercel 배포 설정

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Root Directory: 비워두기

## 문제 수정

`src/questions.js` 파일에서 문제, 보기, 정답, 설명을 수정하면 됩니다.

- 객관식 정답은 보기의 순서대로 0, 1, 2, 3으로 입력합니다.
- OX 묶음 문제는 `true`가 O, `false`가 X입니다.
