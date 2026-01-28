"use client"

import { useState } from "react"
import { PropertyCard } from "@/components/property-card"
import { createClient } from "@/lib/supabase/client"

interface Property {
  id: string
  title: string
  location: string
  price: number
  rating: number
  image_url: string
  property_type: string
  status?: string
}

interface FavoritesClientProps {
  initialProperties: Property[]
  userId: string
}

export function FavoritesClient({
  initialProperties,
  userId,
}: FavoritesClientProps) {
  const [properties, setProperties] = useState(initialProperties)
  const supabase = createClient()

  const handleFavoriteToggle = async (propertyId: string) => {
    // Remove from UI immediately
    setProperties((prev) => prev.filter((p) => p.id !== propertyId))

    // Remove from database
    await supabase
      .from("favorites")
      .delete()
      .match({ property_id: propertyId, user_id: userId })
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          id={property.id}
          title={property.title}
          location={property.location}
          price={property.price}
          rating={property.rating || 4.5}
          imageUrl={property.image_url}
          propertyType={property.property_type}
          status={property.status}
          isFavorite={true}
          onFavoriteToggle={handleFavoriteToggle}
        />
      ))}
    </div>
  )
}
