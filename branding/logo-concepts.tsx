"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Logo concept components with actual SVG designs
const LogoConcepts = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">FiscalClarity.com</h1>
          <p className="text-xl text-gray-600">Visual Identity & Logo Concepts</p>
        </div>

        {/* Primary Logo Concepts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Concept 1: Chart + Magnifying Glass */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Primary Logo Concept</CardTitle>
              <CardDescription>Chart bars with magnifying glass</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-8 rounded-lg border flex items-center justify-center">
                <svg width="200" height="80" viewBox="0 0 200 80" className="text-blue-600">
                  {/* Chart bars */}
                  <rect x="20" y="40" width="8" height="25" fill="currentColor" />
                  <rect x="32" y="30" width="8" height="35" fill="currentColor" />
                  <rect x="44" y="20" width="8" height="45" fill="currentColor" />
                  <rect x="56" y="35" width="8" height="30" fill="currentColor" />

                  {/* Magnifying glass */}
                  <circle cx="85" cy="35" r="12" fill="none" stroke="currentColor" strokeWidth="3" />
                  <line x1="94" y1="44" x2="105" y2="55" stroke="currentColor" strokeWidth="3" />

                  {/* Text */}
                  <text x="115" y="30" className="text-sm font-bold fill-gray-800">
                    Fiscal
                  </text>
                  <text x="115" y="45" className="text-sm font-bold fill-blue-600">
                    Clarity
                  </text>
                </svg>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Recommended</Badge>
            </CardContent>
          </Card>

          {/* Concept 2: Pie Chart Focus */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alternative Concept</CardTitle>
              <CardDescription>Pie chart with transparency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-8 rounded-lg border flex items-center justify-center">
                <svg width="200" height="80" viewBox="0 0 200 80">
                  {/* Pie chart segments */}
                  <path d="M 40 40 L 40 25 A 15 15 0 0 1 52 28 Z" fill="#2563eb" />
                  <path d="M 40 40 L 52 28 A 15 15 0 0 1 48 52 Z" fill="#059669" />
                  <path d="M 40 40 L 48 52 A 15 15 0 0 1 28 48 Z" fill="#dc2626" />
                  <path d="M 40 40 L 28 48 A 15 15 0 0 1 40 25 Z" fill="#f59e0b" />

                  {/* Text */}
                  <text x="70" y="30" className="text-sm font-bold fill-gray-800">
                    Fiscal
                  </text>
                  <text x="70" y="45" className="text-sm font-bold fill-blue-600">
                    Clarity
                  </text>
                </svg>
              </div>
              <Badge variant="outline">Alternative</Badge>
            </CardContent>
          </Card>

          {/* Concept 3: Minimalist Text */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Text-Based Logo</CardTitle>
              <CardDescription>Clean typography focus</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-8 rounded-lg border flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">FISCAL</div>
                  <div className="text-2xl font-bold text-blue-600">CLARITY</div>
                  <div className="text-xs text-gray-500 mt-1">BUDGET ANALYSIS</div>
                </div>
              </div>
              <Badge variant="secondary">Simple</Badge>
            </CardContent>
          </Card>

          {/* Concept 4: Icon Only */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Icon Mark</CardTitle>
              <CardDescription>Standalone symbol</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-8 rounded-lg border flex items-center justify-center">
                <svg width="60" height="60" viewBox="0 0 60 60" className="text-blue-600">
                  <rect x="10" y="30" width="6" height="20" fill="currentColor" />
                  <rect x="20" y="20" width="6" height="30" fill="currentColor" />
                  <rect x="30" y="15" width="6" height="35" fill="currentColor" />
                  <rect x="40" y="25" width="6" height="25" fill="currentColor" />
                  <circle cx="30" cy="30" r="25" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                </svg>
              </div>
              <Badge variant="outline">Icon Only</Badge>
            </CardContent>
          </Card>

          {/* Concept 5: Horizontal Layout */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Horizontal Version</CardTitle>
              <CardDescription>For headers and wide spaces</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-8 rounded-lg border flex items-center justify-center">
                <svg width="250" height="50" viewBox="0 0 250 50">
                  {/* Icon */}
                  <rect x="10" y="20" width="4" height="15" fill="#2563eb" />
                  <rect x="16" y="15" width="4" height="20" fill="#2563eb" />
                  <rect x="22" y="10" width="4" height="25" fill="#2563eb" />
                  <rect x="28" y="18" width="4" height="17" fill="#2563eb" />

                  {/* Text */}
                  <text x="45" y="20" className="text-lg font-bold fill-gray-800">
                    FiscalClarity
                  </text>
                  <text x="45" y="35" className="text-xs fill-gray-500">
                    Federal Budget Analysis
                  </text>
                </svg>
              </div>
              <Badge variant="outline">Horizontal</Badge>
            </CardContent>
          </Card>

          {/* Concept 6: Government Style */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Government Style</CardTitle>
              <CardDescription>Official, institutional look</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-8 rounded-lg border flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-600 tracking-wider">UNITED STATES</div>
                  <div className="text-xl font-bold text-blue-800">FISCAL CLARITY</div>
                  <div className="text-xs text-gray-500">BUDGET TRANSPARENCY INITIATIVE</div>
                  <div className="w-16 h-0.5 bg-blue-600 mx-auto mt-2"></div>
                </div>
              </div>
              <Badge variant="outline">Institutional</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Color Variations */}
        <Card>
          <CardHeader>
            <CardTitle>Color Variations</CardTitle>
            <CardDescription>Primary logo in different color schemes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Full Color */}
              <div className="bg-white p-6 rounded-lg border text-center">
                <svg width="120" height="50" viewBox="0 0 120 50" className="mx-auto">
                  <rect x="10" y="25" width="5" height="15" fill="#2563eb" />
                  <rect x="18" y="20" width="5" height="20" fill="#2563eb" />
                  <rect x="26" y="15" width="5" height="25" fill="#2563eb" />
                  <rect x="34" y="22" width="5" height="18" fill="#2563eb" />
                  <circle cx="50" cy="25" r="8" fill="none" stroke="#2563eb" strokeWidth="2" />
                  <line x1="56" y1="31" x2="63" y2="38" stroke="#2563eb" strokeWidth="2" />
                  <text x="70" y="22" className="text-xs font-bold fill-gray-800">
                    Fiscal
                  </text>
                  <text x="70" y="32" className="text-xs font-bold fill-blue-600">
                    Clarity
                  </text>
                </svg>
                <p className="text-xs text-gray-600 mt-2">Full Color</p>
              </div>

              {/* White Version */}
              <div className="bg-blue-600 p-6 rounded-lg text-center">
                <svg width="120" height="50" viewBox="0 0 120 50" className="mx-auto">
                  <rect x="10" y="25" width="5" height="15" fill="white" />
                  <rect x="18" y="20" width="5" height="20" fill="white" />
                  <rect x="26" y="15" width="5" height="25" fill="white" />
                  <rect x="34" y="22" width="5" height="18" fill="white" />
                  <circle cx="50" cy="25" r="8" fill="none" stroke="white" strokeWidth="2" />
                  <line x1="56" y1="31" x2="63" y2="38" stroke="white" strokeWidth="2" />
                  <text x="70" y="22" className="text-xs font-bold fill-white">
                    Fiscal
                  </text>
                  <text x="70" y="32" className="text-xs font-bold fill-white">
                    Clarity
                  </text>
                </svg>
                <p className="text-xs text-white mt-2">White Version</p>
              </div>

              {/* Monochrome */}
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <svg width="120" height="50" viewBox="0 0 120 50" className="mx-auto">
                  <rect x="10" y="25" width="5" height="15" fill="#374151" />
                  <rect x="18" y="20" width="5" height="20" fill="#374151" />
                  <rect x="26" y="15" width="5" height="25" fill="#374151" />
                  <rect x="34" y="22" width="5" height="18" fill="#374151" />
                  <circle cx="50" cy="25" r="8" fill="none" stroke="#374151" strokeWidth="2" />
                  <line x1="56" y1="31" x2="63" y2="38" stroke="#374151" strokeWidth="2" />
                  <text x="70" y="22" className="text-xs font-bold fill-gray-700">
                    Fiscal
                  </text>
                  <text x="70" y="32" className="text-xs font-bold fill-gray-700">
                    Clarity
                  </text>
                </svg>
                <p className="text-xs text-gray-600 mt-2">Monochrome</p>
              </div>

              {/* Simplified */}
              <div className="bg-white p-6 rounded-lg border text-center">
                <svg width="120" height="50" viewBox="0 0 120 50" className="mx-auto">
                  <rect x="15" y="25" width="8" height="15" fill="#2563eb" />
                  <rect x="27" y="20" width="8" height="20" fill="#2563eb" />
                  <rect x="39" y="15" width="8" height="25" fill="#2563eb" />
                  <text x="55" y="28" className="text-sm font-bold fill-blue-600">
                    FC
                  </text>
                </svg>
                <p className="text-xs text-gray-600 mt-2">Simplified</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LogoConcepts
