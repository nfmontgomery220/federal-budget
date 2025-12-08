"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, TrendingUp, Clock, Bell, CheckCircle, X, DollarSign, ArrowLeft } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

// Legislative tracking system for budget-impacting bills - Updated for July 4, 2025
const legislativeData = {
  activeBills: [
    {
      id: "hr-2025-089",
      title: "Infrastructure Maintenance and Modernization Act",
      chamber: "House",
      status: "Committee Markup",
      sponsor: "Rep. Davis (R-FL)",
      introducedDate: "2025-03-15",
      lastAction: "2025-07-02",

      budgetImpact: {
        totalCost: 650, // billions over 10 years
        yearlyImpact: 65, // billions per year
        deficitIncrease: 520, // net after revenue offsets
        revenueOffsets: 130, // billions from user fees
      },

      provisions: [
        { category: "Highway Repairs", amount: 280, description: "Critical bridge and road maintenance" },
        { category: "Airport Infrastructure", amount: 150, description: "Runway and terminal upgrades" },
        { category: "Broadband Rural Access", amount: 120, description: "5G and fiber expansion" },
        { category: "User Fee Offsets", amount: -130, description: "Increased fuel and aviation taxes" },
      ],

      passageProbability: {
        house: 75, // percentage
        senate: 60,
        overall: 45,
        timeline: "Q4 2025",
      },

      economicImpact: {
        gdpBoost: 0.8, // percentage over 5 years
        jobsCreated: 1800000, // total jobs
        multiplierEffect: 1.6,
      },

      politicalDynamics: {
        republicanSupport: 70, // percentage
        democraticSupport: 80,
        bipartisanElements: ["Rural broadband", "Bridge safety", "Job creation"],
        controversialElements: ["User fee increases", "Federal vs state funding"],
      },
    },

    {
      id: "s-2025-034",
      title: "Social Security Solvency Act of 2025",
      chamber: "Senate",
      status: "Floor Consideration",
      sponsor: "Sen. Collins (R-ME)",
      introducedDate: "2025-02-08",
      lastAction: "2025-07-01",

      budgetImpact: {
        totalCost: -890, // negative = revenue increase
        yearlyImpact: -89,
        deficitDecrease: 890, // reduces deficit
        revenueIncrease: 890,
      },

      provisions: [
        { category: "Payroll Tax Cap Adjustment", amount: -650, description: "Gradual increase to $200K by 2030" },
        { category: "Benefit Formula Adjustment", amount: 180, description: "Protect low-income benefits" },
        { category: "Retirement Age Adjustment", amount: -320, description: "Gradual increase to 67.5 by 2035" },
        { category: "Administrative Modernization", amount: 100, description: "IT systems upgrade" },
      ],

      passageProbability: {
        house: 55,
        senate: 65,
        overall: 35,
        timeline: "Q1 2026",
      },

      economicImpact: {
        gdpBoost: -0.2, // slight drag from higher taxes
        beneficiariesAffected: 70000000,
        workersAffected: 15000000, // higher earners
      },

      politicalDynamics: {
        republicanSupport: 40,
        democraticSupport: 75,
        bipartisanElements: ["Long-term solvency", "Protecting current retirees"],
        controversialElements: ["Tax increases", "Retirement age changes"],
      },
    },

    {
      id: "hr-2025-156",
      title: "National Defense Authorization Act 2026",
      chamber: "House",
      status: "Passed House",
      sponsor: "Rep. Turner (R-OH)",
      introducedDate: "2025-04-20",
      lastAction: "2025-06-28",

      budgetImpact: {
        totalCost: 1050, // billions over 10 years
        yearlyImpact: 105,
        deficitIncrease: 1050,
        revenueOffsets: 0,
      },

      provisions: [
        { category: "Personnel & Benefits", amount: 220, description: "Military pay raises, family support" },
        { category: "Weapons Procurement", amount: 380, description: "Next-gen fighter jets, naval vessels" },
        { category: "R&D & Innovation", amount: 280, description: "AI, cyber warfare, space defense" },
        { category: "Base Operations", amount: 170, description: "Maintenance, training, logistics" },
      ],

      passageProbability: {
        house: 100, // already passed
        senate: 85,
        overall: 80,
        timeline: "Q3 2025",
      },

      economicImpact: {
        gdpBoost: 0.6,
        jobsCreated: 950000,
        defenseContractorImpact: 18.5, // percentage increase
      },

      politicalDynamics: {
        republicanSupport: 95,
        democraticSupport: 70,
        bipartisanElements: ["Military pay raises", "Cybersecurity", "China competition"],
        controversialElements: ["Weapons system costs", "Space Force expansion"],
      },
    },

    {
      id: "s-2025-reconciliation",
      title: "American Competitiveness and Tax Reform Act",
      chamber: "Senate",
      status: "Committee Review",
      sponsor: "Sen. Thune (R-SD)",
      introducedDate: "2025-05-12",
      lastAction: "2025-07-03",

      budgetImpact: {
        totalCost: -450, // negative = revenue loss from tax cuts
        yearlyImpact: -45,
        deficitIncrease: 450, // increases deficit despite being "revenue"
        revenueOffsets: 0,
      },

      provisions: [
        { category: "Corporate Tax Rate Reduction", amount: 280, description: "21% to 18% over 3 years" },
        { category: "R&D Tax Credit Enhancement", amount: 120, description: "Immediate expensing restoration" },
        { category: "Small Business Deduction", amount: 180, description: "Section 199A expansion" },
        { category: "Repatriation Incentives", amount: -130, description: "One-time overseas profit tax" },
      ],

      passageProbability: {
        house: 90, // Republican control
        senate: 75, // Republican control
        overall: 70, // Trump supports
        timeline: "Q4 2025",
      },

      economicImpact: {
        gdpBoost: 1.1, // percentage over 5 years
        jobsCreated: 2200000,
        multiplierEffect: 1.9,
      },

      politicalDynamics: {
        republicanSupport: 95,
        democraticSupport: 15,
        bipartisanElements: ["Small business support", "R&D incentives"],
        controversialElements: ["Corporate tax cuts", "Deficit impact", "Wealth inequality"],
      },

      reconciliationStatus: {
        isReconciliation: true,
        parliamentarian: "Under review by Senate Parliamentarian",
        votesNeeded: 51,
        currentWhipCount: 52, // Republican majority
        undecidedVotes: ["Sen. Murkowski (R-AK)"],
        expectedPassage: "September 2025",
        presidentialAction: "Trump supports - signature expected",
      },
    },

    // CORRECTED - The One Big Beautiful Bill Act (H.R. 1)
    {
      id: "hr-2025-001",
      title: "One Big Beautiful Bill Act (H.R. 1)",
      chamber: "House",
      status: "Signed into Law",
      sponsor: "Rep. Johnson (R-LA)",
      introducedDate: "2025-01-03",
      lastAction: "2025-07-04", // SIGNED TODAY!

      budgetImpact: {
        totalCost: 3300, // $3.3 TRILLION over 10 years
        yearlyImpact: 330, // $330B per year average
        deficitIncrease: 3300, // MASSIVE deficit increase
        revenueOffsets: 0, // No meaningful offsets
      },

      provisions: [
        {
          category: "Trump Tax Cuts Extension",
          amount: 2200,
          description: "Permanent extension of 2017 corporate and high-income tax cuts",
        },
        {
          category: "Enhanced Child Tax Credit",
          amount: 220,
          description: "$2,200 credit but phases out other middle-income benefits",
        },
        {
          category: "Medicaid Cuts",
          amount: -900,
          description: "Block grants and eligibility restrictions over 10 years",
        },
        {
          category: "Border & Immigration",
          amount: 350,
          description: "ICE expansion and border wall construction",
        },
        {
          category: "Rural Hospital Fund",
          amount: 50,
          description: "Stabilization fund (critics say insufficient)",
        },
        {
          category: "Climate Program Elimination",
          amount: -180,
          description: "Eliminates EV credits, solar incentives, clean energy programs",
        },
        {
          category: "AI Regulation Override",
          amount: 15,
          description: "Federal override of state AI regulations for 5 years",
        },
        {
          category: "Debt Ceiling Increase",
          amount: 5000,
          description: "$5 trillion debt ceiling raise to accommodate spending",
        },
      ],

      passageProbability: {
        house: 100, // Already passed via reconciliation
        senate: 100, // Already passed 51-50 with VP Vance tiebreaker
        overall: 100, // SIGNED INTO LAW
        timeline: "Enacted July 4, 2025",
      },

      economicImpact: {
        gdpBoost: 0.8, // Short-term boost from tax cuts and spending
        jobsCreated: 1200000, // Mostly temporary construction jobs
        multiplierEffect: 1.3,
        healthcareLosses: 12000000, // 12M lose Medicaid coverage
      },

      politicalDynamics: {
        republicanSupport: 100, // Pure party-line reconciliation vote
        democraticSupport: 0, // Zero Democratic support
        bipartisanElements: [], // NO bipartisan elements - pure reconciliation
        controversialElements: [
          "Massive deficit increase",
          "Medicaid cuts affecting 12M people",
          "Climate program elimination",
          "AI regulation federal override",
          "Asylum seeker fees",
        ],
      },

      reconciliationStatus: {
        isReconciliation: true, // Used reconciliation process
        parliamentarian: "Approved most provisions as budget-related",
        votesNeeded: 51, // Simple majority via reconciliation
        currentWhipCount: 51, // Exact party-line vote with VP tiebreaker
        undecidedVotes: [], // No undecided - strict party line
        finalPassage: "July 1, 2025",
        presidentialAction: "Signed July 4, 2025 - 'One Big Beautiful Bill'",
        vicePresidentTiebreaker: "VP JD Vance cast deciding vote 51-50",
      },

      signingDetails: {
        location: "White House South Lawn",
        ceremony: "Independence Day celebration with Republican leadership",
        effectiveDate: "July 4, 2025",
        implementationStart: "October 1, 2025", // Start of FY 2026
        trumpQuote: "This is one big, beautiful bill - the most beautiful bill ever signed!",
      },

      // PAYGO sequestration trigger details
      paygoSequestration: {
        triggered: true,
        reason: "$3.3T deficit increase without revenue offsets violated PAYGO rules",
        automaticCutAmount: 500, // $500B over 10 years
        implementationDate: "January 1, 2026",
        affectedPrograms: [
          {
            program: "Medicare",
            maxCutAllowed: 4, // 4% maximum cut by statute
            annualImpact: 30, // $30B per year
            beneficiariesAffected: 66000000, // All 66M Medicare beneficiaries
          },
          {
            program: "Social Security",
            exempt: false, // Despite tradition, could be included
            potentialCut: 2, // 2% possible under extreme interpretation
            annualImpact: 20, // $20B per year if not exempted
          },
          {
            program: "Other Mandatory Spending",
            cutPercentage: 8, // Remaining cuts hit other programs harder
            annualImpact: 50, // $50B per year from various programs
          },
        ],
        totalFiscalImpact: {
          combined10Year: 3800, // $3.3T deficit increase + $500B PAYGO cuts
          netDeficitIncrease: 2800, // $3.3T - $500B = still $2.8T worse
          trustFundAcceleration: "Cuts worsen trust fund depletion by 1-2 years",
        },
        politicalContext: "Automatic cuts provide political cover for entitlement reductions",
        legalChallenges: "Expected litigation over scope of PAYGO cuts to Social Security",
      },

      healthcareImpact: {
        medicaidCutsTotal: 900, // $900B over 10 years
        peopleLosingCoverage: 12000000, // 12 million Americans
        ruralHospitalFund: 50, // $50B fund (insufficient per critics)
        eligibilityChanges: "Work requirements and asset tests expanded",
        stateImpact: "Block grants force states to redesign programs",
      },

      climateImpact: {
        evCreditElimination: "All federal EV tax credits eliminated",
        solarIncentivesCut: "Solar and wind tax credits ended",
        cleanEnergyDefunding: "Federal clean energy programs slashed",
        totalClimateReduction: 180, // $180B in climate spending eliminated
      },
    },
  ],

  // Historical impact of major legislation - Updated through July 2025
  historicalImpacts: [
    { year: 2021, legislation: "American Rescue Plan", impact: 1900, type: "spending" },
    { year: 2022, legislation: "Inflation Reduction Act", impact: -740, type: "revenue" },
    { year: 2023, legislation: "Infrastructure Investment", impact: 550, type: "spending" },
    { year: 2024, legislation: "Various Appropriations", impact: 200, type: "spending" },
    { year: 2025, legislation: "One Big Beautiful Bill", impact: 3300, type: "massive-spending" },
  ],

  // Budget projections with and without pending legislation - Updated for July 2025
  projections: {
    baseline: [
      { year: 2025, deficit: 1950, debt: 36500 },
      { year: 2026, deficit: 2020, debt: 38520 },
      { year: 2027, deficit: 2110, debt: 40630 },
      { year: 2028, deficit: 2200, debt: 42830 },
      { year: 2029, deficit: 2300, debt: 45130 },
    ],
    withPendingLegislation: [
      { year: 2025, deficit: 2280, debt: 36830 }, // +$330B from One Big Beautiful Bill
      { year: 2026, deficit: 2350, debt: 39180 },
      { year: 2027, deficit: 2440, debt: 41620 },
      { year: 2028, deficit: 2530, debt: 44150 },
      { year: 2029, deficit: 2630, debt: 46780 },
    ],
  },

  // Recent legislative outcomes - What happened in 2025
  recentOutcomes: [
    {
      bill: "Budget Reconciliation Act of 2024 (Original Democratic)",
      outcome: "Vetoed by Trump",
      date: "January 8, 2025",
      impact: "No fiscal impact - veto sustained",
      details: "House override attempt failed 267-168 (needed 290)",
    },
    {
      bill: "Emergency Border Security Act",
      outcome: "Signed into law",
      date: "March 15, 2025",
      impact: "+$85B over 5 years",
      details: "Bipartisan support for border infrastructure",
    },
    {
      bill: "Disaster Relief Supplemental",
      outcome: "Signed into law",
      date: "May 22, 2025",
      impact: "+$45B emergency spending",
      details: "Response to spring tornado season",
    },
    {
      bill: "One Big Beautiful Bill Act (H.R. 1)",
      outcome: "Signed into law",
      date: "July 4, 2025",
      impact: "+$3.3T over 10 years",
      details: "Massive Republican reconciliation bill - party-line 51-50 Senate vote",
    },
  ],
}

