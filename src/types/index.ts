export interface BoardGame {
  id: string
  name: string
  description: string
  imageUrl: string
  minAge: number
  maxAge: number
  minPlayers: number
  maxPlayers: number
  pathologyTags: string[]
  psychomotorTags: string[]
  createdAt: string
  updatedAt: string
}

export interface BoardGameFormData {
  name: string
  description: string
  imageUrl: string
  minAge: number
  maxAge: number
  minPlayers: number
  maxPlayers: number
  pathologyTags: string[]
  psychomotorTags: string[]
}

export interface GameFilters {
  players?: number
  ageMin?: number
  ageMax?: number
  pathologyTags?: string[]
  psychomotorTags?: string[]
}

export interface ApiError {
  error: string
}
