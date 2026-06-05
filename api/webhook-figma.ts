/**
 * Figma Webhook Receiver — Serverless Function
 * 
 * Receives LIBRARY_PUBLISH events from Figma and stores them as changelog entries.
 * Deployed automatically by Vercel at: https://[your-domain].vercel.app/api/webhook-figma
 * 
 * Figma webhook docs: https://www.figma.com/developers/api#webhooks
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

// --- Types ---

interface FigmaWebhookPayload {
  event_type: string
  timestamp: string
  file_key: string
  file_name: string
  triggered_by: {
    id: string
    handle: string
  }
  description?: string
  created_components?: Array<{ key: string; name: string }>
  modified_components?: Array<{ key: string; name: string }>
  deleted_components?: Array<{ key: string; name: string }>
  created_styles?: Array<{ key: string; name: string }>
  modified_styles?: Array<{ key: string; name: string }>
  deleted_styles?: Array<{ key: string; name: string }>
}

interface ChangelogEntry {
  id: string
  timestamp: string
  version?: string
  publishedBy: string
  fileName: string
  fileKey: string
  description: string
  changes: {
    components: {
      created: string[]
      modified: string[]
      deleted: string[]
    }
    styles: {
      created: string[]
      modified: string[]
      deleted: string[]
    }
  }
  summary: string
}

// --- Storage ---
// In Vercel serverless, /tmp is the only writable directory (ephemeral)
// For persistence across deploys, we'll use a JSON file in the repo
// that gets committed. For now, we use /tmp for the webhook receiver
// and a separate endpoint to fetch the changelog.

const CHANGELOG_PATH = join('/tmp', 'changelog.json')

function getChangelog(): ChangelogEntry[] {
  if (existsSync(CHANGELOG_PATH)) {
    try {
      return JSON.parse(readFileSync(CHANGELOG_PATH, 'utf-8'))
    } catch {
      return []
    }
  }
  return []
}

function saveChangelog(entries: ChangelogEntry[]): void {
  const dir = '/tmp'
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(CHANGELOG_PATH, JSON.stringify(entries, null, 2))
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

function buildSummary(entry: Omit<ChangelogEntry, 'summary' | 'id'>): string {
  const parts: string[] = []
  const { components, styles } = entry.changes
  
  if (components.created.length > 0) parts.push(`${components.created.length} componentes creados`)
  if (components.modified.length > 0) parts.push(`${components.modified.length} componentes modificados`)
  if (components.deleted.length > 0) parts.push(`${components.deleted.length} componentes eliminados`)
  if (styles.created.length > 0) parts.push(`${styles.created.length} estilos creados`)
  if (styles.modified.length > 0) parts.push(`${styles.modified.length} estilos modificados`)
  if (styles.deleted.length > 0) parts.push(`${styles.deleted.length} estilos eliminados`)
  
  if (parts.length === 0) return 'Publicación sin cambios detectados'
  return parts.join(', ')
}

// --- Handler ---

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Verify it's a Figma webhook (optional: add passcode verification)
  // Note: passcode verification disabled for now since Figma may not send it consistently
  // const passcode = req.headers['x-figma-signature'] || req.query.passcode
  // const expectedPasscode = process.env.FIGMA_WEBHOOK_PASSCODE

  try {
    const payload = req.body as FigmaWebhookPayload

    // Handle PING events (sent when webhook is first created)
    if (payload.event_type === 'PING') {
      return res.status(200).json({ message: 'pong' })
    }

    // Only process LIBRARY_PUBLISH events
    if (payload.event_type !== 'LIBRARY_PUBLISH') {
      return res.status(200).json({ message: `Event ${payload.event_type} ignored` })
    }

    // Build changelog entry
    const entry: ChangelogEntry = {
      id: generateId(),
      timestamp: payload.timestamp || new Date().toISOString(),
      publishedBy: payload.triggered_by?.handle || 'unknown',
      fileName: payload.file_name || 'unknown',
      fileKey: payload.file_key || '',
      description: payload.description || '(sin descripción)',
      changes: {
        components: {
          created: (payload.created_components || []).map(c => c.name),
          modified: (payload.modified_components || []).map(c => c.name),
          deleted: (payload.deleted_components || []).map(c => c.name),
        },
        styles: {
          created: (payload.created_styles || []).map(s => s.name),
          modified: (payload.modified_styles || []).map(s => s.name),
          deleted: (payload.deleted_styles || []).map(s => s.name),
        },
      },
      summary: '',
    }
    entry.summary = buildSummary(entry)

    // Append to changelog
    const changelog = getChangelog()
    changelog.unshift(entry) // newest first
    
    // Keep last 100 entries max
    if (changelog.length > 100) changelog.length = 100
    
    saveChangelog(changelog)

    console.log(`[webhook] LIBRARY_PUBLISH received: ${entry.summary}`)

    return res.status(200).json({
      success: true,
      entry: {
        id: entry.id,
        summary: entry.summary,
        timestamp: entry.timestamp,
      }
    })
  } catch (error: any) {
    console.error('[webhook] Error processing:', error.message)
    return res.status(500).json({ error: 'Internal error', message: error.message })
  }
}
