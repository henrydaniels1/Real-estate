"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, X } from "lucide-react"

interface FilterState {
  locations: string[]
  priceRange: string
  customPriceMin: number
  customPriceMax: number
  landAreaMin: string
  landAreaMax: string
  propertyTypes: string[]
  amenities: string[]
}

interface PropertyFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearAll: () => void
  locationOptions?: string[]
  propertyTypeOptions?: string[]
  amenityOptions?: string[]
}

export function PropertyFilters({
  filters,
  onFiltersChange,
  onClearAll,
  locationOptions = [],
  propertyTypeOptions = [],
  amenityOptions = [],
}: PropertyFiltersProps) {
  const [isMounted, setIsMounted] = useState(false)
  const priceRangeOptions = [
    { value: "under-1000", label: "Under $1,000" },
    { value: "1000-15000", label: "$1,000 - $15,000" },
    { value: "over-15000", label: "More Than $15,000" },
    { value: "custom", label: "Custom" },
  ]
  const [openSections, setOpenSections] = useState({
    location: true,
    price: true,
    landArea: true,
    type: true,
    amenities: true,
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <aside className="w-full space-y-4 lg:w-64">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Custom Filter</h2>
          <Button
            variant="link"
            className="h-auto p-0 text-sm text-primary"
            onClick={onClearAll}
          >
            Clear all
          </Button>
        </div>
        <div className="space-y-4">
          <div className="h-20 bg-muted/20 rounded animate-pulse" />
          <div className="h-32 bg-muted/20 rounded animate-pulse" />
          <div className="h-24 bg-muted/20 rounded animate-pulse" />
          <div className="h-28 bg-muted/20 rounded animate-pulse" />
          <div className="h-36 bg-muted/20 rounded animate-pulse" />
        </div>
      </aside>
    )
  }

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (
    key: "locations" | "propertyTypes" | "amenities",
    value: string
  ) => {
    const current = filters[key]
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    updateFilter(key, updated)
  }

  return (
    <aside className="w-full space-y-4 lg:w-64">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Custom Filter</h2>
        <Button
          variant="link"
          className="h-auto p-0 text-sm text-primary"
          onClick={onClearAll}
        >
          Clear all
        </Button>
      </div>

      {/* Location Filter */}
      <Collapsible open={openSections.location}>
        <CollapsibleTrigger
          onClick={() => toggleSection("location")}
          className="flex w-full items-center justify-between py-2"
        >
          <span className="font-medium text-foreground">Location</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              openSections.location ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          {locationOptions.map((location) => (
            <div key={location} className="flex items-center space-x-2">
              <Checkbox
                id={location}
                checked={filters.locations.includes(location)}
                onCheckedChange={() => toggleArrayFilter("locations", location)}
              />
              <Label
                htmlFor={location}
                className="text-sm font-normal text-muted-foreground cursor-pointer"
              >
                {location}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Range Filter */}
      <Collapsible open={openSections.price}>
        <CollapsibleTrigger
          onClick={() => toggleSection("price")}
          className="flex w-full items-center justify-between py-2"
        >
          <span className="font-medium text-foreground">Price Range</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              openSections.price ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          <RadioGroup
            value={filters.priceRange}
            onValueChange={(value) => updateFilter("priceRange", value)}
          >
            {priceRangeOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label
                  htmlFor={option.value}
                  className="text-sm font-normal text-muted-foreground cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {filters.priceRange === "custom" && (
            <div className="space-y-3 pt-2">
              <Slider
                value={[filters.customPriceMin, filters.customPriceMax]}
                min={0}
                max={100000}
                step={1000}
                onValueChange={([min, max]) => {
                  updateFilter("customPriceMin", min)
                  updateFilter("customPriceMax", max)
                }}
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>${filters.customPriceMin.toLocaleString()}</span>
                <span>${filters.customPriceMax.toLocaleString()}</span>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Land Area Filter */}
      <Collapsible open={openSections.landArea}>
        <CollapsibleTrigger
          onClick={() => toggleSection("landArea")}
          className="flex w-full items-center justify-between py-2"
        >
          <span className="font-medium text-foreground">Land Area</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              openSections.landArea ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Min</Label>
              <Input
                placeholder="sq ft"
                value={filters.landAreaMin}
                onChange={(e) => updateFilter("landAreaMin", e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Max</Label>
              <Input
                placeholder="sq ft"
                value={filters.landAreaMax}
                onChange={(e) => updateFilter("landAreaMax", e.target.value)}
                className="h-9"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Property Type Filter */}
      <Collapsible open={openSections.type}>
        <CollapsibleTrigger
          onClick={() => toggleSection("type")}
          className="flex w-full items-center justify-between py-2"
        >
          <span className="font-medium text-foreground">Type Of Place</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              openSections.type ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          {propertyTypeOptions.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={filters.propertyTypes.includes(type)}
                onCheckedChange={() => toggleArrayFilter("propertyTypes", type)}
              />
              <Label
                htmlFor={type}
                className="text-sm font-normal text-muted-foreground cursor-pointer"
              >
                {type}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Amenities Filter */}
      <Collapsible open={openSections.amenities}>
        <CollapsibleTrigger
          onClick={() => toggleSection("amenities")}
          className="flex w-full items-center justify-between py-2"
        >
          <span className="font-medium text-foreground">Amenities</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              openSections.amenities ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="flex flex-wrap gap-2">
            {amenityOptions.map((amenity) => (
              <button
                key={amenity}
                onClick={() => toggleArrayFilter("amenities", amenity)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors ${
                  filters.amenities.includes(amenity)
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {amenity}
                {filters.amenities.includes(amenity) && (
                  <X className="h-3 w-3" />
                )}
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </aside>
  )
}
