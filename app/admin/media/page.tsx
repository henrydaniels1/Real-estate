"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2, Loader2, Copy, Check, ImageIcon } from "lucide-react"

interface MediaItem {
  id: string
  name: string
  file_url: string
  file_type: string
  file_size?: number
  alt_text?: string
  folder: string
  created_at: string
}

const folders = ["hero", "property", "blog", "testimonial", "general"]

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState("all")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: "",
    file_url: "",
    file_type: "image",
    alt_text: "",
    folder: "general",
  })

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    const { data } = await supabase
      .from("media_library")
      .select("*")
      .order("created_at", { ascending: false })

    setMedia(data || [])
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)

    await supabase.from("media_library").insert({
      name: formData.name || "Untitled",
      file_url: formData.file_url,
      file_type: formData.file_type,
      alt_text: formData.alt_text,
      folder: formData.folder,
    })

    await fetchMedia()
    setDialogOpen(false)
    setFormData({ name: "", file_url: "", file_type: "image", alt_text: "", folder: "general" })
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this media item?")) {
      await supabase.from("media_library").delete().eq("id", id)
      await fetchMedia()
    }
  }

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredMedia = media.filter((item) => {
    if (filter === "all") return true
    return item.folder === filter
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
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">
            Manage images and media files for your website
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Media</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">File Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="hero-image"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file_url">File URL</Label>
                <Input
                  id="file_url"
                  value={formData.file_url}
                  onChange={(e) =>
                    setFormData({ ...formData, file_url: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {formData.file_url && (
                <div className="relative aspect-video overflow-hidden rounded-lg border">
                  <img
                    src={formData.file_url || "/placeholder.svg"}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="alt_text">Alt Text</Label>
                <Input
                  id="alt_text"
                  value={formData.alt_text}
                  onChange={(e) =>
                    setFormData({ ...formData, alt_text: e.target.value })
                  }
                  placeholder="Describe the image..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="folder">Folder</Label>
                <Select
                  value={formData.folder}
                  onValueChange={(value) =>
                    setFormData({ ...formData, folder: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {folders.map((folder) => (
                      <SelectItem key={folder} value={folder}>
                        {folder.charAt(0).toUpperCase() + folder.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSave}
                disabled={saving || !formData.file_url}
                className="w-full"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Add to Library
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Media ({filteredMedia.length})</CardTitle>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder} value={folder}>
                    {folder.charAt(0).toUpperCase() + folder.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No media found</p>
              <p className="text-sm text-muted-foreground">
                Add your first image to the library
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-lg border bg-muted"
                >
                  <div className="aspect-square">
                    <img
                      src={item.file_url || "/placeholder.svg"}
                      alt={item.alt_text || ""}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => copyUrl(item.id, item.file_url)}
                    >
                      {copiedId === item.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-2">
                    <p className="truncate text-sm font-medium">{item.name || "Untitled"}</p>
                    <p className="text-xs text-muted-foreground capitalize">{item.folder}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
