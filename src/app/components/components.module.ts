import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { MenuComponent } from './menu/menu.component';
import { IonicModule } from '@ionic/angular';
import { RouterLinkWithHref } from '@angular/router';



@NgModule({
  declarations: [DoughnutChartComponent, MenuComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterLinkWithHref 
  ],
  exports: [
    DoughnutChartComponent,
    MenuComponent
  ]
})
export class ComponentsModule { }
