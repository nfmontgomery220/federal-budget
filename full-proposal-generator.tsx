"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Download, FileText, Calculator, TrendingUp, Users, AlertTriangle, CheckCircle } from "lucide-react"

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 300,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.ComponentProps<typeof Input>, "onChange">) {
  const [value, setValue] = useState(initialValue)
  const isMounted = useRef(false)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  })

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    const timeout = setTimeout(() => {
      onChangeRef.current(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce])

  return <Input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
}

interface BudgetItem {
  category: string
  current: number
  proposed: number
  change: number
  changePercent: number
}

interface TaxPolicy {
  bracket: string
  currentRate: number
  proposedRate: number
  revenue: number
}

interface RevenueOption {
  id: string
  name: string
  description: string
  currentRevenue: number // In billions
  proposedRevenue: number // In billions
  canEdit: boolean
  rate?: number // Optional tax rate if applicable (e.g., 21%)
}

export default function FullProposalGenerator() {
  const [proposalTitle, setProposalTitle] = useState("Comprehensive Budget Reform Act of 2025")
  const [proposalSummary, setProposalSummary] = useState("")
  const [selectedApproach, setSelectedApproach] = useState<string>("")
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedProposal, setGeneratedProposal] = useState<any>(null)

  const [revenueOptions, setRevenueOptions] = useState<RevenueOption[]>([
    {
      id: "corporate_tax",
      name: "Corporate Income Tax",
      description: "Tax on corporate profits (Current Rate: 21%)",
      currentRevenue: 420,
      proposedRevenue: 420,
      canEdit: true,
      rate: 21,
    },
    {
      id: "loophole_closures",
      name: "Corporate Loophole Closures",
      description: "Eliminating carried interest, offshoring incentives, and specific industry subsidies",
      currentRevenue: 0,
      proposedRevenue: 0,
      canEdit: true,
    },
    {
      id: "capital_gains",
      name: "Capital Gains Tax Reform",
      description: "Adjusting tax rates on investment income for high earners",
      currentRevenue: 250,
      proposedRevenue: 250,
      canEdit: true,
    },
    {
      id: "estate_tax",
      name: "Estate & Wealth Tax",
      description: "Taxes on large inheritances and accumulated wealth",
      currentRevenue: 33,
      proposedRevenue: 33,
      canEdit: true,
    },
    {
      id: "carbon_tax",
      name: "Carbon Emissions Tax",
      description: "New tax on carbon emissions to reduce pollution",
      currentRevenue: 0,
      proposedRevenue: 0,
      canEdit: true,
    },
    {
      id: "financial_tax",
      name: "Financial Transaction Tax",
      description: "Small fee on stock, bond, and derivative trades",
      currentRevenue: 0,
      proposedRevenue: 0,
      canEdit: true,
    },
  ])

  // Budget categories with 2025 post-"One Big Beautiful Bill Act" baseline
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { category: "Defense", current: 886, proposed: 886, change: 0, changePercent: 0 },
    { category: "Social Security", current: 1347, proposed: 1347, change: 0, changePercent: 0 },
    { category: "Medicare", current: 1019, proposed: 1019, change: 0, changePercent: 0 },
    { category: "Medicaid", current: 616, proposed: 616, change: 0, changePercent: 0 },
    { category: "Interest on Debt", current: 640, proposed: 640, change: 0, changePercent: 0 },
    { category: "Veterans Affairs", current: 303, proposed: 303, change: 0, changePercent: 0 },
    { category: "Education", current: 80, proposed: 80, change: 0, changePercent: 0 },
    { category: "Transportation", current: 105, proposed: 105, change: 0, changePercent: 0 },
    { category: "Other Discretionary", current: 204, proposed: 204, change: 0, changePercent: 0 },
  ])

  const [taxPolicies, setTaxPolicies] = useState<TaxPolicy[]>([
    { bracket: "Under $50k", currentRate: 0.12, proposedRate: 0.12, revenue: 0 },
    { bracket: "$50k-$100k", currentRate: 0.22, proposedRate: 0.22, revenue: 0 },
    { bracket: "$100k-$200k", currentRate: 0.24, proposedRate: 0.24, revenue: 0 },
    { bracket: "$200k-$500k", currentRate: 0.32, proposedRate: 0.32, revenue: 0 },
    { bracket: "Over $500k", currentRate: 0.37, proposedRate: 0.37, revenue: 0 },
  ])

  const updateBudgetItem = (index: number, newValue: number) => {
    const updated = [...budgetItems]
    updated[index].proposed = newValue
    updated[index].change = newValue - updated[index].current
    updated[index].changePercent = (updated[index].change / updated[index].current) * 100
    setBudgetItems(updated)
  }

  const updateRevenueOption = (index: number, newValue: number) => {
    const updated = [...revenueOptions]
    updated[index].proposedRevenue = newValue
    setRevenueOptions(updated)
  }

  const updateTaxPolicy = (index: number, newRate: number) => {
    const updated = [...taxPolicies]
    updated[index].proposedRate = newRate
    // Simplified revenue calculation
    const baseRevenue = [400, 800, 600, 500, 300][index]
    updated[index].revenue = baseRevenue * (newRate / updated[index].currentRate)
    setTaxPolicies(updated)
  }

  const calculateTotals = () => {
    const totalSpending = budgetItems.reduce((sum, item) => sum + item.proposed, 0)

    const incomeTaxChange = taxPolicies.reduce(
      (sum, policy) => sum + (policy.revenue - [400, 800, 600, 500, 300][taxPolicies.indexOf(policy)]),
      0,
    )

    const otherRevenueChange = revenueOptions.reduce(
      (sum, option) => sum + (option.proposedRevenue - option.currentRevenue),
      0,
    )

    // Base revenue (4550) + Income Tax Changes + Other Revenue Changes
    const totalRevenue = 4550 + incomeTaxChange + otherRevenueChange

    const deficit = totalRevenue - totalSpending

    return { totalSpending, totalRevenue, deficit }
  }

  const generateProposal = async () => {
    setIsGenerating(true)

    try {
      const { totalSpending, totalRevenue, deficit } = calculateTotals()

      // Generate comprehensive proposal
      const proposal = {
        title: proposalTitle,
        summary: proposalSummary || generateDefaultSummary(),
        approach: selectedApproach,
        fiscalImpact: {
          totalSpending,
          totalRevenue,
          deficit,
          deficitReduction: 2650 + deficit, // Compared to 2025 baseline
        },
        spendingChanges: budgetItems.filter((item) => item.change !== 0),
        taxChanges: taxPolicies.filter((policy) => policy.proposedRate !== policy.currentRate),
        revenueChanges: revenueOptions.filter((option) => option.proposedRevenue !== option.currentRevenue),
        implementation: generateImplementationPlan(),
        politicalAnalysis: generatePoliticalAnalysis(),
        economicImpact: generateEconomicImpact(),
      }

      setGeneratedProposal(proposal)
    } catch (error) {
      console.error("Error generating proposal:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateDefaultSummary = () => {
    const { deficit } = calculateTotals()
    const isBalanced = deficit >= 0

    return `This comprehensive budget reform proposal aims to ${isBalanced ? "balance the federal budget" : "significantly reduce the federal deficit"} through a combination of strategic spending adjustments and targeted revenue enhancements. The proposal addresses the fiscal challenges created by the "One Big Beautiful Bill Act" of 2025 while maintaining essential government services and promoting economic growth.`
  }

  const generateImplementationPlan = () => {
    return {
      phase1: "Year 1: Legislative passage and initial implementation of tax policy changes",
      phase2: "Year 2-3: Gradual implementation of spending adjustments with transition support",
      phase3: "Year 4-5: Full implementation and monitoring of fiscal impacts",
      timeline: "5-year implementation period with annual review and adjustment mechanisms",
    }
  }

  const generatePoliticalAnalysis = () => {
    const spendingCuts = budgetItems.filter((item) => item.change < 0).length
    const taxIncreases = taxPolicies.filter((policy) => policy.proposedRate > policy.currentRate).length
    const revenueIncreases = revenueOptions.filter((opt) => opt.proposedRevenue > opt.currentRevenue).length

    return {
      feasibility: spendingCuts > 3 || taxIncreases + revenueIncreases > 2 ? "Challenging" : "Moderate",
      coalitionBuilding: "Requires bipartisan support and stakeholder engagement",
      risks: "Political opposition to spending cuts and tax increases",
      opportunities: "Fiscal responsibility messaging and deficit reduction benefits",
    }
  }

  const generateEconomicImpact = () => {
    const { deficit } = calculateTotals()

    return {
      gdpImpact: deficit >= 0 ? "Positive long-term growth" : "Moderate fiscal drag",
      employmentEffect: "Varies by sector based on spending changes",
      marketResponse: "Likely positive due to deficit reduction",
      longTermOutlook: "Improved fiscal sustainability",
    }
  }

  const exportProposal = () => {
    if (!generatedProposal) return

    const htmlContent = generateProposalHTML()
    downloadAsHTML(htmlContent)
  }

  const generateProposalHTML = () => {
    const { totalSpending, totalRevenue, deficit } = calculateTotals()
    const isBalanced = deficit >= 0

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${generatedProposal.title}</title>
    <style>
        body { 
            font-family: 'Georgia', 'Times New Roman', serif; 
            margin: 40px; 
            line-height: 1.6; 
            color: #1f2937; 
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px;
        }
        .header { 
            text-align: center; 
            border-bottom: 4px solid #2563eb; 
            padding-bottom: 30px; 
            margin-bottom: 40px; 
        }
        .title { 
            font-size: 32px; 
            font-weight: bold; 
            color: #1e40af; 
            margin-bottom: 15px; 
            letter-spacing: -0.5px;
        }
        .subtitle { 
            font-size: 18px; 
            color: #64748b; 
            font-style: italic;
        }
        .executive-summary {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-left: 6px solid #2563eb;
            padding: 25px;
            margin: 30px 0;
            border-radius: 8px;
        }
        .section { 
            margin-bottom: 40px; 
            page-break-inside: avoid;
        }
        .section-title { 
            font-size: 24px; 
            font-weight: bold; 
            color: #1e40af; 
            border-bottom: 3px solid #bfdbfe; 
            padding-bottom: 10px; 
            margin-bottom: 20px; 
        }
        .subsection-title {
            font-size: 18px;
            font-weight: bold;
            color: #374151;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        .metrics-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin: 30px 0;
        }
        .metric-card { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 10px; 
            text-align: center;
            border: 2px solid #e2e8f0;
        }
        .metric-value { 
            font-size: 28px; 
            font-weight: bold; 
            color: #1e40af; 
            margin-bottom: 5px;
        }
        .metric-label { 
            font-size: 14px; 
            color: #64748b; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .change-item {
            background: white;
            border: 1px solid #e2e8f0;
            padding: 15px;
            margin-bottom: 12px;
            border-radius: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .change-item-title {
            font-weight: 600;
            color: #1f2937;
            font-size: 16px;
        }
        .change-item-detail {
            font-size: 14px;
            color: #6b7280;
            margin-top: 4px;
        }
        .change-amount {
            text-align: right;
        }
        .change-value {
            font-family: 'Courier New', monospace;
            font-size: 18px;
            font-weight: bold;
        }
        .change-percent {
            font-size: 13px;
            color: #6b7280;
        }
        .positive { color: #dc2626; }
        .negative { color: #059669; }
        .neutral { color: #6b7280; }
        .phase-box {
            background: #f9fafb;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .phase-title {
            font-size: 18px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
        }
        .phase-content {
            color: #4b5563;
            line-height: 1.8;
        }
        .info-box {
            background: #ecfeff;
            border-left: 4px solid #06b6d4;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .warning-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .success-box {
            background: #dcfce7;
            border-left: 4px solid #22c55e;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .badge-success { background: #dcfce7; color: #166534; }
        .badge-warning { background: #fef3c7; color: #92400e; }
        .badge-info { background: #dbeafe; color: #1e40af; }
        .footer { 
            text-align: center; 
            margin-top: 60px; 
            padding-top: 30px; 
            border-top: 2px solid #e5e7eb; 
            color: #6b7280;
            font-size: 14px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        th {
            background: #f8fafc;
            font-weight: 600;
            color: #374151;
        }
        @media print {
            body { margin: 20px; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">${generatedProposal.title}</div>
        <div class="subtitle">Comprehensive Federal Budget Reform Proposal</div>
        <div class="subtitle">Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
    </div>

    <div class="executive-summary">
        <h2 style="margin-top: 0; color: #1e40af;">Executive Summary</h2>
        <p style="font-size: 16px; line-height: 1.8; margin: 0;">${generatedProposal.summary}</p>
    </div>

    <div class="metrics-grid">
        <div class="metric-card">
            <div class="metric-value">$${totalSpending.toLocaleString()}B</div>
            <div class="metric-label">Total Spending</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">$${totalRevenue.toLocaleString()}B</div>
            <div class="metric-label">Total Revenue</div>
        </div>
        <div class="metric-card">
            <div class="metric-value ${isBalanced ? "positive" : "negative"}">${isBalanced ? "+" : ""}$${deficit.toLocaleString()}B</div>
            <div class="metric-label">${isBalanced ? "Surplus" : "Deficit"}</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">$${generatedProposal.fiscalImpact.deficitReduction.toLocaleString()}B</div>
            <div class="metric-label">Deficit Reduction</div>
        </div>
    </div>

    ${
      isBalanced
        ? '<div class="success-box"><strong>✓ Budget Balanced:</strong> This proposal achieves a balanced federal budget with a surplus of $' +
          deficit.toLocaleString() +
          "B.</div>"
        : '<div class="warning-box"><strong>⚠ Deficit Remains:</strong> While significant progress is made, a deficit of $' +
          Math.abs(deficit).toLocaleString() +
          "B remains. Additional measures may be needed.</div>"
    }

    <div class="section">
        <div class="section-title">Spending Changes</div>
        <div class="subsection-title">Proposed Adjustments to Federal Spending (in Billions)</div>
        ${
          generatedProposal.spendingChanges.length > 0
            ? generatedProposal.spendingChanges
                .map(
                  (item: BudgetItem) => `
            <div class="change-item">
                <div>
                    <div class="change-item-title">${item.category}</div>
                    <div class="change-item-detail">Current: $${item.current.toLocaleString()}B → Proposed: $${item.proposed.toLocaleString()}B</div>
                </div>
                <div class="change-amount">
                    <div class="change-value ${item.change > 0 ? "positive" : "negative"}">${item.change > 0 ? "+" : ""}$${item.change.toLocaleString()}B</div>
                    <div class="change-percent">${item.changePercent.toFixed(1)}%</div>
                </div>
            </div>
            `,
                )
                .join("")
            : '<p style="color: #6b7280; font-style: italic;">No spending changes proposed in this scenario.</p>'
        }
        
        <div class="info-box">
            <strong>Total Spending Impact:</strong> ${generatedProposal.fiscalImpact.totalSpending > 7200 ? "Net increase" : "Net reduction"} of $${Math.abs(generatedProposal.fiscalImpact.totalSpending - 7200).toLocaleString()}B compared to 2025 baseline.
        </div>
    </div>

    <div class="section">
        <div class="section-title">Tax Policy Changes</div>
        
        <!-- Personal Income Tax Section -->
        <div class="subsection-title">Personal Income Tax Reform</div>
        ${
          generatedProposal.taxChanges.length > 0
            ? generatedProposal.taxChanges
                .map(
                  (policy: TaxPolicy) => `
            <div class="change-item">
                <div>
                    <div class="change-item-title">${policy.bracket} Bracket</div>
                    <div class="change-item-detail">Current Rate: ${(policy.currentRate * 100).toFixed(1)}% → Proposed Rate: ${(policy.proposedRate * 100).toFixed(1)}%</div>
                </div>
                <div class="change-amount">
                    <div class="change-value ${policy.proposedRate > policy.currentRate ? "positive" : "negative"}">$${policy.revenue.toLocaleString()}B</div>
                    <div class="change-percent">Annual Revenue</div>
                </div>
            </div>
            `,
                )
                .join("")
            : '<p style="color: #6b7280; font-style: italic; margin-bottom: 20px;">No changes to personal income tax rates.</p>'
        }

        <!-- Corporate & Alternative Revenue Section to HTML -->
        <div class="subsection-title" style="margin-top: 30px;">Corporate & Alternative Revenue</div>
        ${
          generatedProposal.revenueChanges.length > 0
            ? generatedProposal.revenueChanges
                .map(
                  (option: RevenueOption) => `
            <div class="change-item">
                <div>
                    <div class="change-item-title">${option.name}</div>
                    <div class="change-item-detail">${option.description}</div>
                    <div class="change-item-detail">Current Revenue: $${option.currentRevenue.toLocaleString()}B → Proposed: $${option.proposedRevenue.toLocaleString()}B</div>
                </div>
                <div class="change-amount">
                    <div class="change-value ${option.proposedRevenue > option.currentRevenue ? "positive" : "negative"}">${option.proposedRevenue > option.currentRevenue ? "+" : ""}$${(option.proposedRevenue - option.currentRevenue).toLocaleString()}B</div>
                    <div class="change-percent">Net Change</div>
                </div>
            </div>
            `,
                )
                .join("")
            : '<p style="color: #6b7280; font-style: italic;">No changes to corporate or alternative revenue sources.</p>'
        }
        
        <div class="info-box">
            <strong>Total Revenue Impact:</strong> ${generatedProposal.fiscalImpact.totalRevenue > 4550 ? "Increase" : "Decrease"} of $${Math.abs(generatedProposal.fiscalImpact.totalRevenue - 4550).toLocaleString()}B compared to 2025 baseline revenue.
        </div>
    </div>

    <div class="section">
        <div class="section-title">Implementation Plan</div>
        <div class="subsection-title">5-Year Phased Approach</div>
        
        <div class="phase-box">
            <div class="phase-title">Phase 1: Foundation (Year 1)</div>
            <div class="phase-content">${generatedProposal.implementation.phase1}</div>
        </div>
        
        <div class="phase-box">
            <div class="phase-title">Phase 2: Transition (Years 2-3)</div>
            <div class="phase-content">${generatedProposal.implementation.phase2}</div>
        </div>
        
        <div class="phase-box">
            <div class="phase-title">Phase 3: Full Implementation (Years 4-5)</div>
            <div class="phase-content">${generatedProposal.implementation.phase3}</div>
        </div>
        
        <div class="info-box">
            <strong>Implementation Timeline:</strong> ${generatedProposal.implementation.timeline}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Political Analysis</div>
        
        <div style="margin-bottom: 20px;">
            <strong>Feasibility Assessment:</strong>
            <span class="badge ${generatedProposal.politicalAnalysis.feasibility === "Challenging" ? "badge-warning" : "badge-success"}">
                ${generatedProposal.politicalAnalysis.feasibility}
            </span>
        </div>
        
        <div style="margin-bottom: 15px;">
            <strong>Coalition Building Strategy:</strong>
            <p style="margin: 10px 0; color: #4b5563;">${generatedProposal.politicalAnalysis.coalitionBuilding}</p>
        </div>
        
        <div style="margin-bottom: 15px;">
            <strong>Key Risks:</strong>
            <p style="margin: 10px 0; color: #4b5563;">${generatedProposal.politicalAnalysis.risks}</p>
        </div>
        
        <div>
            <strong>Opportunities:</strong>
            <p style="margin: 10px 0; color: #4b5563;">${generatedProposal.politicalAnalysis.opportunities}</p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Economic Impact Assessment</div>
        
        <table>
            <thead>
                <tr>
                    <th>Impact Area</th>
                    <th>Assessment</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>GDP Impact</strong></td>
                    <td>${generatedProposal.economicImpact.gdpImpact}</td>
                </tr>
                <tr>
                    <td><strong>Employment Effect</strong></td>
                    <td>${generatedProposal.economicImpact.employmentEffect}</td>
                </tr>
                <tr>
                    <td><strong>Market Response</strong></td>
                    <td>${generatedProposal.economicImpact.marketResponse}</td>
                </tr>
                <tr>
                    <td><strong>Long-term Outlook</strong></td>
                    <td>${generatedProposal.economicImpact.longTermOutlook}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Approach & Philosophy</div>
        <div class="info-box">
            <strong>Selected Approach:</strong> ${generatedProposal.approach}
            <p style="margin: 10px 0 0 0; color: #4b5563;">
                This approach balances fiscal responsibility with economic growth considerations, 
                emphasizing ${
                  generatedProposal.approach.includes("spending")
                    ? "efficient government operations and spending discipline"
                    : generatedProposal.approach.includes("revenue")
                      ? "fair revenue generation and progressive taxation"
                      : "both spending efficiency and revenue optimization"
                }.
            </p>
        </div>
    </div>

    <div class="footer">
        <p><strong>${generatedProposal.title}</strong></p>
        <p>Federal Budget Reform Proposal - ${new Date().getFullYear()}</p>
        <p style="margin-top: 15px; font-size: 12px;">
            This proposal represents a comprehensive approach to federal fiscal reform. 
            Implementation requires legislative approval and may be subject to economic conditions.
        </p>
        <p style="font-size: 12px; color: #9ca3af;">
            Generated using the Federal Budget Analysis Tool | For planning and analysis purposes
        </p>
    </div>
</body>
</html>
    `
  }

  const downloadAsHTML = (htmlContent: string) => {
    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${proposalTitle.replace(/\s+/g, "_")}_Budget_Proposal.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const { totalSpending, totalRevenue, deficit } = calculateTotals()
  const isBalanced = deficit >= 0

  if (generatedProposal) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={() => setGeneratedProposal(null)} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Generator
            </Button>
            <div className="flex gap-2">
              <Button onClick={exportProposal} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Proposal
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{generatedProposal.title}</CardTitle>
                  <CardDescription className="mt-2">{generatedProposal.summary}</CardDescription>
                </div>
                <Badge variant={isBalanced ? "default" : "destructive"} className="text-lg px-4 py-2">
                  {isBalanced ? "Balanced Budget" : `$${Math.abs(deficit).toLocaleString()}B Deficit`}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="spending">Spending</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="implementation">Implementation</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Fiscal Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Spending:</span>
                        <span className="font-mono">${totalSpending.toLocaleString()}B</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Revenue:</span>
                        <span className="font-mono">${totalRevenue.toLocaleString()}B</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Budget Balance:</span>
                        <span className={`font-mono ${isBalanced ? "text-green-600" : "text-red-600"}`}>
                          ${deficit.toLocaleString()}B
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Deficit Reduction:</span>
                        <span className="font-mono">
                          ${generatedProposal.fiscalImpact.deficitReduction.toLocaleString()}B
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Key Changes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Spending Changes:</span>
                        <span className="ml-2">{generatedProposal.spendingChanges.length} categories</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Tax Changes:</span>
                        <span className="ml-2">{generatedProposal.taxChanges.length} brackets</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Revenue Changes:</span>
                        <span className="ml-2">{generatedProposal.revenueChanges.length} sources</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Approach:</span>
                        <span className="ml-2">{generatedProposal.approach}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Political Feasibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Feasibility:</span>
                        <Badge
                          variant={
                            generatedProposal.politicalAnalysis.feasibility === "Challenging"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {generatedProposal.politicalAnalysis.feasibility}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{generatedProposal.politicalAnalysis.coalitionBuilding}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="spending">
              <Card>
                <CardHeader>
                  <CardTitle>Spending Changes</CardTitle>
                  <CardDescription>Detailed breakdown of proposed spending adjustments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedProposal.spendingChanges.map((item: BudgetItem, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{item.category}</h4>
                          <p className="text-sm text-gray-600">
                            ${item.current.toLocaleString()}B → ${item.proposed.toLocaleString()}B
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`font-mono ${item.change > 0 ? "text-red-600" : "text-green-600"}`}>
                            {item.change > 0 ? "+" : ""}${item.change.toLocaleString()}B
                          </div>
                          <div className="text-sm text-gray-600">{item.changePercent.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Changes</CardTitle>
                  <CardDescription>Proposed modifications to federal revenue streams</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="mb-6">
                      <h4 className="font-medium text-lg mb-3">Personal Income Tax Reform</h4>
                      {generatedProposal.taxChanges.length > 0 ? (
                        generatedProposal.taxChanges.map((policy: TaxPolicy, index: number) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg mb-3">
                            <div>
                              <h4 className="font-medium">{policy.bracket}</h4>
                              <p className="text-sm text-gray-600">
                                {(policy.currentRate * 100).toFixed(1)}% → {(policy.proposedRate * 100).toFixed(1)}%
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-mono">${policy.revenue.toLocaleString()}B</div>
                              <div className="text-sm text-gray-600">Annual Revenue</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No changes to personal income tax rates.</p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium text-lg mb-3">Corporate & Alternative Revenue</h4>
                      {generatedProposal.revenueChanges.length > 0 ? (
                        generatedProposal.revenueChanges.map((option: RevenueOption, index: number) => (
                          <div key={option.id} className="flex items-center justify-between p-4 border rounded-lg mb-3">
                            <div>
                              <h4 className="font-medium">{option.name}</h4>
                              <p className="text-sm text-gray-600">{option.description}</p>
                              <p className="text-sm text-gray-600">
                                Current: ${option.currentRevenue.toLocaleString()}B → Proposed: $
                                {option.proposedRevenue.toLocaleString()}B
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-mono">
                                ${(option.proposedRevenue - option.currentRevenue).toLocaleString()}B
                              </div>
                              <div className="text-sm text-gray-600">Net Change</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No changes to corporate or alternative revenue sources.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="implementation">
              <Card>
                <CardHeader>
                  <CardTitle>Implementation Plan</CardTitle>
                  <CardDescription>Phased approach to implementing budget reforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Phase 1: Foundation (Year 1)</h4>
                      <p className="text-gray-600">{generatedProposal.implementation.phase1}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Phase 2: Transition (Years 2-3)</h4>
                      <p className="text-gray-600">{generatedProposal.implementation.phase2}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Phase 3: Full Implementation (Years 4-5)</h4>
                      <p className="text-gray-600">{generatedProposal.implementation.phase3}</p>
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-2">Timeline Overview</h4>
                      <p className="text-gray-600">{generatedProposal.implementation.timeline}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Political Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Feasibility Assessment</h4>
                        <p className="text-sm text-gray-600">{generatedProposal.politicalAnalysis.feasibility}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Coalition Building</h4>
                        <p className="text-sm text-gray-600">{generatedProposal.politicalAnalysis.coalitionBuilding}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Key Risks</h4>
                        <p className="text-sm text-gray-600">{generatedProposal.politicalAnalysis.risks}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Opportunities</h4>
                        <p className="text-sm text-gray-600">{generatedProposal.politicalAnalysis.opportunities}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Economic Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">GDP Impact</h4>
                        <p className="text-sm text-gray-600">{generatedProposal.economicImpact.gdpImpact}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Employment Effect</h4>
                        <p className="text-sm text-gray-600">{generatedProposal.economicImpact.employmentEffect}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Market Response</h4>
                        <p className="text-sm text-gray-600">{generatedProposal.economicImpact.marketResponse}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Long-term Outlook</h4>
                        <p className="text-sm text-gray-600">{generatedProposal.economicImpact.longTermOutlook}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Progress value={(currentStep / 4) * 100} className="w-32" />
            <span className="text-sm text-gray-600">Step {currentStep} of 4</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Full Proposal Generator
            </CardTitle>
            <CardDescription>
              Create a comprehensive budget reform proposal with detailed analysis and implementation plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentStep.toString()} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="1">Setup</TabsTrigger>
                <TabsTrigger value="2">Spending & Revenue</TabsTrigger>
                <TabsTrigger value="3">Review</TabsTrigger>
              </TabsList>

              <TabsContent value="1" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Proposal Title</Label>
                    <Input
                      id="title"
                      value={proposalTitle}
                      onChange={(e) => setProposalTitle(e.target.value)}
                      placeholder="Enter proposal title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="approach">Budget Approach</Label>
                    <Select value={selectedApproach} onValueChange={setSelectedApproach}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your approach" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced Approach</SelectItem>
                        <SelectItem value="spending-focused">Spending Reduction Focus</SelectItem>
                        <SelectItem value="revenue-focused">Revenue Enhancement Focus</SelectItem>
                        <SelectItem value="progressive">Progressive Reform</SelectItem>
                        <SelectItem value="conservative">Conservative Reform</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="summary">Executive Summary (Optional)</Label>
                    <Textarea
                      id="summary"
                      value={proposalSummary}
                      onChange={(e) => setProposalSummary(e.target.value)}
                      placeholder="Provide a brief summary of your proposal goals and approach"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setCurrentStep(2)} disabled={!selectedApproach}>
                    Next: Configure Spending & Revenue
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="2" className="space-y-6">
                {/* Step 2: Spending and Revenue Configuration */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Spending Configuration</h3>
                    <div className="space-y-4">
                      {budgetItems.map((item, index) => (
                        <div key={item.category} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.category}</h4>
                            <p className="text-sm text-gray-600">Current: ${item.current.toLocaleString()}B</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <DebouncedInput
                              type="number"
                              value={item.proposed}
                              onChange={(val) => updateBudgetItem(index, Number(val))}
                              className="w-24"
                            />
                            <div className="text-right min-w-[80px]">
                              <div
                                className={`text-sm font-mono ${item.change > 0 ? "text-red-600" : item.change < 0 ? "text-green-600" : "text-gray-600"}`}
                              >
                                {item.change > 0 ? "+" : ""}
                                {item.change.toFixed(0)}B
                              </div>
                              <div className="text-xs text-gray-500">{item.changePercent.toFixed(1)}%</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-medium mb-4">Corporate & Alternative Revenue</h3>
                    <div className="space-y-6">
                      {revenueOptions.map((option, index) => (
                        <div key={option.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <Label className="text-base font-bold text-slate-800">{option.name}</Label>
                              <p className="text-xs text-slate-500 mt-1">{option.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-mono font-bold text-lg text-emerald-600">
                                ${option.proposedRevenue.toLocaleString()}B
                              </div>
                              {option.proposedRevenue !== option.currentRevenue && (
                                <div
                                  className={`text-xs ${option.proposedRevenue > option.currentRevenue ? "text-emerald-600" : "text-red-600"}`}
                                >
                                  {option.proposedRevenue > option.currentRevenue ? "+" : ""}$
                                  {Math.abs(option.proposedRevenue - option.currentRevenue).toLocaleString()}B
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-4 items-center mt-4">
                            <span className="text-xs w-12 text-right text-slate-500">Min</span>
                            <DebouncedInput
                              type="range"
                              min={0}
                              max={option.currentRevenue > 0 ? option.currentRevenue * 2 : 500}
                              step={10}
                              value={option.proposedRevenue}
                              onChange={(val) => updateRevenueOption(index, Number(val))}
                              className="flex-1"
                            />
                            <span className="text-xs w-12 text-slate-500">Max</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={() => setCurrentStep(3)}>Continue to Review</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="3" className="space-y-6">
                {/* Step 3: Review & Generate */}
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-4">Proposal Summary</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">${totalSpending.toLocaleString()}B</div>
                        <div className="text-sm text-gray-600">Total Spending</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}B</div>
                        <div className="text-sm text-gray-600">Total Revenue</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className={`text-2xl font-bold ${isBalanced ? "text-green-600" : "text-red-600"}`}>
                          ${Math.abs(deficit).toLocaleString()}B
                        </div>
                        <div className="text-sm text-gray-600">{isBalanced ? "Surplus" : "Deficit"}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-6">
                    {isBalanced ? (
                      <>
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <span className="text-green-600 font-medium">Budget Balanced!</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-6 w-6 text-yellow-600" />
                        <span className="text-yellow-600 font-medium">
                          Deficit Reduced by ${(2650 + deficit).toLocaleString()}B
                        </span>
                      </>
                    )}
                  </div>

                  <Button onClick={generateProposal} disabled={isGenerating} size="lg" className="w-full max-w-md">
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Proposal...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Full Proposal
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
