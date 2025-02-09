import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopPageRoutingModule } from './shop-routing.module';

import { ShopPage } from './shop.page';
import { SharedModule } from "../../components/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot({
      innerHTMLTemplatesEnabled: true
    }),
    ShopPageRoutingModule,
    SharedModule,
],
  declarations: [ShopPage]
})
export class ShopPageModule {}
