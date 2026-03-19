'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TagInput } from '@/components/TagInput'
import { MEMBRES_EQUIPE, FONCTIONS_PSYCHOMOTRICES } from '@/lib/constants'
import type { BoardGame, BoardGameFormData } from '@/types'

const MAX_FILE_SIZE = 1 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const LAST_MEMBER_KEY = 'gc_last_member'

interface GameFormProps {
  initialData?: BoardGame
  mode: 'create' | 'edit'
  existingPathologyTags?: string[]
}

export function GameForm({ initialData, mode, existingPathologyTags = [] }: GameFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<BoardGameFormData>({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    imageUrl: initialData?.imageUrl ?? '',
    minAge: initialData?.minAge ?? 5,
    maxAge: initialData?.maxAge ?? 99,
    minPlayers: initialData?.minPlayers ?? 1,
    maxPlayers: initialData?.maxPlayers ?? 6,
    pathologyTags: initialData?.pathologyTags ?? [],
    psychomotorTags: initialData?.psychomotorTags ?? [],
    addedBy: initialData?.addedBy ?? '',
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(initialData?.imageUrl ?? '')
  const [imageError, setImageError] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')

  // Pre-fill member from localStorage on create
  useEffect(() => {
    if (mode === 'create' && !formData.addedBy) {
      const last = localStorage.getItem(LAST_MEMBER_KEY)
      if (last) setFormData((p) => ({ ...p, addedBy: last }))
    }
  }, [mode]) // eslint-disable-line react-hooks/exhaustive-deps

  const ageError = formData.minAge > formData.maxAge
    ? "L'âge minimum ne peut pas dépasser l'âge maximum"
    : ''
  const playersError = formData.minPlayers > formData.maxPlayers
    ? 'Le nombre minimum ne peut pas dépasser le maximum'
    : ''

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageError('')
    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError('Format non accepté. Utilisez JPEG ou PNG uniquement.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setImageError('Fichier trop volumineux. La taille maximale est 1 Mo.')
      return
    }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function removeImage() {
    setImageFile(null)
    setImagePreview('')
    setFormData((prev) => ({ ...prev, imageUrl: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function uploadImage(): Promise<string | null> {
    if (!imageFile) return formData.imageUrl
    setIsUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', imageFile)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        setImageError(data.error ?? "Erreur lors de l'upload de l'image")
        return null
      }
      return data.url as string
    } finally {
      setIsUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!formData.name.trim()) { setError('Le nom est requis'); return }
    if (!formData.description.trim()) { setError('La description est requise'); return }
    if (!imagePreview) { setError('Une image est requise'); return }
    if (ageError) { setError(ageError); return }
    if (playersError) { setError(playersError); return }

    // Save last member to localStorage
    if (formData.addedBy) {
      localStorage.setItem(LAST_MEMBER_KEY, formData.addedBy)
    }

    setIsSubmitting(true)
    try {
      const imageUrl = await uploadImage()
      if (imageUrl === null) { setIsSubmitting(false); return }

      const payload = {
        ...formData,
        imageUrl,
        ...(mode === 'edit' && initialData?.imageUrl !== imageUrl
          ? { oldImageUrl: initialData?.imageUrl }
          : {}),
      }

      const url = mode === 'edit' ? `/api/games/${initialData!.id}` : '/api/games'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Une erreur est survenue'); return }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Une erreur inattendue est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isPending = isUploading || isSubmitting

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Colonne gauche */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du jeu *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              placeholder="Ex : Dobble, Catan, Uno..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Description courte du jeu et de ses caractéristiques..."
              rows={4}
              required
            />
          </div>

          {/* Tranche d'âge */}
          <div className="space-y-2">
            <Label>Tranche d'âge</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="minAge" className="text-xs text-muted-foreground">Âge minimum</Label>
                <Input
                  id="minAge"
                  type="number"
                  min={0}
                  max={120}
                  value={formData.minAge}
                  onChange={(e) => setFormData((p) => ({ ...p, minAge: parseInt(e.target.value) || 0 }))}
                  className={ageError ? 'border-destructive' : ''}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="maxAge" className="text-xs text-muted-foreground">Âge maximum (120 = illimité)</Label>
                <Input
                  id="maxAge"
                  type="number"
                  min={0}
                  max={120}
                  value={formData.maxAge}
                  onChange={(e) => setFormData((p) => ({ ...p, maxAge: parseInt(e.target.value) || 0 }))}
                  className={ageError ? 'border-destructive' : ''}
                />
              </div>
            </div>
            {ageError && <p className="text-xs text-destructive">{ageError}</p>}
          </div>

          {/* Nombre de joueurs */}
          <div className="space-y-2">
            <Label>Nombre de joueurs</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="minPlayers" className="text-xs text-muted-foreground">Minimum</Label>
                <Input
                  id="minPlayers"
                  type="number"
                  min={1}
                  max={50}
                  value={formData.minPlayers}
                  onChange={(e) => setFormData((p) => ({ ...p, minPlayers: parseInt(e.target.value) || 1 }))}
                  className={playersError ? 'border-destructive' : ''}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="maxPlayers" className="text-xs text-muted-foreground">Maximum</Label>
                <Input
                  id="maxPlayers"
                  type="number"
                  min={1}
                  max={50}
                  value={formData.maxPlayers}
                  onChange={(e) => setFormData((p) => ({ ...p, maxPlayers: parseInt(e.target.value) || 1 }))}
                  className={playersError ? 'border-destructive' : ''}
                />
              </div>
            </div>
            {playersError && <p className="text-xs text-destructive">{playersError}</p>}
          </div>

          {/* Ajouté par */}
          <div className="space-y-2">
            <Label htmlFor="addedBy">Ajouté par</Label>
            <select
              id="addedBy"
              value={formData.addedBy ?? ''}
              onChange={(e) => setFormData((p) => ({ ...p, addedBy: e.target.value }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">— Sélectionner un membre —</option>
              {MEMBRES_EQUIPE.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="space-y-6">
          {/* Image */}
          <div className="space-y-2">
            <Label>Image du jeu *</Label>
            {imagePreview ? (
              <div className="relative">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border">
                  <Image src={imagePreview} alt="Aperçu" fill className="object-cover" />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center w-full aspect-[4/3] border-2 border-dashed border-input rounded-lg hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer gap-3"
              >
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium">Cliquer pour uploader une image</p>
                  <p className="text-xs text-muted-foreground mt-1">JPEG ou PNG — 1 Mo maximum</p>
                </div>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleImageChange}
              className="hidden"
            />
            {imageError && <p className="text-sm text-destructive">{imageError}</p>}
          </div>

          {/* Tags fonctions */}
          <div className="space-y-2">
            <Label>Fonctions</Label>
            <TagInput
              value={formData.psychomotorTags}
              onChange={(tags) => setFormData((p) => ({ ...p, psychomotorTags: tags }))}
              placeholder="Cliquer pour voir les fonctions disponibles..."
              variant="psychomotor"
              suggestions={FONCTIONS_PSYCHOMOTRICES}
              showAllOnFocus={true}
            />
          </div>

          {/* Tags populations */}
          <div className="space-y-2">
            <Label>Populations</Label>
            <TagInput
              value={formData.pathologyTags}
              onChange={(tags) => setFormData((p) => ({ ...p, pathologyTags: tags }))}
              placeholder="Ex : personnes âgées, TDAH, enfants..."
              variant="pathology"
              suggestions={existingPathologyTags}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
          Annuler
        </Button>
        <Button type="submit" disabled={isPending || !!ageError || !!playersError} className="gap-2">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isUploading
            ? 'Upload en cours...'
            : isSubmitting
            ? 'Enregistrement...'
            : mode === 'create'
            ? 'Ajouter le jeu'
            : 'Enregistrer les modifications'}
        </Button>
      </div>
    </form>
  )
}
