import { Beneficiary } from '@prisma/client'

// Helper: Convert income range string like "10001-20000" to midpoint number
function parseIncomeRange(incomeRange?: string | null): number | null {
  if (!incomeRange) return null
  const matches = incomeRange.match(/(\d+)-(\d+)/)
  if (matches) {
    const min = parseInt(matches[1])
    const max = parseInt(matches[2])

    return Math.round((min + max) / 2)
  }
  if (incomeRange === '0-10000') return 5000
  if (incomeRange.toLowerCase() === 'unknown' || incomeRange === '') return null

  return null
}

export function assessBeneficiaryScore(b: Beneficiary): number {
  let score = 0

  // 1️⃣ Income scoring
  if (!b.monthlyIncome) score += 20
  else if (b.monthlyIncome === '0-10000') score += 25
  else if (b.monthlyIncome === '10001-20000') score += 20
  else if (b.monthlyIncome === '20001-30000') score += 10
  else if (b.monthlyIncome === '30001-50000') score += 5
  else score += 0

  // 2️⃣ Dependents scoring
  const totalDependents = (b.numberOfDependentChildren || 0) + (b.numberOfIndependentChildren || 0)
  if (totalDependents === 1) score += 5
  else if (totalDependents === 2) score += 10
  else if (totalDependents >= 3) score += 15

  // 3️⃣ Education expense vs income
  const incomeNumeric = parseIncomeRange(b.monthlyIncome)
  if (incomeNumeric && b.educationExpense) {
    const expenseRatio = b.educationExpense / incomeNumeric
    if (expenseRatio > 0.3) score += 20
    else if (expenseRatio > 0.1) score += 10
  }

  // 4️⃣ Health scoring
  if (b.healthCondition?.toLowerCase() === 'poor') score += 10
  if (b.chronicIllnesses && b.chronicIllnesses.trim() !== '') score += 10
  if (b.disability === 'yes') score += 10
  if (b.healthInsurance === 'no') score += 5

  // 5️⃣ Housing scoring
  if (b.housingStatus?.toLowerCase() === 'rented') score += 10

  // 6️⃣ Earning members vs dependents
  const earners = Number(b.earningMembers) || 0
  if (earners > 0 && totalDependents > earners) score += 10

  // 7️⃣ Assistance needs scoring
  score += (b.assistanceNeeds?.length || 0) * 5

  // 8️⃣ No government schemes availed while needing assistance
  if ((b.governmentSchemes?.length || 0) === 0 && (b.assistanceNeeds?.length || 0) > 0) score += 10

  // 9️⃣ Assets check (deduct points if low income but owns many assets)
  if (incomeNumeric && incomeNumeric < 25000) {
    score -= (b.assets?.length || 0) * 5
  }

  // Cap score between 0-100
  score = Math.max(0, Math.min(100, score))

  return score
}
