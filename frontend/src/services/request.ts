/**
 * HTTP client based on Taro.request (WeChat Mini-Program compatible)
 */

import Taro from '@tarojs/taro'
import { getStorage, STORAGE_KEYS } from '@/utils/storage'

const API_BASE = 'http://localhost:3000' // dev server

interface RequestConfig {
  header?: Record<string, string>
}

const request = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: unknown,
  params?: Record<string, unknown>,
): Promise<T> => {
  // Inject token
  const token = await getStorage<string>(STORAGE_KEYS.TOKEN)
  const header: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    header['Authorization'] = `Bearer ${token}`
  }

  // Build query string
  let fullUrl = API_BASE + url
  if (params) {
    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== '')
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
      .join('&')
    if (qs) fullUrl += '?' + qs
  }

  try {
    const res = await Taro.request({
      url: fullUrl,
      method,
      header,
      data: method !== 'GET' ? data : undefined,
    })

    if (res.statusCode === 200) {
      const body = res.data as { code: number; data: T; message?: string }
      if (body.code !== 0) {
        Taro.showToast({ title: body.message || 'Request failed', icon: 'none' })
        throw new Error(body.message || 'Request failed')
      }
      return body.data
    }

    if (res.statusCode === 401) {
      Taro.showToast({ title: 'Please login first', icon: 'none' })
      throw new Error('Unauthorized')
    }
    if (res.statusCode === 403) {
      Taro.showToast({ title: 'Please verify alumni identity first', icon: 'none' })
      throw new Error('Forbidden')
    }

    Taro.showToast({ title: `Error ${res.statusCode}`, icon: 'none' })
    throw new Error(`HTTP ${res.statusCode}`)
  } catch (err: any) {
    if (err.errMsg?.includes('request:fail')) {
      Taro.showToast({ title: 'Network error - is the dev server running?', icon: 'none' })
    }
    throw err
  }
}

export const get = <T>(url: string, params?: Record<string, unknown>): Promise<T> =>
  request<T>('GET', url, undefined, params)

export const post = <T>(url: string, data?: unknown): Promise<T> =>
  request<T>('POST', url, data)

export const put = <T>(url: string, data?: unknown): Promise<T> =>
  request<T>('PUT', url, data)

export const del = <T>(url: string): Promise<T> =>
  request<T>('DELETE', url)

export default request
