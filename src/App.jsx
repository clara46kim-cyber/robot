import { useState } from 'react'
import { ArrowLeft, CheckCircle2, ChevronRight, Home, RotateCcw, Sparkles, XCircle } from 'lucide-react'
import { parts } from './data'
import tp from './assets/tp.png'
import tpa from './assets/tpa.png'
import tma from './assets/tma.png'
import tna from './assets/tna.png'

const images = { tp, tpa, tma, tna }

function HomeScreen({ completed, openPart, resetAll }) {
  return (
    <main className="home-screen">
      <section className="home-hero">
        <div className="eyebrow"><Sparkles size={18}/> 부천로보파크 온라인 활동지</div>
        <h1>로보파크<br/><span>로봇 탐험대 퀴즈</span></h1>
        <p>로보파크의 네 캐릭터와 함께 네 가지 활동을 차례로 만나 보세요.</p>
      </section>

      <section className="exact-list">
        {parts.map((part, index) => (
          <button
            key={part.id}
            className="exact-card"
            style={{ '--accent': part.color }}
            onClick={() => openPart(part.id)}
          >
            <div className="number-badge">{index + 1}</div>
            <img src={images[part.image]} alt={part.character}/>
            <div className="exact-copy">
              <small>{part.character}</small>
              <h2>{part.menuTitle}</h2>
              <span>{completed[part.id] ? '완료 ✓' : '시작하기'} <ChevronRight size={18}/></span>
            </div>
          </button>
        ))}
      </section>

      {Object.keys(completed).length > 0 && (
        <button className="reset-link" onClick={resetAll}><RotateCcw size={17}/> 처음부터 다시 하기</button>
      )}
    </main>
  )
}

function Header({ part, goHome }) {
  return (
    <header className="topbar">
      <button onClick={goHome} aria-label="뒤로"><ArrowLeft/></button>
      <div className="topbar-title">
        <small>{part.character}</small>
        <b>{part.menuTitle}</b>
      </div>
      <button onClick={goHome} aria-label="홈"><Home/></button>
    </header>
  )
}

