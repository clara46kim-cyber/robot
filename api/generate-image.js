export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'POST 요청만 사용할 수 있습니다.'
    })
  }

  try {
    const { name, place, problem, job, feature } = req.body || {}

    if (!name || !place || !problem || !job || !feature) {
      return res.status(400).json({
        error: '로봇 정보를 모두 입력해 주세요.'
      })
    }

    const prompt = `
Create a high-quality product concept image of a future robot imagined by an elementary school student.

Robot name: ${name}
Place where it works: ${place}
Problem it solves: ${problem}
Main job: ${job}
Special feature: ${feature}

Important requirements:
- Preserve the child's original idea and functions.
- Show the robot itself as a real, functional product.
- Friendly and imaginative but realistically buildable within 5 to 10 years.
- Show realistic materials, sensors, joints, wheels, arms, displays, cameras, and structural details where appropriate.
- Show the entire robot clearly.
- Clean bright background.
- Professional product design visualization.
- No text, no letters, no logo, no watermark.
- Suitable and friendly for children.
`.trim()

    const query = new URLSearchParams({
      width: '768',
      height: '768',
      seed: String(Math.floor(Math.random() * 1000000)),
      nologo: 'true'
    })

    // Pollinations 공개 웹 이미지 주소를 사용합니다.
    // 별도의 API 키나 Vercel 환경변수가 필요하지 않습니다.
    const imageUrl =
      `https://pollinations.ai/p/${encodeURIComponent(prompt)}` +
      `?${query.toString()}`

    return res.status(200).json({
      image: imageUrl
    })
  } catch (error) {
    console.error('이미지 주소 생성 오류:', error)

    return res.status(500).json({
      error: '이미지 주소를 만드는 중 오류가 발생했습니다.'
    })
  }
}
