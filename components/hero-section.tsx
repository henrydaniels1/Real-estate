"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"

const propertyTypes = ["House", "Apartment", "Residential"]
const filterOptions = ["City", "House", "Residential", "Apartment"]

export function HeroSection() {
  const router = useRouter()
  const [searchType, setSearchType] = useState("")
  const [price, setPrice] = useState("")
  const [location, setLocation] = useState("")
  const [rooms, setRooms] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    )
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchType) params.set("type", searchType)
    if (price) params.set("price", price)
    if (location) params.set("location", location)
    if (rooms) params.set("rooms", rooms)
    if (activeFilters.length > 0) params.set("filters", activeFilters.join(","))
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/hero-property.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pt-24 pb-32 md:px-8 lg:px-12">
        {/* Property Type Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          {propertyTypes.map((type) => (
            <span
              key={type}
              className="rounded-full border border-foreground/30 bg-background/80 px-4 py-1.5 text-sm font-medium text-foreground backdrop-blur-sm"
            >
              {type}
            </span>
          ))}
        </div>

        {/* Main Heading */}
        <div className="mb-8 max-w-2xl">
          <h1 className="mb-6 font-serif text-4xl font-light leading-tight text-foreground md:text-5xl lg:text-6xl text-balance">
            Build Your Future, One Property at a Time.
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            Own Your World. One Property at a Time. Own Your World. One Property at a Time. Own Your World. One Property at a Time.
          </p>
        </div>

        {/* Search Card */}
        <div className="w-full max-w-4xl rounded-2xl bg-card p-6 shadow-xl md:p-8">
          <h2 className="mb-6 text-xl font-semibold text-card-foreground">
            Find the best place
          </h2>

          {/* Search Form */}
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Looking for
              </label>
              <Input
                placeholder="Enter type"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="rounded-lg border-border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Price
              </label>
              <Select value={price} onValueChange={setPrice}>
                <SelectTrigger className="rounded-lg border-border">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-100000">Under $100,000</SelectItem>
                  <SelectItem value="100000-300000">$100,000 - $300,000</SelectItem>
                  <SelectItem value="300000-500000">$300,000 - $500,000</SelectItem>
                  <SelectItem value="500000+">$500,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Locations
              </label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="rounded-lg border-border">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jakarta">Jakarta, Indonesia</SelectItem>
                  <SelectItem value="semarang">Semarang, Indonesia</SelectItem>
                  <SelectItem value="bali">Bali, Indonesia</SelectItem>
                  <SelectItem value="surabaya">Surabaya, Indonesia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Number of rooms
              </label>
              <Select value={rooms} onValueChange={setRooms}>
                <SelectTrigger className="rounded-lg border-border">
                  <SelectValue placeholder="2 Bed rooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Bedroom</SelectItem>
                  <SelectItem value="2">2 Bedrooms</SelectItem>
                  <SelectItem value="3">3 Bedrooms</SelectItem>
                  <SelectItem value="4">4+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filter Tags and Search Button */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Filter:
              </span>
              {filterOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    activeFilters.includes(filter)
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <Button
              onClick={handleSearch}
              className="rounded-full bg-foreground px-6 py-2 text-background hover:bg-foreground/90"
            >
              <Search className="mr-2 h-4 w-4" />
              Search Properties
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
