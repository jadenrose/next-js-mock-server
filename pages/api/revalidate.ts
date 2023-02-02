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
  if (!req.headers['gcms-signature'])
    return res
      .status(401)
      .send({ revalidated: false, message: 'Unauthenticated' })

  if (!process.env.REVALIDATE_SECRET)
    throw new Error('Revalidate secret missing from env')

  const isValid = verifyWebhookSignature({
    body: req.body,
    signature: req.headers['gcms-signature'],
    secret: process.env.REVALIDATE_SECRET,
  })

  if (!isValid)
    return res.status(403).send({ revalidated: false, message: 'Forbidden' })

  try {
    console.log(req.body)

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
