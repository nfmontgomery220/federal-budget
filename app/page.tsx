"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calculator,
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  AlertTriangle,
  Building2,
  PieChart,
  Target,
  Gavel,
  Shield,
  Heart,
  Briefcase,
  Activity,
  ArrowLeft,
} from "lucide-react"

// Import components dynamically to avoid module resolution issues
import dynamic from "next/dynamic"

const BalancedBudgetBuilder = dynamic(() => import("../balanced-budget-builder"), { ssr: false })
const BudgetAnalyticsDashboard = dynamic(() => import("../budget-analytics-dashboard"), { ssr: false })
const TaxDesignCalculator = dynamic(() => import("../tax-design-calculator"), { ssr: false })
const MilitarySpendingBreakdown = dynamic(() => import("../military-spending-breakdown"), { ssr: false })
const RevenueOptimization = dynamic(() => import("../revenue-optimization"), { ssr: false })
const IncomeBracketImpactAnalyzer = dynamic(() => import("../income-bracket-impact-analyzer"), { ssr: false })
const StateTaxAnalysis = dynamic(() => import("../state-tax-analysis"), { ssr: false })
const RevenueBreakdown = dynamic(() => import("../revenue-breakdown"), { ssr: false })
const TaxPolicyScenarios = dynamic(() => import("../tax-policy-scenarios"), { ssr: false })
const GunsVsButterAnalysis = dynamic(() => import("../guns-vs-butter-analysis"), { ssr: false })
const SocialSecurityMedicareAnalysis = dynamic(() => import("../social-security-medicare-analysis"), { ssr: false })
const SocialSecuritySolutions = dynamic(() => import("../social-security-solutions"), { ssr: false })
const FullProposalGenerator = dynamic(() => import("../full-proposal-generator"), { ssr: false })
const LegislativeUpdateSystem = dynamic(() => import("../legislative-update-system"), { ssr: false })
const FederalBudgetDashboard = dynamic(() => import("../federal-budget-dashboard"), { ssr: false })

type ActiveTool =
  | "dashboard"
  | "budget-builder"
  | "analytics"
  | "tax-design"
  | "military-spending"
  | "revenue-optimization"
  | "income-impact"
  | "state-tax"
  | "revenue-breakdown"
  | "tax-scenarios"
  | "guns-vs-butter"
  | "social-security"
  | "ss-solutions"
  | "full-proposal"
  | "legislative-updates"

