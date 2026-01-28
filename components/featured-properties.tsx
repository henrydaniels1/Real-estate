"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Bath, BedDouble, MapPin, Maximize } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const mockProperties = [
  {
    id: "1",
    title: "Modern Villa with Ocean View",
    city: "Bali",
    country: "Indonesia",
    price: 850000,
    bedrooms: 4,
    bathrooms: 3,
    area_sqft: 3200,
    property_type: "Villa",
    image_url: "/images/property-1.jpg",
    is_featured: true
  },
  {
    id: "2",
    title: "Luxury Apartment Downtown",
    city: "Jakarta",
    country: "Indonesia",
    price: 650000,
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 2100,
    property_type: "Apartment",
    image_url: "/images/property-2.jpg",
    is_featured: true
  },
  {
    id: "3",
    title: "Family House with Garden",
    city: "Surabaya",
    country: "Indonesia",
    price: 420000,
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 2800,
    property_type: "House",
    image_url: "/images/property-3.jpg",
    is_featured: true
  }
]

export function FeaturedProperties() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const currentSectionRef = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );

    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }

    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <section ref={sectionRef} className="bg-gray-50 py-16 md:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-4"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-blue-600">
              Featured Properties
            </span>
            <h2 className="text-3xl font-semibold text-gray-900 md:text-4xl lg:text-5xl text-balance">
              Discover our handpicked selections
            </h2>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/properties">
              <Button variant="outline" className="group rounded-full bg-white border-gray-200 hover:border-blue-600 hover:bg-blue-50">
                View All Properties
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {mockProperties?.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
              whileHover={{ y: -8 }}
            >
              <Link
                href={`/properties/${property.id}`}
                className="group block"
              >
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
                      <Badge className="absolute top-4 right-4 bg-blue-600 text-white">
                        Featured
                      </Badge>
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
                      <div>
                        <span className="text-2xl font-bold text-blue-600">
                          {formatPrice(property.price)}
                        </span>
                      </div>
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

        {(!mockProperties || mockProperties.length === 0) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <p className="text-gray-600 mb-4">No featured properties available at the moment.</p>
            <Link href="/properties">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">Browse All Properties</Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
