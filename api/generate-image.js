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

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const apiToken = process.env.CLOUDFLARE_API_TOKEN

    if (!accountId || !apiToken) {
      console.error('Cloudflare 환경변수 누락')

      return res.status(500).json({
        error: 'Cloudflare 환경변수가 설정되지 않았습니다.'
      })
    }

    const prompt = `
Create a high-quality realistic product concept image of a future robot imagined by an elementary school student.

Robot name: ${name}
Place where it works: ${place}
Problem it solves: ${problem}
Main job: ${job}
Special feature: ${feature}

Important requirements:
- Preserve the child's original robot idea and functions.
- Show the robot itself as a real, functional product.
- Friendly and imaginative design.
- Realistically buildable within 5 to 10 years.
- Show realistic materials, sensors, joints, wheels, arms, cameras, displays and structural details where appropriate.
- Show the entire robot clearly from head to feet or wheels.
- Place the robot in the center of the image.
- Clean, bright studio background.
- Professional industrial product design visualization.
- No text.
- No letters.
- No Korean characters.
- No logo.
- No watermark.
- Suitable and friendly for children.
`.trim()

    const cloudflareResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          seed: Math.floor(Math.random() * 1000000),
          steps: 6
        })
      }
    )

    const contentType =
      cloudflareResponse.headers.get('content-type') || ''

    let result

    if (contentType.includes('application/json')) {
      result = await cloudflareResponse.json()
    } else {
      const responseText = await cloudflareResponse.text()

      console.error(
        'Cloudflare 비정상 응답:',
        cloudflareResponse.status,
        responseText
      )

      return res.status(502).json({
        error: 'Cloudflare가 올바르지 않은 응답을 보냈습니다.'
      })
    }

    if (!cloudflareResponse.ok || result.success === false) {
      console.error(
        'Cloudflare API 오류:',
        JSON.stringify(result)
      )

      const cloudflareError =
        result?.errors?.[0]?.message ||
        result?.messages?.[0]?.message ||
        'Cloudflare 이미지 생성 요청에 실패했습니다.'

      return res.status(cloudflareResponse.status || 500).json({
        error: cloudflareError
      })
    }

    /*
      Cloudflare REST API 응답은 일반적으로 다음 구조입니다.

      {
        result: {
          image: "BASE64_IMAGE"
        },
        success: true
      }
    */

    const base64Image =
      result?.result?.image ||
      result?.image

    if (
      !base64Image ||
      typeof base64Image !== 'string'
    ) {
      console.error(
        '이미지 데이터가 없는 Cloudflare 응답:',
        JSON.stringify(result)
      )

      return res.status(500).json({
        error: 'Cloudflare 응답에 이미지 데이터가 없습니다.'
      })
    }

    const cleanedBase64 = base64Image
      .replace(/^data:image\/[a-zA-Z+.-]+;base64,/, '')
      .replace(/\s/g, '')

    if (cleanedBase64.length < 1000) {
      console.error(
        '이미지 데이터가 너무 짧음:',
        cleanedBase64.slice(0, 100)
      )

      return res.status(500).json({
        error: '정상적인 이미지 데이터를 받지 못했습니다.'
      })
    }

    const imageDataUri =
      `data:image/jpeg;charset=utf-8;base64,${cleanedBase64}`

    return res.status(200).json({
      image: imageDataUri
    })
  } catch (error) {
    console.error('이미지 생성 서버 오류:', error)

    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : '이미지를 생성하는 중 오류가 발생했습니다.'
    })
  }
}
