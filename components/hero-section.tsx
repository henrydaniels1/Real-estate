"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
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
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const currentSectionRef = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2, // Trigger when 20% of the section is visible
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
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-background/80" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pt-24 pb-32 md:px-8 lg:px-12">
        {/* Property Type Tags */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          {propertyTypes.map((type, index) => (
            <motion.span
              key={type}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md hover:bg-white/20 transition-colors"
            >
              {type}
            </motion.span>
          ))}
        </motion.div>

        {/* Main Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8 max-w-2xl"
        >
          <h1 className="mb-6 font-serif text-4xl font-light leading-tight text-white md:text-5xl lg:text-6xl text-balance drop-shadow-lg">
            Build Your Future, One Property at a Time.
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="max-w-md text-sm leading-relaxed text-white/90 md:text-base drop-shadow-md"
          >
            Discover exceptional properties that match your lifestyle. From luxury homes to investment opportunities, find your perfect space.
          </motion.p>
        </motion.div>

        {/* Search Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ y: -2 }}
          className="w-full max-w-4xl rounded-2xl bg-white/95 backdrop-blur-md p-6 shadow-2xl md:p-8 border border-white/20"
        >
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            Find the best place
          </h2>

          {/* Search Form */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-6 grid gap-4 md:grid-cols-4"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-700">
                Looking for
              </label>
              <Input
                placeholder="Enter type"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="rounded-lg border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-700">
                Price
              </label>
              <Select value={price} onValueChange={setPrice}>
                <SelectTrigger className="rounded-lg border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-100000">Under $100,000</SelectItem>
                  <SelectItem value="100000-300000">$100,000 - $300,000</SelectItem>
                  <SelectItem value="300000-500000">$300,000 - $500,000</SelectItem>
                  <SelectItem value="500000+">$500,000+</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-700">
                Locations
              </label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="rounded-lg border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jakarta">Jakarta, Indonesia</SelectItem>
                  <SelectItem value="semarang">Semarang, Indonesia</SelectItem>
                  <SelectItem value="bali">Bali, Indonesia</SelectItem>
                  <SelectItem value="surabaya">Surabaya, Indonesia</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-700">
                Number of rooms
              </label>
              <Select value={rooms} onValueChange={setRooms}>
                <SelectTrigger className="rounded-lg border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                  <SelectValue placeholder="2 Bed rooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Bedroom</SelectItem>
                  <SelectItem value="2">2 Bedrooms</SelectItem>
                  <SelectItem value="3">3 Bedrooms</SelectItem>
                  <SelectItem value="4">4+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </motion.div>

          {/* Filter Tags and Search Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Filter:
              </span>
              {filterOptions.map((filter, index) => (
                <motion.button
                  key={filter}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleFilter(filter)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                    activeFilters.includes(filter)
                      ? "bg-blue-600 text-white shadow-md"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  {filter}
                </motion.button>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleSearch}
                className="rounded-full bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Search className="mr-2 h-4 w-4" />
                Search Properties
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
