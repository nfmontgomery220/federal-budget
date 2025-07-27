"use client"

import { useState, useEffect } from "react"
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
import { formatLargeNumber, formatPercentage } from "@/utils/format-helpers"
import { createBudgetSession, saveBudgetConfig, completeSession, trackInteraction } from "@/lib/budget-analytics"

interface FullProposalGeneratorProps {
  onBack: () => void
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

export default function FullProposalGenerator({ onBack }: FullProposalGeneratorProps) {
  const [sessionId, setSessionId] = useState<string>("")
  const [proposalTitle, setProposalTitle] = useState("Comprehensive Budget Reform Act of 2025")
  const [proposalSummary, setProposalSummary] = useState("")
  const [selectedApproach, setSelectedApproach] = useState<string>("")
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedProposal, setGeneratedProposal] = useState<any>(null)

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

  useEffect(() => {
    initializeSession()
  }, [])

  const initializeSession = async () => {
    try {
      const id = await createBudgetSession()
      setSessionId(id)
      await trackInteraction(id, "started_full_proposal_generator")
    } catch (error) {
      console.error("Error initializing session:", error)
    }
  }

  const updateBudgetItem = (index: number, newValue: number) => {
    const updated = [...budgetItems]
    updated[index].proposed = newValue
    updated[index].change = newValue - updated[index].current
    updated[index].changePercent = (updated[index].change / updated[index].current) * 100
    setBudgetItems(updated)
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
    const totalRevenue =
      4550 +
      taxPolicies.reduce(
        (sum, policy) => sum + (policy.revenue - [400, 800, 600, 500, 300][taxPolicies.indexOf(policy)]),
        0,
      )
    const deficit = totalRevenue - totalSpending

    return { totalSpending, totalRevenue, deficit }
  }

