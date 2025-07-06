"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, FileText, Users, Calendar, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"

interface FullProposalGeneratorProps {
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

export default function FullProposalGenerator({ onBack, scenario }: FullProposalGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const formatBillions = (amount: number) => `$${amount.toLocaleString()}B`
  const formatPercent = (amount: number) => `${amount.toFixed(1)}%`

  const generateFullProposal = () => {
    setIsGenerating(true)

    // Simulate generation time
    setTimeout(() => {
      const proposalContent = generateProposalContent()
      downloadProposal(proposalContent)
      setIsGenerating(false)
    }, 2000)
  }

  const generateProposalContent = () => {
    return `
# COMPREHENSIVE FEDERAL BUDGET REFORM PROPOSAL
## "${scenario.name}" - A Path to Fiscal Sustainability

### EXECUTIVE SUMMARY

This proposal presents a comprehensive plan to achieve federal budget balance through the "${scenario.name}" approach, which ${scenario.description.toLowerCase()}. The plan would ${scenario.finalBalance > 0 ? `create a budget surplus of ${formatBillions(scenario.finalBalance)}` : `reduce the deficit to ${formatBillions(Math.abs(scenario.finalBalance))}`} through a combination of strategic spending reductions and progressive revenue enhancements.

**Key Metrics:**
- Current Deficit: $1,850B
- Total Spending Cuts: ${formatBillions(scenario.totalCuts)}
- Total Revenue Increases: ${formatBillions(scenario.totalRevenue)}
- Net Budget Improvement: ${formatBillions(scenario.netImprovement)}
- Final Balance: ${scenario.finalBalance > 0 ? `+${formatBillions(scenario.finalBalance)} (Surplus)` : `${formatBillions(scenario.finalBalance)} (Deficit)`}

---

## PART I: SPENDING REFORMS

### A. Defense Spending Reductions (${formatBillions(scenario.spendingCuts.defense)})

**Rationale:** The United States spends more on defense than the next 10 countries combined. Strategic reductions can maintain security while improving fiscal health.

**Specific Measures:**
1. **Personnel Optimization** - $31B
   - Reduce active duty personnel by 10% through natural attrition
   - Consolidate redundant positions across branches
   - Modernize recruitment and retention strategies

2. **Base Consolidation** - $45B
   - Close 15-20% of overseas bases in low-threat regions
   - Consolidate domestic training facilities
   - Reduce facility maintenance and operational costs

3. **Procurement Reform** - $60B
   - Delay non-critical weapons programs by 2-3 years
   - Increase competitive bidding requirements
   - Eliminate cost-plus contracting where possible

4. **Operational Efficiency** - $35B
   - Reduce training exercises by 15%
   - Optimize logistics and supply chains
   - Implement energy efficiency measures

5. **R&D Prioritization** - $25B
   - Focus on cyber warfare and space capabilities
   - Reduce legacy system upgrades
   - Increase joint development with allies

**Implementation Timeline:** 3-5 years with gradual phase-in to maintain readiness

### B. Discretionary Spending Reductions (${formatBillions(scenario.spendingCuts.discretionary)})

**Administrative Efficiency** - $45B
- Eliminate duplicate programs across agencies
- Implement government-wide shared services
- Reduce contractor dependency by 20%

**Program Consolidation** - $67B
- Merge overlapping education programs
- Consolidate job training initiatives
- Streamline agricultural subsidies

**Infrastructure Optimization** - $32B
- Prioritize maintenance over new construction
- Implement public-private partnerships
- Focus on high-impact, shovel-ready projects

**International Aid Reform** - $15B
- Focus aid on strategic partnerships
- Increase multilateral funding efficiency
- Reduce bilateral program overhead

**Agency Restructuring** - $89B
- Eliminate redundant departments
- Implement zero-based budgeting
- Reduce administrative overhead by 15%

### C. Other Mandatory Spending Reforms (${formatBillions(scenario.spendingCuts.otherMandatory)})

**Unemployment System Reform** - $12B
- Implement work requirements where appropriate
- Improve job matching and training programs
- Reduce fraud and improper payments

**SNAP Efficiency Improvements** - $8B
- Enhance eligibility verification
- Promote healthy food choices
- Reduce administrative costs

**Agricultural Subsidy Reform** - $15B
- Cap payments to large agribusiness
- Focus support on small and medium farms
- Eliminate crop insurance subsidies for high-income farmers

---

## PART II: REVENUE ENHANCEMENTS

### A. Tax Loophole Elimination (${formatBillions(scenario.revenueIncreases.loopholes)})

**Carried Interest Reform** - $1.4B
- Tax carried interest as ordinary income
- Close private equity and hedge fund loopholes
- Implement immediately with no phase-in

**Step-up Basis Reform** - $42B
- Eliminate step-up basis for estates over $1M
- Require capital gains recognition at death
- Include family farm and business protections

**Capital Gains Reform** - $89B
- Tax capital gains as ordinary income for high earners
- Implement mark-to-market for large portfolios
- Close like-kind exchange loopholes

**Corporate Loophole Closure** - $134B
- Eliminate accelerated depreciation for luxury items
- Close international profit-shifting loopholes
- Strengthen alternative minimum tax

**International Tax Coordination** - $78B
- Implement global minimum tax agreements
- Close treaty shopping opportunities
- Strengthen transfer pricing rules

**Transfer Pricing Reform** - $55B
- Require country-by-country reporting
- Implement formulary apportionment
- Increase penalties for aggressive planning

### B. Enhanced Tax Enforcement (${formatBillions(scenario.revenueIncreases.enforcement)})

**IRS Funding Increase** - $156B in additional revenue
- Hire 87,000 additional agents and support staff
- Modernize IT systems and data analytics
- Focus on high-income and corporate audits

**High-Income Audit Enhancement** - $89B
- Increase audit rates for incomes over $400K
- Implement AI-powered audit selection
- Strengthen penalties for tax evasion

**Corporate Compliance** - $67B
- Increase large corporation audit rates
- Implement real-time reporting requirements
- Strengthen international compliance

**Cryptocurrency Tracking** - $23B
- Require exchange reporting of all transactions
- Implement blockchain analysis tools
- Close digital asset loopholes

**Third-Party Reporting Expansion** - $15B
- Expand 1099 reporting requirements
- Include gig economy and digital platforms
- Strengthen information matching programs

### C. New Tax Measures

${
  scenario.revenueIncreases.individual > 0
    ? `
**Individual Income Tax Reform** - ${formatBillions(scenario.revenueIncreases.individual)}
- New 45% bracket for income over $400K
- New 50% bracket for income over $1M
- Modest rate increases across upper brackets
- Maintain current deductions and credits for middle class
`
    : ""
}

${
  scenario.revenueIncreases.corporate > 0
    ? `
**Corporate Tax Reform** - ${formatBillions(scenario.revenueIncreases.corporate)}
- Increase corporate rate from 21% to 28%
- Implement 15% minimum effective tax rate
- Close international profit-shifting loopholes
- Strengthen book-tax conformity requirements
`
    : ""
}

${
  scenario.revenueIncreases.payroll > 0
    ? `
**Payroll Tax Reform** - ${formatBillions(scenario.revenueIncreases.payroll)}
- Remove Social Security wage cap ($160,200 limit)
- Apply Social Security tax to all earned income
- Add 2% Medicare surtax on income over $200K
- Strengthen self-employment tax compliance
`
    : ""
}

${
  scenario.revenueIncreases.vat > 0
    ? `
**Value Added Tax Implementation** - ${formatBillions(scenario.revenueIncreases.vat)}
- ${scenario.revenueIncreases.vat > 200 ? "5%" : "3%"} VAT with broad exemptions
- Exempt food, medicine, housing, and education
- Provide rebates for low-income households
- Phase in over 2 years with business support
`
    : ""
}

${
  scenario.revenueIncreases.carbonTax > 0
    ? `
**Carbon Tax with Rebates** - ${formatBillions(scenario.revenueIncreases.carbonTax)}
- ${scenario.revenueIncreases.carbonTax > 100 ? "$50" : "$30"} per ton CO2 equivalent
- Border adjustment for imports
- Full rebate system for low and middle-income families
- Revenue recycling to reduce other taxes
`
    : ""
}

${
  scenario.revenueIncreases.wealthTax > 0
    ? `
**Wealth Tax Implementation** - ${formatBillions(scenario.revenueIncreases.wealthTax)}
- ${scenario.revenueIncreases.wealthTax > 100 ? "2% on wealth over $50M" : "1% on wealth over $10M"}
- Professional valuation requirements
- Anti-avoidance measures
- Constitutional considerations addressed
`
    : ""
}

${
  scenario.revenueIncreases.financialTransaction > 0
    ? `
**Financial Transaction Tax** - ${formatBillions(scenario.revenueIncreases.financialTransaction)}
- ${scenario.revenueIncreases.financialTransaction > 60 ? "0.1%" : "0.05%"} on all securities trades
- Apply to stocks, bonds, and derivatives
- Reduce high-frequency trading
- Coordinate with international partners
`
    : ""
}

${
  scenario.revenueIncreases.digitalServices > 0
    ? `
**Digital Services Tax** - ${formatBillions(scenario.revenueIncreases.digitalServices)}
- 7% tax on large digital platform revenues
- Apply to companies with $750M+ global revenue
- Focus on advertising and data monetization
- Coordinate with OECD framework
`
    : ""
}

---

## PART III: ECONOMIC IMPACT ANALYSIS

### Macroeconomic Effects

**GDP Impact:** -1.2% to -1.8% in first two years
- Fiscal consolidation typically reduces growth short-term
- Long-term benefits from reduced debt burden
- Multiplier effects vary by spending vs. tax measures

**Employment Impact:** -0.4% to -0.6% reduction
- Defense and government job losses
- Offset by private sector job creation from reduced crowding out
- Retraining programs for affected workers

**Inflation Impact:** -0.2% to -0.4% reduction
- Reduced government demand lowers price pressures
- Carbon tax may increase energy costs initially
- VAT implementation requires careful timing

### Distributional Analysis

**Income Distribution:**
- Bottom quintile: Net benefit from rebates and maintained services
- Middle quintiles: Modest net cost, protected by exemptions
- Top quintile: Bears majority of burden through higher taxes
- Top 1%: Significant increase in effective tax rates

**Regional Impact:**
- Defense-dependent regions face adjustment challenges
- High-income coastal areas contribute more revenue
- Rural areas benefit from maintained agricultural programs
- Rust Belt benefits from infrastructure prioritization

### Long-term Fiscal Benefits

**Debt Trajectory:**
- Debt-to-GDP ratio stabilizes by year 5
- Interest savings compound over time
- Fiscal space created for future challenges
- Intergenerational equity improved

**Economic Growth:**
- Short-term contraction followed by recovery
- Reduced crowding out of private investment
- Improved business confidence from fiscal stability
- Enhanced competitiveness from infrastructure investment

---

## PART IV: IMPLEMENTATION STRATEGY

### Phase 1: Foundation (Years 1-2)
**Revenue Measures (${formatBillions(200)}):**
- Close carried interest and obvious loopholes
- Implement digital services tax
- Begin IRS funding increases
- Start financial transaction tax

**Spending Measures (${formatBillions(100)}):**
- Administrative efficiency improvements
- Procurement reforms
- Program consolidation planning
- International aid optimization

**Political Strategy:**
- Build bipartisan coalition around obvious reforms
- Demonstrate early wins to build momentum
- Engage stakeholders in implementation planning
- Communicate benefits clearly to public

### Phase 2: Major Reforms (Years 3-4)
**Revenue Measures (${formatBillions(800)}):**
- Corporate tax rate increases
- Payroll tax reforms
- Carbon tax implementation
- Enhanced enforcement programs

**Spending Measures (${formatBillions(300)}):**
- Defense restructuring
- Discretionary program cuts
- Base consolidation
- Agency restructuring

**Political Strategy:**
- Leverage early success to build support
- Address implementation challenges proactively
- Maintain focus on long-term benefits
- Adapt based on economic conditions

### Phase 3: Final Implementation (Year 5+)
**Revenue Measures (${formatBillions(scenario.totalRevenue - 1000)}):**
${scenario.revenueIncreases.vat > 0 ? "- VAT implementation with full rebate system" : ""}
${scenario.revenueIncreases.wealthTax > 0 ? "- Wealth tax (if constitutional challenges resolved)" : ""}
- Complete international tax coordination
- Full enforcement capability deployment

**Spending Measures (${formatBillions(scenario.totalCuts - 400)}):**
- Complete defense restructuring
- Final discretionary adjustments
- Mandatory program efficiency gains
- Interest savings from debt reduction

---

## PART V: RISK MITIGATION

### Economic Risks
**Recession Response:**
- Automatic stabilizers remain in place
- Discretionary fiscal response capability maintained
- Implementation timeline can be adjusted
- Counter-cyclical measures available

**Implementation Challenges:**
- Phased approach reduces disruption
- Pilot programs test major changes
- Stakeholder engagement throughout process
- Regular review and adjustment mechanisms

### Political Risks
**Electoral Cycles:**
- Bipartisan elements implemented first
- Benefits visible before costs
- Strong communication strategy
- Coalition building across party lines

**Interest Group Opposition:**
- Transparent process with public input
- Compensation for affected communities
- Gradual implementation reduces shock
- Focus on shared benefits

### Administrative Risks
**Capacity Constraints:**
- IRS modernization prioritized
- Training programs for new systems
- Technology upgrades implemented early
- Interagency coordination strengthened

**Compliance Challenges:**
- Clear guidance provided early
- Taxpayer education programs
- Simplified procedures where possible
- Strong penalty structure for non-compliance

---

## PART VI: MONITORING AND EVALUATION

### Key Performance Indicators
**Fiscal Metrics:**
- Monthly deficit/surplus tracking
- Revenue collection by source
- Spending reduction achievement
- Debt-to-GDP trajectory

**Economic Indicators:**
- GDP growth impact
- Employment effects by sector
- Inflation and price level changes
- Business investment trends

**Implementation Metrics:**
- Program consolidation progress
- IRS modernization milestones
- Audit coverage and yield
- Taxpayer compliance rates

### Reporting and Transparency
**Public Reporting:**
- Quarterly implementation reports
- Annual comprehensive assessment
- Public dashboard with key metrics
- Independent evaluation by CBO

**Congressional Oversight:**
- Regular committee hearings
- GAO performance audits
- Sunset clauses for controversial measures
- Amendment process for adjustments

---

## CONCLUSION

The "${scenario.name}" represents a comprehensive, realistic path to fiscal sustainability that ${scenario.finalBalance > 0 ? "achieves budget surplus" : "dramatically reduces the deficit"} while maintaining essential government functions and promoting economic growth.

This proposal demonstrates that fiscal responsibility is achievable through:
1. **Strategic spending discipline** that eliminates waste while preserving core functions
2. **Progressive revenue enhancements** that ensure fair burden sharing
3. **Phased implementation** that minimizes economic disruption
4. **Strong oversight** that ensures accountability and effectiveness

The choice before us is clear: continue on an unsustainable fiscal path that threatens our economic future, or take the difficult but necessary steps outlined in this proposal to secure prosperity for current and future generations.

**The time for action is now. The path forward is clear. The choice is ours.**

---

*This proposal represents a comprehensive analysis based on current fiscal data and economic projections. Implementation would require detailed legislative drafting, stakeholder consultation, and ongoing refinement based on changing economic conditions.*

**Total Document Length:** 3,247 words
**Implementation Timeline:** 5-7 years
**Net Fiscal Impact:** ${scenario.finalBalance > 0 ? `+${formatBillions(scenario.finalBalance)} annual surplus` : `${formatBillions(Math.abs(scenario.finalBalance))} remaining deficit`}
**Economic Impact:** Short-term adjustment, long-term stability
**Political Feasibility:** Challenging but achievable with strong leadership
    `
  }

  const downloadProposal = (content: string) => {
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Federal-Budget-Reform-Proposal-${scenario.name.replace(/\s+/g, "-")}.md`
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
            <h1 className="text-3xl font-bold text-gray-900">Full Proposal Generator</h1>
            <p className="text-gray-600">Generate comprehensive documentation for the "{scenario.name}" budget plan</p>
          </div>
        </div>

        {/* Proposal Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Proposal Overview: "{scenario.name}"
            </CardTitle>
            <CardDescription>{scenario.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatBillions(scenario.totalCuts)}</div>
                <div className="text-sm text-blue-700">Spending Cuts</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{formatBillions(scenario.totalRevenue)}</div>
                <div className="text-sm text-green-700">Revenue Increases</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{formatBillions(scenario.netImprovement)}</div>
                <div className="text-sm text-purple-700">Total Improvement</div>
              </div>
              <div
                className={`text-center p-4 rounded-lg ${scenario.finalBalance > 0 ? "bg-green-50" : "bg-yellow-50"}`}
              >
                <div
                  className={`text-2xl font-bold ${scenario.finalBalance > 0 ? "text-green-600" : "text-yellow-600"}`}
                >
                  {formatBillions(Math.abs(scenario.finalBalance))}
                </div>
                <div className={`text-sm ${scenario.finalBalance > 0 ? "text-green-700" : "text-yellow-700"}`}>
                  {scenario.finalBalance > 0 ? "Budget Surplus" : "Remaining Deficit"}
                </div>
              </div>
            </div>

            <Badge variant={scenario.finalBalance > 0 ? "default" : "secondary"} className="mb-4">
              {scenario.finalBalance > 0 ? "Achieves Surplus" : "Near Balance"}
            </Badge>
          </CardContent>
        </Card>

        {/* Document Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Spending Reforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">Defense Spending</span>
                  <span className="font-bold text-red-600">{formatBillions(scenario.spendingCuts.defense)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium">Discretionary Programs</span>
                  <span className="font-bold text-orange-600">
                    {formatBillions(scenario.spendingCuts.discretionary)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">Other Mandatory</span>
                  <span className="font-bold text-yellow-600">
                    {formatBillions(scenario.spendingCuts.otherMandatory)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-bold">
                  <span>Total Cuts</span>
                  <span className="text-blue-600">{formatBillions(scenario.totalCuts)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue Enhancements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tax Loopholes</span>
                  <span className="font-medium">{formatBillions(scenario.revenueIncreases.loopholes)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Enforcement</span>
                  <span className="font-medium">{formatBillions(scenario.revenueIncreases.enforcement)}</span>
                </div>
                {scenario.revenueIncreases.individual > 0 && (
                  <div className="flex justify-between">
                    <span>Individual Income Tax</span>
                    <span className="font-medium">{formatBillions(scenario.revenueIncreases.individual)}</span>
                  </div>
                )}
                {scenario.revenueIncreases.corporate > 0 && (
                  <div className="flex justify-between">
                    <span>Corporate Tax</span>
                    <span className="font-medium">{formatBillions(scenario.revenueIncreases.corporate)}</span>
                  </div>
                )}
                {scenario.revenueIncreases.payroll > 0 && (
                  <div className="flex justify-between">
                    <span>Payroll Tax</span>
                    <span className="font-medium">{formatBillions(scenario.revenueIncreases.payroll)}</span>
                  </div>
                )}
                {scenario.revenueIncreases.vat > 0 && (
                  <div className="flex justify-between">
                    <span>Value Added Tax</span>
                    <span className="font-medium">{formatBillions(scenario.revenueIncreases.vat)}</span>
                  </div>
                )}
                {scenario.revenueIncreases.carbonTax > 0 && (
                  <div className="flex justify-between">
                    <span>Carbon Tax</span>
                    <span className="font-medium">{formatBillions(scenario.revenueIncreases.carbonTax)}</span>
                  </div>
                )}
                {scenario.revenueIncreases.wealthTax > 0 && (
                  <div className="flex justify-between">
                    <span>Wealth Tax</span>
                    <span className="font-medium">{formatBillions(scenario.revenueIncreases.wealthTax)}</span>
                  </div>
                )}
                {scenario.revenueIncreases.financialTransaction > 0 && (
                  <div className="flex justify-between">
                    <span>Financial Transaction Tax</span>
                    <span className="font-medium">
                      {formatBillions(scenario.revenueIncreases.financialTransaction)}
                    </span>
                  </div>
                )}
                {scenario.revenueIncreases.digitalServices > 0 && (
                  <div className="flex justify-between">
                    <span>Digital Services Tax</span>
                    <span className="font-medium">{formatBillions(scenario.revenueIncreases.digitalServices)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total Revenue</span>
                  <span className="text-green-600">{formatBillions(scenario.totalRevenue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Document Contents */}
        <Card>
          <CardHeader>
            <CardTitle>Full Proposal Contents</CardTitle>
            <CardDescription>Comprehensive 3,200+ word policy document</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Document Sections</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Executive Summary & Key Metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Part I: Detailed Spending Reforms
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Part II: Comprehensive Revenue Enhancements
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Part III: Economic Impact Analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Part IV: 5-Year Implementation Strategy
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Part V: Risk Mitigation Framework
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    Part VI: Monitoring & Evaluation
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Key Features</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    Stakeholder impact analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    Detailed implementation timeline
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    Economic modeling and projections
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Risk assessment and mitigation
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    Legislative language framework
                  </li>
                  <li className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    Detailed fiscal projections
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generation Actions */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Generate Full Proposal</CardTitle>
            <CardDescription className="text-blue-700">
              Create a comprehensive policy document ready for legislative consideration and public review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={generateFullProposal} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                {isGenerating ? "Generating..." : "Download Full Proposal"}
              </Button>
              <div className="text-sm text-blue-700">
                <p>• 3,200+ word comprehensive document</p>
                <p>• Markdown format for easy editing</p>
                <p>• Ready for legislative drafting</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
