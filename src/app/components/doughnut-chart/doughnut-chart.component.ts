import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss'],
})
export class DoughnutChartComponent implements OnInit, OnChanges {
  public chart: Chart | null;
  private chartData: any;
  @Input() incomes!: number;
  @Input() expenses!: number;

  constructor() {
    this.chart = null;
  }

  ngOnInit() {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['incomes'] || changes['expenses']) {
      this.updateChart();
    }
  }

  updateChart() {
    this.chartData = {
      labels: ['Ingresos', 'Egresos'],
      datasets: [
        {
          data: [this.incomes, this.expenses],
          backgroundColor: ['#2dd36f', '#eb445a'],
          hoverOffset: 4
        },
      ],
    };

    if (this.chart) {
      this.chart.data = this.chartData;
      this.chart.update();
    } else {
      this.createChart();
    }
  }

  createChart() {
    const canvas = document.getElementById('doughnut-chart') as HTMLCanvasElement;

    this.chart = new (Chart as any)(canvas, {
      type: 'doughnut',
      data: this.chartData,
      options: {
        responsive: true,
      },
    });
  }
}
