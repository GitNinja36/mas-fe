import type { VercelRequest, VercelResponse } from '@vercel/node'

const API_BASE_URL = process.env.VITE_API_BASE || process.env.API_BASE_URL || 'https://api-surveys.banza.xyz'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.status(200).end()
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/agents`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { Authorization: req.headers.authorization }),
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body || {}) : undefined,
    })

    const data = await response.text()
    
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(response.status)
    
    const contentType = response.headers.get('content-type')
    if (contentType) {
      res.setHeader('Content-Type', contentType)
    }
    
    try {
      res.json(JSON.parse(data))
    } catch {
      res.send(data)
    }
  } catch (error: any) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(500).json({ error: error.message, url: `${API_BASE_URL}/agents` })
  }
}
