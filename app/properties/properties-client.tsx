"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ListingsHeader } from "@/components/listings-header"
import { PropertyFilters } from "@/components/property-filters"
import { PropertyCard } from "@/components/property-card"
import { PropertyDetailPanel } from "@/components/property-detail-panel"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  address: string
  property_type: string
  bedrooms: number
  bathrooms: number
  area: number
  image_url: string
  images: string[]
  amenities: string[]
  rating: number
  status?: string
  kitchens?: number
  garages?: number
}

interface PropertiesClientProps {
  initialProperties: Property[]
  initialFavorites: string[]
  user: {
    id?: string
    name: string
    email: string
    avatarUrl?: string
  } | null
  pageTitle?: string
  pageDescription?: string
  isRentPage?: boolean
  filterOptions: {
    locations: string[]
    propertyTypes: string[]
    amenities: string[]
  }
}

const defaultFilters = {
  locations: [] as string[],
  priceRange: "",
  customPriceMin: 0,
  customPriceMax: 50000,
  landAreaMin: "",
  landAreaMax: "",
  propertyTypes: [] as string[],
  amenities: [] as string[],
}

export function PropertiesClient({
  initialProperties,
  initialFavorites,
  user,
  isRentPage = false,
  filterOptions,
}: PropertiesClientProps) {
  const [filters, setFilters] = useState(defaultFilters)
  const [favorites, setFavorites] = useState<string[]>(initialFavorites)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  )
  const [showFilters, setShowFilters] = useState(false)

  const supabase = createClient()

  const filteredProperties = useMemo(() => {
    const { locations, priceRange, customPriceMin, customPriceMax, landAreaMin, landAreaMax, propertyTypes, amenities } = filters
    
    if (!locations.length && !priceRange && !propertyTypes.length && !amenities.length && !landAreaMin && !landAreaMax) {
      return initialProperties
    }

    const minArea = landAreaMin ? Number(landAreaMin) : null
    const maxArea = landAreaMax ? Number(landAreaMax) : null
    const hasValidMinArea = minArea && !isNaN(minArea)
    const hasValidMaxArea = maxArea && !isNaN(maxArea)

    return initialProperties.filter((property) => {
      // Location filter
      if (locations.length > 0) {
        const propertyLocation = property.location.toLowerCase()
        if (!locations.some((loc) => propertyLocation.includes(loc.toLowerCase()))) {
          return false
        }
      }

      // Price filter
      if (priceRange) {
        const price = property.price
        switch (priceRange) {
          case "under-1000":
            if (price >= 1000) return false
            break
          case "1000-15000":
            if (price < 1000 || price > 15000) return false
            break
          case "over-15000":
            if (price <= 15000) return false
            break
          case "custom":
            if (price < customPriceMin || price > customPriceMax) return false
            break
        }
      }

      // Property type filter
      if (propertyTypes.length > 0) {
        const propertyType = property.property_type.toLowerCase()
        if (!propertyTypes.some((type) => 
          propertyType === type.toLowerCase() ||
          (type === "Single Family Home" && propertyType === "house")
        )) {
          return false
        }
      }

      // Amenities filter
      if (amenities.length > 0) {
        const propertyAmenities = property.amenities || []
        if (!amenities.every((amenity) =>
          propertyAmenities.some((a) => a.toLowerCase() === amenity.toLowerCase())
        )) {
          return false
        }
      }

      // Land area filter
      if (hasValidMinArea && property.area < minArea) return false
      if (hasValidMaxArea && property.area > maxArea) return false

      return true
    })
  }, [initialProperties, filters])

  const handleFavoriteToggle = async (propertyId: string) => {
    if (!user || !user.id) {
      window.location.href = "/auth/login"
      return
    }

    const isFavorite = favorites.includes(propertyId)

    if (isFavorite) {
      setFavorites((prev) => prev.filter((id) => id !== propertyId))
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("property_id", propertyId)
        .eq("user_id", user.id)
      
      if (error) {
        console.log("[v0] Error removing favorite:", error)
        setFavorites((prev) => [...prev, propertyId])
      }
    } else {
      setFavorites((prev) => [...prev, propertyId])
      const { error } = await supabase.from("favorites").insert({ 
        property_id: propertyId,
        user_id: user.id 
      })
      
      if (error) {
        console.log("[v0] Error adding favorite:", error)
        setFavorites((prev) => prev.filter((id) => id !== propertyId))
      }
    }
  }

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property)
  }

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      suppressHydrationWarning
    >
      <ListingsHeader user={user} activeTab={isRentPage ? "rent" : "buy"} />

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="lg:flex lg:gap-6">
          
          {/* Filters Sidebar */}
          <motion.div
            className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-card p-4 shadow-lg transition-transform lg:relative lg:z-0 lg:w-64 lg:transform-none lg:bg-transparent lg:p-0 lg:shadow-none lg:flex-shrink-0 ${
              showFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PropertyFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearAll={() => setFilters(defaultFilters)}
              locationOptions={filterOptions.locations}
              propertyTypeOptions={filterOptions.propertyTypes}
              amenityOptions={filterOptions.amenities}
            />
          </motion.div>

          {/* Overlay for mobile */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
                onClick={() => setShowFilters(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>

          {/* Properties Grid */}
          <div className="flex-1 lg:flex lg:gap-6">
            <div className="flex-1">
              {/* Mobile Filter Toggle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="lg:hidden mb-4"
              >
                <Button
                  variant="outline"
                  className="bg-card shadow-sm border-border"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? (
                    <X className="mr-2 h-4 w-4" />
                  ) : (
                    <Menu className="mr-2 h-4 w-4" />
                  )}
                  Filters
                </Button>
              </motion.div>
              
              <motion.div 
                className="mb-4 text-sm text-muted-foreground"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {filteredProperties.length} properties found
              </motion.div>
              <motion.div 
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {filteredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    onClick={() => handlePropertySelect(property)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handlePropertySelect(property)
                      }
                    }}
                    className="cursor-pointer"
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${property.title} in ${property.location}`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <PropertyCard
                      id={property.id}
                      title={property.title}
                      location={property.location}
                      price={property.price}
                      rating={property.rating || 4.5}
                      imageUrl={property.image_url}
                      propertyType={property.property_type}
                      status={property.status || (isRentPage ? "for_rent" : "for_sale")}
                      isFavorite={favorites.includes(property.id)}
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {filteredProperties.length === 0 && (
                <motion.div 
                  className="flex flex-col items-center justify-center py-12 text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <p className="text-lg font-medium text-foreground">
                    No properties found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters to see more results.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Property Detail Panel */}
            <AnimatePresence>
              {selectedProperty && (
                <motion.div 
                  className="hidden w-96 lg:block lg:flex-shrink-0"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.3 }}
                >
                  <PropertyDetailPanel
                    property={{
                      id: selectedProperty.id,
                      title: selectedProperty.title,
                      location: selectedProperty.location,
                      price: selectedProperty.price,
                      description:
                        selectedProperty.description ||
                        "Welcome to this beautiful property. Experience a peaceful escape at this modern retreat set on a quiet hillside with stunning views of valleys and starry nights.",
                      bedrooms: selectedProperty.bedrooms,
                      bathrooms: selectedProperty.bathrooms,
                      kitchens: selectedProperty.kitchens || 1,
                      area: selectedProperty.area,
                      garages: selectedProperty.garages || 1,
                      imageUrl: selectedProperty.image_url,
                      images: selectedProperty.images || [],
                    }}
                    onClose={() => setSelectedProperty(null)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  )
}
