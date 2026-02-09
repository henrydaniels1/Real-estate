"use client"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2, Link as LinkIcon } from "lucide-react"
import { toast } from "sonner"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  bucket?: string
  label?: string
  accept?: string
}

export function ImageUpload({
  value,
  onChange,
  bucket = "images",
  label = "Image",
  accept = "image/*"
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const uploadImage = async (file: File) => {
    try {
      setUploading(true)
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      onChange(publicUrl)
      toast.success("Image uploaded successfully!")
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB")
        return
      }
      uploadImage(file)
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput) {
      onChange(urlInput)
      setUrlInput("")
      setShowUrlInput(false)
      toast.success("Image URL added!")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      uploadImage(file)
    }
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {value && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <img src={value} alt="Preview" className="h-full w-full object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div
        className="flex flex-col gap-2 rounded-lg border-2 border-dashed p-4"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowUrlInput(!showUrlInput)}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>

        {showUrlInput && (
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
            />
            <Button type="button" onClick={handleUrlSubmit}>
              Add
            </Button>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Drag & drop or click to upload (max 5MB)
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
