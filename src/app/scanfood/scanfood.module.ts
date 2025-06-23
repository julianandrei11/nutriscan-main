import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ Add this

import { ScanfoodPage } from './scanfood.page';

@NgModule({
  declarations: [ScanfoodPage],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule, // ✅ Required for [(ngModel)]
    RouterModule.forChild([{ path: '', component: ScanfoodPage }])
  ]
})
export class ScanfoodPageModule {}
