import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScanfoodPage } from './scanfood.page';

const routes: Routes = [
  {
    path: '',
    component: ScanfoodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanfoodPageRoutingModule {}
