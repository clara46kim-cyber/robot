import { useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, ChevronRight, Home, RotateCcw, Sparkles, XCircle } from 'lucide-react'
import { parts } from './data'
import tp from './assets/tp.png'
import tpa from './assets/tpa.png'
import tma from './assets/tma.png'
import tna from './assets/tna.png'

const images = { tp, tpa, tma, tna }

function CharacterCard({ part, complete, onClick }) {
  return (
    <button className="character-card" style={{ '--accent': part.color }} onClick={onClick}>
      <div className="character-image-wrap">
        <img src={images[part.image]} alt={`${part.character} 캐릭터`} />
      </div>
      <div className="character-copy">
        <span className="part-badge">{complete ? '완료 ✓' : '탐험 시작'}</span>
        <h2>{part.character}</h2>
        <p>{part.title.replace(`${part.character.split('(')[0]}가 `, '')}</p>
        <span className="start-link">시작하기 <ChevronRight size={18} /></span>
      </div>
    </button>
  )
}

function HomeScreen({ progress, onSelect, onReset }) {
  const completed = Object.keys(progress).filter((key) => progress[key]).length
  return (
    <main className="home-screen">
      <section className="home-hero">
        <div className="eyebrow"><Sparkles size={18} /> 부천로보파크 온라인 활동지</div>
        <h1>로보파크<br /><span>로봇 탐험대 퀴즈</span></h1>
        <p>네 명의 로봇 친구와 함께 로봇의 개념, 역사, OX 퀴즈와 미래 로봇 상상 활동을 만나 보세요.</p>
        <div className="progress-panel">
          <div><b>전체 진행도</b><span>{completed} / {parts.length} 파트</span></div>
          <div className="progress-track"><div style={{ width: `${completed / parts.length * 100}%` }} /></div>
        </div>
      </section>

      <section className="character-grid">
        {parts.map((part) => (
          <CharacterCard key={part.id} part={part} complete={progress[part.id]} onClick={() => onSelect(part.id)} />
        ))}
      </section>

      {completed > 0 && (
        <button className="reset-link" onClick={onReset}><RotateCcw size={17} /> 처음부터 다시 하기</button>
      )}
    </main>
  )
}

