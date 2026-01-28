"use client"

import { useState, useMemo } from "react"
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
}

interface PropertiesClientProps {
  initialProperties: Property[]
  initialFavorites: string[]
  user: {
    name: string
    email: string
    avatarUrl?: string
  } | null
  pageTitle?: string
  pageDescription?: string
  isRentPage?: boolean
}

const defaultFilters = {
  locations: [],
  priceRange: "",
  customPriceMin: 0,
  customPriceMax: 50000,
  landAreaMin: "",
  landAreaMax: "",
  propertyTypes: [],
  amenities: [],
}

export function PropertiesClient({
  initialProperties,
  initialFavorites,
  user,
  pageTitle = "Properties for Sale",
  pageDescription,
  isRentPage = false,
}: PropertiesClientProps) {
  const [filters, setFilters] = useState(defaultFilters)
  const [favorites, setFavorites] = useState<string[]>(initialFavorites)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  )
  const [showFilters, setShowFilters] = useState(false)

  const supabase = createClient()

  const filteredProperties = useMemo(() => {
    return initialProperties.filter((property) => {
      // Location filter
      if (
        filters.locations.length > 0 &&
        !filters.locations.some((loc) =>
          property.location.toLowerCase().includes(loc.toLowerCase())
        )
      ) {
        return false
      }

      // Price filter
      if (filters.priceRange) {
        if (filters.priceRange === "under-1000" && property.price >= 1000) {
          return false
        }
        if (
          filters.priceRange === "1000-15000" &&
          (property.price < 1000 || property.price > 15000)
        ) {
          return false
        }
        if (filters.priceRange === "over-15000" && property.price <= 15000) {
          return false
        }
        if (
          filters.priceRange === "custom" &&
          (property.price < filters.customPriceMin ||
            property.price > filters.customPriceMax)
        ) {
          return false
        }
      }

      // Property type filter
      if (
        filters.propertyTypes.length > 0 &&
        !filters.propertyTypes.some(
          (type) =>
            property.property_type.toLowerCase() === type.toLowerCase() ||
            (type === "Single Family Home" &&
              property.property_type.toLowerCase() === "house")
        )
      ) {
        return false
      }

      // Amenities filter
      if (
        filters.amenities.length > 0 &&
        !filters.amenities.every((amenity) =>
          property.amenities?.some(
            (a) => a.toLowerCase() === amenity.toLowerCase()
          )
        )
      ) {
        return false
      }

      // Land area filter
      if (filters.landAreaMin && property.area < parseInt(filters.landAreaMin)) {
        return false
      }
      if (filters.landAreaMax && property.area > parseInt(filters.landAreaMax)) {
        return false
      }

      return true
    })
  }, [initialProperties, filters])

  const handleFavoriteToggle = async (propertyId: string) => {
    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    const isFavorite = favorites.includes(propertyId)

    if (isFavorite) {
      setFavorites((prev) => prev.filter((id) => id !== propertyId))
      await supabase
        .from("favorites")
        .delete()
        .match({ property_id: propertyId })
    } else {
      setFavorites((prev) => [...prev, propertyId])
      await supabase.from("favorites").insert({ property_id: propertyId })
    }
  }

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property)
  }

  return (
    <div className="min-h-screen bg-background">
      <ListingsHeader user={user} activeTab={isRentPage ? "rent" : "buy"} />

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex gap-6">
          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            className="fixed bottom-4 left-4 z-50 lg:hidden bg-transparent"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? (
              <X className="mr-2 h-4 w-4" />
            ) : (
              <Menu className="mr-2 h-4 w-4" />
            )}
            Filters
          </Button>

          {/* Filters Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-card p-4 shadow-lg transition-transform lg:relative lg:z-0 lg:w-64 lg:transform-none lg:bg-transparent lg:p-0 lg:shadow-none ${
              showFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <PropertyFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearAll={() => setFilters(defaultFilters)}
            />
          </div>

          {/* Overlay for mobile */}
          {showFilters && (
            <div
              className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* Properties Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-muted-foreground">
              {filteredProperties.length} properties found
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  onClick={() => handlePropertySelect(property)}
                  className="cursor-pointer"
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
                </div>
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg font-medium text-foreground">
                  No properties found
                </p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            )}
          </div>

          {/* Property Detail Panel */}
          {selectedProperty && (
            <div className="hidden w-96 lg:block">
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
                  kitchens: 2,
                  area: selectedProperty.area,
                  garages: 1,
                  imageUrl: selectedProperty.image_url,
                  images: selectedProperty.images || [],
                }}
                onClose={() => setSelectedProperty(null)}
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
