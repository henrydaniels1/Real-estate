"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Save, Loader2, Plus, Trash2, ImageIcon } from "lucide-react"

interface HeroContent {
  id: string
  title: string
  subtitle: string
  description: string
  background_image: string
  cta_text: string
  cta_link: string
  property_tags: string[]
  is_active: boolean
}

export default function AdminHeroPage() {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newTag, setNewTag] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchHeroContent()
  }, [])

  const fetchHeroContent = async () => {
    const { data } = await supabase
      .from("hero_content")
      .select("*")
      .eq("is_active", true)
      .single()

    if (data) {
      setHeroContent(data)
    } else {
      // Create default hero content
      setHeroContent({
        id: "",
        title: "Build Your Future, One Property at a Time.",
        subtitle: "Own Your World, One Property at a Time.",
        description: "Find your dream property with EverGreen.",
        background_image: "/images/hero-property.jpg",
        cta_text: "Search Properties",
        cta_link: "/properties",
        property_tags: ["House", "Apartment", "Residential"],
        is_active: true,
      })
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!heroContent) return

    setSaving(true)

    if (heroContent.id) {
      await supabase
        .from("hero_content")
        .update({
          title: heroContent.title,
          subtitle: heroContent.subtitle,
          description: heroContent.description,
          background_image: heroContent.background_image,
          cta_text: heroContent.cta_text,
          cta_link: heroContent.cta_link,
          property_tags: heroContent.property_tags,
          is_active: heroContent.is_active,
        })
        .eq("id", heroContent.id)
    } else {
      const { data } = await supabase
        .from("hero_content")
        .insert({
          title: heroContent.title,
          subtitle: heroContent.subtitle,
          description: heroContent.description,
          background_image: heroContent.background_image,
          cta_text: heroContent.cta_text,
          cta_link: heroContent.cta_link,
          property_tags: heroContent.property_tags,
          is_active: heroContent.is_active,
        })
        .select()
        .single()

      if (data) {
        setHeroContent(data)
      }
    }

    setSaving(false)
  }

  const addTag = () => {
    if (newTag && heroContent && !heroContent.property_tags.includes(newTag)) {
      setHeroContent({
        ...heroContent,
        property_tags: [...heroContent.property_tags, newTag],
      })
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    if (heroContent) {
      setHeroContent({
        ...heroContent,
        property_tags: heroContent.property_tags.filter((t) => t !== tag),
      })
    }
  }

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
          <h1 className="text-3xl font-bold">Hero Section</h1>
          <p className="text-muted-foreground">
            Manage the hero section content on your homepage
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Edit the hero section text and call-to-action</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Main Title</Label>
              <Input
                id="title"
                value={heroContent?.title || ""}
                onChange={(e) =>
                  setHeroContent((prev) =>
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
                placeholder="Build Your Future..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={heroContent?.subtitle || ""}
                onChange={(e) =>
                  setHeroContent((prev) =>
                    prev ? { ...prev, subtitle: e.target.value } : null
                  )
                }
                placeholder="Own Your World..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={heroContent?.description || ""}
                onChange={(e) =>
                  setHeroContent((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                placeholder="Find your dream property..."
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cta_text">CTA Button Text</Label>
                <Input
                  id="cta_text"
                  value={heroContent?.cta_text || ""}
                  onChange={(e) =>
                    setHeroContent((prev) =>
                      prev ? { ...prev, cta_text: e.target.value } : null
                    )
                  }
                  placeholder="Search Properties"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta_link">CTA Button Link</Label>
                <Input
                  id="cta_link"
                  value={heroContent?.cta_link || ""}
                  onChange={(e) =>
                    setHeroContent((prev) =>
                      prev ? { ...prev, cta_link: e.target.value } : null
                    )
                  }
                  placeholder="/properties"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Active</Label>
                <p className="text-sm text-muted-foreground">Show this hero on the homepage</p>
              </div>
              <Switch
                checked={heroContent?.is_active || false}
                onCheckedChange={(checked) =>
                  setHeroContent((prev) =>
                    prev ? { ...prev, is_active: checked } : null
                  )
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Background Image</CardTitle>
              <CardDescription>Upload or set the hero background image URL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="background_image">Image URL</Label>
                <Input
                  id="background_image"
                  value={heroContent?.background_image || ""}
                  onChange={(e) =>
                    setHeroContent((prev) =>
                      prev ? { ...prev, background_image: e.target.value } : null
                    )
                  }
                  placeholder="/images/hero.jpg"
                />
              </div>

              {heroContent?.background_image && (
                <div className="relative aspect-video overflow-hidden rounded-lg border">
                  <img
                    src={heroContent.background_image || "/placeholder.svg"}
                    alt="Hero preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {!heroContent?.background_image && (
                <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">No image set</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Property Tags</CardTitle>
              <CardDescription>Tags shown on the hero section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                />
                <Button onClick={addTag} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {heroContent?.property_tags?.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )) || []}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
