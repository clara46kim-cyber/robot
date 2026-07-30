export const parts = [
  {
    id: "tpa",
    character: "티파(T.Pa)",
    shortName: "티파",
    image: "tpa",
    color: "#2366a5",
    menuTitle: "로봇이란? · 로봇의 구성",
    intro: "안녕! 나는 티파야. 로봇이 무엇인지, 로봇을 이루는 센서·컴퓨터·모터를 함께 알아보자!",
    type: "quiz",
    questions: [
      {
        kind: "choice",
        question: "로봇을 가장 알맞게 설명한 것은 무엇일까요?",
        options: [
          "전기로 움직이는 모든 물건",
          "사람처럼 생긴 모든 기계",
          "주변을 감지하고 프로그램에 따라 일을 수행하는 기계",
          "말을 할 수 있는 장난감"
        ],
        answer: 2,
        explanation:
          "로봇은 센서로 주변을 감지하고 프로그램에 따라 일을 수행하는 기계입니다."
      },
      {
        kind: "choice",
        question: "사람의 눈처럼 로봇이 주변을 알아보게 하는 장치는 무엇일까요?",
        options: ["센서", "모터", "배터리", "바퀴"],
        answer: 0,
        explanation: "센서는 빛, 소리, 거리 등을 감지합니다."
      },
      {
        kind: "choice",
        question: "사람의 뇌처럼 정보를 처리하고 명령을 내리는 부분은 무엇일까요?",
        options: ["카메라", "컴퓨터와 제어장치", "바퀴", "관절"],
        answer: 1,
        explanation:
          "컴퓨터와 제어장치는 정보를 처리하고 로봇의 움직임을 결정합니다."
      },
      {
        kind: "choice",
        question: "사람의 근육처럼 로봇의 몸을 움직이게 하는 장치는 무엇일까요?",
        options: ["센서", "모터", "마이크", "화면"],
        answer: 1,
        explanation: "모터는 로봇의 팔, 다리, 바퀴 등을 움직입니다."
      }
    ]
  },

  {
    id: "tma",
    character: "티마(T.Ma)",
    shortName: "티마",
    image: "tma",
    color: "#ed1c24",
    menuTitle: "로봇의 역사",
    intro: "안녕! 나는 티마야. 로봇의 역사를 함께 알아보자!",
    type: "quiz",
    questions: [
      {
        kind: "choice",
        question: "‘로봇(Robot)’이라는 말을 처음 사용한 사람은 누구일까요?",
        options: [
          "카렐 차페크",
          "아이작 뉴턴",
          "토머스 에디슨",
          "알베르트 아인슈타인"
        ],
        answer: 0,
        explanation:
          "카렐 차페크가 희곡 「R.U.R.」에서 Robot이라는 말을 처음 사용했습니다."
      },
      {
        kind: "choice",
        question:
          "약 500년 전 움직이는 기계 기사를 설계한 사람은 누구일까요?",
        options: [
          "갈릴레오",
          "레오나르도 다빈치",
          "제임스 와트",
          "니콜라 테슬라"
        ],
        answer: 1,
        explanation:
          "레오나르도 다빈치는 움직이는 기계 기사를 설계했습니다."
      },
      {
        kind: "choice",
        question:
          "1939년 뉴욕 세계박람회에 등장한 초기 인간형 로봇은 무엇일까요?",
        options: [
          "아시모",
          "일렉트로",
          "스팟",
          "와봇-1"
        ],
        answer: 1,
        explanation:
          "일렉트로(Elektro)는 초기 인간형 로봇으로 유명합니다."
      },
      {
        kind: "choice",
  question: "2026년 CES에서 'Best Robot'으로 선정된 로봇은 무엇일까요?",
  options: [
    "아시모",
    "옵티머스",
    "스팟",
    "아틀라스"
  ],
  answer: 3,
  explanation: "보스턴 다이내믹스의 휴머노이드 로봇 아틀라스(Atlas)는 2026년 CES에서 CNET Group이 선정한 'Best Robot'을 수상했습니다."
      }
    ]
  },

  {
    id: "tp",
    character: "티피(T.P)",
    shortName: "티피",
    image: "tp",
    color: "#72bf44",
    menuTitle: "로봇 OX 퀴즈",
    intro: "자동으로 움직인다고 모두 로봇일까? O와 X를 골라 보자!",
    type: "quiz",
    questions: [
      {
        kind: "ox",
        question: "자동문은 로봇이다.",
        answer: false,
        explanation:
          "자동문은 센서를 사용하지만 자동기계로 분류합니다."
      },
      {
        kind: "ox",
        question: "엘리베이터는 로봇이다.",
        answer: false,
        explanation:
          "엘리베이터는 자동제어 기계입니다."
      },
      {
        kind: "ox",
        question: "로봇청소기는 로봇이다.",
        answer: true,
        explanation:
          "센서로 주변을 감지하고 스스로 이동하며 청소하기 때문에 로봇입니다."
      }
    ]
  },

  {
    id: "tna",
    character: "티나(T.Na)",
    shortName: "티나",
    image: "tna",
    color: "#f8a719",
    menuTitle: "로봇과 상상하기",
    intro:
      "정답은 없어! 나만의 미래 로봇을 자유롭게 상상해 보자!",
    type: "imagine",
    prompts: [
      {
        key: "place",
        label: "내 로봇은 어디에서 활동하나요?"
      },
      {
        key: "problem",
        label: "어떤 문제를 해결하나요?"
      },
      {
        key: "name",
        label: "로봇의 이름은 무엇인가요?"
      },
      {
        key: "job",
        label: "로봇이 하는 일을 자세히 적어 보세요."
      },
      {
        key: "feature",
        label: "특별한 기능은 무엇인가요?"
      }
    ]
  }
];
