"use server"

import { createClient } from "@/lib/supabase/server"

export async function getFilterOptions() {
  const supabase = await createClient()

  const { data: properties } = await supabase
    .from("properties")
    .select("city, country, price, property_type, amenities")

  if (!properties) return { locations: [], propertyTypes: [], amenities: [], priceRange: { min: 0, max: 100000 } }

  const locations = [...new Set(properties.map(p => `${p.city}, ${p.country}`))].sort()
  const propertyTypes = [...new Set(properties.map(p => p.property_type))].sort()
  const amenities = [...new Set(properties.flatMap(p => p.amenities || []))].sort()
  
  const prices = properties.map(p => p.price).filter(Boolean)
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 100000

  return {
    locations,
    propertyTypes,
    amenities,
    priceRange: { min: minPrice, max: maxPrice }
  }
}

export async function getPropertyById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("properties").select("*").eq("id", id).single()
  return { data, error }
}
