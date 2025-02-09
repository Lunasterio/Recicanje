import { HomeBtnComponent } from '../home-btn/home-btn.component';
import { ItemShopComponent } from '../item-shop/item-shop.component';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [HomeBtnComponent,ItemShopComponent, ImageUploaderComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [HomeBtnComponent,ItemShopComponent, ImageUploaderComponent]
})
export class SharedModule { }
