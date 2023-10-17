import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { IonicModule } from '@ionic/angular';
import { RouterLinkWithHref } from '@angular/router';



@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterLinkWithHref 
  ],
  exports: [
    MenuComponent
  ]
})
export class ComponentsModule { }
