import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MovementsPageRoutingModule } from './movements-routing.module';

import { MovementsPage } from './movements.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MovementsPageRoutingModule
  ],
  declarations: [MovementsPage]
})
export class MovementsPageModule {}
