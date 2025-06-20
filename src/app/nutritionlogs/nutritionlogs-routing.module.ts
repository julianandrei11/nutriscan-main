import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NutritionlogsPage } from './nutritionlogs.page';

const routes: Routes = [
  {
    path: '',
    component: NutritionlogsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NutritionlogsPageRoutingModule {}
