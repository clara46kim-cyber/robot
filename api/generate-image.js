export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'POST 요청만 사용할 수 있습니다.'
    })
  }

  const apiKey = process.env.POLLINATIONS_API_KEY

  if (!apiKey) {
    return res.status(500).json({
      error: 'POLLINATIONS_API_KEY 환경변수가 설정되지 않았습니다.'
    })
  }

  try {
    const {
      name,
      place,
      problem,
      job,
      feature
    } = req.body || {}

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
      model: 'flux',
      width: '768',
      height: '768',
      enhance: 'true',
      nologo: 'true',
      seed: String(Math.floor(Math.random() * 1000000))
    })

    const imageUrl =
      `https://gen.pollinations.ai/image/` +
      `${encodeURIComponent(prompt)}?${query.toString()}`

    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })

    if (!response.ok) {
      const errorText = await response.text()

      console.error(
        'Pollinations API 오류:',
        response.status,
        errorText
      )

      return res.status(response.status).json({
        error:
          response.status === 401
            ? 'API 키가 올바르지 않습니다.'
            : response.status === 402
              ? 'Pollinations 사용 가능 잔액을 확인해 주세요.'
              : '이미지 생성에 실패했습니다.'
      })
    }

    const contentType =
      response.headers.get('content-type') || 'image/jpeg'

    const arrayBuffer = await response.arrayBuffer()
    const imageBuffer = Buffer.from(arrayBuffer)

    const base64Image =
      `data:${contentType};base64,${imageBuffer.toString('base64')}`

    return res.status(200).json({
      image: base64Image
    })
  } catch (error) {
    console.error('이미지 생성 서버 오류:', error)

    return res.status(500).json({
      error: '이미지를 만드는 중 서버 오류가 발생했습니다.'
    })
  }
}
