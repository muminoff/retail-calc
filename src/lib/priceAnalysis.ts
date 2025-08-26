export interface PriceAnalysis {
  score: number
  level: 'excellent' | 'good' | 'moderate' | 'warning' | 'poor'
  message: string
  colorClass: string
  bgGradient: string
  warnings: string[]
}

export function calculatePerceptionScore(
  margin: number,
  shippingRatio: number,
  finalPriceUZS: number
): number {
  let score = 100

  // Margin scoring (optimal is 15-20%)
  if (margin <= 20 && margin >= 15) {
    // Perfect range, no penalty
  } else if (margin < 15) {
    // Too low margin, might indicate unsustainable pricing
    score -= (15 - margin) * 1.5
  } else if (margin > 20 && margin <= 30) {
    // Slightly high but acceptable
    score -= (margin - 20) * 2
  } else if (margin > 30 && margin <= 40) {
    // Getting expensive
    score -= 20 + (margin - 30) * 3
  } else {
    // Very high margin
    score -= 50 + (margin - 40) * 4
  }

  // Shipping ratio penalty (optimal is < 20% of product cost)
  if (shippingRatio > 0.2 && shippingRatio <= 0.3) {
    score -= (shippingRatio - 0.2) * 50
  } else if (shippingRatio > 0.3 && shippingRatio <= 0.5) {
    score -= 5 + (shippingRatio - 0.3) * 100
  } else if (shippingRatio > 0.5) {
    score -= 25 + (shippingRatio - 0.5) * 150
  }

  // Psychological pricing bonus
  const lastDigits = finalPriceUZS % 10000
  if (lastDigits === 9000) {
    score += 8 // Strong psychological pricing
  } else if (lastDigits === 5000) {
    score += 5 // Good psychological pricing
  } else if (lastDigits === 0) {
    score += 3 // Clean round number
  }

  // Price threshold penalties
  if (finalPriceUZS > 1000000) {
    score -= 10 // Psychological barrier of 1M UZS
  } else if (finalPriceUZS > 500000) {
    score -= 5 // Half million barrier
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

export function analyzePricing(
  margin: number,
  shippingCost: number,
  originalPrice: number,
  finalPriceUZS: number
): PriceAnalysis {
  const shippingRatio = shippingCost / originalPrice
  const score = calculatePerceptionScore(margin, shippingRatio, finalPriceUZS)
  
  const warnings: string[] = []

  // Add specific warnings
  if (shippingRatio > 0.5) {
    warnings.push('Pochta narxi mahsulot narxidan 50% ortiq')
  } else if (shippingRatio > 0.3) {
    warnings.push('Pochta narxi yuqori')
  }

  if (margin > 40) {
    warnings.push('Foyda darajasi juda yuqori')
  } else if (margin > 30) {
    warnings.push('Foyda darajasi yuqori')
  }

  if (finalPriceUZS > 1000000) {
    warnings.push('1 million so\'mdan oshdi')
  }

  // Determine level and styling based on score
  let level: PriceAnalysis['level']
  let message: string
  let colorClass: string
  let bgGradient: string

  if (score >= 90) {
    level = 'excellent'
    message = 'Juda yaxshi narx'
    colorClass = 'text-green-600 dark:text-green-400'
    bgGradient = 'bg-gradient-to-br from-green-400/20 to-green-500/30 dark:from-green-500/20 dark:to-green-600/30'
  } else if (score >= 70) {
    level = 'good'
    message = 'Yaxshi narx'
    colorClass = 'text-green-500 dark:text-green-400'
    bgGradient = 'bg-gradient-to-br from-green-300/15 to-green-400/25 dark:from-green-400/15 dark:to-green-500/25'
  } else if (score >= 50) {
    level = 'moderate'
    message = "O'rtacha narx"
    colorClass = 'text-yellow-600 dark:text-yellow-400'
    bgGradient = 'bg-gradient-to-br from-yellow-300/15 to-yellow-400/25 dark:from-yellow-400/15 dark:to-yellow-500/25'
  } else if (score >= 30) {
    level = 'warning'
    message = 'Qimmat narx'
    colorClass = 'text-orange-600 dark:text-orange-400'
    bgGradient = 'bg-gradient-to-br from-orange-300/15 to-orange-400/25 dark:from-orange-400/15 dark:to-orange-500/25'
  } else {
    level = 'poor'
    message = 'Juda qimmat'
    colorClass = 'text-red-600 dark:text-red-400'
    bgGradient = 'bg-gradient-to-br from-red-300/15 to-red-400/25 dark:from-red-400/15 dark:to-red-500/25'
  }

  return {
    score,
    level,
    message,
    colorClass,
    bgGradient,
    warnings
  }
}

export function getPriceEndingBonus(priceUZS: number): string | null {
  const lastDigits = priceUZS % 10000
  if (lastDigits === 9000) {
    return '✨ 9,000 bilan tugaydi'
  } else if (lastDigits === 5000) {
    return '✨ 5,000 bilan tugaydi'
  } else if (lastDigits === 0) {
    return '✨ Aniq son'
  }
  return null
}