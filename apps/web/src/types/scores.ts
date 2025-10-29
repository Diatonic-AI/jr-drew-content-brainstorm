export type ScoreType =
  | 'focus'
  | 'meetings'
  | 'breaks'
  | 'context-switching'
  | 'consistency'
  | 'energy'

export type ScoreTrend = 'up' | 'down' | 'steady'

export interface ScoreMetric {
  id: string
  type: ScoreType
  label: string
  value: number
  /**
   * Previous period value used to calculate trend.
   */
  previousValue?: number
  target?: number
  trend?: ScoreTrend
  /**
   * Confidence score (0-1) derived from data density.
   */
  confidence?: number
  description?: string
}

export interface ScoreBreakdown {
  metric: ScoreMetric
  /**
   * Specific contributing factors with their impact weights.
   */
  factors: Array<{
    label: string
    impact: number
    description?: string
  }>
}

export interface ScoreHistoryPoint {
  period: string
  value: number
  target?: number
}

export interface ScoreSnapshot {
  generatedAt: string
  metrics: ScoreMetric[]
  breakdowns: ScoreBreakdown[]
  history: Record<ScoreType, ScoreHistoryPoint[]>
}

