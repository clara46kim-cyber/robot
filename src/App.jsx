import { useMemo, useState } from "react";
import { questions } from "./questions";

function Robot({ mood = "happy" }) {
  return (
    <div className={`robot robot-${mood}`} aria-label="귀여운 로봇 캐릭터">
      <div className="antenna">
        <span />
      </div>
      <div className="robot-head">
        <div className="robot-ear left" />
        <div className="robot-ear right" />
        <div className="robot-face">
          <i className="eye left" />
          <i className="eye right" />
          <div className="mouth" />
        </div>
      </div>
      <div className="robot-body">
        <div className="heart">★</div>
      </div>
      <div className="robot-arm left" />
      <div className="robot-arm right" />
    </div>
  );
}

function StartScreen({ onStart }) {
  return (
    <main className="page center-page">
      <div className="floating gear g1">⚙️</div>
      <div className="floating gear g2">⚙️</div>
      <Robot />
      <section className="hero-card">
        <span className="eyebrow">부천 로보파크 온라인 활동지</span>
        <h1>로봇 박사 탐험대</h1>
        <p>
          로봇 친구와 함께 6개의 미션을 해결하고
          <br />
          나만의 로봇 박사 인증서를 받아 보세요!
        </p>
        <button className="primary big" onClick={onStart}>
          🚀 탐험 시작
        </button>
      </section>
    </main>
  );
}

