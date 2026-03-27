'use client'

import { useState, useEffect } from 'react'

// Mots courts liés aux fonctions — ≤ 12 car. pour tenir sur mobile
const WORDS = [
  "d'attention",
  "de mémoire",
  "de tonus",
  "de praxies",
  "d'inhibition",
  "d'espace",
  "de temps",
  "de schéma",
  "de motricité",
]

const TYPING_SPEED = 75
const DELETING_SPEED = 35
const PAUSE_AFTER = 2000
const PAUSE_BEFORE = 400

export function TypewriterHero() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = WORDS[wordIndex]

    if (!deleting) {
      if (displayed.length < word.length) {
        const t = setTimeout(
          () => setDisplayed(word.slice(0, displayed.length + 1)),
          TYPING_SPEED
        )
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setDeleting(true), PAUSE_AFTER)
        return () => clearTimeout(t)
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(
          () => setDisplayed(displayed.slice(0, -1)),
          DELETING_SPEED
        )
        return () => clearTimeout(t)
      } else {
        setDeleting(false)
        setWordIndex((i) => (i + 1) % WORDS.length)
        const t = setTimeout(() => {}, PAUSE_BEFORE)
        return () => clearTimeout(t)
      }
    }
  }, [displayed, deleting, wordIndex])

  return (
    <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
      Déjouer les difficultés
      <br />
      <span className="text-accent">
        {displayed}
        <span className="inline-block w-[3px] h-[0.85em] bg-accent align-middle ml-0.5 animate-pulse" />
      </span>
    </h1>
  )
}
