"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
    // Store current state for rollback
    const previousProperties = properties
    
    // Remove from UI immediately (optimistic update)
    setProperties((prev) => prev.filter((p) => p.id !== propertyId))

    // Remove from database
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("property_id", propertyId)
      .eq("user_id", userId)
    
    if (error) {
      console.log("[v0] Error removing favorite:", error)
      // Rollback on error
      setProperties(previousProperties)
    }
  }

  return (
    <motion.div 
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {properties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.5,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.03,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.97 }}
            layout
          >
            <PropertyCard
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
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
