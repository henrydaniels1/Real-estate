"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BedDouble,
  Bath,
  ChefHat,
  Maximize,
  Car,
  X,
} from "lucide-react"

interface Property {
  id: string
  title: string
  location: string
  price: number
  description: string
  bedrooms: number
  bathrooms: number
  kitchens: number
  area: number
  garages: number
  imageUrl: string
  images: string[]
}

interface PropertyDetailPanelProps {
  property: Property | null
  onClose: () => void
}

export function PropertyDetailPanel({
  property,
  onClose,
}: PropertyDetailPanelProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!property) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const amenities = [
    { icon: BedDouble, label: "Rooms", value: property.bedrooms },
    { icon: BedDouble, label: "Beds", value: property.bedrooms },
    { icon: Bath, label: "Baths", value: property.bathrooms },
    { icon: ChefHat, label: "Kitchen", value: property.kitchens },
    { icon: Maximize, label: "sqft", value: property.area.toLocaleString() },
    { icon: Car, label: "Garage", value: property.garages },
  ]

  return (
    <Card className="sticky top-4 h-fit border-border bg-card">
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <Image
            src={property.imageUrl || "/placeholder.svg"}
            alt={property.title}
            fill
            className="object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h2 className="mb-1 text-xl font-semibold text-card-foreground">
            {property.title}
          </h2>
          <p className="mb-2 text-sm text-muted-foreground">
            {property.location}
          </p>
          <div className="mb-4">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(property.price)}
            </span>
            <span className="text-muted-foreground">/month</span>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium text-card-foreground">
                  Description:
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {property.description}
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="grid grid-cols-3 gap-3">
                {amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <amenity.icon className="h-4 w-4" />
                    <span>
                      {amenity.value} {amenity.label}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <p className="text-sm text-muted-foreground">
                No reviews yet. Be the first to review this property.
              </p>
            </TabsContent>

            <TabsContent value="about">
              <p className="text-sm text-muted-foreground">
                Contact our agents for more information about this property.
              </p>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-full border-primary text-primary hover:bg-primary/10 bg-transparent"
            >
              Contact Agent
            </Button>
            <Button className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              Order Now
            </Button>
          </div>

          {/* Map Placeholder */}
          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <div className="relative aspect-video bg-muted">
              <Image
                src="/placeholder.svg?height=200&width=400"
                alt="Map"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                <p className="text-sm text-muted-foreground">Map View</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
