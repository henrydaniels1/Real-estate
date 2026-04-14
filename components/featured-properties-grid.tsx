"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Bath, BedDouble, MapPin, Maximize } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

interface Property {
  id: string
  title: string
  city: string
  country: string
  price: number
  bedrooms: number
  bathrooms: number
  area_sqft: number
  property_type: string
  image_url: string
  is_featured: boolean
}

export function FeaturedPropertiesGrid({ properties }: { properties: Property[] }) {
  if (!properties.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center py-12"
      >
        <p className="text-gray-600 mb-4">No featured properties available at the moment.</p>
        <Link href="/properties">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
            Browse All Properties
          </Button>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {properties.map((property, index) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
          whileHover={{ y: -8 }}
        >
          <Link href={`/properties/${property.id}`} className="group block">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl hover:border-gray-300">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={property.image_url || "/images/property-1.jpg"}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Badge className="absolute top-4 left-4 bg-white/90 text-gray-900 backdrop-blur-sm">
                  {property.property_type}
                </Badge>
                {property.is_featured && (
                  <Badge className="absolute top-4 right-4 bg-blue-600 text-white">Featured</Badge>
                )}
              </div>
              <div className="p-5 lg:p-6">
                <div className="mb-2 flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{property.city}, {property.country}</span>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {property.title}
                </h3>
                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <BedDouble className="h-4 w-4" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    <span>{property.area_sqft?.toLocaleString()} sqft</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-2xl font-bold text-blue-600">{formatPrice(property.price)}</span>
                  <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50">
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
