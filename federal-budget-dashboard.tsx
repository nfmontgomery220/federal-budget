"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, TrendingUp, Users, BarChart3, PieChart, Database } from "lucide-react"
import BalancedBudgetBuilder from "./balanced-budget-builder"
import BudgetAnalyticsDashboard from "./budget-analytics-dashboard"
import MilitarySpendingBreakdown from "./military-spending-breakdown"
import StateTaxAnalysis from "./state-tax-analysis"
import RevenueBreakdown from "./revenue-breakdown"
import TaxPolicyScenarios from "./tax-policy-scenarios"
import RevenueOptimization from "./revenue-optimization"
import GunsVsButterAnalysis from "./guns-vs-butter-analysis"
import TaxDesignCalculator from "./tax-design-calculator"
import FullProposalGenerator from "./full-proposal-generator"
import ImplementationPDFGenerator from "./implementation-pdf-generator"
import IncomeBracketImpactAnalyzer from "./income-bracket-impact-analyzer"
import SocialSecurityMedicareAnalysis from "./social-security-medicare-analysis"
import SocialSecuritySolutions from "./social-security-solutions"
import LegislativeUpdateSystem from "./legislative-update-system"

export default function FederalBudgetDashboard() {
  const [activeView, setActiveView] = useState("dashboard")

  const renderActiveView = () => {
    switch (activeView) {
      case "budget-builder":
        return <BalancedBudgetBuilder onBack={() => setActiveView("dashboard")} />
      case "analytics":
        return <BudgetAnalyticsDashboard onBack={() => setActiveView("dashboard")} />
      case "military-breakdown":
        return <MilitarySpendingBreakdown onBack={() => setActiveView("dashboard")} />
      case "state-tax":
        return <StateTaxAnalysis onBack={() => setActiveView("dashboard")} />
      case "revenue-breakdown":
        return <RevenueBreakdown onBack={() => setActiveView("dashboard")} />
      case "tax-scenarios":
        return <TaxPolicyScenarios onBack={() => setActiveView("dashboard")} />
      case "revenue-optimization":
        return <RevenueOptimization onBack={() => setActiveView("dashboard")} />
      case "guns-butter":
        return <GunsVsButterAnalysis onBack={() => setActiveView("dashboard")} />
      case "tax-design":
        return <TaxDesignCalculator onBack={() => setActiveView("dashboard")} />
      case "full-proposal":
        return <FullProposalGenerator onBack={() => setActiveView("dashboard")} />
      case "implementation-pdf":
        return <ImplementationPDFGenerator onBack={() => setActiveView("dashboard")} />
      case "income-impact":
        return <IncomeBracketImpactAnalyzer onBack={() => setActiveView("dashboard")} />
      case "social-security":
        return <SocialSecurityMedicareAnalysis onBack={() => setActiveView("dashboard")} />
      case "ss-solutions":
        return <SocialSecuritySolutions onBack={() => setActiveView("dashboard")} />
      case "legislative-updates":
        return <LegislativeUpdateSystem onBack={() => setActiveView("dashboard")} />
      default:
        return (
          <div className="container mx-auto p-6 space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Federal Budget Analysis Tool</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive tools for analyzing the federal budget, exploring policy scenarios, and understanding
                fiscal impacts in the post-"One Big Beautiful Bill Act" era.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-4xl mx-auto">
                <h2 className="text-lg font-semibold text-red-800 mb-2">🚨 2025 Fiscal Crisis Alert</h2>
                <p className="text-red-700">
                  The "One Big Beautiful Bill Act" signed on July 4th, 2025 has created a $2.65 trillion deficit. Use
                  these tools to explore solutions and understand the fiscal challenges ahead.
                </p>
              </div>
            </div>

            {/* Main Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Calculator className="h-5 w-5" />
                    Budget Builder
                  </CardTitle>
                  <CardDescription>
                    Interactive tool to balance the 2025 federal budget through spending cuts and revenue increases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setActiveView("budget-builder")}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Start Building Budget
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Database className="h-5 w-5" />
                    Analytics Dashboard
                  </CardTitle>
                  <CardDescription>
                    Real-time insights from user budget exercises and policy preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveView("analytics")} className="w-full bg-green-600 hover:bg-green-700">
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Tax Design Calculator
                  </CardTitle>
                  <CardDescription>Design optimal tax policies and analyze revenue potential</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveView("tax-design")} className="w-full">
                    Design Tax Policy
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Military Spending Analysis
                  </CardTitle>
                  <CardDescription>Detailed breakdown of defense spending by branch and category</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveView("military-breakdown")} className="w-full">
                    Analyze Defense Spending
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Revenue Optimization
                  </CardTitle>
                  <CardDescription>Find the most efficient ways to increase federal revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveView("revenue-optimization")} className="w-full">
                    Optimize Revenue
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Income Impact Analysis
                  </CardTitle>
                  <CardDescription>Analyze how tax changes affect different income brackets</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveView("income-impact")} className="w-full">
                    Analyze Income Impact
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Additional Analysis Tools */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-center">Additional Analysis Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveView("state-tax")}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <span className="font-medium">State Tax Analysis</span>
                  <span className="text-xs text-muted-foreground">Regional tax impacts</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setActiveView("revenue-breakdown")}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <span className="font-medium">Revenue Breakdown</span>
                  <span className="text-xs text-muted-foreground">Tax source analysis</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setActiveView("tax-scenarios")}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <span className="font-medium">Tax Scenarios</span>
                  <span className="text-xs text-muted-foreground">Policy comparisons</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setActiveView("guns-butter")}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <span className="font-medium">Guns vs Butter</span>
                  <span className="text-xs text-muted-foreground">Defense vs social spending</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setActiveView("social-security")}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <span className="font-medium">Social Security Analysis</span>
                  <span className="text-xs text-muted-foreground">Entitlement sustainability</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setActiveView("ss-solutions")}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <span className="font-medium">SS Solutions</span>
                  <span className="text-xs text-muted-foreground">Reform options</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setActiveView("full-proposal")}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <span className="font-medium">Full Proposal</span>
                  <span className="text-xs text-muted-foreground">Complete policy package</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setActiveView("legislative-updates")}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <span className="font-medium">Legislative Updates</span>
                  <span className="text-xs text-muted-foreground">Real-time tracking</span>
                </Button>
              </div>
            </div>

            {/* Key Statistics */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-center">2025 Fiscal Reality</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">$2.65T</div>
                  <div className="text-sm text-muted-foreground">Annual Deficit</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">$7.2T</div>
                  <div className="text-sm text-muted-foreground">Total Spending</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">$4.55T</div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return renderActiveView()
}
