"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, DollarSign, Globe, TrendingUp, Users } from "lucide-react"

const domainOptions = [
  {
    domain: "fiscalclarity.info",
    price: 12.98,
    status: "recommended",
    pros: [
      "Perfect semantic match for our mission",
      "Incredible value at under $13",
      "Professional and trustworthy",
      "Great for SEO with 'fiscal' keyword",
      ".info TLD is perfect for informational content",
    ],
    cons: [".info is less prestigious than .com", "Some users might expect .com by default"],
    seoScore: 85,
    brandScore: 80,
    trustScore: 75,
  },
  {
    domain: "fiscalclarity.com",
    price: 2600.0,
    status: "premium",
    pros: [
      "Most prestigious TLD",
      "Maximum user trust and recognition",
      "Best for brand building",
      "Highest SEO potential",
      "Professional credibility",
    ],
    cons: [
      "Extremely expensive at $2,600",
      "Depletes entire marketing budget",
      "May not provide proportional ROI",
      "High opportunity cost",
    ],
    seoScore: 95,
    brandScore: 100,
    trustScore: 95,
  },
  {
    domain: "fiscalclarity.org",
    price: 45.99,
    status: "backup",
    pros: [
      "Implies non-profit mission",
      "Good for educational content",
      "Reasonable price point",
      "High trust for policy content",
    ],
    cons: ["May imply we're a non-profit when we're not", "Less commercial appeal", "Could confuse business model"],
    seoScore: 80,
    brandScore: 70,
    trustScore: 90,
  },
]

const budgetAllocation = {
  domainCost: 12.98,
  totalBudget: 2600.0,
  savings: 2587.02,
  allocations: [
    { category: "Development & Design", amount: 1200, percentage: 46.4 },
    { category: "Content Creation", amount: 600, percentage: 23.2 },
    { category: "Marketing & SEO", amount: 500, percentage: 19.3 },
    { category: "Legal & Compliance", amount: 200, percentage: 7.7 },
    { category: "Domain & Hosting", amount: 87.02, percentage: 3.4 },
  ],
}

interface DomainStrategyProps {
  onBack?: () => void
}

