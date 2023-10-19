import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { IonicModule } from '@ionic/angular';
import { RouterLinkWithHref } from '@angular/router';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';



@NgModule({
  declarations: [MenuComponent, DoughnutChartComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterLinkWithHref 
  ],
  exports: [
    MenuComponent,
    DoughnutChartComponent
  ]
})
export class ComponentsModule { }
