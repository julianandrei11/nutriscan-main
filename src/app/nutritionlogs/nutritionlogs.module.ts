import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NutritionlogsPageRoutingModule } from './nutritionlogs-routing.module';

import { NutritionlogsPage } from './nutritionlogs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NutritionlogsPageRoutingModule
  ],
  declarations: [NutritionlogsPage]
})
export class NutritionlogsPageModule {}
