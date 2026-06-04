/**
 * Changelog API — Serverless Function
 * 
 * Returns the changelog entries stored by the webhook receiver.
 * GET /api/changelog → returns all entries
 * GET /api/changelog?limit=10 → returns last 10
 * 
 * Note: In Vercel serverless, /tmp is ephemeral. Data persists within
 * the same deployment but resets on new deploys. For permanent storage,
 * we'll add a persistent backend later (e.g., Vercel KV, Supabase, or file in repo).
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const CHANGELOG_PATH = join('/tmp', 'changelog.json')

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // CORS headers for dashboard to fetch
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  try {
    let changelog: any[] = []
    
    if (existsSync(CHANGELOG_PATH)) {
      changelog = JSON.parse(readFileSync(CHANGELOG_PATH, 'utf-8'))
    }

    // Optional limit
    const limit = parseInt(req.query.limit as string) || 0
    if (limit > 0) {
      changelog = changelog.slice(0, limit)
    }

    return res.status(200).json({
      total: changelog.length,
      entries: changelog,
    })
  } catch (error: any) {
    return res.status(500).json({ error: 'Error reading changelog', message: error.message })
  }
}
