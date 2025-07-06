"use client"

import { useState } from "react"
import FederalBudgetDashboard from "@/federal-budget-dashboard"
import BalancedBudgetBuilder from "@/balanced-budget-builder"
import BudgetAnalyticsDashboard from "@/budget-analytics-dashboard"
import TaxDesignCalculator from "@/tax-design-calculator"
import MilitarySpendingBreakdown from "@/military-spending-breakdown"
import RevenueOptimization from "@/revenue-optimization"
import IncomeBracketImpactAnalyzer from "@/income-bracket-impact-analyzer"
import StateTaxAnalysis from "@/state-tax-analysis"
import RevenueBreakdown from "@/revenue-breakdown"
import TaxPolicyScenarios from "@/tax-policy-scenarios"
import GunsVsButterAnalysis from "@/guns-vs-butter-analysis"
import FullProposalGenerator from "@/full-proposal-generator"
import SocialSecurityMedicareAnalysis from "@/social-security-medicare-analysis"
import SocialSecuritySolutions from "@/social-security-solutions"
import LegislativeUpdateSystem from "@/legislative-update-system"

type ActiveView =
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
  | "guns-butter"
  | "full-proposal"
  | "social-security"
  | "ss-solutions"
  | "legislative-updates"

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard")

  const renderActiveView = () => {
    switch (activeView) {
      case "budget-builder":
        return <BalancedBudgetBuilder onBack={() => setActiveView("dashboard")} />
      case "analytics":
        return <BudgetAnalyticsDashboard onBack={() => setActiveView("dashboard")} />
      case "tax-design":
        return <TaxDesignCalculator onBack={() => setActiveView("dashboard")} />
      case "military-spending":
        return <MilitarySpendingBreakdown onBack={() => setActiveView("dashboard")} />
      case "revenue-optimization":
        return <RevenueOptimization onBack={() => setActiveView("dashboard")} />
      case "income-impact":
        return <IncomeBracketImpactAnalyzer onBack={() => setActiveView("dashboard")} />
      case "state-tax":
        return <StateTaxAnalysis onBack={() => setActiveView("dashboard")} />
      case "revenue-breakdown":
        return <RevenueBreakdown onBack={() => setActiveView("dashboard")} />
      case "tax-scenarios":
        return <TaxPolicyScenarios onBack={() => setActiveView("dashboard")} />
      case "guns-butter":
        return <GunsVsButterAnalysis onBack={() => setActiveView("dashboard")} />
      case "full-proposal":
        return <FullProposalGenerator onBack={() => setActiveView("dashboard")} />
      case "social-security":
        return <SocialSecurityMedicareAnalysis onBack={() => setActiveView("dashboard")} />
      case "ss-solutions":
        return <SocialSecuritySolutions onBack={() => setActiveView("dashboard")} />
      case "legislative-updates":
        return <LegislativeUpdateSystem onBack={() => setActiveView("dashboard")} />
      default:
        return <FederalBudgetDashboard onNavigate={setActiveView} />
    }
  }

  return <main className="min-h-screen bg-gray-50">{renderActiveView()}</main>
}
