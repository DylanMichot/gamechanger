'use client'

import { useState, KeyboardEvent, useRef, useEffect, useMemo } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  className?: string
  variant?: 'pathology' | 'psychomotor'
  suggestions?: string[]
  showAllOnFocus?: boolean
}

export function TagInput({
  value,
  onChange,
  placeholder = 'Ajouter un tag...',
  className,
  variant = 'pathology',
  suggestions = [],
  showAllOnFocus = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredSuggestions = useMemo(() => {
    const available = suggestions.filter((s) => !value.includes(s))
    if (!inputValue.trim()) {
      return showAllOnFocus ? available : []
    }
    const lower = inputValue.toLowerCase()
    return available.filter((s) => s.toLowerCase().includes(lower)).slice(0, 8)
  }, [inputValue, suggestions, value, showAllOnFocus])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function addTag(tag: string) {
    const trimmed = tag.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInputValue('')
    setShowSuggestions(false)
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredSuggestions.length > 0 && inputValue) {
        addTag(filteredSuggestions[0])
      } else if (!showAllOnFocus) {
        addTag(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const allSelected = showAllOnFocus && suggestions.length > 0 && suggestions.every((s) => value.includes(s))

  return (
    <div className={cn('relative space-y-2', className)} ref={containerRef}>
      <div className="flex flex-wrap gap-1.5 min-h-[2.5rem] p-2 border border-input rounded-md bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {value.map((tag) => (
          <span
            key={tag}
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
              variant === 'pathology'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-teal-100 text-teal-800'
            )}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:opacity-70 transition-opacity"
              aria-label={`Supprimer ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {!allSelected && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setShowSuggestions(true)
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 150)
              if (inputValue.trim() && !showAllOnFocus) addTag(inputValue)
            }}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
        )}
      </div>

      {/* Dropdown suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute left-0 right-0 z-10 mt-1 bg-white border border-border rounded-md shadow-md overflow-hidden max-h-52 overflow-y-auto">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                addTag(suggestion)
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {!showAllOnFocus && (
        <p className="text-xs text-muted-foreground">
          Appuyez sur{' '}
          <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-xs">Entrée</kbd>{' '}
          pour ajouter un tag
        </p>
      )}
      {showAllOnFocus && (
        <p className="text-xs text-muted-foreground">
          Cliquez sur le champ pour voir les options disponibles
        </p>
      )}
    </div>
  )
}
