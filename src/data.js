export const parts = [
  {
    id: 'concept',
    character: '티파(T.Pa)',
    image: 'tpa',
    color: '#2366a5',
    title: '티파가 알려주는 로봇이란? 로봇의 구성',
    intro: '안녕! 나는 티파야. 로봇이 무엇인지, 어떤 장치로 이루어져 있는지 함께 알아보자!',
    mode: 'quiz',
    questions: [
      {
        type: 'choice',
        question: '로봇을 가장 알맞게 설명한 것은 무엇일까요?',
        options: [
          '전기로 움직이는 모든 물건',
          '사람처럼 생긴 모든 기계',
          '주변을 감지하고 프로그램에 따라 일을 수행하는 기계',
          '말을 할 수 있는 장난감'
        ],
        answer: 2,
        explanation: '로봇은 센서로 주변을 알아보고, 프로그램에 따라 판단한 뒤, 모터나 장치를 움직여 일을 수행하는 기계입니다.'
      },
      {
        type: 'choice',
        question: '사람의 눈처럼 로봇이 주변을 알아보게 하는 장치는 무엇일까요?',
        options: ['센서', '모터', '배터리', '바퀴'],
        answer: 0,
        explanation: '센서는 빛, 소리, 거리, 온도 같은 주변 정보를 감지합니다.'
      },
      {
        type: 'choice',
        question: '사람의 뇌처럼 로봇이 정보를 처리하고 명령을 내리는 부분은 무엇일까요?',
        options: ['카메라', '컴퓨터와 제어장치', '바퀴', '관절'],
        answer: 1,
        explanation: '컴퓨터와 제어장치는 센서에서 받은 정보를 처리하고 로봇이 어떻게 움직일지 결정합니다.'
      },
      {
        type: 'choice',
        question: '사람의 근육처럼 로봇의 몸을 움직이게 하는 장치는 무엇일까요?',
        options: ['센서', '모터', '마이크', '화면'],
        answer: 1,
        explanation: '모터는 전기 에너지를 움직임으로 바꾸어 팔, 다리, 바퀴 등을 움직입니다.'
      }
    ]
  },
  {
    id: 'history',
    character: '티마(T.Ma)',
    image: 'tma',
    color: '#ed1c24',
    title: '티마가 들려주는 로봇의 역사',
    intro: '안녕! 나는 티마야. 오래전 로봇의 아이디어부터 오늘날의 휴머노이드까지 시간여행을 떠나자!',
    mode: 'quiz',
    questions: [
      {
        type: 'choice',
        question: '“로봇(Robot)”이라는 말을 작품에서 처음 사용한 사람은 누구일까요?',
        options: ['카렐 차페크', '아이작 뉴턴', '토머스 에디슨', '알베르트 아인슈타인'],
        answer: 0,
        explanation: '체코의 작가 카렐 차페크가 1920년 희곡 「R.U.R.」에서 Robot이라는 말을 사용했습니다.'
      },
      {
        type: 'choice',
        question: '약 500년 전, 움직이는 기계 기사를 설계한 것으로 알려진 사람은 누구일까요?',
        options: ['갈릴레오 갈릴레이', '레오나르도 다빈치', '제임스 와트', '니콜라 테슬라'],
        answer: 1,
        explanation: '레오나르도 다빈치는 갑옷을 입은 기계 기사가 움직이는 설계를 남겼습니다.'
      },
      {
        type: 'choice',
        question: '1939년 뉴욕 세계박람회에 등장해 걷고 말하며 팔을 움직였던 초기 인간형 로봇은 무엇일까요?',
        options: ['아시모', '일렉트로', '스팟', '와봇-1'],
        answer: 1,
        explanation: '일렉트로(Elektro)는 사람 모양을 하고 걷고 말하며 팔을 움직였던 대표적인 초기 인간형 로봇입니다.'
      },
      {
        type: 'choice',
        question: '1973년 완성된 세계 최초의 본격적인 전신 휴머노이드 로봇으로 알려진 것은 무엇일까요?',
        options: ['와봇-1', '일렉트로', '옵티머스', '아틀라스'],
        answer: 0,
        explanation: '와봇-1은 센서, 손, 두 다리와 대화 기능을 통합한 초기의 본격적인 전신 휴머노이드입니다.'
      }
    ]
  },
  {
    id: 'ox',
    character: '티피(T.P)',
    image: 'tp',
    color: '#72bf44',
    title: '티피와 도전하는 로봇 OX 퀴즈',
    intro: '안녕! 나는 티피야. 자동으로 움직인다고 모두 로봇일까? O와 X를 골라 보자!',
    mode: 'quiz',
    questions: [
      {
        type: 'ox',
        question: '자동문은 주변 사람을 감지하므로 로봇이다.',
        answer: false,
        explanation: '자동문은 센서를 사용하지만, 주로 정해진 방식대로 열리고 닫히는 자동기계로 봅니다.'
      },
      {
        type: 'ox',
        question: '엘리베이터는 버튼과 프로그램에 따라 움직이므로 로봇이다.',
        answer: false,
        explanation: '엘리베이터는 정해진 층 사이를 자동으로 움직이는 자동제어 기계에 가깝습니다.'
      },
      {
        type: 'ox',
        question: '로봇청소기는 장애물을 감지하고 이동 경로를 바꾸므로 로봇이다.',
        answer: true,
        explanation: '로봇청소기는 센서로 주변을 살피고 상황에 따라 움직임을 조절하며 청소합니다.'
      }
    ]
  },
  {
    id: 'imagine',
    character: '티나(T.Na)',
    image: 'tna',
    color: '#f8a719',
    title: '티나와 함께 로봇 상상하기',
    intro: '안녕! 나는 티나야. 이제 정답은 없어. 우리 생활을 더 멋지게 바꿀 로봇을 상상해 보자!',
    mode: 'imagine',
    prompts: [
      { key: 'place', label: '내 로봇은 어디에서 활동하나요?', placeholder: '예: 학교, 집, 병원, 우주, 바닷속' },
      { key: 'problem', label: '어떤 불편이나 문제를 해결하나요?', placeholder: '예: 무거운 짐을 옮기기 힘들어요.' },
      { key: 'name', label: '로봇의 이름은 무엇인가요?', placeholder: '멋진 이름을 지어 주세요.' },
      { key: 'job', label: '로봇이 하는 일을 자세히 적어 보세요.', placeholder: '센서로 위험을 찾고 사람에게 알려 줍니다.' },
      { key: 'feature', label: '꼭 필요한 기능 한 가지는 무엇인가요?', placeholder: '예: 사람의 목소리를 알아듣는 기능' }
    ]
  }
]
