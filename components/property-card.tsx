"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, MapPin, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface PropertyCardProps {
  id: string
  title: string
  location: string
  price: number
  rating: number
  imageUrl: string
  propertyType: string
  status?: string
  isFavorite?: boolean
  onFavoriteToggle?: (id: string) => void
}

export function PropertyCard({
  id,
  title,
  location,
  price,
  rating,
  imageUrl,
  propertyType,
  status = "for_sale",
  isFavorite = false,
  onFavoriteToggle,
}: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case "house":
        return "bg-red-500 text-red-50"
      case "apartment":
        return "bg-blue-500 text-blue-50"
      case "villa":
        return "bg-amber-500 text-amber-50"
      default:
        return "bg-primary text-primary-foreground"
    }
  }

  return (
    <Card className="group overflow-hidden border-border bg-card transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/properties/${id}`}>
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <Badge
          className={`absolute top-3 left-3 ${getBadgeVariant(propertyType)}`}
        >
          {propertyType}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
          onClick={(e) => {
            e.preventDefault()
            onFavoriteToggle?.(id)
          }}
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
            }`}
          />
        </Button>
      </div>
      <CardContent className="p-4">
        <Link href={`/properties/${id}`}>
          <h3 className="mb-1 font-semibold text-card-foreground line-clamp-1 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="line-clamp-1">{location}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">
              {formatPrice(price)}
            </span>
            <span className="text-sm text-muted-foreground">
              {status === "for_rent" ? "/month" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-card-foreground">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
