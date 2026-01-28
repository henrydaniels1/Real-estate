import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ListingsHeader } from "@/components/listings-header"
import { Footer } from "@/components/footer"
import { FavoritesClient } from "./favorites-client"

export default async function FavoritesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/favorites")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const userData = {
    name: profile?.full_name || user.email?.split("@")[0] || "User",
    email: user.email || "",
    avatarUrl: profile?.avatar_url,
  }

  const { data: favorites } = await supabase
    .from("favorites")
    .select("property_id, properties(*)")
    .eq("user_id", user.id)

  const favoriteProperties =
    favorites
      ?.map((f) => {
        const p = f.properties as any
        if (!p) return null
        return {
          id: p.id,
          title: p.title,
          location: `${p.city}, ${p.country}`,
          address: p.address,
          price: p.price,
          rating: p.rating,
          image_url: p.image_url,
          property_type: p.property_type,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          area: p.area_sqft,
          status: p.status,
        }
      })
      .filter(Boolean) || []

  return (
    <div className="min-h-screen bg-background">
      <ListingsHeader user={userData} activeTab="favorites" />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          Your Favorites
        </h1>
        <p className="mb-8 text-muted-foreground">
          Properties you have saved for later
        </p>

        {favoriteProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="mb-2 text-lg font-medium text-foreground">
              No favorites yet
            </p>
            <p className="text-sm text-muted-foreground">
              Start browsing properties and save your favorites here.
            </p>
          </div>
        ) : (
          <FavoritesClient
            initialProperties={favoriteProperties as any[]}
            userId={user.id}
          />
        )}
      </div>
      <Footer />
    </div>
  )
}