function QuizPart({ part, saved, save, goHome }) {
  const [index, setIndex] = useState(saved?.index || 0)
  const [answers, setAnswers] = useState(saved?.answers || {})
  const question = part.questions[index]
  const current = answers[index]

  const choose = (value) => {
    if (current) return
    setAnswers(prev => ({ ...prev, [index]: { value, correct: value === question.answer } }))
  }

  const next = () => {
    const latest = { ...answers }
    if (index === part.questions.length - 1) {
      save({ index, answers: latest, complete: true })
      goHome()
    } else {
      const nextIndex = index + 1
      save({ index: nextIndex, answers: latest, complete: false })
      setIndex(nextIndex)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <main className="part-screen" style={{ '--accent': part.color }}>
      <Header part={part} goHome={goHome}/>
      <section className="guide-card">
        <img src={images[part.image]} alt={part.character}/>
        <div className="speech">
          <b>{part.shortName}의 한마디</b>
          <p>{part.intro}</p>
        </div>
      </section>

      <section className="quiz-card">
        <div className="quiz-meta"><span>문제 {index + 1}</span><span>{part.questions.length}문제 중</span></div>
        <div className="mini-progress"><div style={{ width: `${((index + 1) / part.questions.length) * 100}%` }}/></div>
        <h2>{question.question}</h2>

        {question.kind === 'choice' ? (
          <div className="choice-list">
            {question.options.map((option, i) => (
              <button
                key={option}
                className={current?.value === i ? 'selected' : ''}
                disabled={Boolean(current)}
                onClick={() => choose(i)}
              >
                <span>{i + 1}</span>{option}
              </button>
            ))}
          </div>
        ) : (
          <div className="ox-buttons">
            <button className={current?.value === true ? 'selected' : ''} disabled={Boolean(current)} onClick={() => choose(true)}>O</button>
            <button className={current?.value === false ? 'selected' : ''} disabled={Boolean(current)} onClick={() => choose(false)}>X</button>
          </div>
        )}

        {current && (
          <div className={`feedback ${current.correct ? 'correct' : 'wrong'}`}>
            <div className="feedback-heading">
              {current.correct ? <CheckCircle2/> : <XCircle/>}
              <b>{current.correct ? '정답이에요!' : '아쉬워요. 정답을 확인해 보세요!'}</b>
            </div>
            {!current.correct && (
              <p><b>정답:</b> {question.kind === 'choice'
                ? `${question.answer + 1}번 ${question.options[question.answer]}`
                : question.answer ? 'O' : 'X'}</p>
            )}
            <p><b>설명:</b> {question.explanation}</p>
            <button className="primary-button" onClick={next}>
              {index === part.questions.length - 1 ? '이 파트 마치기' : '다음 문제'} <ChevronRight/>
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

function ImaginePart({ part, saved, save, goHome }) {
  const [form, setForm] = useState(saved?.form || {})
  const [done, setDone] = useState(Boolean(saved?.complete))
  const ready = part.prompts.every(item => (form[item.key] || '').trim())

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  if (done) {
    return (
      <main className="part-screen" style={{ '--accent': part.color }}>
        <Header part={part} goHome={goHome}/>
        <section className="certificate">
          <img src={images[part.image]} alt={part.character}/>
          <span>ROBOT IMAGINATION</span>
          <h1>나의 미래 로봇</h1>
          <h2>{form.name}</h2>
          <div className="idea-summary">
            <p><b>활동 장소</b>{form.place}</p>
            <p><b>해결할 문제</b>{form.problem}</p>
            <p><b>하는 일</b>{form.job}</p>
            <p><b>특별한 기능</b>{form.feature}</p>
          </div>
          <button className="primary-button" onClick={goHome}><Home/> 홈으로</button>
        </section>
      </main>
    )
  }

  return (
    <main className="part-screen" style={{ '--accent': part.color }}>
      <Header part={part} goHome={goHome}/>
      <section className="guide-card">
        <img src={images[part.image]} alt={part.character}/>
        <div className="speech">
          <b>티나의 상상 미션</b>
          <p>{part.intro}</p>
        </div>
      </section>

      <section className="quiz-card imagination-card">
        <h2>내가 만들고 싶은 미래 로봇</h2>
        <p className="helper">정답은 없습니다. 떠오르는 생각을 자유롭게 적어 보세요.</p>
        <div className="form-list">
          {part.prompts.map((prompt, i) => (
            <label key={prompt.key}>
              <span><b>{i + 1}</b>{prompt.label}</span>
              {prompt.key === 'job' ? (
                <textarea value={form[prompt.key] || ''} onChange={e => update(prompt.key, e.target.value)} placeholder={prompt.placeholder}/>
              ) : (
                <input value={form[prompt.key] || ''} onChange={e => update(prompt.key, e.target.value)} placeholder={prompt.placeholder}/>
              )}
            </label>
          ))}
        </div>
        <button
          className="primary-button"
          disabled={!ready}
          onClick={() => {
            save({ form, complete: true })
            setDone(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          나의 로봇 완성하기 <Sparkles/>
        </button>
      </section>
    </main>
  )
}

export default function App() {
  const [currentId, setCurrentId] = useState(null)
  const [progress, setProgress] = useState({})

  const currentPart = parts.find(p => p.id === currentId)
  const save = (id, data) => setProgress(prev => ({ ...prev, [id]: data }))
  const completed = Object.fromEntries(
    Object.entries(progress).filter(([, value]) => value?.complete).map(([key]) => [key, true])
  )

  if (!currentPart) {
    return (
      <HomeScreen
        completed={completed}
        openPart={setCurrentId}
        resetAll={() => setProgress({})}
      />
    )
  }

  if (currentPart.type === 'imagine') {
    return <ImaginePart part={currentPart} saved={progress[currentId]} save={data => save(currentId, data)} goHome={() => setCurrentId(null)}/>
  }

  return <QuizPart part={currentPart} saved={progress[currentId]} save={data => save(currentId, data)} goHome={() => setCurrentId(null)}/>
}
