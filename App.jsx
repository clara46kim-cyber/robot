import { useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Home,
  RotateCcw,
  Sparkles,
  XCircle
} from 'lucide-react'

import { parts } from './data'

import tp from './assets/tp.png'
import tpa from './assets/tpa.png'
import tma from './assets/tma.png'
import tna from './assets/tna.png'

import capek from './assets/history/capek.jpeg'
import davinci from './assets/history/davinci.jpg'
import elektro from './assets/history/elektro.jpeg'
import atlas from './assets/history/atlas.jpeg'

const images = {
  tp,
  tpa,
  tma,
  tna
}

const explanationImages = {
  capek,
  davinci,
  elektro,
  atlas
}

const STORAGE_KEY = 'robopark-worksheet-progress'

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

function HomeScreen({ completed, openPart, resetAll }) {
  return (
    <main className="home-screen">
      <section className="home-hero">
        <div className="eyebrow">
          <Sparkles size={18} />
          부천로보파크 온라인 활동지
        </div>

        <h1>
          로보파크
          <br />
          <span>로봇 탐험대 퀴즈</span>
        </h1>

        <p>
          로보파크의 네 캐릭터와 함께 네 가지 활동을 차례로 만나 보세요.
        </p>
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

            <img
              src={images[part.image]}
              alt={part.character}
            />

            <div className="exact-copy">
              <small>{part.character}</small>
              <h2>{part.menuTitle}</h2>

              <span>
                {completed[part.id] ? '완료 ✓' : '시작하기'}
                <ChevronRight size={18} />
              </span>
            </div>
          </button>
        ))}
      </section>

      {Object.keys(completed).length > 0 && (
        <button
          className="reset-link"
          onClick={resetAll}
        >
          <RotateCcw size={17} />
          처음부터 다시 하기
        </button>
      )}
    </main>
  )
}

function Header({ part, goHome }) {
  return (
    <header className="topbar">
      <button
        onClick={goHome}
        aria-label="뒤로"
      >
        <ArrowLeft />
      </button>

      <div className="topbar-title">
        <small>{part.character}</small>
        <b>{part.menuTitle}</b>
      </div>

      <button
        onClick={goHome}
        aria-label="홈"
      >
        <Home />
      </button>
    </header>
  )
}

