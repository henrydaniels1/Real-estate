export interface Property {
  id: string
  title: string
  description?: string
  price: number
  location: string
  address?: string
  property_type: string
  bedrooms?: number
  bathrooms?: number
  kitchens?: number
  garages?: number
  area?: number
  image_url: string
  images?: string[]
  amenities?: string[]
  rating?: number
  status?: string
}

export interface User {
  id?: string
  name: string
  email: string
  avatarUrl?: string
}