function Progress({ current, total, completed }) {
  const percent = Math.round((completed / total) * 100);
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span>미션 {current} / {total}</span>
        <strong>{percent}% 완료</strong>
      </div>
      <div className="progress-track">
        <div className="progress-bar" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function ChoiceQuestion({ q, value, onChange }) {
  return (
    <div className="option-grid">
      {q.options.map((option, index) => (
        <button
          key={option}
          type="button"
          className={`option ${value === index ? "selected" : ""}`}
          onClick={() => onChange(index)}
        >
          <span className="option-number">{index + 1}</span>
          {option}
        </button>
      ))}
    </div>
  );
}

function MultiQuestion({ q, value = [], onChange }) {
  const toggle = (index) => {
    const next = value.includes(index)
      ? value.filter((item) => item !== index)
      : [...value, index];
    onChange(next);
  };
  return (
    <div className="option-grid">
      {q.options.map((option, index) => (
        <button
          key={option}
          type="button"
          className={`option ${value.includes(index) ? "selected" : ""}`}
          onClick={() => toggle(index)}
        >
          <span className="checkbox">{value.includes(index) ? "✓" : ""}</span>
          {option}
        </button>
      ))}
    </div>
  );
}

function MatchingQuestion({ q, value = {}, onChange }) {
  return (
    <div className="matching-list">
      {q.pairs.map((pair, index) => (
        <label className="matching-row" key={pair.left}>
          <strong>{pair.left}</strong>
          <span>→</span>
          <select
            value={value[index] || ""}
            onChange={(e) => onChange({ ...value, [index]: e.target.value })}
          >
            <option value="">선택하기</option>
            {q.choices.map((choice) => (
              <option key={choice} value={choice}>{choice}</option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}

function QuestionBody({ q, value, onChange }) {
  if (q.type === "choice") {
    return <ChoiceQuestion q={q} value={value} onChange={onChange} />;
  }
  if (q.type === "multi") {
    return <MultiQuestion q={q} value={value} onChange={onChange} />;
  }
  if (q.type === "matching") {
    return <MatchingQuestion q={q} value={value} onChange={onChange} />;
  }
  if (q.type === "ox") {
    return (
      <div className="ox-grid">
        {["O", "X"].map((item) => (
          <button
            key={item}
            type="button"
            className={`ox-button ${value === item ? "selected" : ""}`}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        ))}
      </div>
    );
  }
  return (
    <textarea
      className="idea-input"
      value={value || ""}
      placeholder={q.placeholder}
      onChange={(e) => onChange(e.target.value)}
      maxLength={180}
    />
  );
}

function isAnswered(q, value) {
  if (q.type === "multi") return Array.isArray(value) && value.length > 0;
  if (q.type === "matching") {
    return q.pairs.every((_, index) => Boolean(value?.[index]));
  }
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function isCorrect(q, value) {
  if (q.type === "text") return String(value || "").trim().length >= 2;
  if (q.type === "choice") return value === q.answer;
  if (q.type === "ox") return value === q.answer;
  if (q.type === "multi") {
    const selected = [...(value || [])].sort();
    return JSON.stringify(selected) === JSON.stringify([...q.answers].sort());
  }
  if (q.type === "matching") {
    return q.pairs.every((pair, index) => value?.[index] === pair.answer);
  }
  return false;
}

function Quiz({ onFinish }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const q = questions[current];
  const value = answers[q.id];
  const result = checked[q.id];
  const completed = Object.keys(checked).length;

  const change = (next) => {
    setAnswers((prev) => ({ ...prev, [q.id]: next }));
    setChecked((prev) => {
      const copy = { ...prev };
      delete copy[q.id];
      return copy;
    });
  };

  const check = () => {
    if (!isAnswered(q, value)) {
      alert("먼저 답을 선택하거나 입력해 주세요!");
      return;
    }
    setChecked((prev) => ({ ...prev, [q.id]: isCorrect(q, value) }));
  };

  const next = () => {
    if (current === questions.length - 1) {
      const score = questions.reduce(
        (sum, item) => sum + (isCorrect(item, answers[item.id]) ? 1 : 0),
        0
      );
      onFinish({ score, answers });
    } else {
      setCurrent((index) => index + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main className="page quiz-page">
      <header className="mini-header">
        <div className="mini-brand">🤖 로봇 박사 탐험대</div>
        <span className="star-count">⭐ {completed}</span>
      </header>

      <Progress
        current={current + 1}
        total={questions.length}
        completed={completed}
      />

      <section className="question-card">
        <div className="mission-badge">MISSION {q.id}</div>
        <div className="question-icon">{q.emoji}</div>
        <h2>{q.title}</h2>
        <p className="prompt">{q.prompt}</p>

        <QuestionBody q={q} value={value} onChange={change} />

        {result !== undefined && (
          <div className={`feedback ${result ? "correct" : "wrong"}`}>
            <div className="feedback-title">
              {result ? "🎉 정답이에요!" : "🔧 다시 생각해 볼까요?"}
            </div>
            <p>{q.explanation}</p>
          </div>
        )}

        <div className="action-row">
          <button
            className="secondary"
            disabled={current === 0}
            onClick={() => setCurrent((index) => index - 1)}
          >
            ← 이전
          </button>

          {result === undefined ? (
            <button className="primary" onClick={check}>
              정답 확인
            </button>
          ) : (
            <button className="primary" onClick={next}>
              {current === questions.length - 1 ? "탐험 완료 🏆" : "다음 미션 →"}
            </button>
          )}
        </div>
      </section>

      <aside className="robot-tip">
        <Robot mood={result === false ? "thinking" : "happy"} />
        <div className="speech">
          {result === undefined
            ? "천천히 관찰하고 답을 골라 봐!"
            : result
              ? "삐빅! 아주 훌륭해!"
              : "괜찮아. 설명을 읽고 다시 골라 봐!"}
        </div>
      </aside>
    </main>
  );
}

function Certificate({ score, onRestart }) {
  const [name, setName] = useState("");
  const date = useMemo(
    () => new Intl.DateTimeFormat("ko-KR", { dateStyle: "long" }).format(new Date()),
    []
  );

  const print = () => window.print();

  return (
    <main className="page certificate-page">
      <div className="confetti">★　⚙️　★　🤖　★　⚙️　★</div>
      <section className="result-card">
        <Robot />
        <h1>모든 미션 완료!</h1>
        <p className="score">
          총 <strong>{questions.length}</strong>개 중{" "}
          <strong>{score}</strong>개 미션 성공
        </p>
        <label className="name-label">
          인증서에 들어갈 이름
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            maxLength={12}
          />
        </label>
      </section>

      <section className="certificate" id="certificate">
        <div className="certificate-border">
          <span className="certificate-badge">🤖</span>
          <p className="small-title">ROBOT EXPLORER CERTIFICATE</p>
          <h2>로봇 박사 인증서</h2>
          <p className="certificate-name">{name || "멋진 탐험가"} 어린이</p>
          <p className="certificate-text">
            위 어린이는 로봇의 원리와 역할을 알아보는
            <br />
            모든 탐험 미션에 즐겁게 참여하였으므로
            <br />
            이 인증서를 수여합니다.
          </p>
          <p className="certificate-date">{date}</p>
          <p className="signature">로봇 박사 탐험대장 🤖</p>
        </div>
      </section>

      <div className="result-actions">
        <button className="secondary" onClick={onRestart}>처음부터 다시</button>
        <button className="primary" onClick={print}>인증서 인쇄·저장</button>
      </div>
    </main>
  );
}

export default function App() {
  const [screen, setScreen] = useState("start");
  const [result, setResult] = useState(null);

  if (screen === "start") {
    return <StartScreen onStart={() => setScreen("quiz")} />;
  }

  if (screen === "quiz") {
    return (
      <Quiz
        onFinish={(quizResult) => {
          setResult(quizResult);
          setScreen("certificate");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  return (
    <Certificate
      score={result?.score || 0}
      onRestart={() => {
        setResult(null);
        setScreen("start");
      }}
    />
  );
}