function QuizPart({ part, saved, save, goHome }) {
  const questions = part.questions || []
  const [current, setCurrent] = useState(saved?.current || 0)
  const [answers, setAnswers] = useState(saved?.answers || {})
  const [showResult, setShowResult] = useState(
    Boolean(saved?.showResult)
  )

  const question = questions[current]
  const selected = answers[current]
  const isAnswered = selected !== undefined
  const isCorrect =
    isAnswered && selected === question?.answer

  const chooseAnswer = index => {
    if (isAnswered) return

    const nextAnswers = {
      ...answers,
      [current]: index
    }

    setAnswers(nextAnswers)

    save({
      current,
      answers: nextAnswers,
      showResult: false,
      complete: false
    })
  }

  const nextQuestion = () => {
    if (!isAnswered) return

    if (current < questions.length - 1) {
      const nextCurrent = current + 1
      setCurrent(nextCurrent)

      save({
        current: nextCurrent,
        answers,
        showResult: false,
        complete: false
      })
    } else {
      setShowResult(true)

      save({
        current,
        answers,
        showResult: true,
        complete: true
      })

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  const retry = () => {
    setCurrent(0)
    setAnswers({})
    setShowResult(false)

    save({
      current: 0,
      answers: {},
      showResult: false,
      complete: false
    })
  }

  if (!questions.length) {
    return (
      <main
        className="part-screen"
        style={{ '--accent': part.color }}
      >
        <Header part={part} goHome={goHome} />

        <section className="quiz-card">
          <h2>문제가 아직 준비되지 않았어요.</h2>
          <button
            className="primary-button"
            onClick={goHome}
          >
            <Home />
            홈으로
          </button>
        </section>
      </main>
    )
  }

  if (showResult) {
    const correctCount = questions.reduce(
      (count, item, index) =>
        count + (answers[index] === item.answer ? 1 : 0),
      0
    )

    return (
      <main
        className="part-screen"
        style={{ '--accent': part.color }}
      >
        <Header part={part} goHome={goHome} />

        <section className="certificate">
          <img
            className="certificate-character"
            src={images[part.image]}
            alt={part.character}
          />

          <span>MISSION COMPLETE</span>
          <h1>{part.menuTitle} 완료!</h1>

          <h2>
            {questions.length}문제 중 {correctCount}문제를 맞혔어요.
          </h2>

          <button
            className="primary-button"
            onClick={retry}
          >
            <RotateCcw />
            다시 풀기
          </button>

          <button
            className="secondary-button"
            onClick={goHome}
          >
            <Home />
            홈으로
          </button>
        </section>
      </main>
    )
  }

  return (
    <main
      className="part-screen"
      style={{ '--accent': part.color }}
    >
      <Header part={part} goHome={goHome} />

      <section className="guide-card">
        <img
          src={images[part.image]}
          alt={part.character}
        />

        <div className="speech">
          <b>{part.character}의 미션</b>
          <p>{part.intro}</p>
        </div>
      </section>

      <section className="quiz-card">
        <div className="question-progress">
          {current + 1} / {questions.length}
        </div>

        <h2>{question.question}</h2>

        {question.description && (
          <p className="helper">
            {question.description}
          </p>
        )}

        <div className="answer-list">
          {question.options.map((option, index) => {
            let className = 'answer-button'

            if (isAnswered) {
              if (index === question.answer) {
                className += ' correct'
              } else if (index === selected) {
                className += ' wrong'
              }
            }

            return (
              <button
                key={`${option}-${index}`}
                className={className}
                onClick={() => chooseAnswer(index)}
                disabled={isAnswered}
              >
                <span>{index + 1}</span>
                {option}
              </button>
            )
          })}
        </div>

        {isAnswered && (
          <section
            className={`answer-result ${
              isCorrect ? 'correct' : 'wrong'
            }`}
          >
            <div className="result-title">
              {isCorrect ? (
                <>
                  <CheckCircle2 />
                  정답이에요!
                </>
              ) : (
                <>
                  <XCircle />
                  다시 확인해 볼까요?
                </>
              )}
            </div>

            <p>
              <b>정답:</b>{' '}
              {question.options[question.answer]}
            </p>

            <p>
              <b>설명:</b> {question.explanation}
            </p>

            {question.image &&
              explanationImages[question.image] && (
                <figure className="explanation-image">
                  <img
                    src={explanationImages[question.image]}
                    alt={
                      question.imageAlt ||
                      '문제 관련 이미지'
                    }
                  />

                  {question.imageCaption && (
                    <figcaption>
                      {question.imageCaption}
                    </figcaption>
                  )}
                </figure>
              )}
          </section>
        )}

        <button
          className="primary-button"
          disabled={!isAnswered}
          onClick={nextQuestion}
        >
          {current < questions.length - 1
            ? '다음 문제'
            : '결과 보기'}
          <ChevronRight />
        </button>
      </section>
    </main>
  )
}

function ImaginePart({ part, saved, save, goHome }) {
  const [form, setForm] = useState(saved?.form || {})
  const [generatedImage, setGeneratedImage] = useState(
    saved?.image || ''
  )
  const [done, setDone] = useState(Boolean(saved?.complete))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const ready = part.prompts.every(item =>
    (form[item.key] || '').trim()
  )

  const update = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }))

    setError('')
  }

  const generateRobotImage = async () => {
    if (!ready || loading) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          place: form.place,
          problem: form.problem,
          job: form.job,
          feature: form.feature
        })
      })

      const contentType =
        response.headers.get('content-type') || ''

      const data = contentType.includes('application/json')
        ? await response.json()
        : {
            error:
              '서버에서 올바른 응답을 받지 못했습니다.'
          }

      if (!response.ok) {
        throw new Error(
          data.error || '이미지 생성에 실패했습니다.'
        )
      }

      if (!data.image) {
        throw new Error('생성된 이미지가 없습니다.')
      }

      setGeneratedImage(data.image)
      setDone(true)

      save({
        form,
        image: data.image,
        complete: true
      })

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } catch (err) {
      console.error(err)

      setError(
        err.message ||
          '이미지를 만드는 중 오류가 발생했습니다.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <main
        className="part-screen"
        style={{ '--accent': part.color }}
      >
        <Header part={part} goHome={goHome} />

        <section className="certificate">
          <img
            className="certificate-character"
            src={images[part.image]}
            alt={part.character}
          />

          <span>ROBOT IMAGINATION</span>

          <h1>나의 미래 로봇</h1>
          <h2>{form.name}</h2>

          {generatedImage && (
            <figure className="generated-robot">
              <img
                src={generatedImage}
                alt={`${form.name} 미래 로봇`}
              />

              <figcaption>
                내가 상상한 내용을 AI가 이미지로 표현했어요.
              </figcaption>
            </figure>
          )}

          <div className="idea-summary">
            <p>
              <b>활동 장소</b>
              {form.place}
            </p>

            <p>
              <b>해결할 문제</b>
              {form.problem}
            </p>

            <p>
              <b>하는 일</b>
              {form.job}
            </p>

            <p>
              <b>특별한 기능</b>
              {form.feature}
            </p>
          </div>

          {error && (
            <div className="image-error">{error}</div>
          )}

          <button
            className="primary-button"
            onClick={generateRobotImage}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner" />
                새로운 로봇을 만드는 중...
              </>
            ) : (
              <>
                <RotateCcw />
                이미지 다시 만들기
              </>
            )}
          </button>

          <button
            className="secondary-button"
            onClick={goHome}
            disabled={loading}
          >
            <Home />
            홈으로
          </button>
        </section>
      </main>
    )
  }

  return (
    <main
      className="part-screen"
      style={{ '--accent': part.color }}
    >
      <Header part={part} goHome={goHome} />

      <section className="guide-card">
        <img
          src={images[part.image]}
          alt={part.character}
        />

        <div className="speech">
          <b>티나의 상상 미션</b>
          <p>{part.intro}</p>
        </div>
      </section>

      <section className="quiz-card imagination-card">
        <h2>내가 만들고 싶은 미래 로봇</h2>

        <p className="helper">
          정답은 없습니다. 떠오르는 생각을 자유롭게 적어 보세요.
          모든 내용을 입력하면 AI가 로봇의 모습을 만들어 줍니다.
        </p>

        <div className="form-list">
          {part.prompts.map((prompt, i) => (
            <label key={prompt.key}>
              <span>
                <b>{i + 1}</b>
                {prompt.label}
              </span>

              {prompt.key === 'job' ? (
                <textarea
                  value={form[prompt.key] || ''}
                  onChange={event =>
                    update(prompt.key, event.target.value)
                  }
                  placeholder={prompt.placeholder}
                  disabled={loading}
                />
              ) : (
                <input
                  value={form[prompt.key] || ''}
                  onChange={event =>
                    update(prompt.key, event.target.value)
                  }
                  placeholder={prompt.placeholder}
                  disabled={loading}
                />
              )}
            </label>
          ))}
        </div>

        {error && (
          <div className="image-error">{error}</div>
        )}

        {loading && (
          <div className="generating-message">
            <span className="loading-spinner" />

            <div>
              <b>상상의 로봇을 만들고 있어요!</b>
              <p>
                약간의 시간이 걸릴 수 있습니다.
                창을 닫지 말고 기다려 주세요.
              </p>
            </div>
          </div>
        )}

        <button
          className="primary-button"
          disabled={!ready || loading}
          onClick={generateRobotImage}
        >
          {loading ? (
            <>
              <span className="loading-spinner" />
              AI가 로봇을 만드는 중...
            </>
          ) : (
            <>
              상상의 로봇 이미지 만들기
              <Sparkles />
            </>
          )}
        </button>
      </section>
    </main>
  )
}

function App() {
  const [progress, setProgress] = useState(loadProgress)
  const [activePartId, setActivePartId] = useState(null)

  const activePart = parts.find(
    part => part.id === activePartId
  )

  const savePart = (partId, value) => {
    setProgress(previous => {
      const next = {
        ...previous,
        [partId]: value
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(next)
      )

      return next
    })
  }

  const resetAll = () => {
    const confirmed = window.confirm(
      '모든 활동 기록을 지우고 처음부터 시작할까요?'
    )

    if (!confirmed) return

    localStorage.removeItem(STORAGE_KEY)
    setProgress({})
    setActivePartId(null)
  }

  const completed = Object.fromEntries(
    Object.entries(progress)
      .filter(([, value]) => value?.complete)
      .map(([key]) => [key, true])
  )

  if (!activePart) {
    return (
      <HomeScreen
        completed={completed}
        openPart={setActivePartId}
        resetAll={resetAll}
      />
    )
  }

  const commonProps = {
    part: activePart,
    saved: progress[activePart.id],
    save: value => savePart(activePart.id, value),
    goHome: () => setActivePartId(null)
  }

  if (activePart.prompts) {
    return <ImaginePart {...commonProps} />
  }

  return <QuizPart {...commonProps} />
}

export default App
