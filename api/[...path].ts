import type { VercelRequest, VercelResponse } from '@vercel/node'

const API_BASE_URL = process.env.VITE_API_BASE || 'https://api-surveys.banza.xyz'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.status(200).end()
    return
  }

  // Get the path from the request
  const path = (req.query.path as string[]) || []
  const apiPath = path.join('/')
  
  // Build query string from query parameters (excluding 'path')
  const queryParams = new URLSearchParams()
  Object.entries(req.query).forEach(([key, value]) => {
    if (key !== 'path' && value) {
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, String(v)))
      } else {
        queryParams.append(key, String(value))
      }
    }
  })
  const queryString = queryParams.toString()
  
  // Construct the full URL
  const url = `${API_BASE_URL}/${apiPath}${queryString ? `?${queryString}` : ''}`
  
  try {
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    // Forward authorization header if present
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization
    }
    
    // Prepare body for non-GET requests
    let body: string | undefined
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = JSON.stringify(req.body || {})
    }
    
    // Forward the request to the backend API
    const response = await fetch(url, {
      method: req.method,
      headers,
      body,
    })

    const data = await response.text()
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    // Forward the status
    res.status(response.status)
    
    // Forward content-type if available
    const contentType = response.headers.get('content-type')
    if (contentType) {
      res.setHeader('Content-Type', contentType)
    }
    
    // Try to parse as JSON, otherwise send as text
    try {
      const jsonData = JSON.parse(data)
      res.json(jsonData)
    } catch {
      res.send(data)
    }
  } catch (error: any) {
    console.error('Proxy error:', error)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message,
      url 
    })
  }
}
