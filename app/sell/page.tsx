import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ListingsHeader } from "@/components/listings-header"
import { Footer } from "@/components/footer"
import { SellPropertyForm } from "./sell-property-form"

export default async function SellPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/sell")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const userData = {
    id: user.id,
    name: profile?.full_name || user.email?.split("@")[0] || "User",
    email: user.email || "",
    avatarUrl: profile?.avatar_url,
  }

  return (
    <div className="min-h-screen bg-background">
      <ListingsHeader user={userData} />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            List Your Property
          </h1>
          <p className="text-muted-foreground">
            Fill in the details below to list your property on EverGreen
          </p>
        </div>
        <SellPropertyForm userId={user.id} />
      </div>
      <Footer />
    </div>
  )
}
