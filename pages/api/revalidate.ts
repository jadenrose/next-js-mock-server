import { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  revalidated: boolean
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!req.headers.authorization)
    return res
      .status(401)
      .send({ revalidated: false, message: 'Unauthenticated' })

  if (
    req.headers.authorization.replace('Bearer ', '') !==
    process.env.REVALIDATE_SECRET
  ) {
    return res.status(403).send({ revalidated: false, message: 'Forbidden' })
  }

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