export default function DomainStrategy({ onBack }: DomainStrategyProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "recommended":
        return "bg-green-100 text-green-800"
      case "premium":
        return "bg-purple-100 text-purple-800"
      case "backup":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Domain Strategy Analysis</h1>
            <p className="text-gray-600">Strategic domain selection for Fiscal Clarity platform</p>
          </div>
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              ← Back to Dashboard
            </Button>
          )}
        </div>

        {/* Recommendation Alert */}
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="text-green-800">Recommended Decision</AlertTitle>
          <AlertDescription className="text-green-700">
            <strong>Register fiscalclarity.info immediately</strong> for $12.98. This provides excellent value, perfect
            semantic alignment, and frees up $2,587 for development and marketing investments.
          </AlertDescription>
        </Alert>

        {/* Domain Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {domainOptions.map((option, index) => (
            <Card key={option.domain} className={`${option.status === "recommended" ? "ring-2 ring-green-500" : ""}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{option.domain}</CardTitle>
                  <Badge className={getStatusColor(option.status)}>{option.status}</Badge>
                </div>
                <CardDescription className="text-2xl font-bold text-gray-900">
                  {formatCurrency(option.price)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Scoring */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className={`text-lg font-bold ${getScoreColor(option.seoScore)}`}>{option.seoScore}</div>
                      <div className="text-xs text-gray-600">SEO</div>
                    </div>
                    <div>
                      <div className={`text-lg font-bold ${getScoreColor(option.brandScore)}`}>{option.brandScore}</div>
                      <div className="text-xs text-gray-600">Brand</div>
                    </div>
                    <div>
                      <div className={`text-lg font-bold ${getScoreColor(option.trustScore)}`}>{option.trustScore}</div>
                      <div className="text-xs text-gray-600">Trust</div>
                    </div>
                  </div>

                  {/* Pros */}
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Advantages</h4>
                    <ul className="text-sm space-y-1">
                      {option.pros.map((pro, idx) => (
                        <li key={idx} className="text-green-600 flex items-start">
                          <CheckCircle className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons */}
                  <div>
                    <h4 className="font-medium text-red-700 mb-2">Disadvantages</h4>
                    <ul className="text-sm space-y-1">
                      {option.cons.map((con, idx) => (
                        <li key={idx} className="text-red-600 flex items-start">
                          <AlertTriangle className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Budget Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Budget Optimization Analysis
            </CardTitle>
            <CardDescription>How choosing fiscalclarity.info optimizes our resource allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-4">Cost Comparison</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">fiscalclarity.info</div>
                      <div className="text-xs text-gray-600">Recommended choice</div>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(budgetAllocation.domainCost)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">fiscalclarity.com</div>
                      <div className="text-xs text-gray-600">Premium alternative</div>
                    </div>
                    <div className="text-lg font-bold text-red-600">{formatCurrency(budgetAllocation.totalBudget)}</div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div>
                      <div className="font-medium text-sm text-blue-900">Total Savings</div>
                      <div className="text-xs text-blue-700">Available for development</div>
                    </div>
                    <div className="text-xl font-bold text-blue-600">{formatCurrency(budgetAllocation.savings)}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Optimized Budget Allocation</h4>
                <div className="space-y-3">
                  {budgetAllocation.allocations.map((allocation, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{allocation.category}</div>
                        <div className="text-xs text-gray-600">{allocation.percentage}% of budget</div>
                      </div>
                      <div className="text-lg font-bold text-gray-900">{formatCurrency(allocation.amount)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategic Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                SEO & Marketing Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Keyword Optimization</h4>
                  <p className="text-sm text-green-700">
                    "Fiscal" is a high-value keyword in our target market, providing natural SEO advantages
                  </p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Content Strategy Alignment</h4>
                  <p className="text-sm text-blue-700">
                    .info TLD signals informational content, perfect for our educational mission
                  </p>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900">Brand Positioning</h4>
                  <p className="text-sm text-purple-700">
                    Positions us as the authoritative source for fiscal policy information
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Growth Strategy Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900">Development Acceleration</h4>
                  <p className="text-sm text-orange-700">
                    $1,200 additional development budget enables faster feature delivery
                  </p>
                </div>

                <div className="p-3 bg-teal-50 rounded-lg">
                  <h4 className="font-medium text-teal-900">Content Investment</h4>
                  <p className="text-sm text-teal-700">
                    $600 for content creation builds authority and drives organic traffic
                  </p>
                </div>

                <div className="p-3 bg-indigo-50 rounded-lg">
                  <h4 className="font-medium text-indigo-900">Marketing Launch</h4>
                  <p className="text-sm text-indigo-700">
                    $500 marketing budget enables proper launch campaign and user acquisition
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Implementation Action Plan
            </CardTitle>
            <CardDescription>Step-by-step execution plan for domain registration and platform launch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-4">Immediate Actions (Next 48 Hours)</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <div className="font-medium text-sm">Register fiscalclarity.info</div>
                      <div className="text-xs text-gray-600">Use Namecheap or GoDaddy for $12.98</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <div className="font-medium text-sm">Secure social media handles</div>
                      <div className="text-xs text-gray-600">@fiscalclarity across all platforms</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <div className="font-medium text-sm">Set up professional email</div>
                      <div className="text-xs text-gray-600">contact@fiscalclarity.info</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Short-term Goals (Next 30 Days)</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <div>
                      <div className="font-medium text-sm">Deploy coming soon page</div>
                      <div className="text-xs text-gray-600">Professional landing with email capture</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      5
                    </div>
                    <div>
                      <div className="font-medium text-sm">Begin development sprint</div>
                      <div className="text-xs text-gray-600">Use $1,200 development budget</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      6
                    </div>
                    <div>
                      <div className="font-medium text-sm">Content strategy execution</div>
                      <div className="text-xs text-gray-600">Allocate $600 for content creation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Success Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Domain Authority:</strong> Target DA 30+ within 6 months
                </div>
                <div>
                  <strong>Organic Traffic:</strong> 10K monthly visitors by month 6
                </div>
                <div>
                  <strong>User Engagement:</strong> 3+ minute average session duration
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment & Mitigation</CardTitle>
            <CardDescription>Potential challenges and our response strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-red-700 mb-3">Potential Risks</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="font-medium text-sm text-red-900">User Expectation of .com</div>
                    <div className="text-xs text-red-700">Some users may expect .com domain</div>
                  </div>

                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="font-medium text-sm text-orange-900">Brand Recognition</div>
                    <div className="text-xs text-orange-700">.info may seem less authoritative initially</div>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="font-medium text-sm text-yellow-900">Competitor Acquisition</div>
                    <div className="text-xs text-yellow-700">Competitors might acquire .com version</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-green-700 mb-3">Mitigation Strategies</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-sm text-green-900">Strong Brand Building</div>
                    <div className="text-xs text-green-700">Invest savings in brand recognition and quality</div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-sm text-blue-900">SEO Excellence</div>
                    <div className="text-xs text-blue-700">Dominate search results to overcome TLD bias</div>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-sm text-purple-900">Future Acquisition Option</div>
                    <div className="text-xs text-purple-700">Monitor .com availability and acquire when profitable</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
