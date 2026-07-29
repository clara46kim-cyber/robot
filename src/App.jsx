import { useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, Home, RotateCcw, Sparkles, XCircle } from 'lucide-react'
import { questions } from './questions'

const partPositions = {
  1: { left: '50%', top: '20%' },
  2: { left: '83%', top: '48%' },
  3: { left: '17%', top: '48%' },
  4: { left: '50%', top: '48%' },
  5: { left: '50%', top: '29%' },
  6: { left: '66%', top: '88%' },
  7: { left: '34%', top: '88%' },
  8: { left: '50%', top: '5%' }
}

function RobotMap({ completed, onSelect }) {
  return (
    <div className="robot-stage">
      <div className="stars" aria-hidden="true">✦　·　✧　·　✦</div>

      <svg className="robot-svg" viewBox="0 0 500 650" role="img" aria-label="문제 번호가 표시된 귀여운 로봇">
        <defs>
          <linearGradient id="bodyGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#8e86ff" />
            <stop offset="100%" stopColor="#5f58e8" />
          </linearGradient>
          <linearGradient id="screenGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#eaffff" />
            <stop offset="100%" stopColor="#b9f0f0" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodOpacity=".18" />
          </filter>
        </defs>

        <g filter="url(#shadow)">
          <line x1="250" y1="75" x2="250" y2="35" stroke="#5149cc" strokeWidth="10" strokeLinecap="round" />
          <circle cx="250" cy="25" r="16" fill="#ffcf5c" />

          <rect x="140" y="85" width="220" height="165" rx="70" fill="url(#bodyGradient)" />
          <rect x="165" y="113" width="170" height="105" rx="44" fill="url(#screenGradient)" />
          <circle cx="215" cy="163" r="15" fill="#3d3a78" />
          <circle cx="285" cy="163" r="15" fill="#3d3a78" />
          <circle cx="210" cy="157" r="5" fill="white" />
          <circle cx="280" cy="157" r="5" fill="white" />
          <path d="M220 193 Q250 215 280 193" fill="none" stroke="#3d3a78" strokeWidth="8" strokeLinecap="round" />

          <rect x="135" y="270" width="230" height="205" rx="55" fill="url(#bodyGradient)" />
          <rect x="180" y="310" width="140" height="100" rx="24" fill="#f7f6ff" />
          <circle cx="250" cy="350" r="24" fill="#ffcf5c" />
          <path d="M238 350 l10 11 23-28" fill="none" stroke="#5149cc" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

          <rect x="70" y="285" width="70" height="190" rx="35" fill="#776ff3" transform="rotate(12 105 380)" />
          <rect x="360" y="285" width="70" height="190" rx="35" fill="#776ff3" transform="rotate(-12 395 380)" />
          <circle cx="77" cy="470" r="45" fill="#ffcf5c" />
          <circle cx="423" cy="470" r="45" fill="#ffcf5c" />

          <rect x="170" y="460" width="65" height="130" rx="30" fill="#6c63eb" />
          <rect x="265" y="460" width="65" height="130" rx="30" fill="#6c63eb" />
          <rect x="145" y="555" width="105" height="52" rx="26" fill="#3f397f" />
          <rect x="250" y="555" width="105" height="52" rx="26" fill="#3f397f" />
        </g>
      </svg>

      {questions.map((q) => {
        const pos = partPositions[q.id]
        return (
          <button
            key={q.id}
            className={`hotspot ${completed[q.id] ? 'done' : ''}`}
            style={{ left: pos.left, top: pos.top }}
            onClick={() => onSelect(q.id)}
            aria-label={`${q.part}의 ${q.id}번 문제 열기`}
          >
            {completed[q.id] ? '✓' : q.id}
            <span>{q.part}</span>
          </button>
        )
      })}
    </div>
  )
}

function ChoiceQuestion({ question, savedAnswer, onSubmit }) {
  const [selected, setSelected] = useState(savedAnswer?.value ?? null)

  return (
    <>
      <div className="option-list">
        {question.options.map((option, index) => (
          <button
            key={option}
            className={`option ${selected === index ? 'selected' : ''}`}
            onClick={() => setSelected(index)}
            disabled={Boolean(savedAnswer)}
          >
            <span className="option-number">{index + 1}</span>
            {option}
          </button>
        ))}
      </div>
      {!savedAnswer && (
        <button className="submit-button" disabled={selected === null} onClick={() => onSubmit(selected)}>
          정답 확인
        </button>
      )}
    </>
  )
}

