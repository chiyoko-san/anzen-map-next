'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Ad } from '@/types'

type Props = {
  position: Ad['position']
  page?: string
  className?: string
}

export default function AdSlot({ position, page = 'all', className = '' }: Props) {
  const [ad, setAd] = useState<Ad | null>(null)

  useEffect(() => {
    supabase
      .from('ads')
      .select('*')
      .eq('position', position)
      .eq('is_active', true)
      .or(`page.eq.all,page.eq.${page}`)
      .order('priority', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setAd(data as Ad)
      })
  }, [position, page])

  if (!ad) return null

  return (
    <div
      className={`ad-slot overflow-hidden ${className}`}
      dangerouslySetInnerHTML={{ __html: ad.code }}
    />
  )
}
