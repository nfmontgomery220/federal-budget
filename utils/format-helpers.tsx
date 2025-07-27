export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatBillions = (amount: number): string => {
  return `$${(amount / 1000).toFixed(1)}T`
}

export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`
}

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`
}

export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000000000) {
    return `$${(num / 1000000000000).toFixed(1)}T`
  } else if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(1)}B`
  } else if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(1)}K`
  } else {
    return `$${num.toFixed(0)}`
  }
}

export const formatNumber = (value: number): string => {
  return value.toLocaleString("en-US")
}

export const calculatePercentChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0
  return ((newValue - oldValue) / oldValue) * 100
}

export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0
  return ((newValue - oldValue) / oldValue) * 100
}

export const formatDate = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const formatDateLong = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const getColorForValue = (value: number, type: "deficit" | "spending" | "revenue" = "deficit"): string => {
  switch (type) {
    case "deficit":
      return value > 0 ? "text-red-600" : "text-green-600"
    case "spending":
      return value > 0 ? "text-red-600" : "text-gray-600"
    case "revenue":
      return value > 0 ? "text-green-600" : "text-red-600"
    default:
      return "text-gray-600"
  }
}

export const getBadgeColorForStatus = (status: string): string => {
  switch (status.toLowerCase()) {
    case "signed into law":
      return "bg-green-100 text-green-800"
    case "passed house":
    case "passed senate":
      return "bg-blue-100 text-blue-800"
    case "floor consideration":
      return "bg-purple-100 text-purple-800"
    case "committee review":
    case "committee markup":
      return "bg-yellow-100 text-yellow-800"
    case "introduced":
      return "bg-gray-100 text-gray-800"
    case "vetoed":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const calculateCompoundGrowth = (principal: number, rate: number, years: number): number => {
  return principal * Math.pow(1 + rate, years)
}

export const calculateAnnualPayment = (principal: number, rate: number, years: number): number => {
  if (rate === 0) return principal / years
  return (principal * rate * Math.pow(1 + rate, years)) / (Math.pow(1 + rate, years) - 1)
}

// Budget-specific helpers
export const calculateDeficitAsPercentOfGDP = (deficit: number, gdp: number): number => {
  return (deficit / gdp) * 100
}

export const calculateDebtServiceRatio = (interestPayments: number, totalRevenue: number): number => {
  return (interestPayments / totalRevenue) * 100
}

export const projectFutureDeficit = (
  currentDeficit: number,
  growthRate: number,
  years: number,
): { year: number; deficit: number }[] => {
  const projections = []
  for (let i = 0; i <= years; i++) {
    projections.push({
      year: new Date().getFullYear() + i,
      deficit: currentDeficit * Math.pow(1 + growthRate, i),
    })
  }
  return projections
}

export const formatDeficit = (amount: number): string => {
  if (amount >= 0) {
    return `+$${formatLargeNumber(amount)} Surplus`
  } else {
    return `-$${formatLargeNumber(Math.abs(amount))} Deficit`
  }
}

// Legislative tracking helpers
export const calculatePassageProbability = (
  houseSupport: number,
  senateSupport: number,
  presidentialSupport: boolean,
): number => {
  const houseProbability = Math.min(houseSupport / 218, 1) // 218 needed for majority
  const senateProbability = Math.min(senateSupport / 60, 1) // 60 for cloture
  const presidentialFactor = presidentialSupport ? 1 : 0.1 // Very low if president opposes

  return houseProbability * senateProbability * presidentialFactor * 100
}

export const calculateReconciliationProbability = (senateSupport: number, presidentialSupport: boolean): number => {
  const senateProbability = Math.min(senateSupport / 51, 1) // Only 51 needed for reconciliation
  const presidentialFactor = presidentialSupport ? 1 : 0.1

  return senateProbability * presidentialFactor * 100
}

export const estimateBudgetImpactWithProbability = (budgetImpact: number, passageProbability: number): number => {
  return budgetImpact * (passageProbability / 100)
}

// Healthcare impact helpers
export const calculateCoverageImpact = (
  currentEnrollment: number,
  reductionPercentage: number,
): { peopleAffected: number; newEnrollment: number } => {
  const peopleAffected = Math.round(currentEnrollment * (reductionPercentage / 100))
  const newEnrollment = currentEnrollment - peopleAffected

  return {
    peopleAffected,
    newEnrollment,
  }
}

export const calculateStateHealthcareImpact = (
  statePopulation: number,
  medicaidEnrollmentRate: number,
  nationalReductionRate: number,
): number => {
  const stateMedicaidEnrollment = statePopulation * medicaidEnrollmentRate
  return Math.round(stateMedicaidEnrollment * nationalReductionRate)
}

// Tax policy helpers
export const calculateTaxCutBenefitByIncome = (income: number, currentRate: number, newRate: number): number => {
  return income * (currentRate - newRate)
}

export const calculateCorporateTaxImpact = (corporateRevenue: number, currentRate: number, newRate: number): number => {
  return corporateRevenue * (currentRate - newRate)
}

export const formatTaxRate = (rate: number): string => {
  return `${(rate * 100).toFixed(1)}%`
}

// Climate and energy helpers
export const calculateClimateSpendingImpact = (
  totalClimateSpending: number,
  reductionPercentage: number,
): { amountCut: number; remainingSpending: number } => {
  const amountCut = totalClimateSpending * (reductionPercentage / 100)
  const remainingSpending = totalClimateSpending - amountCut

  return {
    amountCut,
    remainingSpending,
  }
}

export const estimateEVCreditImpact = (annualEVSales: number, averageCreditAmount: number): number => {
  return annualEVSales * averageCreditAmount
}

// Political analysis helpers
export const calculateBipartisanScore = (
  republicanSupport: number,
  democraticSupport: number,
): { score: number; level: string } => {
  const averageSupport = (republicanSupport + democraticSupport) / 2
  const bipartisanGap = Math.abs(republicanSupport - democraticSupport)

  let level: string
  if (averageSupport >= 70 && bipartisanGap <= 20) {
    level = "Strong Bipartisan"
  } else if (averageSupport >= 50 && bipartisanGap <= 40) {
    level = "Moderate Bipartisan"
  } else if (bipartisanGap <= 30) {
    level = "Weak Bipartisan"
  } else {
    level = "Partisan"
  }

  return {
    score: Math.round(averageSupport),
    level,
  }
}

export const calculatePoliticalRisk = (
  passageProbability: number,
  controversyLevel: number,
  economicImpact: number,
): { risk: number; level: string } => {
  // Higher controversy and economic impact increase risk
  // Higher passage probability decreases risk
  const risk = Math.round(controversyLevel * 0.4 + Math.abs(economicImpact) * 0.3 + (100 - passageProbability) * 0.3)

  let level: string
  if (risk >= 80) level = "Very High"
  else if (risk >= 60) level = "High"
  else if (risk >= 40) level = "Moderate"
  else if (risk >= 20) level = "Low"
  else level = "Very Low"

  return { risk, level }
}

export const formatBudgetItem = (name: string, amount: number, isIncrease = false): string => {
  const sign = isIncrease ? "+" : "-"
  return `${name}: ${sign}${formatCurrency(Math.abs(amount))}`
}
