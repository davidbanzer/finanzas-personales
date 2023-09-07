import { Component, Input, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss'],
})
export class DoughnutChartComponent implements OnInit {
  public chart: Chart | null;
  private chartData: any;
  @Input() data!: number[];

  constructor() {
    this.chart = null;
    this.chartData = {
      labels: ['Ingresos', 'Egresos'],
      datasets: [
        {
          data: [3000, 1500], // Valores de ingresos y egresos
          backgroundColor: ['#2dd36f', '#eb445a'], // Colores de las secciones de la dona
          hoverOffset: 4
        },
      ],
    };
  }

  ngOnInit() {
    this.createChart();
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy(); // Destruye el gráfico existente si hay uno
    }

    const canvas = document.getElementById('doughnut-chart') as HTMLCanvasElement;

    this.chart = new  (Chart as any)(canvas, {
      type: 'doughnut',
      data: this.chartData,
      options: {
        responsive: true,
      },
    });
  }
}
