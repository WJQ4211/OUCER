/**
 * Simple JSON file store for dev mode persistence.
 * Survives server restarts without MySQL.
 */

import fs from 'fs'
import path from 'path'

const DATA_DIR = path.resolve(__dirname, '../../data')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

function filePath(name: string): string {
  return path.join(DATA_DIR, `${name}.json`)
}

/** Load a collection from disk */
export function load<T>(name: string): Map<string, T> {
  try {
    if (fs.existsSync(filePath(name))) {
      const raw = fs.readFileSync(filePath(name), 'utf-8')
      const entries: [string, T][] = JSON.parse(raw)
      return new Map(entries)
    }
  } catch (e) {
    console.warn(`[Store] Failed to load ${name}:`, (e as Error).message)
  }
  return new Map()
}

/** Save a collection to disk (throttled - writes after 500ms of inactivity) */
const saveTimers = new Map<string, NodeJS.Timeout>()

export function save<T>(name: string, data: Map<string, T>): void {
  const id = saveTimers.get(name)
  if (id) clearTimeout(id)
  saveTimers.set(name, setTimeout(() => {
    try {
      const entries = Array.from(data.entries())
      fs.writeFileSync(filePath(name), JSON.stringify(entries), 'utf-8')
    } catch (e) {
      console.error(`[Store] Failed to save ${name}:`, (e as Error).message)
    }
  }, 500))
}

/** Save immediately (for shutdown) */
export function saveSync<T>(name: string, data: Map<string, T>): void {
  try {
    const entries = Array.from(data.entries())
    fs.writeFileSync(filePath(name), JSON.stringify(entries), 'utf-8')
  } catch (e) {
    console.error(`[Store] Failed to saveSync ${name}:`, (e as Error).message)
  }
}
