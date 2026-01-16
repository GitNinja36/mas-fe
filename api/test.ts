import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json({ 
    message: 'API proxy is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  })
}
