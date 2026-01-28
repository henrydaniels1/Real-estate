import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Bath, BedDouble, MapPin, Maximize } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export async function FeaturedProperties() {
  const supabase = await createClient()
  
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("is_featured", true)
    .limit(3)
    .order("created_at", { ascending: false })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <section className="bg-muted/50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
              Featured Properties
            </span>
            <h2 className="text-3xl font-semibold text-foreground md:text-4xl text-balance">
              Discover our handpicked selections
            </h2>
          </div>
          <Link href="/properties">
            <Button variant="outline" className="group rounded-full bg-transparent">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties?.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group"
            >
              <div className="overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={property.image_url || "/images/property-1.jpg"}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                    {property.property_type}
                  </Badge>
                  {property.is_featured && (
                    <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{property.city}, {property.country}</span>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>
                  <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
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
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(property.price)}
                      </span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                      View Details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {(!properties || properties.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured properties available at the moment.</p>
            <Link href="/properties">
              <Button className="mt-4">Browse All Properties</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
