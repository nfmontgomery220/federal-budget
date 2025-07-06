"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Share, FileText, Calendar, Users, AlertTriangle } from "lucide-react"

interface ImplementationPDFGeneratorProps {
  onBack?: () => void
  scenario: {
    name: string
    description: string
    spendingCuts: {
      defense: number
      discretionary: number
      otherMandatory: number
    }
    revenueIncreases: {
      loopholes: number
      enforcement: number
      individual: number
      corporate: number
      payroll: number
      vat: number
      carbonTax: number
      wealthTax: number
      financialTransaction: number
      digitalServices: number
    }
    totalCuts: number
    totalRevenue: number
    netImprovement: number
    finalBalance: number
  }
}

export default function ImplementationPDFGenerator({ onBack, scenario }: ImplementationPDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const formatBillions = (amount: number) => `$${amount.toLocaleString()}B`

  const generateImplementationPDF = () => {
    setIsGenerating(true)

    // Simulate PDF generation
    setTimeout(() => {
      const htmlContent = generateImplementationHTML()
      downloadAsPDF(htmlContent)
      setIsGenerating(false)
    }, 2000)
  }

  const generateImplementationHTML = () => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Federal Budget Reform Implementation Plan</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
        .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .title { font-size: 28px; font-weight: bold; color: #1e40af; margin-bottom: 10px; }
        .subtitle { font-size: 18px; color: #64748b; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 20px; font-weight: bold; color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px; }
        .phase { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 20px; }
        .phase-title { font-size: 18px; font-weight: bold; color: #1e40af; margin-bottom: 10px; }
        .measure-list { margin-left: 20px; }
        .measure-item { margin-bottom: 8px; }
        .amount { font-weight: bold; color: #059669; }
        .timeline { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 5px; }
        .risk-box { background: #fef2f2; border: 1px solid #ef4444; padding: 15px; border-radius: 5px; margin-bottom: 15px; }
        .success-box { background: #f0fdf4; border: 1px solid #22c55e; padding: 15px; border-radius: 5px; margin-bottom: 15px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .metric-card { background: #f1f5f9; padding: 15px; border-radius: 5px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; color: #1e40af; }
        .metric-label { font-size: 12px; color: #64748b; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #64748b; }
        @media print { body { margin: 20px; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">FEDERAL BUDGET REFORM</div>
        <div class="title">Implementation Plan</div>
        <div class="subtitle">"${scenario.name}" Strategy</div>
        <div class="subtitle">5-Year Roadmap to Fiscal Sustainability</div>
    </div>

    <div class="section">
        <div class="section-title">Executive Summary</div>
        <div class="success-box">
            <strong>Objective:</strong> ${scenario.finalBalance > 0 ? `Achieve budget surplus of ${formatBillions(scenario.finalBalance)}` : `Reduce deficit to ${formatBillions(Math.abs(scenario.finalBalance))}`} through strategic spending reforms and progressive revenue enhancements.
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-value">${formatBillions(1850)}</div>
                <div class="metric-label">Starting Deficit</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${formatBillions(scenario.totalCuts)}</div>
                <div class="metric-label">Spending Cuts</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${formatBillions(scenario.totalRevenue)}</div>
                <div class="metric-label">Revenue Increases</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${scenario.finalBalance > 0 ? "+" : ""}${formatBillions(scenario.finalBalance)}</div>
                <div class="metric-label">Final Balance</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Phase 1: Foundation Building (Years 1-2)</div>
        <div class="phase">
            <div class="phase-title">🎯 Objective: Establish credibility with early wins</div>
            <div class="timeline"><strong>Timeline:</strong> January 2025 - December 2026</div>
            
            <h4>Revenue Measures (~$200B annually)</h4>
            <div class="measure-list">
                <div class="measure-item">• <strong>Close Carried Interest Loophole</strong> - <span class="amount">$1.4B</span>
                    <br>&nbsp;&nbsp;→ Tax carried interest as ordinary income
                    <br>&nbsp;&nbsp;→ Immediate implementation, no phase-in</div>
                
                <div class="measure-item">• <strong>Digital Services Tax</strong> - <span class="amount">$34B</span>
                    <br>&nbsp;&nbsp;→ 7% tax on large tech platform revenues
                    <br>&nbsp;&nbsp;→ Apply to companies with $750M+ global revenue</div>
                
                <div class="measure-item">• <strong>IRS Funding Increase (Phase 1)</strong> - <span class="amount">$75B</span>
                    <br>&nbsp;&nbsp;→ Hire 25,000 additional agents and support staff
                    <br>&nbsp;&nbsp;→ Begin IT system modernization</div>
                
                <div class="measure-item">• <strong>Financial Transaction Tax</strong> - <span class="amount">${formatBillions(scenario.revenueIncreases.financialTransaction)}</span>
                    <br>&nbsp;&nbsp;→ ${scenario.revenueIncreases.financialTransaction > 60 ? "0.1%" : "0.05%"} on securities trades
                    <br>&nbsp;&nbsp;→ Reduce high-frequency trading</div>
            </div>

            <h4>Spending Measures (~$100B annually)</h4>
            <div class="measure-list">
                <div class="measure-item">• <strong>Administrative Efficiency</strong> - <span class="amount">$45B</span>
                    <br>&nbsp;&nbsp;→ Eliminate duplicate programs across agencies
                    <br>&nbsp;&nbsp;→ Implement shared services</div>
                
                <div class="measure-item">• <strong>Procurement Reform</strong> - <span class="amount">$30B</span>
                    <br>&nbsp;&nbsp;→ Increase competitive bidding
                    <br>&nbsp;&nbsp;→ Reduce cost-plus contracting</div>
                
                <div class="measure-item">• <strong>International Aid Optimization</strong> - <span class="amount">$15B</span>
                    <br>&nbsp;&nbsp;→ Focus on strategic partnerships
                    <br>&nbsp;&nbsp;→ Reduce bilateral program overhead</div>
            </div>

            <div class="success-box">
                <strong>Expected Impact:</strong> Reduce annual deficit by approximately $300B while building public confidence in reform process.
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Phase 2: Major Structural Reforms (Years 3-4)</div>
        <div class="phase">
            <div class="phase-title">🏗️ Objective: Implement substantial policy changes</div>
            <div class="timeline"><strong>Timeline:</strong> January 2027 - December 2028</div>
            
            <h4>Revenue Measures (~$800B annually)</h4>
            <div class="measure-list">
                ${
                  scenario.revenueIncreases.corporate > 0
                    ? `
                <div class="measure-item">• <strong>Corporate Tax Reform</strong> - <span class="amount">${formatBillions(scenario.revenueIncreases.corporate)}</span>
                    <br>&nbsp;&nbsp;→ Increase rate from 21% to 28%
                    <br>&nbsp;&nbsp;→ Implement 15% minimum effective rate</div>
                `
                    : ""
                }
                
                ${
                  scenario.revenueIncreases.payroll > 0
                    ? `
                <div class="measure-item">• <strong>Payroll Tax Reform</strong> - <span class="amount">${formatBillions(scenario.revenueIncreases.payroll)}</span>
                    <br>&nbsp;&nbsp;→ Remove Social Security wage cap
                    <br>&nbsp;&nbsp;→ Add Medicare surtax on high earners</div>
                `
                    : ""
                }
                
                ${
                  scenario.revenueIncreases.carbonTax > 0
                    ? `
                <div class="measure-item">• <strong>Carbon Tax Implementation</strong> - <span class="amount">${formatBillions(scenario.revenueIncreases.carbonTax)}</span>
                    <br>&nbsp;&nbsp;→ ${scenario.revenueIncreases.carbonTax > 100 ? "$50" : "$30"} per ton CO2
                    <br>&nbsp;&nbsp;→ Full rebate system for low-income families</div>
                `
                    : ""
                }
                
                <div class="measure-item">• <strong>Enhanced Tax Enforcement</strong> - <span class="amount">$275B</span>
                    <br>&nbsp;&nbsp;→ Complete IRS modernization
                    <br>&nbsp;&nbsp;→ AI-powered audit selection</div>
                
                <div class="measure-item">• <strong>Loophole Closure (Major)</strong> - <span class="amount">$300B</span>
                    <br>&nbsp;&nbsp;→ Step-up basis reform
                    <br>&nbsp;&nbsp;→ Capital gains as ordinary income</div>
            </div>

            <h4>Spending Measures (~$300B annually)</h4>
            <div class="measure-list">
                <div class="measure-item">• <strong>Defense Restructuring</strong> - <span class="amount">${formatBillions(Math.floor(scenario.spendingCuts.defense * 0.6))}</span>
                    <br>&nbsp;&nbsp;→ Base consolidation program
                    <br>&nbsp;&nbsp;→ Personnel optimization</div>
                
                <div class="measure-item">• <strong>Discretionary Program Reform</strong> - <span class="amount">${formatBillions(Math.floor(scenario.spendingCuts.discretionary * 0.7))}</span>
                    <br>&nbsp;&nbsp;→ Program consolidation
                    <br>&nbsp;&nbsp;→ Agency restructuring</div>
                
                <div class="measure-item">• <strong>Mandatory Program Efficiency</strong> - <span class="amount">${formatBillions(scenario.spendingCuts.otherMandatory)}</span>
                    <br>&nbsp;&nbsp;→ SNAP and unemployment reforms
                    <br>&nbsp;&nbsp;→ Agricultural subsidy restructuring</div>
            </div>

            <div class="success-box">
                <strong>Expected Impact:</strong> Additional $1.1T in annual deficit reduction, bringing total improvement to $1.4T.
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Phase 3: Final Implementation (Year 5+)</div>
        <div class="phase">
            <div class="phase-title">🎯 Objective: Achieve full fiscal balance</div>
            <div class="timeline"><strong>Timeline:</strong> January 2029 onwards</div>
            
            <h4>Final Revenue Measures</h4>
            <div class="measure-list">
                ${
                  scenario.revenueIncreases.vat > 0
                    ? `
                <div class="measure-item">• <strong>VAT Implementation</strong> - <span class="amount">${formatBillions(scenario.revenueIncreases.vat)}</span>
                    <br>&nbsp;&nbsp;→ ${scenario.revenueIncreases.vat > 200 ? "5%" : "3%"} rate with exemptions
                    <br>&nbsp;&nbsp;→ Rebates for low-income households</div>
                `
                    : ""
                }
                
                ${
                  scenario.revenueIncreases.wealthTax > 0
                    ? `
                <div class="measure-item">• <strong>Wealth Tax (if constitutional)</strong> - <span class="amount">${formatBillions(scenario.revenueIncreases.wealthTax)}</span>
                    <br>&nbsp;&nbsp;→ ${scenario.revenueIncreases.wealthTax > 100 ? "2% on wealth over $50M" : "1% on wealth over $10M"}
                    <br>&nbsp;&nbsp;→ Professional valuation requirements</div>
                `
                    : ""
                }
                
                ${
                  scenario.revenueIncreases.individual > 0
                    ? `
                <div class="measure-item">• <strong>Income Tax Adjustments</strong> - <span class="amount">${formatBillions(scenario.revenueIncreases.individual)}</span>
                    <br>&nbsp;&nbsp;→ New brackets for high earners
                    <br>&nbsp;&nbsp;→ Maintain middle-class protections</div>
                `
                    : ""
                }
            </div>

            <h4>Final Spending Adjustments</h4>
            <div class="measure-list">
                <div class="measure-item">• <strong>Complete Defense Optimization</strong>
                    <br>&nbsp;&nbsp;→ Final base closures and consolidations
                    <br>&nbsp;&nbsp;→ R&D prioritization complete</div>
                
                <div class="measure-item">• <strong>Interest Savings</strong>
                    <br>&nbsp;&nbsp;→ Compound benefits from debt reduction
                    <br>&nbsp;&nbsp;→ Lower borrowing costs</div>
            </div>

            <div class="success-box">
                <strong>Final Result:</strong> ${scenario.finalBalance > 0 ? `Budget surplus of ${formatBillions(scenario.finalBalance)}` : `Deficit reduced to ${formatBillions(Math.abs(scenario.finalBalance))}`} with sustainable fiscal trajectory.
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Risk Management & Contingencies</div>
        
        <div class="risk-box">
            <strong>⚠️ Economic Recession Risk</strong>
            <div class="measure-list">
                <div class="measure-item">• Automatic stabilizers remain fully operational</div>
                <div class="measure-item">• Implementation timeline can be extended</div>
                <div class="measure-item">• Counter-cyclical measures available</div>
                <div class="measure-item">• Regular economic impact assessments</div>
            </div>
        </div>

        <div class="risk-box">
            <strong>⚠️ Political Opposition Risk</strong>
            <div class="measure-list">
                <div class="measure-item">• Bipartisan elements prioritized in early phases</div>
                <div class="measure-item">• Strong public communication strategy</div>
                <div class="measure-item">• Coalition building across interest groups</div>
                <div class="measure-item">• Gradual implementation reduces shock</div>
            </div>
        </div>

        <div class="risk-box">
            <strong>⚠️ Implementation Capacity Risk</strong>
            <div class="measure-list">
                <div class="measure-item">• IRS modernization prioritized early</div>
                <div class="measure-item">• Extensive training programs</div>
                <div class="measure-item">• Technology upgrades front-loaded</div>
                <div class="measure-item">• Interagency coordination protocols</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Success Metrics & Monitoring</div>
        
        <h4>Key Performance Indicators</h4>
        <div class="measure-list">
            <div class="measure-item">• <strong>Fiscal Metrics:</strong> Monthly deficit tracking, revenue by source, spending reduction achievement</div>
            <div class="measure-item">• <strong>Economic Indicators:</strong> GDP impact, employment effects, inflation trends</div>
            <div class="measure-item">• <strong>Implementation Metrics:</strong> Program consolidation progress, audit coverage, compliance rates</div>
        </div>

        <h4>Reporting & Transparency</h4>
        <div class="measure-list">
            <div class="measure-item">• Quarterly public implementation reports</div>
            <div class="measure-item">• Annual comprehensive CBO assessment</div>
            <div class="measure-item">• Public dashboard with real-time metrics</div>
            <div class="measure-item">• Regular Congressional oversight hearings</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Public Engagement Strategy</div>
        
        <div class="success-box">
            <strong>Communication Priorities:</strong>
            <div class="measure-list">
                <div class="measure-item">• Emphasize shared sacrifice and fair burden distribution</div>
                <div class="measure-item">• Highlight long-term benefits for future generations</div>
                <div class="measure-item">• Demonstrate early wins and progress milestones</div>
                <div class="measure-item">• Address concerns proactively with data and analysis</div>
            </div>
        </div>

        <h4>Stakeholder Engagement</h4>
        <div class="measure-list">
            <div class="measure-item">• Regular town halls and public forums</div>
            <div class="measure-item">• Business community briefings and feedback sessions</div>
            <div class="measure-item">• Labor union consultations on employment impacts</div>
            <div class="measure-item">• State and local government coordination</div>
        </div>
    </div>

    <div class="footer">
        <p><strong>Federal Budget Reform Implementation Plan</strong></p>
        <p>"${scenario.name}" Strategy - Generated ${new Date().toLocaleDateString()}</p>
        <p>This document provides a roadmap for achieving fiscal sustainability through comprehensive reform.</p>
        <p><em>Implementation subject to legislative approval and economic conditions.</em></p>
    </div>
</body>
</html>
    `
  }

  const downloadAsPDF = (htmlContent: string) => {
    // Create a blob with the HTML content
    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)

    // Create download link
    const a = document.createElement("a")
    a.href = url
    a.download = `Budget-Reform-Implementation-Plan-${scenario.name.replace(/\s+/g, "-")}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Implementation Plan Generator</h1>
            <p className="text-gray-600">Create detailed implementation documentation for public comment</p>
          </div>
        </div>

        {/* Plan Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              5-Year Implementation Roadmap
            </CardTitle>
            <CardDescription>"{scenario.name}" - Phased approach to fiscal reform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">Phase 1</div>
                <div className="text-sm text-green-700">Foundation (Years 1-2)</div>
                <div className="text-xs text-gray-600 mt-1">Early wins & credibility</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">Phase 2</div>
                <div className="text-sm text-blue-700">Major Reforms (Years 3-4)</div>
                <div className="text-xs text-gray-600 mt-1">Structural changes</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">Phase 3</div>
                <div className="text-sm text-purple-700">Final Push (Year 5+)</div>
                <div className="text-xs text-gray-600 mt-1">Achieve balance</div>
              </div>
            </div>

            <Badge variant={scenario.finalBalance > 0 ? "default" : "secondary"} className="mb-4">
              Target:{" "}
              {scenario.finalBalance > 0
                ? `${formatBillions(scenario.finalBalance)} Surplus`
                : `${formatBillions(Math.abs(scenario.finalBalance))} Deficit`}
            </Badge>
          </CardContent>
        </Card>

        {/* Document Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Contents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Executive Summary</div>
                    <div className="text-sm text-gray-600">Key metrics and objectives</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Phase-by-Phase Breakdown</div>
                    <div className="text-sm text-gray-600">Detailed 5-year timeline</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Risk Management</div>
                    <div className="text-sm text-gray-600">Contingency planning</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Success Metrics</div>
                    <div className="text-sm text-gray-600">Monitoring framework</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Public Engagement</div>
                    <div className="text-sm text-gray-600">Communication strategy</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Public Feedback Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-800">Clear Timeline</div>
                    <div className="text-sm text-blue-600">When each change happens</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Users className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="font-medium text-green-800">Impact Analysis</div>
                    <div className="text-sm text-green-600">Who is affected and how</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <div>
                    <div className="font-medium text-orange-800">Risk Assessment</div>
                    <div className="text-sm text-orange-600">What could go wrong</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Share className="h-4 w-4 text-purple-600" />
                  <div>
                    <div className="font-medium text-purple-800">Shareable Format</div>
                    <div className="text-sm text-purple-600">Easy to distribute and discuss</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Highlights */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Highlights</CardTitle>
            <CardDescription>Key features of the "{scenario.name}" implementation plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-green-700">Early Wins (Years 1-2)</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Close obvious tax loopholes</li>
                  <li>• Implement digital services tax</li>
                  <li>• Begin IRS modernization</li>
                  <li>• Administrative efficiency gains</li>
                  <li>• Build public confidence</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-blue-700">Major Changes (Years 3-4)</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Corporate tax rate increases</li>
                  <li>• Defense spending restructuring</li>
                  <li>• Payroll tax reforms</li>
                  <li>• Carbon tax with rebates</li>
                  <li>• Program consolidation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generation Actions */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Share for Public Comment</CardTitle>
            <CardDescription className="text-green-700">
              Generate a comprehensive implementation plan ready for public review and feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={generateImplementationPDF}
                disabled={isGenerating}
                className="bg-green-600 hover:bg-green-700"
              >
                <Share className="h-4 w-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Implementation Plan"}
              </Button>
              <div className="text-sm text-green-700">
                <p>• Detailed 5-year roadmap</p>
                <p>• Risk assessment and mitigation</p>
                <p>• Ready for public distribution</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
