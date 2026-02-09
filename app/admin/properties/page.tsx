"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, Loader2, Eye, Star } from "lucide-react"
import Link from "next/link"

interface Property {
  id: string
  title: string
  description: string
  price: number
  city: string
  country: string
  address: string
  property_type: string
  status: string
  bedrooms: number
  bathrooms: number
  area_sqft: number
  image_url: string
  is_featured: boolean
  rating: number
  created_at: string
}

const propertyTypes = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
]

const statusOptions = [
  { value: "for_sale", label: "For Sale" },
  { value: "for_rent", label: "For Rent" },
  { value: "sold", label: "Sold" },
  { value: "rented", label: "Rented" },
]

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Property | null>(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState("all")
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    country: "Indonesia",
    address: "",
    property_type: "house",
    status: "for_sale",
    bedrooms: "3",
    bathrooms: "2",
    area_sqft: "",
    image_url: "",
    is_featured: false,
    rating: "4.5",
  })

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false })

    setProperties(data || [])
    setLoading(false)
  }

  const openDialog = (property?: Property) => {
    if (property) {
      setEditing(property)
      setFormData({
        title: property.title,
        description: property.description || "",
        price: property.price.toString(),
        city: property.city,
        country: property.country,
        address: property.address || "",
        property_type: property.property_type,
        status: property.status,
        bedrooms: property.bedrooms.toString(),
        bathrooms: property.bathrooms.toString(),
        area_sqft: property.area_sqft?.toString() || "",
        image_url: property.image_url || "",
        is_featured: property.is_featured || false,
        rating: property.rating?.toString() || "4.5",
      })
    } else {
      setEditing(null)
      setFormData({
        title: "",
        description: "",
        price: "",
        city: "",
        country: "Indonesia",
        address: "",
        property_type: "house",
        status: "for_sale",
        bedrooms: "3",
        bathrooms: "2",
        area_sqft: "",
        image_url: "",
        is_featured: false,
        rating: "4.5",
      })
    }
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)

    const dataToSave = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      city: formData.city,
      country: formData.country,
      address: formData.address,
      property_type: formData.property_type,
      status: formData.status,
      bedrooms: parseInt(formData.bedrooms) || 0,
      bathrooms: parseInt(formData.bathrooms) || 0,
      area_sqft: parseInt(formData.area_sqft) || 0,
      image_url: formData.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      is_featured: formData.is_featured,
      rating: parseFloat(formData.rating) || 4.5,
    }

    if (editing) {
      await supabase.from("properties").update(dataToSave).eq("id", editing.id)
    } else {
      await supabase.from("properties").insert(dataToSave)
    }

    await fetchProperties()
    setDialogOpen(false)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      await supabase.from("properties").delete().eq("id", id)
      await fetchProperties()
    }
  }

  const toggleFeatured = async (id: string, isFeatured: boolean) => {
    const { error } = await supabase
      .from("properties")
      .update({ is_featured: isFeatured })
      .eq("id", id)
    
    if (error) {
      console.error("Error updating featured status:", error)
    }
    await fetchProperties()
  }

  const filteredProperties = properties.filter((p) => {
    if (filter === "all") return true
    if (filter === "featured") return p.is_featured
    return p.status === filter
  })

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground">
            Manage all property listings on the platform
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Property" : "Add New Property"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Beautiful Family Home"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the property..."
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="250000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property_type">Type</Label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, property_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="Jakarta"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    placeholder="Indonesia"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bedrooms: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bathrooms: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area_sqft">Area (sqft)</Label>
                  <Input
                    id="area_sqft"
                    type="number"
                    value={formData.area_sqft}
                    onChange={(e) =>
                      setFormData({ ...formData, area_sqft: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Main Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Featured Property</Label>
                  <p className="text-sm text-muted-foreground">
                    Show on homepage featured section
                  </p>
                </div>
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_featured: checked })
                  }
                />
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editing ? "Update Property" : "Add Property"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Properties ({filteredProperties.length})</CardTitle>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="for_sale">For Sale</SelectItem>
                <SelectItem value="for_rent">For Rent</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={property.image_url || "/placeholder.svg"}
                        alt={property.title}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{property.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {property.property_type} - {property.bedrooms} bed, {property.bathrooms} bath
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{property.city}, {property.country}</TableCell>
                  <TableCell>
                    ${property.price?.toLocaleString()}
                    {property.status === "for_rent" && <span className="text-muted-foreground">/mo</span>}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        property.status === "for_sale"
                          ? "default"
                          : property.status === "for_rent"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {statusOptions.find((s) => s.value === property.status)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={property.is_featured}
                      onCheckedChange={(checked) =>
                        toggleFeatured(property.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/properties/${property.id}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDialog(property)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(property.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProperties.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No properties found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
