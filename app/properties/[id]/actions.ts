"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function toggleFavorite(propertyId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: "User not authenticated" }
  }

  // Check if already favorited
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("property_id", propertyId)
    .eq("user_id", user.id)
    .single()

  if (existing) {
    // Remove from favorites
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("property_id", propertyId)
      .eq("user_id", user.id)
    
    if (error) {
      return { error: "Failed to remove from favorites" }
    }
    
    revalidatePath(`/properties/${propertyId}`)
    return { success: true, isFavorite: false }
  } else {
    // Add to favorites
    const { error } = await supabase
      .from("favorites")
      .insert({
        property_id: propertyId,
        user_id: user.id
      })
    
    if (error) {
      return { error: "Failed to add to favorites" }
    }
    
    revalidatePath(`/properties/${propertyId}`)
    return { success: true, isFavorite: true }
  }
}

export async function checkIsFavorite(propertyId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return false
  }

  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("property_id", propertyId)
    .eq("user_id", user.id)
    .single()

  return !!data
}