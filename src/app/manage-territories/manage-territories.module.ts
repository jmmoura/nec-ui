import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ManageTerritoriesPageRoutingModule } from './manage-territories-routing.module';
import { ManageTerritoriesPage } from './manage-territories.page';
import { DateOrderDirective } from '../shared/validators/date-order.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageTerritoriesPageRoutingModule
  ],
  declarations: [
    ManageTerritoriesPage,
    DateOrderDirective
  ],
  exports: [
    DateOrderDirective
  ]
})
export class ManageTerritoriesPageModule {}