interface LegislativeUpdateSystemProps {
  onBack?: () => void
}

export default function LegislativeUpdateSystem({ onBack }: LegislativeUpdateSystemProps) {
  const [activeTab, setActiveTab] = useState("active-bills")
  const [selectedBill, setSelectedBill] = useState(legislativeData.activeBills[4]) // Default to One Big Beautiful Bill
  const [updateMode, setUpdateMode] = useState(false)

  const formatBillions = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "$0B"
    }
    if (Math.abs(amount) >= 1000) {
      return `$${(amount / 1000).toFixed(1)}T`
    }
    return `$${Math.abs(amount).toLocaleString()}B`
  }

  const formatPercent = (amount: number) => `${amount.toFixed(1)}%`

  const getTotalPendingImpact = () => {
    return legislativeData.activeBills
      .filter((bill) => bill.status !== "Signed into Law")
      .reduce((total, bill) => {
        const probability = bill.passageProbability.overall / 100
        return total + bill.budgetImpact.deficitIncrease * probability
      }, 0)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "signed into law":
        return "bg-green-100 text-green-800"
      case "passed house":
        return "bg-blue-100 text-blue-800"
      case "floor consideration":
        return "bg-blue-100 text-blue-800"
      case "committee review":
      case "committee markup":
        return "bg-yellow-100 text-yellow-800"
      case "awaiting presidential signature":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return "text-green-600"
    if (probability >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        {/* Independence Day 2025 BREAKING NEWS Alert */}
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-red-800">🇺🇸 BREAKING: "One Big Beautiful Bill" Signed!</AlertTitle>
          <AlertDescription className="text-red-700">
            <strong>President Trump just signed H.R. 1 - the "One Big Beautiful Bill Act"</strong> in an Independence
            Day ceremony. The massive reconciliation bill adds{" "}
            <strong>$3.3 TRILLION to the deficit over 10 years</strong>, extends Trump tax cuts permanently, but cuts{" "}
            <strong>$900B from Medicaid</strong> leaving 12 million Americans without coverage. Senate passed 51-50 with
            VP Vance tiebreaker.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Legislative Impact Tracker</h1>
            <p className="text-gray-600">Real-time monitoring of budget-impacting legislation and fiscal projections</p>
            <p className="text-sm text-gray-500">Current Date: July 4, 2025 - Independence Day</p>
          </div>
          {onBack && (
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          )}
          <div className="flex items-center gap-3">
            <Button variant={updateMode ? "default" : "outline"} size="sm" onClick={() => setUpdateMode(!updateMode)}>
              <Bell className="h-4 w-4 mr-2" />
              {updateMode ? "Live Updates On" : "Enable Updates"}
            </Button>
          </div>
        </div>

        {/* Alert for Massive Fiscal Impact */}
        <Alert className="border-orange-200 bg-orange-50">
          <DollarSign className="h-4 w-4" />
          <AlertTitle className="text-orange-800">Historic Deficit Increase Enacted</AlertTitle>
          <AlertDescription className="text-orange-700">
            The "One Big Beautiful Bill" will <strong>increase the deficit by $3.3 TRILLION over 10 years</strong> - the
            largest single deficit increase in U.S. history. While extending tax cuts for corporations and high earners,
            it cuts healthcare for 12 million Americans. Remaining pending legislation could add another{" "}
            <strong>{formatBillions(getTotalPendingImpact())}</strong>.
            {selectedBill.paygoSequestration && selectedBill.paygoSequestration.triggered && (
              <>
                {" "}
                Additionally, PAYGO sequestration rules have been triggered, mandating{" "}
                <strong>{formatBillions(selectedBill.paygoSequestration.automaticCutAmount)}</strong> in automatic
                spending cuts to take effect January 1, 2026, impacting Medicare and other mandatory programs.
              </>
            )}
          </AlertDescription>
        </Alert>

        {/* Recent Outcomes Summary */}
        <Card>
          <CardHeader>
            <CardTitle>2025 Legislative Outcomes</CardTitle>
            <CardDescription>
              Major bills resolved in 2025, including today's historic reconciliation signing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {legislativeData.recentOutcomes.map((outcome, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {outcome.outcome.includes("Vetoed") ? (
                      <X className="h-4 w-4 text-red-600" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    <div className="font-medium text-sm">{outcome.bill}</div>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>
                      <strong>Outcome:</strong> {outcome.outcome}
                    </div>
                    <div>
                      <strong>Date:</strong> {outcome.date}
                    </div>
                    <div>
                      <strong>Impact:</strong> {outcome.impact}
                    </div>
                    <div>{outcome.details}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active-bills">Active Bills</TabsTrigger>
            <TabsTrigger value="impact-analysis">Impact Analysis</TabsTrigger>
            <TabsTrigger value="projections">Budget Projections</TabsTrigger>
            <TabsTrigger value="update-system">Update System</TabsTrigger>
          </TabsList>

          <TabsContent value="active-bills" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {legislativeData.activeBills.map((bill, index) => (
                <Card
                  key={bill.id}
                  className={`cursor-pointer transition-all ${selectedBill.id === bill.id ? "ring-2 ring-blue-500" : "hover:shadow-md"} ${bill.status === "Signed into Law" ? "border-green-300 bg-green-50" : ""}`}
                  onClick={() => setSelectedBill(bill)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{bill.title}</CardTitle>
                    <CardDescription>
                      {bill.chamber} • {bill.sponsor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge className={getStatusColor(bill.status)}>{bill.status}</Badge>

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className={`text-xl font-bold text-red-600`}>
                            +{formatBillions(bill.budgetImpact.deficitIncrease)}
                          </div>
                          <div className="text-xs text-gray-600">Deficit Increase</div>
                        </div>
                        <div>
                          <div
                            className={`text-xl font-bold ${bill.status === "Signed into Law" ? "text-green-600" : getProbabilityColor(bill.passageProbability.overall)}`}
                          >
                            {bill.status === "Signed into Law" ? "✓ LAW" : `${bill.passageProbability.overall}%`}
                          </div>
                          <div className="text-xs text-gray-600">
                            {bill.status === "Signed into Law" ? "Enacted" : "Passage Probability"}
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Timeline:</span>
                          <span>{bill.passageProbability.timeline}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Action:</span>
                          <span>{new Date(bill.lastAction).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Bill Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>{selectedBill.title} - Detailed Analysis</CardTitle>
                <CardDescription>Comprehensive breakdown of fiscal impact and political dynamics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Budget Impact Breakdown</h4>
                    <div className="space-y-3">
                      {selectedBill.provisions.map((provision, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-sm">{provision.category}</div>
                            <div className="text-xs text-gray-600">{provision.description}</div>
                          </div>
                          <div className={`font-bold ${provision.amount > 0 ? "text-red-600" : "text-green-600"}`}>
                            {provision.amount > 0 ? "+" : ""}
                            {formatBillions(provision.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Political Analysis</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-lg font-bold text-red-600">
                            {selectedBill.politicalDynamics.republicanSupport}%
                          </div>
                          <div className="text-xs text-red-700">Republican Support</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">
                            {selectedBill.politicalDynamics.democraticSupport}%
                          </div>
                          <div className="text-xs text-blue-700">Democratic Support</div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-green-700 mb-2">Bipartisan Elements</h5>
                        <ul className="text-sm space-y-1">
                          {selectedBill.politicalDynamics.bipartisanElements.length > 0 ? (
                            selectedBill.politicalDynamics.bipartisanElements.map((element, index) => (
                              <li key={index} className="text-green-600">
                                • {element}
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-500 italic">No bipartisan elements - pure reconciliation</li>
                          )}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-red-700 mb-2">Controversial Elements</h5>
                        <ul className="text-sm space-y-1">
                          {selectedBill.politicalDynamics.controversialElements.map((element, index) => (
                            <li key={index} className="text-red-600">
                              • {element}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedBill.reconciliationStatus && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-4">Reconciliation Process Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-sm">Process Type</div>
                            <div className="text-xs text-gray-600">
                              {selectedBill.reconciliationStatus.isReconciliation
                                ? "Budget Reconciliation (51 votes)"
                                : "Regular Order (60 votes)"}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-sm">Votes Needed</div>
                            <div className="text-xs text-gray-600">{selectedBill.reconciliationStatus.votesNeeded}</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-sm">Final Vote Count</div>
                            <div className="text-xs text-gray-600">
                              {selectedBill.reconciliationStatus.currentWhipCount}
                              {selectedBill.reconciliationStatus.vicePresidentTiebreaker && " (VP tiebreaker)"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="font-medium text-sm text-green-900">Final Passage</div>
                          <div className="text-xs text-green-700">
                            {selectedBill.reconciliationStatus.finalPassage || "TBD"}
                          </div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="font-medium text-sm text-blue-900">Presidential Action</div>
                          <div className="text-xs text-blue-700">
                            {selectedBill.reconciliationStatus.presidentialAction}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedBill.id === "hr-2025-001" && (
                  <div className="mt-6 space-y-6">
                    {/* Signing Details */}
                    <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                      <h4 className="font-medium mb-4 text-red-900">🇺🇸 "One Big Beautiful Bill" Signing</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <div>
                            <div className="font-medium text-sm">Signing Location</div>
                            <div className="text-xs text-gray-600">{selectedBill.signingDetails?.location}</div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">✓ Complete</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <div>
                            <div className="font-medium text-sm">Trump Quote</div>
                            <div className="text-xs text-gray-600 italic">
                              "{selectedBill.signingDetails?.trumpQuote}"
                            </div>
                          </div>
                          <Badge className="bg-orange-100 text-orange-800">Historic</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <div>
                            <div className="font-medium text-sm">Senate Vote</div>
                            <div className="text-xs text-gray-600">
                              {selectedBill.reconciliationStatus?.vicePresidentTiebreaker}
                            </div>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800">51-50</Badge>
                        </div>
                      </div>
                    </div>

                    {/* PAYGO Sequestration Details */}
                    {selectedBill.paygoSequestration && selectedBill.paygoSequestration.triggered && (
                      <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                        <h4 className="font-medium mb-4 text-purple-900">⚖️ PAYGO Sequestration Triggered</h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-white rounded-lg">
                            <div className="font-medium text-sm text-purple-900">Reason for Trigger</div>
                            <div className="text-xs text-purple-800">{selectedBill.paygoSequestration.reason}</div>
                          </div>
                          <div className="p-3 bg-white rounded-lg">
                            <div className="font-medium text-sm text-purple-900">Automatic Cut Amount</div>
                            <div className="text-xs text-purple-800">
                              {formatBillions(selectedBill.paygoSequestration.automaticCutAmount)} over 10 years
                            </div>
                          </div>
                          <div className="p-3 bg-white rounded-lg">
                            <div className="font-medium text-sm text-purple-900">Implementation Date</div>
                            <div className="text-xs text-purple-800">
                              {selectedBill.paygoSequestration.implementationDate}
                            </div>
                          </div>
                          <div className="p-3 bg-red-100 rounded-lg">
                            <div className="text-sm font-medium text-red-900">Impacted Programs:</div>
                            <ul className="text-xs text-red-800 mt-2 space-y-1">
                              {selectedBill.paygoSequestration.affectedPrograms.map((prog, i) => (
                                <li key={i}>
                                  - <strong>{prog.program}:</strong>{" "}
                                  {prog.exempt !== undefined && prog.exempt
                                    ? "Exempt"
                                    : `${prog.annualImpact}B annual impact`}
                                  {prog.cutPercentage && ` (${prog.cutPercentage}% cut)`}
                                  {prog.potentialCut && ` (Potential ${prog.potentialCut}%)`}
                                  {prog.maxCutAllowed && ` (Max allowed ${prog.maxCutAllowed}%)`}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Healthcare Impact */}
                    <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                      <h4 className="font-medium mb-4 text-orange-900">🏥 Healthcare Impact</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <div>
                            <div className="font-medium text-sm">Medicaid Cuts</div>
                            <div className="text-xs text-gray-600">
                              {formatBillions(selectedBill.healthcareImpact?.medicaidCutsTotal || 0)} over 10 years
                            </div>
                          </div>
                          <Badge className="bg-red-100 text-red-800">-$900B</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <div>
                            <div className="font-medium text-sm">Coverage Loss</div>
                            <div className="text-xs text-gray-600">
                              {(selectedBill.healthcareImpact?.peopleLosingCoverage || 0).toLocaleString()} Americans
                            </div>
                          </div>
                          <Badge className="bg-red-100 text-red-800">12M People</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <div>
                            <div className="font-medium text-sm">Rural Hospital Fund</div>
                            <div className="text-xs text-gray-600">Critics say insufficient for hospital closures</div>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">$50B</Badge>
                        </div>
                        <div className="p-3 bg-red-100 rounded-lg">
                          <div className="text-sm font-medium text-red-900">Implementation Changes:</div>
                          <ul className="text-xs text-red-800 mt-2 space-y-1">
                            <li>• {selectedBill.healthcareImpact?.eligibilityChanges}</li>
                            <li>• {selectedBill.healthcareImpact?.stateImpact}</li>
                            <li>• Work requirements expanded nationwide</li>
                            <li>• Asset tests reinstated for eligibility</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Climate Impact */}
                    <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                      <h4 className="font-medium mb-4 text-green-900">🌱 Climate & Energy Impact</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <div>
                            <div className="font-medium text-sm">EV Tax Credits</div>
                            <div className="text-xs text-gray-600">
                              {selectedBill.climateImpact?.evCreditElimination}
                            </div>
                          </div>
                          <Badge className="bg-red-100 text-red-800">Eliminated</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <div>
                            <div className="font-medium text-sm">Solar & Wind Incentives</div>
                            <div className="text-xs text-gray-600">
                              {selectedBill.climateImpact?.solarIncentivesCut}
                            </div>
                          </div>
                          <Badge className="bg-red-100 text-red-800">Ended</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <div>
                            <div className="font-medium text-sm">Clean Energy Programs</div>
                            <div className="text-xs text-gray-600">
                              {selectedBill.climateImpact?.cleanEnergyDefunding}
                            </div>
                          </div>
                          <Badge className="bg-red-100 text-red-800">-$180B</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Tax Impact */}
                    <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <h4 className="font-medium mb-4 text-blue-900">💰 Tax Policy Impact</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-white rounded-lg">
                          <div className="text-sm font-medium text-blue-900">Trump Tax Cuts Made Permanent:</div>
                          <ul className="text-xs text-blue-800 mt-2 space-y-1">
                            <li>• Corporate tax rate stays at 21% permanently</li>
                            <li>• Top individual rate remains at 37%</li>
                            <li>• Estate tax exemption maintained at $12M+</li>
                            <li>• Pass-through deduction (Section 199A) permanent</li>
                            <li>• Cost: $2.2 trillion over 10 years</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <div className="text-sm font-medium text-blue-900">Enhanced Child Tax Credit:</div>
                          <ul className="text-xs text-blue-800 mt-2 space-y-1">
                            <li>• Increased to $2,200 per child</li>
                            <li>• But phases out other middle-income benefits</li>
                            <li>• Net benefit unclear for many families</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact-analysis" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cumulative Fiscal Impact</CardTitle>
                  <CardDescription>Total budget impact including "One Big Beautiful Bill"</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      impact: { label: "Budget Impact", color: "hsl(var(--chart-1))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={legislativeData.activeBills}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <ChartTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload
                              return (
                                <div className="bg-white p-3 border rounded-lg shadow-lg">
                                  <p className="font-medium">{data.title}</p>
                                  <p className="text-sm">
                                    Deficit Impact: +{formatBillions(data.budgetImpact.deficitIncrease)}
                                  </p>
                                  <p className="text-sm">
                                    Status:{" "}
                                    {data.status === "Signed into Law"
                                      ? "✓ Enacted"
                                      : `${data.passageProbability.overall}% probability`}
                                  </p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Bar
                          dataKey="budgetImpact.deficitIncrease"
                          fill={(entry) => {
                            if (entry.status === "Signed into Law") return "#ef4444"
                            return "#f59e0b"
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Historical Legislative Impact</CardTitle>
                  <CardDescription>Major budget legislation including today's massive bill</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      impact: { label: "Budget Impact", color: "hsl(var(--chart-2))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={legislativeData.historicalImpacts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <ChartTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload
                              return (
                                <div className="bg-white p-3 border rounded-lg shadow-lg">
                                  <p className="font-medium">{data.legislation}</p>
                                  <p className="text-sm">Year: {data.year}</p>
                                  <p className="text-sm">Impact: +{formatBillions(data.impact)}</p>
                                  <p className="text-sm">Type: {data.type}</p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Bar
                          dataKey="impact"
                          fill={(entry) => {
                            if (entry.type === "massive-spending") return "#dc2626"
                            if (entry.type === "spending") return "#ef4444"
                            if (entry.type === "revenue") return "#10b981"
                            if (entry.type === "cuts") return "#10b981"
                            if (entry.type === "vetoed") return "#6b7280"
                            return "#3b82f6"
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-red-600">+{formatBillions(3300)}</div>
                  <div className="text-sm text-gray-600">Historic Deficit Increase</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-orange-600">12M</div>
                  <div className="text-sm text-gray-600">People Losing Healthcare</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-purple-600">51-50</div>
                  <div className="text-sm text-gray-600">Senate Vote (VP Tiebreaker)</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600">$5T</div>
                  <div className="text-sm text-gray-600">Debt Ceiling Increase</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projections" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Deficit Projections</CardTitle>
                <CardDescription>Updated projections including "One Big Beautiful Bill" impact</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    baseline: { label: "Baseline", color: "hsl(var(--chart-1))" },
                    withLegislation: { label: "With One Big Beautiful Bill", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-medium">FY {label}</p>
                                {payload.map((entry, index) => (
                                  <p key={index} className="text-sm" style={{ color: entry.color }}>
                                    {entry.name}: {formatBillions(entry.value as number)}
                                  </p>
                                ))}
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="deficit"
                        data={legislativeData.projections.baseline}
                        stroke="var(--color-baseline)"
                        strokeWidth={3}
                        name="Baseline"
                      />
                      <Line
                        type="monotone"
                        dataKey="deficit"
                        data={legislativeData.projections.withPendingLegislation}
                        stroke="var(--color-withLegislation)"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        name="With One Big Beautiful Bill"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>10-Year Impact Summary</CardTitle>
                  <CardDescription>Cumulative effects of "One Big Beautiful Bill"</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-900">Deficit Increase</h4>
                      <div className="text-2xl font-bold text-red-600">+{formatBillions(3300)}</div>
                      <p className="text-sm text-red-700">Largest single increase in U.S. history</p>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-medium text-orange-900">Additional Debt</h4>
                      <div className="text-2xl font-bold text-orange-600">
                        +
                        {formatBillions(
                          legislativeData.projections.withPendingLegislation[4].debt -
                            legislativeData.projections.baseline[4].debt,
                        )}
                      </div>
                      <p className="text-sm text-orange-700">Extra debt by 2029</p>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-900">Interest Cost Impact</h4>
                      <div className="text-2xl font-bold text-yellow-600">
                        +
                        {formatBillions(
                          Math.round(
                            (legislativeData.projections.withPendingLegislation[4].debt -
                              legislativeData.projections.baseline[4].debt) *
                              0.04,
                          ),
                        )}
                      </div>
                      <p className="text-sm text-yellow-700">Additional annual interest by 2029</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Implementation Timeline</CardTitle>
                  <CardDescription>"One Big Beautiful Bill" rollout schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900">July 2025</h4>
                      <div className="text-lg font-bold text-green-600">Law Enacted</div>
                      <p className="text-sm text-green-700">Signed on Independence Day</p>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-900">October 2025</h4>
                      <div className="text-lg font-bold text-yellow-600">Major Changes Begin</div>
                      <p className="text-sm text-yellow-700">Medicaid cuts, tax changes, border funding</p>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-900">January 2026</h4>
                      <div className="text-lg font-bold text-red-600">Full Implementation</div>
                      <p className="text-sm text-red-700">All provisions operational, healthcare impacts peak</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="update-system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Automated Update System</CardTitle>
                <CardDescription>
                  Configuration for real-time legislative tracking and budget impact updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Data Sources</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Congress.gov API</div>
                          <div className="text-xs text-gray-600">Bill status and text</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">CBO Score Database</div>
                          <div className="text-xs text-gray-600">Budget impact estimates</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">White House Press Office</div>
                          <div className="text-xs text-gray-600">Presidential actions and signings</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Healthcare Coverage Tracker</div>
                          <div className="text-xs text-gray-600">Real-time Medicaid enrollment monitoring</div>
                        </div>
                        <Badge className="bg-red-100 text-red-800">Critical</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Update Triggers</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-sm">Reconciliation Signings</div>
                        <div className="text-xs text-gray-600">Immediate alerts for massive fiscal legislation</div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-sm">Healthcare Coverage Loss</div>
                        <div className="text-xs text-gray-600">Track 12M people losing Medicaid coverage</div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-sm">Debt Ceiling Changes</div>
                        <div className="text-xs text-gray-600">Monitor $5T debt ceiling increase impacts</div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-sm">Climate Program Elimination</div>
                        <div className="text-xs text-gray-600">Track $180B in clean energy program cuts</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">Historic Bill Tracking Capabilities</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• Real-time deficit impact modeling for $3.3T legislation</li>
                    <li>• Healthcare coverage loss tracking (12M people affected)</li>
                    <li>• State-by-state Medicaid impact calculations</li>
                    <li>• Climate program elimination economic modeling</li>
                    <li>• Tax cut beneficiary analysis by income level</li>
                    <li>• Border spending allocation and effectiveness tracking</li>
                    {selectedBill.paygoSequestration && selectedBill.paygoSequestration.triggered && (
                      <li>• PAYGO sequestration impact on Medicare and other mandatory spending</li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent System Updates</CardTitle>
                <CardDescription>Latest changes including today's historic reconciliation tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm text-red-900">"One Big Beautiful Bill" Detected</div>
                      <div className="text-xs text-red-700">
                        Automatically updated all projections for $3.3T deficit impact
                      </div>
                      <div className="text-xs text-gray-500">July 4, 2025 - 4:30 PM EST</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm text-orange-900">Healthcare Impact Modeling</div>
                      <div className="text-xs text-orange-700">Added tracking for 12M people losing coverage</div>
                      <div className="text-xs text-gray-500">July 4, 2025</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm text-yellow-900">Debt Ceiling Integration</div>
                      <div className="text-xs text-yellow-700">Enhanced tracking for $5T debt ceiling increase</div>
                      <div className="text-xs text-gray-500">July 4, 2025</div>
                    </div>
                  </div>

                  {selectedBill.paygoSequestration && selectedBill.paygoSequestration.triggered && (
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm text-purple-900">PAYGO Sequestration Triggered</div>
                        <div className="text-xs text-purple-700">
                          $500B in automatic cuts to Medicare and other mandatory spending.
                        </div>
                        <div className="text-xs text-gray-500">July 4, 2025</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
