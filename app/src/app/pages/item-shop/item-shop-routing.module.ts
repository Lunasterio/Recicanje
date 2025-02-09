import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemShopPage } from './item-shop.page';

const routes: Routes = [
  {
    path: '',
    component: ItemShopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemShopPageRoutingModule {}
