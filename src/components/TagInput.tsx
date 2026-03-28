'use client'

import { useState, KeyboardEvent, useRef, useEffect, useMemo } from 'react'
import { X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SuggestionGroup {
  label: string
  items: string[]
}

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  className?: string
  variant?: 'pathology' | 'psychomotor'
  suggestions?: string[]
  suggestionGroups?: SuggestionGroup[]
  showAllOnFocus?: boolean
}

export function TagInput({
  value,
  onChange,
  placeholder = 'Ajouter un tag...',
  className,
  variant = 'pathology',
  suggestions = [],
  suggestionGroups,
  showAllOnFocus = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [dropUp, setDropUp] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Flat suggestions — includes selected items (shown with checkmark)
  const filteredSuggestions = useMemo(() => {
    if (!inputValue.trim()) {
      return showAllOnFocus ? suggestions : []
    }
    const lower = inputValue.toLowerCase()
    return suggestions.filter((s) => s.toLowerCase().includes(lower)).slice(0, 8)
  }, [inputValue, suggestions, showAllOnFocus])

  // Grouped suggestions — includes selected items (shown with checkmark)
  const filteredGroups = useMemo(() => {
    if (!suggestionGroups) return null
    const lower = inputValue.toLowerCase()
    return suggestionGroups
      .map((group) => ({
        label: group.label,
        items: group.items.filter(
          (s) => !inputValue.trim() || s.toLowerCase().includes(lower)
        ),
      }))
      .filter((g) => g.items.length > 0)
  }, [inputValue, suggestionGroups])

  const hasVisibleSuggestions = suggestionGroups
    ? (filteredGroups?.length ?? 0) > 0
    : filteredSuggestions.length > 0

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Flip upward if there isn't enough space below (dropdown height ~256px + margin)
  useEffect(() => {
    if (showSuggestions && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setDropUp(spaceBelow < 280)
    }
  }, [showSuggestions])

  function toggleTag(tag: string) {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current)
      closeTimeout.current = null
    }
    const trimmed = tag.trim()
    if (!trimmed) return
    if (value.includes(trimmed)) {
      onChange(value.filter((t) => t !== trimmed))
    } else {
      onChange([...value, trimmed])
    }
    setInputValue('')
    setShowSuggestions(true)
    inputRef.current?.focus()
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const firstSuggestion = filteredGroups
        ? filteredGroups[0]?.items[0]
        : filteredSuggestions[0]
      if (firstSuggestion && inputValue) {
        toggleTag(firstSuggestion)
      } else if (!showAllOnFocus) {
        toggleTag(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const allSelected = showAllOnFocus && suggestions.length > 0 && suggestions.every((s) => value.includes(s))

  const selectedStyle = variant === 'pathology'
    ? 'bg-blue-50 text-blue-800 font-semibold'
    : 'bg-teal-50 text-teal-800 font-semibold'

  const checkStyle = variant === 'pathology'
    ? 'text-blue-500'
    : 'text-teal-500'

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
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setShowSuggestions(true)
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (closeTimeout.current) {
                clearTimeout(closeTimeout.current)
                closeTimeout.current = null
              }
              setShowSuggestions(true)
            }}
            onBlur={() => {
              closeTimeout.current = setTimeout(() => setShowSuggestions(false), 150)
              if (inputValue.trim() && !showAllOnFocus) toggleTag(inputValue)
            }}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
        )}
      </div>

      {/* Dropdown suggestions */}
      {showSuggestions && hasVisibleSuggestions && (
        <div className={cn(
          'absolute left-0 right-0 z-10 bg-white border border-border rounded-md shadow-md overflow-hidden max-h-64 overflow-y-auto',
          dropUp ? 'bottom-full mb-1' : 'mt-1'
        )}>
          {filteredGroups
            ? filteredGroups.map((group) => (
                <div key={group.label}>
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-muted border-b border-border">
                    {group.label}
                  </div>
                  {group.items.map((item) => {
                    const selected = value.includes(item)
                    return (
                      <button
                        key={item}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          toggleTag(item)
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2 text-sm flex items-center justify-between gap-2 transition-colors',
                          selected ? selectedStyle : 'hover:bg-muted'
                        )}
                      >
                        <span>{item}</span>
                        {selected && <Check className={cn('h-3.5 w-3.5 shrink-0', checkStyle)} />}
                      </button>
                    )
                  })}
                </div>
              ))
            : filteredSuggestions.map((suggestion) => {
                const selected = value.includes(suggestion)
                return (
                  <button
                    key={suggestion}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      toggleTag(suggestion)
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm flex items-center justify-between gap-2 transition-colors',
                      selected ? selectedStyle : 'hover:bg-muted'
                    )}
                  >
                    <span>{suggestion}</span>
                    {selected && <Check className={cn('h-3.5 w-3.5 shrink-0', checkStyle)} />}
                  </button>
                )
              })}
        </div>
      )}

      {!showAllOnFocus && (
        <p className="text-xs text-muted-foreground">
          Appuyez sur{' '}
          <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-xs">Entrée</kbd>{' '}
          pour ajouter un tag
        </p>
      )}
    </div>
  )
}