function QuizPart({ part, saved, onSave, onHome }) {
  const [index, setIndex] = useState(saved?.index ?? 0)
  const [answers, setAnswers] = useState(saved?.answers ?? {})
  const question = part.questions[index]
  const current = answers[index]
  const isLast = index === part.questions.length - 1

  const submit = (value) => {
    const correct = value === question.answer
    setAnswers((prev) => ({ ...prev, [index]: { value, correct } }))
  }

  const next = () => {
    if (isLast) {
      onSave({ index, answers, complete: true })
      onHome()
      return
    }
    const nextIndex = index + 1
    setIndex(nextIndex)
    onSave({ index: nextIndex, answers, complete: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const score = Object.values(answers).filter((a) => a.correct).length

  return (
    <main className="part-screen" style={{ '--accent': part.color }}>
      <header className="topbar">
        <button onClick={onHome} aria-label="홈으로"><ArrowLeft /></button>
        <div className="topbar-title"><small>{part.character}</small><b>{part.title}</b></div>
        <button onClick={onHome} aria-label="홈으로"><Home /></button>
      </header>

      <section className="guide-card">
        <img src={images[part.image]} alt={part.character} />
        <div className="speech"><b>{part.character.split('(')[0]}의 한마디</b><p>{part.intro}</p></div>
      </section>

      <section className="quiz-card">
        <div className="quiz-meta"><span>문제 {index + 1}</span><span>{part.questions.length}문제 중</span></div>
        <div className="mini-progress"><div style={{ width: `${(index + 1) / part.questions.length * 100}%` }} /></div>
        <h2>{question.question}</h2>

        {question.type === 'choice' ? (
          <div className="choice-list">
            {question.options.map((option, i) => (
              <button
                key={option}
                className={current?.value === i ? 'selected' : ''}
                disabled={Boolean(current)}
                onClick={() => submit(i)}
              >
                <span>{i + 1}</span>{option}
              </button>
            ))}
          </div>
        ) : (
          <div className="ox-buttons">
            <button className={current?.value === true ? 'selected' : ''} disabled={Boolean(current)} onClick={() => submit(true)}>O</button>
            <button className={current?.value === false ? 'selected' : ''} disabled={Boolean(current)} onClick={() => submit(false)}>X</button>
          </div>
        )}

        {current && (
          <div className={`feedback ${current.correct ? 'correct' : 'wrong'}`}>
            <div className="feedback-heading">
              {current.correct ? <CheckCircle2 /> : <XCircle />}
              <b>{current.correct ? '정답이에요!' : '아쉬워요. 정답을 확인해 보세요!'}</b>
            </div>
            {!current.correct && (
              <p className="answer-line">
                <b>정답:</b>{' '}
                {question.type === 'choice'
                  ? `${question.answer + 1}번 ${question.options[question.answer]}`
                  : question.answer ? 'O' : 'X'}
              </p>
            )}
            <p><b>설명:</b> {question.explanation}</p>
            <button className="primary-button" onClick={next}>
              {isLast ? `파트 완료 · ${score + (current.correct && !Object.values(answers).slice(0,-1).includes(current) ? 0 : 0)}점` : '다음 문제'}
              <ChevronRight />
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

function ImaginePart({ part, saved, onSave, onHome }) {
  const [form, setForm] = useState(saved?.form ?? {})
  const [finished, setFinished] = useState(Boolean(saved?.complete))

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
  const ready = part.prompts.every((prompt) => (form[prompt.key] || '').trim())

  const finish = () => {
    if (!ready) return
    setFinished(true)
    onSave({ form, complete: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (finished) {
    return (
      <main className="part-screen imagine-result" style={{ '--accent': part.color }}>
        <header className="topbar">
          <button onClick={onHome}><ArrowLeft /></button>
          <div className="topbar-title"><small>{part.character}</small><b>미래 로봇 상상 완료</b></div>
          <button onClick={onHome}><Home /></button>
        </header>
        <section className="certificate">
          <img src={images[part.image]} alt={part.character} />
          <span>ROBOT EXPLORER</span>
          <h1>나만의 미래 로봇</h1>
          <h2>{form.name}</h2>
          <div className="idea-summary">
            <p><b>활동 장소</b>{form.place}</p>
            <p><b>해결할 문제</b>{form.problem}</p>
            <p><b>하는 일</b>{form.job}</p>
            <p><b>특별한 기능</b>{form.feature}</p>
          </div>
          <p className="closing">멋진 상상이 미래의 로봇을 만듭니다!</p>
          <button className="primary-button" onClick={onHome}><Home /> 탐험대 홈으로</button>
        </section>
      </main>
    )
  }

  return (
    <main className="part-screen" style={{ '--accent': part.color }}>
      <header className="topbar">
        <button onClick={onHome}><ArrowLeft /></button>
        <div className="topbar-title"><small>{part.character}</small><b>{part.title}</b></div>
        <button onClick={onHome}><Home /></button>
      </header>

      <section className="guide-card">
        <img src={images[part.image]} alt={part.character} />
        <div className="speech"><b>티나의 상상 미션</b><p>{part.intro}</p></div>
      </section>

      <section className="quiz-card imagination-card">
        <h2>내가 만들고 싶은 미래 로봇</h2>
        <p className="helper">정답은 없습니다. 떠오르는 생각을 자유롭게 적어 보세요.</p>
        <div className="form-list">
          {part.prompts.map((prompt, index) => (
            <label key={prompt.key}>
              <span><b>{index + 1}</b>{prompt.label}</span>
              {prompt.key === 'job' ? (
                <textarea value={form[prompt.key] || ''} onChange={(e) => update(prompt.key, e.target.value)} placeholder={prompt.placeholder} />
              ) : (
                <input value={form[prompt.key] || ''} onChange={(e) => update(prompt.key, e.target.value)} placeholder={prompt.placeholder} />
              )}
            </label>
          ))}
        </div>
        <button className="primary-button" disabled={!ready} onClick={finish}>나의 로봇 완성하기 <Sparkles /></button>
      </section>
    </main>
  )
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [progress, setProgress] = useState({})

  const part = useMemo(() => parts.find((p) => p.id === screen), [screen])
  const savePart = (id, data) => setProgress((prev) => ({ ...prev, [id]: data }))

  if (part) {
    if (part.mode === 'imagine') {
      return <ImaginePart part={part} saved={progress[part.id]} onSave={(data) => savePart(part.id, data)} onHome={() => setScreen('home')} />
    }
    return <QuizPart part={part} saved={progress[part.id]} onSave={(data) => savePart(part.id, data)} onHome={() => setScreen('home')} />
  }

  const completeMap = Object.fromEntries(Object.entries(progress).map(([key, value]) => [key, Boolean(value?.complete)]))
  return <HomeScreen progress={completeMap} onSelect={setScreen} onReset={() => setProgress({})} />
}
