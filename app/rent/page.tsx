import { PropertiesClient } from "../properties/properties-client"
import { getFilterOptions } from "../properties/actions"
import { fetchProperties, fetchUserAndFavorites } from "@/lib/properties"

export const metadata = {
  title: "Rent Properties | EverGreen",
  description: "Find your perfect rental property with EverGreen",
}

export default async function RentPage() {
  const [properties, { user, favorites }, filterOptions] = await Promise.all([
    fetchProperties("for_rent"),
    fetchUserAndFavorites(),
    getFilterOptions(),
  ])

  return (
    <PropertiesClient
      initialProperties={properties}
      initialFavorites={favorites}
      user={user}
      isRentPage
      filterOptions={filterOptions}
    />
  )
}