function OxSetQuestion({ question, savedAnswer, onSubmit }) {
  const [answers, setAnswers] = useState(savedAnswer?.value ?? Array(question.statements.length).fill(null))

  const choose = (index, value) => {
    if (savedAnswer) return
    setAnswers((prev) => prev.map((item, i) => (i === index ? value : item)))
  }

  const ready = answers.every((answer) => answer !== null)

  return (
    <>
      <div className="ox-list">
        {question.statements.map((item, index) => (
          <div className="ox-card" key={item.text}>
            <strong>{index + 1}. {item.text}</strong>
            <div className="ox-buttons">
              <button
                className={answers[index] === true ? 'selected' : ''}
                onClick={() => choose(index, true)}
                disabled={Boolean(savedAnswer)}
              >
                O
              </button>
              <button
                className={answers[index] === false ? 'selected' : ''}
                onClick={() => choose(index, false)}
                disabled={Boolean(savedAnswer)}
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>
      {!savedAnswer && (
        <button className="submit-button" disabled={!ready} onClick={() => onSubmit(answers)}>
          정답 확인
        </button>
      )}
    </>
  )
}

function QuestionScreen({ question, answer, onSubmit, onBack, onHome, onNext }) {
  return (
    <main className="question-page">
      <header className="question-header">
        <button className="icon-button" onClick={onBack} aria-label="뒤로 가기"><ArrowLeft /></button>
        <div>
          <span className="mission-label">MISSION {question.id}</span>
          <h1>{question.part} 탐험</h1>
        </div>
        <button className="icon-button" onClick={onHome} aria-label="처음 화면"><Home /></button>
      </header>

      <section className="question-card">
        <div className="mini-robot">🤖</div>
        <h2>{question.title}</h2>

        {question.type === 'choice' ? (
          <ChoiceQuestion question={question} savedAnswer={answer} onSubmit={onSubmit} />
        ) : (
          <OxSetQuestion question={question} savedAnswer={answer} onSubmit={onSubmit} />
        )}

        {answer && (
          <div className={`feedback ${answer.correct ? 'correct' : 'incorrect'}`}>
            <div className="feedback-title">
              {answer.correct ? <CheckCircle2 /> : <XCircle />}
              <strong>{answer.correct ? '정답이에요!' : '아쉬워요. 정답을 확인해 보세요!'}</strong>
            </div>

            {!answer.correct && question.type === 'choice' && (
              <p><b>정답:</b> {question.answer + 1}번. {question.options[question.answer]}</p>
            )}

            {!answer.correct && question.type === 'oxset' && (
              <p>
                <b>정답:</b>{' '}
                {question.statements.map((item, index) => `${index + 1}번 ${item.answer ? 'O' : 'X'}`).join(', ')}
              </p>
            )}

            <p className="explanation"><b>설명:</b> {question.explanation}</p>

            <button className="next-button" onClick={onNext}>
              {question.id === questions.length ? '결과 보기' : '다음 문제로'}
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

function ResultScreen({ answers, onHome, onReset }) {
  const score = Object.values(answers).filter((item) => item.correct).length
  return (
    <main className="result-page">
      <div className="result-card">
        <div className="confetti">✦ 🎉 ✦</div>
        <div className="result-robot">🤖</div>
        <h1>로봇 탐험 완료!</h1>
        <p className="score"><strong>{score}</strong> / {questions.length}</p>
        <p>
          {score === questions.length
            ? '대단해요! 로봇 박사로 임명합니다!'
            : '틀린 문제도 설명을 읽으면 로봇 지식이 쑥쑥 자라요!'}
        </p>
        <div className="result-actions">
          <button className="secondary-button" onClick={onHome}><Home /> 로봇으로 돌아가기</button>
          <button className="submit-button" onClick={onReset}><RotateCcw /> 처음부터 다시 하기</button>
        </div>
      </div>
    </main>
  )
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [currentId, setCurrentId] = useState(null)
  const [answers, setAnswers] = useState({})

  const currentQuestion = useMemo(
    () => questions.find((question) => question.id === currentId),
    [currentId]
  )

  const openQuestion = (id) => {
    setCurrentId(id)
    setScreen('question')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submitAnswer = (value) => {
    let correct = false
    if (currentQuestion.type === 'choice') {
      correct = value === currentQuestion.answer
    } else {
      correct = value.every((item, index) => item === currentQuestion.statements[index].answer)
    }
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { value, correct }
    }))
  }

  const goNext = () => {
    if (currentId === questions.length) {
      setScreen('result')
      return
    }
    openQuestion(currentId + 1)
  }

  const reset = () => {
    setAnswers({})
    setCurrentId(null)
    setScreen('home')
  }

  if (screen === 'question' && currentQuestion) {
    return (
      <QuestionScreen
        question={currentQuestion}
        answer={answers[currentQuestion.id]}
        onSubmit={submitAnswer}
        onBack={() => setScreen('home')}
        onHome={() => setScreen('home')}
        onNext={goNext}
      />
    )
  }

  if (screen === 'result') {
    return <ResultScreen answers={answers} onHome={() => setScreen('home')} onReset={reset} />
  }

  const completedCount = Object.keys(answers).length

  return (
    <main className="home-page">
      <section className="hero">
        <div className="badge"><Sparkles size={16} /> 부천 로보파크 탐험 활동지</div>
        <h1>로봇의 몸을 눌러<br />미션을 해결해요!</h1>
        <p>번호가 적힌 로봇 부위를 눌러 문제를 풀어 보세요.</p>
        <div className="progress-wrap">
          <div className="progress-info"><span>탐험 진행도</span><b>{completedCount}/{questions.length}</b></div>
          <div className="progress-bar"><div style={{ width: `${(completedCount / questions.length) * 100}%` }} /></div>
        </div>
      </section>

      <RobotMap completed={answers} onSelect={openQuestion} />

      <section className="mission-guide">
        <h2>미션 목록</h2>
        <div className="mission-grid">
          {questions.map((question) => (
            <button key={question.id} onClick={() => openQuestion(question.id)} className={answers[question.id] ? 'complete' : ''}>
              <span>{answers[question.id] ? '✓' : question.id}</span>
              <div><b>{question.part}</b><small>문제 열기</small></div>
            </button>
          ))}
        </div>
        {completedCount === questions.length && (
          <button className="submit-button result-open" onClick={() => setScreen('result')}>최종 결과 보기</button>
        )}
      </section>
    </main>
  )
}
