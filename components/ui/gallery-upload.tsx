"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface GalleryUploadProps {
  images: string[]
  onChange: (images: string[]) => void
}

export function GalleryUpload({ images, onChange }: GalleryUploadProps) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    setUploading(true)
    const fileName = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage
      .from("properties")
      .upload(fileName, file)

    if (error) {
      toast.error("Failed to upload image")
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from("properties")
      .getPublicUrl(fileName)

    onChange([...images, publicUrl])
    setUploading(false)
    toast.success("Image uploaded")
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, index) => (
          <div key={index} className="relative aspect-video rounded-lg overflow-hidden border">
            <Image src={img} alt={`Gallery ${index + 1}`} fill className="object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => removeImage(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {images.length < 6 && (
        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="gallery-upload"
          />
          <label htmlFor="gallery-upload">
            <Button type="button" variant="outline" className="w-full" disabled={uploading} asChild>
              <span>
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Add Image ({images.length}/6)
              </span>
            </Button>
          </label>
        </div>
      )}
    </div>
  )
}