export default function HomePage() {
  const [activeTool, setActiveTool] = useState<ActiveTool>("dashboard")

  const handleToolSelect = (tool: ActiveTool) => {
    setActiveTool(tool)
  }

  const handleBackToDashboard = () => {
    setActiveTool("dashboard")
  }

  if (activeTool === "budget-builder") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={handleBackToDashboard} variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <BalancedBudgetBuilder />
        </div>
      </div>
    )
  }

  if (activeTool === "analytics") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={handleBackToDashboard} variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <BudgetAnalyticsDashboard />
        </div>
      </div>
    )
  }

  if (activeTool === "tax-design") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={handleBackToDashboard} variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <TaxDesignCalculator />
        </div>
      </div>
    )
  }

  if (activeTool === "military-spending") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={handleBackToDashboard} variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <MilitarySpendingBreakdown />
        </div>
      </div>
    )
  }

  if (activeTool === "revenue-optimization") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={handleBackToDashboard} variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <RevenueOptimization />
        </div>
      </div>
    )
  }

  if (activeTool === "income-impact") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={handleBackToDashboard} variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <IncomeBracketImpactAnalyzer />
        </div>
      </div>
    )
  }

  if (activeTool === "state-tax") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={handleBackToDashboard} variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <StateTaxAnalysis />
        </div>
      </div>
    )
  }

  if (activeTool === "revenue-breakdown") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={handleBackToDashboard} variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <RevenueBreakdown />
        </div>
      </div>
    )
  }

  if (activeTool === "tax-scenarios") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={handleBackToDashboard} variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <TaxPolicyScenarios />
        </div>
      </div>
    )
  }

  if (activeTool === "guns-vs-butter") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={handleBackToDashboard} variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <GunsVsButterAnalysis />
        </div>
      </div>
    )
  }

  if (activeTool === "social-security") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={handleBackToDashboard} variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <SocialSecurityMedicareAnalysis />
        </div>
      </div>
    )
  }

  if (activeTool === "ss-solutions") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={handleBackToDashboard} variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <SocialSecuritySolutions />
        </div>
      </div>
    )
  }

  if (activeTool === "full-proposal") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={handleBackToDashboard} variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <FullProposalGenerator />
        </div>
      </div>
    )
  }

  if (activeTool === "legislative-updates") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={handleBackToDashboard} variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <LegislativeUpdateSystem />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Federal Budget Analysis Tool</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools for analyzing the federal budget, exploring policy scenarios, and understanding fiscal
            impacts in the post-"One Big Beautiful Bill Act" era.
          </p>
        </div>

        {/* Crisis Alert */}
        <Alert className="mb-8 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>🚨 2025 Fiscal Crisis Alert</strong>
            <br />
            The "One Big Beautiful Bill Act" signed on July 4th, 2025 has created a $2.65 trillion deficit. Use these
            tools to explore solutions and understand the fiscal challenges ahead.
          </AlertDescription>
        </Alert>

        {/* Main Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Budget Builder */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Calculator className="h-5 w-5" />
                Budget Builder
              </CardTitle>
              <CardDescription className="text-blue-700">
                Interactive tool to balance the 2025 federal budget through spending cuts and revenue increases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleToolSelect("budget-builder")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Start Building Budget
              </Button>
            </CardContent>
          </Card>

          {/* Analytics Dashboard */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <BarChart3 className="h-5 w-5" />
                Analytics Dashboard
              </CardTitle>
              <CardDescription className="text-green-700">
                Real-time insights from user budget exercises and policy preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleToolSelect("analytics")} className="w-full bg-green-600 hover:bg-green-700">
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Tax Design Calculator */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Tax Design Calculator
              </CardTitle>
              <CardDescription>Design optimal tax policies and analyze revenue potential</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleToolSelect("tax-design")} className="w-full bg-gray-900 hover:bg-gray-800">
                Design Tax Policy
              </Button>
            </CardContent>
          </Card>

          {/* Military Spending Analysis */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Military Spending Analysis
              </CardTitle>
              <CardDescription>Detailed breakdown of defense spending by branch and category</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleToolSelect("military-spending")}
                className="w-full bg-gray-900 hover:bg-gray-800"
              >
                Analyze Defense Spending
              </Button>
            </CardContent>
          </Card>

          {/* Revenue Optimization */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue Optimization
              </CardTitle>
              <CardDescription>Find the most efficient ways to increase federal revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleToolSelect("revenue-optimization")}
                className="w-full bg-gray-900 hover:bg-gray-800"
              >
                Optimize Revenue
              </Button>
            </CardContent>
          </Card>

          {/* Income Impact Analysis */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Income Impact Analysis
              </CardTitle>
              <CardDescription>Analyze how tax changes affect different income brackets</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleToolSelect("income-impact")}
                className="w-full bg-gray-900 hover:bg-gray-800"
              >
                Analyze Income Impact
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Analysis Tools */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Additional Analysis Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={() => handleToolSelect("state-tax")}
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
            >
              <Building2 className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium text-sm">State Tax Analysis</div>
                <div className="text-xs text-gray-600">Regional tax impacts</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleToolSelect("revenue-breakdown")}
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
            >
              <PieChart className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium text-sm">Revenue Breakdown</div>
                <div className="text-xs text-gray-600">Tax source analysis</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleToolSelect("tax-scenarios")}
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
            >
              <Calculator className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium text-sm">Tax Scenarios</div>
                <div className="text-xs text-gray-600">Policy comparisons</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleToolSelect("guns-vs-butter")}
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
            >
              <Briefcase className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium text-sm">Guns vs Butter</div>
                <div className="text-xs text-gray-600">Defense vs social spending</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleToolSelect("social-security")}
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
            >
              <Heart className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium text-sm">Social Security Analysis</div>
                <div className="text-xs text-gray-600">Entitlement sustainability</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleToolSelect("ss-solutions")}
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
            >
              <Activity className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium text-sm">SS Solutions</div>
                <div className="text-xs text-gray-600">Reform options</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleToolSelect("full-proposal")}
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
            >
              <FileText className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium text-sm">Full Proposal</div>
                <div className="text-xs text-gray-600">Complete policy package</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleToolSelect("legislative-updates")}
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
            >
              <Gavel className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium text-sm">Legislative Updates</div>
                <div className="text-xs text-gray-600">Real-time tracking</div>
              </div>
            </Button>
          </div>
        </div>

        {/* 2025 Fiscal Reality */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">2025 Fiscal Reality</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-red-600 mb-2">$2.65T</div>
                <div className="text-red-700 font-medium">Annual Deficit</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">$7.2T</div>
                <div className="text-blue-700 font-medium">Total Spending</div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600 mb-2">$4.55T</div>
                <div className="text-green-700 font-medium">Total Revenue</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
