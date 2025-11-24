"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calculator,
  BarChart3,
  TrendingUp,
  Shield,
  DollarSign,
  Users,
  MapPin,
  PieChart,
  Settings,
  Target,
  FileText,
  Activity,
  AlertTriangle,
  ArrowLeft,
  Phone,
} from "lucide-react"

// Import components from the components directory
import BalancedBudgetBuilder from "../components/balanced-budget-builder"
import BudgetAnalyticsDashboard from "../components/budget-analytics-dashboard"
import RevenueBreakdown from "../components/revenue-breakdown"
import ContactCongressTool from "../components/contact-congress-tool"

// Import other tools from root directory
import TaxDesignCalculator from "../tax-design-calculator"
import MilitarySpendingBreakdown from "../military-spending-breakdown"
import RevenueOptimization from "../revenue-optimization"
import IncomeBracketImpactAnalyzer from "../income-bracket-impact-analyzer"
import StateTaxAnalysis from "../state-tax-analysis"
import TaxPolicyScenarios from "../tax-policy-scenarios"
import GunsVsButterAnalysis from "../guns-vs-butter-analysis"
import SocialSecurityMedicareAnalysis from "../social-security-medicare-analysis"
import SocialSecuritySolutions from "../social-security-solutions"
import FullProposalGenerator from "../full-proposal-generator"
import LegislativeUpdateSystem from "../legislative-update-system"

type ActiveTool =
  | "dashboard"
  | "budget-builder"
  | "analytics"
  | "tax-design"
  | "military-analysis"
  | "revenue-optimization"
  | "income-impact"
  | "state-tax"
  | "revenue-breakdown"
  | "tax-scenarios"
  | "guns-butter"
  | "social-security"
  | "ss-solutions"
  | "full-proposal"
  | "legislative-updates"
  | "contact-congress"

export default function HomePage() {
  const [activeView, setActiveView] = useState<ActiveTool>("dashboard")

  const renderActiveView = () => {
    switch (activeView) {
      case "budget-builder":
        return <BalancedBudgetBuilder />
      case "analytics":
        return <BudgetAnalyticsDashboard />
      case "tax-design":
        return <TaxDesignCalculator />
      case "military-analysis":
        return <MilitarySpendingBreakdown />
      case "revenue-optimization":
        return <RevenueOptimization />
      case "income-impact":
        return <IncomeBracketImpactAnalyzer />
      case "state-tax":
        return <StateTaxAnalysis />
      case "revenue-breakdown":
        return <RevenueBreakdown />
      case "tax-scenarios":
        return <TaxPolicyScenarios />
      case "guns-butter":
        return <GunsVsButterAnalysis />
      case "social-security":
        return <SocialSecurityMedicareAnalysis />
      case "ss-solutions":
        return <SocialSecuritySolutions />
      case "full-proposal":
        return <FullProposalGenerator />
      case "legislative-updates":
        return <LegislativeUpdateSystem />
      case "contact-congress":
        return <ContactCongressTool />
      default:
        return <DashboardHome setActiveView={setActiveView} />
    }
  }

  if (activeView !== "dashboard") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b px-6 py-4">
          <Button variant="outline" onClick={() => setActiveView("dashboard")} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="p-6">{renderActiveView()}</div>
      </div>
    )
  }

  return <DashboardHome setActiveView={setActiveView} />
}

function DashboardHome({ setActiveView }: { setActiveView: (view: ActiveTool) => void }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Budget Builder */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-900">Budget Builder</CardTitle>
              </div>
              <CardDescription>
                Interactive tool to balance the 2025 federal budget through spending cuts and revenue increases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setActiveView("budget-builder")}>
                Start Building Budget
              </Button>
            </CardContent>
          </Card>

          {/* Analytics Dashboard */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <CardTitle className="text-green-900">Analytics Dashboard</CardTitle>
              </div>
              <CardDescription>Real-time insights from user budget exercises and policy preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setActiveView("analytics")}>
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Tax Design Calculator */}
          <Card className="border-gray-200 bg-gray-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-gray-900">Tax Design Calculator</CardTitle>
              </div>
              <CardDescription>Design optimal tax policies and analyze revenue potential</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gray-800 hover:bg-gray-900" onClick={() => setActiveView("tax-design")}>
                Design Tax Policy
              </Button>
            </CardContent>
          </Card>

          {/* Military Spending Analysis */}
          <Card className="border-gray-200 bg-gray-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-gray-900">Military Spending Analysis</CardTitle>
              </div>
              <CardDescription>Detailed breakdown of defense spending by branch and category</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-gray-800 hover:bg-gray-900"
                onClick={() => setActiveView("military-analysis")}
              >
                Analyze Defense Spending
              </Button>
            </CardContent>
          </Card>

          {/* Revenue Optimization */}
          <Card className="border-gray-200 bg-gray-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-gray-900">Revenue Optimization</CardTitle>
              </div>
              <CardDescription>Find the most efficient ways to increase federal revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-gray-800 hover:bg-gray-900"
                onClick={() => setActiveView("revenue-optimization")}
              >
                Optimize Revenue
              </Button>
            </CardContent>
          </Card>

          {/* Income Impact Analysis */}
          <Card className="border-gray-200 bg-gray-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-gray-900">Income Impact Analysis</CardTitle>
              </div>
              <CardDescription>Analyze how tax changes affect different income brackets</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gray-800 hover:bg-gray-900" onClick={() => setActiveView("income-impact")}>
                Analyze Income Impact
              </Button>
            </CardContent>
          </Card>

          {/* Contact Congress */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-purple-900">Contact Congress</CardTitle>
              </div>
              <CardDescription>Share your budget priorities directly with your representatives</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => setActiveView("contact-congress")}
              >
                Contact Your Reps
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Analysis Tools */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Additional Analysis Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
              onClick={() => setActiveView("state-tax")}
            >
              <MapPin className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">State Tax Analysis</div>
                <div className="text-xs text-gray-500">Regional tax impacts</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
              onClick={() => setActiveView("revenue-breakdown")}
            >
              <PieChart className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Revenue Breakdown</div>
                <div className="text-xs text-gray-500">Tax source analysis</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
              onClick={() => setActiveView("tax-scenarios")}
            >
              <Settings className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Tax Scenarios</div>
                <div className="text-xs text-gray-500">Policy comparisons</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
              onClick={() => setActiveView("guns-butter")}
            >
              <Target className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Guns vs Butter</div>
                <div className="text-xs text-gray-500">Defense vs social spending</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
              onClick={() => setActiveView("social-security")}
            >
              <Users className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Social Security Analysis</div>
                <div className="text-xs text-gray-500">Entitlement sustainability</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
              onClick={() => setActiveView("ss-solutions")}
            >
              <TrendingUp className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">SS Solutions</div>
                <div className="text-xs text-gray-500">Reform options</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
              onClick={() => setActiveView("full-proposal")}
            >
              <FileText className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Full Proposal</div>
                <div className="text-xs text-gray-500">Complete policy package</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
              onClick={() => setActiveView("legislative-updates")}
            >
              <Activity className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Legislative Updates</div>
                <div className="text-xs text-gray-500">Real-time tracking</div>
              </div>
            </Button>
          </div>
        </div>

        {/* 2025 Fiscal Reality */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">2025 Fiscal Reality</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">$2.65T</div>
              <div className="text-gray-600">Annual Deficit</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">$7.2T</div>
              <div className="text-gray-600">Total Spending</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">$4.55T</div>
              <div className="text-gray-600">Total Revenue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
