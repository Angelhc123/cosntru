import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from '../../application/services/analytics.service';

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}

    @Get('dashboard')
    async getDashboard(@Query('period') period?: 'day' | 'week' | 'month') {
        try {
            const data = await this.analyticsService.getDashboard(period || 'day');
            return {
                success: true,
                data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    @Get('realtime')
    async getRealtime() {
        try {
            const data = await this.analyticsService.getRealtime();
            return {
                success: true,
                data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    @Get('timeseries')
    async getTimeSeries(@Query('period') period?: 'day' | 'week' | 'month') {
        try {
            const data = await this.analyticsService.getTimeSeriesData(period || 'week');
            return {
                success: true,
                data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}
