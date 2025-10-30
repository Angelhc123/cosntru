/**
 * Domain Entity - Dashboard Statistics
 * Representa estadísticas agregadas del dashboard
 */
export class DashboardStats {
  constructor(
    public readonly totalQueries: number,
    public readonly averageConfidence: number,
    public readonly positiveRate: number,
    public readonly escalationRate: number,
    public readonly topIntents: Array<{ intent: string; count: number }>,
    public readonly topFaqs: Array<{ question: string; count: number }>,
    public readonly period: { start: Date; end: Date },
  ) {}

  static create(data: {
    totalQueries: number;
    averageConfidence: number;
    positiveRate: number;
    escalationRate: number;
    topIntents: Array<{ intent: string; count: number }>;
    topFaqs: Array<{ question: string; count: number }>;
    period: { start: Date; end: Date };
  }): DashboardStats {
    return new DashboardStats(
      data.totalQueries,
      data.averageConfidence,
      data.positiveRate,
      data.escalationRate,
      data.topIntents,
      data.topFaqs,
      data.period,
    );
  }
}
