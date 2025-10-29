export const formatPercentage = (value: number, digits = 0) => `${(value * 100).toFixed(digits)}%`

export const formatCurrency = (value: number, currency = 'USD') =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value)

export default { formatPercentage, formatCurrency }
