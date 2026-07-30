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

      const data = await response.json()

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
        <Header
          part={part}
          goHome={goHome}
        />

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
            <div className="image-error">
              {error}
            </div>
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
      <Header
        part={part}
        goHome={goHome}
      />

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
                    update(
                      prompt.key,
                      event.target.value
                    )
                  }
                  placeholder={prompt.placeholder}
                  disabled={loading}
                />
              ) : (
                <input
                  value={form[prompt.key] || ''}
                  onChange={event =>
                    update(
                      prompt.key,
                      event.target.value
                    )
                  }
                  placeholder={prompt.placeholder}
                  disabled={loading}
                />
              )}
            </label>
          ))}
        </div>

        {error && (
          <div className="image-error">
            {error}
          </div>
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
