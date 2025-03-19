import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the IP address from the request headers or connection
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log('User IP:', ip);

  // Return the IP address in the response
  res.status(200).json({ ip });
}