'use client'
import { Button } from '@/components/Button'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { Eye } from 'lucide-react'
import { Icon } from '@/components/Icon'
import { cn } from '@/utils/cn'
import classes from './ExitPreview.module.css'

export const ExitPreview = () => {
  const router = useRouter()
  const handleExitPreview = useCallback(() => {
    fetch('/next/exit-preview').then(() => {
      router.refresh()
    })
  }, [router])

  const [show, setShow] = useState(false)

  useEffect(() => {
    //do not show if rendering in an iframe (live preview)
    try {
      setShow(window.self === window.top)
    } catch (e) {
      setShow(false)
    }
  }, [])

  if (!show) return null

  return (
    <div className={cn(classes.previewButton, 'fixed bottom-4 right-4 z-50')}>
      <Button
        variant="default"
        className="shadow-lg flex items-center gap-2 px-4 py-2"
        onClick={handleExitPreview}
      >
        <Icon size="sm">
          <Eye />
        </Icon>
        <span>Режим предпросмотра</span>
        <span className="mx-1">•</span>
        <span>Выйти</span>
        {/* <span>Preview Mode</span>
        <span className="mx-1">•</span>
        <span>Exit</span> */}
      </Button>
    </div>
  )
}
