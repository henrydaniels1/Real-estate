"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Loader2 } from "lucide-react"

interface SiteSettings {
  id: string
  site_name: string
  site_description: string
  contact_email: string
  contact_phone: string
  contact_address: string
  social_facebook: string
  social_twitter: string
  social_instagram: string
  social_linkedin: string
  footer_text: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    // Fetch individual settings from site_settings table
    const { data } = await supabase.from("site_settings").select("key, value")
    
    if (data && data.length > 0) {
      // Convert array of key-value pairs to object
      const settingsObj: any = {
        id: "existing",
        site_name: "EverGreen",
        site_description: "Build Your Future, One Property at a Time",
        contact_email: "info@evergreen.com",
        contact_phone: "+1 (555) 123-4567",
        contact_address: "123 Real Estate Ave, Property City, PC 12345",
        social_facebook: "",
        social_twitter: "",
        social_instagram: "",
        social_linkedin: "",
        footer_text: "2024 EverGreen. All rights reserved.",
      }
      
      data.forEach(item => {
        if (item.key === 'site_name') settingsObj.site_name = item.value
        if (item.key === 'site_description') settingsObj.site_description = item.value
        if (item.key === 'contact_email') settingsObj.contact_email = item.value
        if (item.key === 'contact_phone') settingsObj.contact_phone = item.value
        if (item.key === 'contact_address') settingsObj.contact_address = item.value
        if (item.key === 'social_facebook') settingsObj.social_facebook = item.value
        if (item.key === 'social_twitter') settingsObj.social_twitter = item.value
        if (item.key === 'social_instagram') settingsObj.social_instagram = item.value
        if (item.key === 'social_linkedin') settingsObj.social_linkedin = item.value
        if (item.key === 'footer_text') settingsObj.footer_text = item.value
      })
      
      setSettings(settingsObj)
    } else {
      // Create default settings
      setSettings({
        id: "",
        site_name: "EverGreen",
        site_description: "Build Your Future, One Property at a Time",
        contact_email: "info@evergreen.com",
        contact_phone: "+1 (555) 123-4567",
        contact_address: "123 Real Estate Ave, Property City, PC 12345",
        social_facebook: "",
        social_twitter: "",
        social_instagram: "",
        social_linkedin: "",
        footer_text: "2024 EverGreen. All rights reserved.",
      })
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)

    // Save each setting as a separate row in site_settings table
    const settingsToSave = [
      { key: 'site_name', value: JSON.stringify(settings.site_name) },
      { key: 'site_description', value: JSON.stringify(settings.site_description) },
      { key: 'contact_email', value: JSON.stringify(settings.contact_email) },
      { key: 'contact_phone', value: JSON.stringify(settings.contact_phone) },
      { key: 'contact_address', value: JSON.stringify(settings.contact_address) },
      { key: 'social_facebook', value: JSON.stringify(settings.social_facebook) },
      { key: 'social_twitter', value: JSON.stringify(settings.social_twitter) },
      { key: 'social_instagram', value: JSON.stringify(settings.social_instagram) },
      { key: 'social_linkedin', value: JSON.stringify(settings.social_linkedin) },
      { key: 'footer_text', value: JSON.stringify(settings.footer_text) },
    ]

    // Upsert each setting
    for (const setting of settingsToSave) {
      await supabase
        .from('site_settings')
        .upsert(setting, { onConflict: 'key' })
    }

    setSaving(false)
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
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your website settings and configuration
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

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic information about your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_name">Site Name</Label>
                <Input
                  id="site_name"
                  value={settings?.site_name || ""}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev ? { ...prev, site_name: e.target.value } : null
                    )
                  }
                  placeholder="EverGreen"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  id="site_description"
                  value={settings?.site_description || ""}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev ? { ...prev, site_description: e.target.value } : null
                    )
                  }
                  placeholder="Build Your Future, One Property at a Time"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer_text">Footer Text</Label>
                <Input
                  id="footer_text"
                  value={settings?.footer_text || ""}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev ? { ...prev, footer_text: e.target.value } : null
                    )
                  }
                  placeholder="2024 EverGreen. All rights reserved."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How customers can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email Address</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings?.contact_email || ""}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev ? { ...prev, contact_email: e.target.value } : null
                    )
                  }
                  placeholder="info@evergreen.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Phone Number</Label>
                <Input
                  id="contact_phone"
                  value={settings?.contact_phone || ""}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev ? { ...prev, contact_phone: e.target.value } : null
                    )
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_address">Address</Label>
                <Textarea
                  id="contact_address"
                  value={settings?.contact_address || ""}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev ? { ...prev, contact_address: e.target.value } : null
                    )
                  }
                  placeholder="123 Real Estate Ave, Property City"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Connect your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="social_facebook">Facebook URL</Label>
                <Input
                  id="social_facebook"
                  value={settings?.social_facebook || ""}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev ? { ...prev, social_facebook: e.target.value } : null
                    )
                  }
                  placeholder="https://facebook.com/evergreen"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social_twitter">Twitter URL</Label>
                <Input
                  id="social_twitter"
                  value={settings?.social_twitter || ""}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev ? { ...prev, social_twitter: e.target.value } : null
                    )
                  }
                  placeholder="https://twitter.com/evergreen"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social_instagram">Instagram URL</Label>
                <Input
                  id="social_instagram"
                  value={settings?.social_instagram || ""}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev ? { ...prev, social_instagram: e.target.value } : null
                    )
                  }
                  placeholder="https://instagram.com/evergreen"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social_linkedin">LinkedIn URL</Label>
                <Input
                  id="social_linkedin"
                  value={settings?.social_linkedin || ""}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev ? { ...prev, social_linkedin: e.target.value } : null
                    )
                  }
                  placeholder="https://linkedin.com/company/evergreen"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
