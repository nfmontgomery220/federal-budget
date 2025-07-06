"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const BrandShowcase = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">FiscalClarity Brand Showcase</h1>
          <p className="text-xl text-gray-600">Real-world applications of the visual identity</p>
        </div>

        {/* Website Header Mockup */}
        <Card>
          <CardHeader>
            <CardTitle>Website Header</CardTitle>
            <CardDescription>Primary navigation and branding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-3">
                  <svg width="40" height="40" viewBox="0 0 40 40" className="text-blue-600">
                    <rect x="8" y="20" width="3" height="12" fill="currentColor" />
                    <rect x="13" y="15" width="3" height="17" fill="currentColor" />
                    <rect x="18" y="10" width="3" height="22" fill="currentColor" />
                    <rect x="23" y="18" width="3" height="14" fill="currentColor" />
                    <circle cx="30" cy="20" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="34" y1="24" x2="37" y2="27" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <div>
                    <div className="text-lg font-bold text-gray-800">FiscalClarity</div>
                    <div className="text-xs text-gray-500">Federal Budget Analysis</div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex space-x-6">
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Dashboard
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Analysis
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Tools
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    About
                  </a>
                </nav>

                <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Card Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Card - Front</CardTitle>
              <CardDescription>Professional networking materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white border rounded-lg p-6 w-80 h-48 mx-auto shadow-lg">
                <div className="h-full flex flex-col justify-between">
                  <div className="flex items-center space-x-3">
                    <svg width="32" height="32" viewBox="0 0 32 32" className="text-blue-600">
                      <rect x="6" y="16" width="2.5" height="10" fill="currentColor" />
                      <rect x="10" y="12" width="2.5" height="14" fill="currentColor" />
                      <rect x="14" y="8" width="2.5" height="18" fill="currentColor" />
                      <rect x="18" y="14" width="2.5" height="12" fill="currentColor" />
                      <circle cx="24" cy="16" r="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                      <line x1="27" y1="19" x2="29" y2="21" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                    <div>
                      <div className="font-bold text-gray-800">FiscalClarity</div>
                      <div className="text-xs text-gray-500">Federal Budget Analysis</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">fiscalclarity.com</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Card - Back</CardTitle>
              <CardDescription>Contact information side</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-600 text-white rounded-lg p-6 w-80 h-48 mx-auto shadow-lg">
                <div className="h-full flex flex-col justify-center space-y-3">
                  <div>
                    <div className="font-bold text-lg">Sarah Johnson</div>
                    <div className="text-blue-100">Senior Budget Analyst</div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div>sarah.johnson@fiscalclarity.com</div>
                    <div>(202) 555-0123</div>
                    <div>Washington, DC</div>
                  </div>
                  <div className="text-xs text-blue-100 mt-4">Making federal budget data accessible to all</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Cover */}
        <Card>
          <CardHeader>
            <CardTitle>Report Template</CardTitle>
            <CardDescription>Professional document design</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white border rounded-lg p-8 max-w-2xl mx-auto shadow-lg">
              <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-3">
                    <svg width="32" height="32" viewBox="0 0 32 32" className="text-blue-600">
                      <rect x="6" y="16" width="2.5" height="10" fill="currentColor" />
                      <rect x="10" y="12" width="2.5" height="14" fill="currentColor" />
                      <rect x="14" y="8" width="2.5" height="18" fill="currentColor" />
                      <rect x="18" y="14" width="2.5" height="12" fill="currentColor" />
                    </svg>
                    <div>
                      <div className="font-bold text-gray-800">FiscalClarity</div>
                      <div className="text-xs text-gray-500">Federal Budget Analysis</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">December 2024</div>
                </div>

                {/* Title */}
                <div className="text-center space-y-4">
                  <h1 className="text-3xl font-bold text-gray-900">Federal Budget Analysis</h1>
                  <h2 className="text-xl text-gray-600">Fiscal Year 2025 Projections</h2>
                  <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$4.9T</div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">$6.8T</div>
                    <div className="text-sm text-gray-600">Spending</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">$1.9T</div>
                    <div className="text-sm text-gray-600">Deficit</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-500 border-t pt-4">
                  Prepared by FiscalClarity.com | Data sources: CBO, OMB, Treasury
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Twitter/X Profile</CardTitle>
              <CardDescription>Social media branding</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white relative">
                  <div className="absolute bottom-4 left-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 32 32" className="text-blue-600">
                        <rect x="6" y="16" width="2.5" height="10" fill="currentColor" />
                        <rect x="10" y="12" width="2.5" height="14" fill="currentColor" />
                        <rect x="14" y="8" width="2.5" height="18" fill="currentColor" />
                        <rect x="18" y="14" width="2.5" height="12" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="px-4 space-y-2">
                  <h3 className="font-bold text-xl">FiscalClarity</h3>
                  <p className="text-gray-600">
                    Making federal budget data accessible to all. Nonpartisan analysis, transparent methodology.
                    #BudgetTransparency #DataDriven
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>📍 Washington, DC</span>
                    <span>🔗 fiscalclarity.com</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>LinkedIn Company Page</CardTitle>
              <CardDescription>Professional network presence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Company Header */}
                <div className="bg-gray-100 rounded-lg p-6 relative">
                  <div className="absolute bottom-4 left-4">
                    <div className="w-16 h-16 bg-white rounded border-2 border-white shadow-lg flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 32 32" className="text-blue-600">
                        <rect x="6" y="16" width="2.5" height="10" fill="currentColor" />
                        <rect x="10" y="12" width="2.5" height="14" fill="currentColor" />
                        <rect x="14" y="8" width="2.5" height="18" fill="currentColor" />
                        <rect x="18" y="14" width="2.5" height="12" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Company Info */}
                <div className="px-4 space-y-2">
                  <h3 className="font-bold text-xl">FiscalClarity</h3>
                  <p className="text-blue-600 text-sm">Government Administration</p>
                  <p className="text-gray-600">
                    Providing transparent, nonpartisan analysis of federal budget data to promote informed civic
                    engagement and policy decisions.
                  </p>
                  <div className="text-sm text-gray-500">
                    <span>Washington, District of Columbia</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Signature */}
        <Card>
          <CardHeader>
            <CardTitle>Email Signature Template</CardTitle>
            <CardDescription>Professional email communications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white border rounded-lg p-6 max-w-md">
              <div className="flex items-start space-x-4">
                <svg width="40" height="40" viewBox="0 0 40 40" className="text-blue-600 flex-shrink-0">
                  <rect x="8" y="20" width="3" height="12" fill="currentColor" />
                  <rect x="13" y="15" width="3" height="17" fill="currentColor" />
                  <rect x="18" y="10" width="3" height="22" fill="currentColor" />
                  <rect x="23" y="18" width="3" height="14" fill="currentColor" />
                </svg>
                <div className="space-y-1">
                  <div className="font-bold text-gray-800">Michael Chen</div>
                  <div className="text-sm text-gray-600">Data Analyst</div>
                  <div className="text-sm font-medium text-blue-600">FiscalClarity</div>
                  <div className="text-xs text-gray-500">Federal Budget Analysis</div>
                  <div className="text-xs text-gray-500 space-y-0.5">
                    <div>michael.chen@fiscalclarity.com</div>
                    <div>(202) 555-0156 | fiscalclarity.com</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Palette Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Brand Color Palette</CardTitle>
            <CardDescription>Complete color system for consistent application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Primary Colors */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Primary</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded border"></div>
                    <div className="text-xs">
                      <div className="font-medium">Fiscal Blue</div>
                      <div className="text-gray-500">#2563eb</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-slate-700 rounded border"></div>
                    <div className="text-xs">
                      <div className="font-medium">Charcoal</div>
                      <div className="text-gray-500">#334155</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Colors */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Secondary</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-600 rounded border"></div>
                    <div className="text-xs">
                      <div className="font-medium">Success</div>
                      <div className="text-gray-500">#059669</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-red-600 rounded border"></div>
                    <div className="text-xs">
                      <div className="font-medium">Alert</div>
                      <div className="text-gray-500">#dc2626</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Neutral Colors */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Neutrals</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-50 rounded border"></div>
                    <div className="text-xs">
                      <div className="font-medium">Light Gray</div>
                      <div className="text-gray-500">#f8fafc</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-500 rounded border"></div>
                    <div className="text-xs">
                      <div className="font-medium">Medium</div>
                      <div className="text-gray-500">#64748b</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Examples */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Usage</h4>
                <div className="space-y-2 text-xs">
                  <div>🔵 Blue: Links, CTAs</div>
                  <div>⚫ Charcoal: Text</div>
                  <div>🟢 Green: Surplus</div>
                  <div>🔴 Red: Deficits</div>
                  <div>⚪ Gray: Backgrounds</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BrandShowcase
