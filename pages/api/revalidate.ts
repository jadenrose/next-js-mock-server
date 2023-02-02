import { NextApiRequest, NextApiResponse } from 'next'
import { verifyWebhookSignature } from '@hygraph/utils'

type HygraphWebhookReq = NextApiRequest & {
  headers: {
    ['gcms-signature']: string
  }
}

type Data = {
  revalidated: boolean
  message?: string
}

export default async function handler(
  req: HygraphWebhookReq,
  res: NextApiResponse<Data>
) {
  try {
    const secret = process.env.REVALIDATE_SECRET

    if (!secret) throw new Error('Revalidate secret missing from env')

    const body = req.body
    const signature = req.headers['gcms-signature']

    if (!signature)
      return res
        .status(401)
        .send({ revalidated: false, message: 'Unauthenticated' })

    const isValid = verifyWebhookSignature({
      body,
      signature,
      secret,
    })

    if (!isValid)
      return res.status(403).send({ revalidated: false, message: 'Forbidden' })

    const { path, slug } = body.data

    const url = `/${[path, slug].join('/')}`

    console.log(url)

    await res.revalidate(url)

    return res.status(200).send({
      revalidated: true,
    })
  } catch (err) {
    console.error(err)

    return res
      .status(500)
      .send({ revalidated: false, message: 'Error revalidating' })
  }
}
