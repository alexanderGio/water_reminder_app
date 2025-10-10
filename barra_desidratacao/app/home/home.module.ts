import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HttpClientModule
  ],
})
export class HomePageModule {}
