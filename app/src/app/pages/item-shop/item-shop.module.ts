import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemShopPageRoutingModule } from './item-shop-routing.module';

import { ItemShopPage } from './item-shop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemShopPageRoutingModule
  ],
  declarations: [ItemShopPage]
})
export class ItemShopPageModule {}
