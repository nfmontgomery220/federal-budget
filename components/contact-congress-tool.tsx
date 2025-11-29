"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, ExternalLink, Copy, CheckCircle2, Users, TrendingUp, Building2, Send } from "lucide-react"

interface Representative {
  id: string
  name: string
  party: string
  chamber: "House" | "Senate"
  state: string
  district?: string
  phone: string
  email: string
  website: string
  officeAddress?: string
  contactForm?: string
  dataSource?: string
}

interface ContactStats {
  totalContacts: number
  last24Hours: number
  topDistricts: Array<{ district: string; count: number }>
  growthRate: number
}

export default function ContactCongressTool({ preloadedBudgetData }: { preloadedBudgetData?: any }) {
  const [zipCode, setZipCode] = useState("")
  const [streetAddress, setStreetAddress] = useState("")
  const [showAddressPrompt, setShowAddressPrompt] = useState(false)
  const [representatives, setRepresentatives] = useState<Representative[]>([])
  const [selectedReps, setSelectedReps] = useState<Set<string>>(new Set())
  const [budgetSummary, setBudgetSummary] = useState("")
  const [personalMessage, setPersonalMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [contactStats, setContactStats] = useState<ContactStats | null>(null)

  useEffect(() => {
    if (preloadedBudgetData) {
      const formattedBudget = formatPreloadedBudget(preloadedBudgetData)
      setBudgetSummary(formattedBudget)
    }
  }, [preloadedBudgetData])

  const formatPreloadedBudget = (data: any) => {
    if (!data) return ""

    let summary = `${data.title}\n\n`
    summary += `${data.summary}\n\n`
    summary += `SPENDING CHANGES:\n`
    data.spending.forEach((item) => {
      summary += `- ${item.category}: ${item.change > 0 ? "+" : ""}$${Math.abs(item.change)}B (${item.change > 0 ? "increase" : "cut"})\n`
    })
    summary += `\nREVENUE CHANGES:\n`
    data.revenue.forEach((item) => {
      summary += `- ${item.source}: ${item.change > 0 ? "+" : ""}$${Math.abs(item.change)}B\n`
    })
    summary += `\nNET FISCAL IMPACT: ${data.deficit >= 0 ? "Surplus" : "Deficit"} of $${Math.abs(data.deficit).toFixed(1)}B\n`

    return summary
  }

  const lookupRepresentatives = async () => {
    if (!zipCode || zipCode.length !== 5) {
      return
    }

    setLoading(true)
    try {
      const address = streetAddress ? `${streetAddress}, ${zipCode}` : zipCode
      const response = await fetch(`/api/lookup-representatives?zip=${zipCode}&address=${encodeURIComponent(address)}`)
      const data = await response.json()

      if (data.multipleDistricts && !streetAddress) {
        setShowAddressPrompt(true)
      }

      setRepresentatives(data.representatives || [])
    } catch (error) {
      console.error("[v0] Failed to lookup representatives:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch("/api/congress-contact-stats")
      const data = await response.json()
      setContactStats(data)
    } catch (error) {
      console.error("[v0] Failed to load contact stats:", error)
    }
  }

  const generateEmailContent = () => {
    const selectedRepList = representatives.filter((rep) => selectedReps.has(rep.id))

    const officeGreeting =
      selectedRepList.length === 1
        ? `Dear Representative (${selectedRepList[0].chamber} Office, ${selectedRepList[0].state}${selectedRepList[0].district ? `-${selectedRepList[0].district}` : ""})`
        : `Dear Congressional Representatives`

    return `${officeGreeting},

I am writing to share my analysis of the federal budget and urge action on fiscal responsibility.

MY BUDGET PRIORITIES:
${budgetSummary || "[Include your budget choices here - spending cuts, revenue increases, and resulting deficit/surplus]"}

PERSONAL MESSAGE:
${personalMessage || "[Share why fiscal responsibility matters to you]"}

I encourage you to review these priorities and work toward sustainable fiscal policy that serves all Americans.

Thank you for your service.

Sincerely,
[Your Name]
[City, State, ZIP: ${zipCode}]`
  }

  const copyEmailContent = () => {
    navigator.clipboard.writeText(generateEmailContent())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendEmail = async () => {
    const selectedRepList = representatives.filter((rep) => selectedReps.has(rep.id))

    await fetch("/api/track-congress-contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        zipCode,
        representatives: selectedRepList.map((r) => ({ id: r.id, name: r.name, chamber: r.chamber })),
        budgetSummary,
      }),
    })

    const emails = selectedRepList.map((rep) => rep.email).join(",")
    const subject = encodeURIComponent("Constituent Feedback on Federal Budget Priorities")
    const body = encodeURIComponent(generateEmailContent())
    window.location.href = `mailto:${emails}?subject=${subject}&body=${body}`
  }

  const toggleRepSelection = (repId: string) => {
    const newSelected = new Set(selectedReps)
    if (newSelected.has(repId)) {
      newSelected.delete(repId)
    } else {
      newSelected.add(repId)
    }
    setSelectedReps(newSelected)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Your Representatives</h1>
        <p className="text-lg text-gray-600">
          Share your budget priorities directly with your members of Congress. Let them know how you would solve the
          fiscal crisis.
        </p>
        {preloadedBudgetData && (
          <Alert className="mt-4 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-900">
              <strong>Budget Loaded:</strong> Your proposal "{preloadedBudgetData.title}" is ready to send
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Tabs defaultValue="contact" className="space-y-6" onValueChange={(val) => val === "stats" && loadStats()}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contact">Send Your Budget</TabsTrigger>
          <TabsTrigger value="stats">Impact Tracker</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Step 1: Find Your Representatives
              </CardTitle>
              <CardDescription>
                Enter your ZIP code to find your representatives. For more accurate results, include your street
                address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    placeholder="12345"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    onKeyDown={(e) => e.key === "Enter" && lookupRepresentatives()}
                    maxLength={5}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={lookupRepresentatives} disabled={loading || zipCode.length !== 5}>
                    {loading ? "Searching..." : "Find Representatives"}
                  </Button>
                </div>
              </div>

              {showAddressPrompt && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <MapPin className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-900">
                    <strong>Multiple Districts Found:</strong> Your ZIP code spans multiple congressional districts. For
                    accurate results, please enter your street address below.
                  </AlertDescription>
                </Alert>
              )}

              {(showAddressPrompt || streetAddress) && (
                <div>
                  <Label htmlFor="streetAddress">Street Address (Optional - for better accuracy)</Label>
                  <Input
                    id="streetAddress"
                    placeholder="123 Main Street"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && lookupRepresentatives()}
                  />
                  <p className="text-xs text-gray-500 mt-1">Your address is used only for lookup and is not stored</p>
                </div>
              )}

              {representatives.length > 0 && (
                <div className="space-y-3 mt-6">
                  <Label>Select representatives to contact:</Label>
                  {representatives.map((rep) => (
                    <Card
                      key={rep.id}
                      className={`cursor-pointer transition-colors ${
                        selectedReps.has(rep.id) ? "border-blue-500 bg-blue-50" : "hover:border-gray-400"
                      }`}
                      onClick={() => toggleRepSelection(rep.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{rep.name}</h3>
                              <Badge
                                variant={
                                  rep.party === "Democrat"
                                    ? "default"
                                    : rep.party === "Republican"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {rep.party}
                              </Badge>
                              <Badge variant="outline">{rep.chamber}</Badge>
                              {rep.dataSource && (
                                <Badge variant="secondary" className="text-xs">
                                  {rep.dataSource === "google" ? "✓ Google API" : "Fallback API"}
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                <strong>Office:</strong> {rep.state} {rep.district ? `- District ${rep.district}` : ""}
                              </div>
                              {rep.officeAddress && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <strong>Office Address:</strong> {rep.officeAddress}
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <strong>Office Phone:</strong> {rep.phone}
                              </div>
                              {rep.contactForm ? (
                                <a
                                  href={rep.contactForm}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-blue-600 hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Mail className="h-4 w-4" />
                                  <strong>Use Official Contact Form (Recommended)</strong>
                                </a>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  {rep.email}
                                </div>
                              )}
                              <a
                                href={rep.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-4 w-4" />
                                Visit Official Website
                              </a>
                            </div>
                          </div>
                          {selectedReps.has(rep.id) && <CheckCircle2 className="h-6 w-6 text-blue-600" />}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedReps.size > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Step 2: Share Your Budget Priorities
                </CardTitle>
                <CardDescription>Explain how you would balance the budget and why it matters to you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="budgetSummary">Your Budget Plan (Required)</Label>
                  <Textarea
                    id="budgetSummary"
                    placeholder="Example: I would cut defense spending by 10% ($90B), increase corporate tax rate to 25% (+$150B), and eliminate agricultural subsidies ($30B), resulting in a $270B deficit reduction..."
                    value={budgetSummary}
                    onChange={(e) => setBudgetSummary(e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tip: Copy your budget choices from the Budget Builder or Full Proposal Generator
                  </p>
                </div>

                <div>
                  <Label htmlFor="personalMessage">Personal Message (Optional)</Label>
                  <Textarea
                    id="personalMessage"
                    placeholder="Example: As a veteran and small business owner, I'm deeply concerned about our growing national debt. We need leaders who will make tough choices to secure our economic future..."
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Preview Your Message:</strong> Click "Preview & Copy" below to see your complete email
                    before sending.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {selectedReps.size > 0 && budgetSummary && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-blue-600" />
                  Step 3: Send Your Message
                </CardTitle>
                <CardDescription>Choose how to contact your representatives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button onClick={sendEmail} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Mail className="h-4 w-4 mr-2" />
                    Open Email Client
                  </Button>
                  <Button onClick={copyEmailContent} variant="outline" className="flex-1 bg-transparent">
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Preview & Copy
                      </>
                    )}
                  </Button>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Users className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>
                      Sending to {selectedReps.size} representative{selectedReps.size > 1 ? "s" : ""}:
                    </strong>
                    <br />
                    {representatives
                      .filter((rep) => selectedReps.has(rep.id))
                      .map((rep) => `${rep.name} (${rep.chamber})`)
                      .join(", ")}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{contactStats?.totalContacts.toLocaleString() || "0"}</CardTitle>
                <CardDescription>Total Messages Sent</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">+{contactStats?.last24Hours || "0"}</CardTitle>
                <CardDescription>In the Last 24 Hours</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  {contactStats?.growthRate || "0"}%
                </CardTitle>
                <CardDescription>Weekly Growth Rate</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Most Engaged Districts</CardTitle>
              <CardDescription>Congressional districts sending the most budget feedback</CardDescription>
            </CardHeader>
            <CardContent>
              {contactStats?.topDistricts && contactStats.topDistricts.length > 0 ? (
                <div className="space-y-3">
                  {contactStats.topDistricts.map((district, idx) => (
                    <div key={district.district} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                          {idx + 1}
                        </div>
                        <span className="font-medium">{district.district}</span>
                      </div>
                      <Badge>{district.count} contacts</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No data available yet. Be the first to contact your representatives!
                </p>
              )}
            </CardContent>
          </Card>

          <Alert className="bg-green-50 border-green-200">
            <Users className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-900">
              <strong>Make Your Voice Heard!</strong>
              <br />
              Join thousands of citizens sharing their budget priorities with Congress. Your input helps shape fiscal
              policy.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}