  const generateProposal = async () => {
    setIsGenerating(true)

    try {
      await trackInteraction(sessionId, "generated_full_proposal", { approach: selectedApproach })

      const { totalSpending, totalRevenue, deficit } = calculateTotals()

      // Save configuration
      for (const item of budgetItems) {
        if (item.change !== 0) {
          await saveBudgetConfig(sessionId, item.category, item.proposed)
        }
      }

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
        implementation: generateImplementationPlan(),
        politicalAnalysis: generatePoliticalAnalysis(),
        economicImpact: generateEconomicImpact(),
      }

      setGeneratedProposal(proposal)
      await completeSession(sessionId, selectedApproach, deficit, totalSpending, totalRevenue)
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

    return {
      feasibility: spendingCuts > 3 || taxIncreases > 2 ? "Challenging" : "Moderate",
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

    const content = `
# ${generatedProposal.title}

## Executive Summary
${generatedProposal.summary}

## Fiscal Impact
- Total Spending: ${formatLargeNumber(generatedProposal.fiscalImpact.totalSpending * 1000000000)}
- Total Revenue: ${formatLargeNumber(generatedProposal.fiscalImpact.totalRevenue * 1000000000)}
- Budget Balance: ${formatLargeNumber(generatedProposal.fiscalImpact.deficit * 1000000000)}
- Deficit Reduction: ${formatLargeNumber(generatedProposal.fiscalImpact.deficitReduction * 1000000000)}

## Spending Changes
${generatedProposal.spendingChanges
  .map(
    (item: BudgetItem) =>
      `- ${item.category}: ${item.change > 0 ? "+" : ""}${formatLargeNumber(item.change * 1000000000)} (${item.changePercent.toFixed(1)}%)`,
  )
  .join("\n")}

## Tax Policy Changes
${generatedProposal.taxChanges
  .map(
    (policy: TaxPolicy) =>
      `- ${policy.bracket}: ${formatPercentage(policy.currentRate)} → ${formatPercentage(policy.proposedRate)}`,
  )
  .join("\n")}

## Implementation Plan
- Phase 1: ${generatedProposal.implementation.phase1}
- Phase 2: ${generatedProposal.implementation.phase2}
- Phase 3: ${generatedProposal.implementation.phase3}

## Political Analysis
- Feasibility: ${generatedProposal.politicalAnalysis.feasibility}
- Coalition Building: ${generatedProposal.politicalAnalysis.coalitionBuilding}

## Economic Impact
- GDP Impact: ${generatedProposal.economicImpact.gdpImpact}
- Employment Effect: ${generatedProposal.economicImpact.employmentEffect}
    `

    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${proposalTitle.replace(/\s+/g, "_")}.md`
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
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex gap-2">
              <Button onClick={exportProposal} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Proposal
              </Button>
              <Button variant="outline" onClick={() => setGeneratedProposal(null)}>
                Create New Proposal
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
                  {isBalanced ? "Balanced Budget" : `${formatLargeNumber(Math.abs(deficit) * 1000000000)} Deficit`}
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
                        <span className="font-mono">{formatLargeNumber(totalSpending * 1000000000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Revenue:</span>
                        <span className="font-mono">{formatLargeNumber(totalRevenue * 1000000000)}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Budget Balance:</span>
                        <span className={`font-mono ${isBalanced ? "text-green-600" : "text-red-600"}`}>
                          {formatLargeNumber(deficit * 1000000000)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Deficit Reduction:</span>
                        <span className="font-mono">
                          {formatLargeNumber(generatedProposal.fiscalImpact.deficitReduction * 1000000000)}
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
                            {formatLargeNumber(item.current * 1000000000)} →{" "}
                            {formatLargeNumber(item.proposed * 1000000000)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`font-mono ${item.change > 0 ? "text-red-600" : "text-green-600"}`}>
                            {item.change > 0 ? "+" : ""}
                            {formatLargeNumber(item.change * 1000000000)}
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
                  <CardTitle>Tax Policy Changes</CardTitle>
                  <CardDescription>Proposed modifications to federal tax rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedProposal.taxChanges.map((policy: TaxPolicy, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{policy.bracket}</h4>
                          <p className="text-sm text-gray-600">
                            {formatPercentage(policy.currentRate)} → {formatPercentage(policy.proposedRate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-mono">{formatLargeNumber(policy.revenue * 1000000000)}</div>
                          <div className="text-sm text-gray-600">Annual Revenue</div>
                        </div>
                      </div>
                    ))}
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
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
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
                <TabsTrigger value="2">Spending</TabsTrigger>
                <TabsTrigger value="3">Revenue</TabsTrigger>
                <TabsTrigger value="4">Generate</TabsTrigger>
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
                    Next: Configure Spending
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="2" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Spending Configuration</h3>
                  <div className="space-y-4">
                    {budgetItems.map((item, index) => (
                      <div key={item.category} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.category}</h4>
                          <p className="text-sm text-gray-600">
                            Current: {formatLargeNumber(item.current * 1000000000)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Input
                            type="number"
                            value={item.proposed}
                            onChange={(e) => updateBudgetItem(index, Number(e.target.value))}
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

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep(3)}>Next: Configure Revenue</Button>
                </div>
              </TabsContent>

              <TabsContent value="3" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Tax Policy Configuration</h3>
                  <div className="space-y-4">
                    {taxPolicies.map((policy, index) => (
                      <div key={policy.bracket} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{policy.bracket}</h4>
                          <p className="text-sm text-gray-600">Current Rate: {formatPercentage(policy.currentRate)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            value={policy.proposedRate}
                            onChange={(e) => updateTaxPolicy(index, Number(e.target.value))}
                            className="w-24"
                          />
                          <div className="text-right min-w-[100px]">
                            <div className="text-sm font-mono">{formatLargeNumber(policy.revenue * 1000000000)}</div>
                            <div className="text-xs text-gray-500">Revenue</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep(4)}>Next: Generate Proposal</Button>
                </div>
              </TabsContent>

              <TabsContent value="4" className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-4">Proposal Summary</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{formatLargeNumber(totalSpending * 1000000000)}</div>
                        <div className="text-sm text-gray-600">Total Spending</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{formatLargeNumber(totalRevenue * 1000000000)}</div>
                        <div className="text-sm text-gray-600">Total Revenue</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className={`text-2xl font-bold ${isBalanced ? "text-green-600" : "text-red-600"}`}>
                          {formatLargeNumber(Math.abs(deficit) * 1000000000)}
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
                          Deficit Reduced by {formatLargeNumber((2650 + deficit) * 1000000000)}
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

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(3)}>
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
