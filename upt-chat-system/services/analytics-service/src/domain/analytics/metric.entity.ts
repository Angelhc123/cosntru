/**
 * Domain Entity - Metric
 * Representa una métrica del sistema
 */
export class Metric {
  constructor(
    public readonly name: string,
    public readonly value: number,
    public readonly timestamp: Date,
    public readonly metadata?: Record<string, any>,
  ) {}

  static create(data: {
    name: string;
    value: number;
    timestamp?: Date;
    metadata?: Record<string, any>;
  }): Metric {
    return new Metric(
      data.name,
      data.value,
      data.timestamp || new Date(),
      data.metadata,
    );
  }
}
