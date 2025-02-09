import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-item-shop',
  templateUrl: './item-shop.page.html',
  styleUrls: ['./item-shop.page.scss'],
})
export class ItemShopPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }
  goHome(){
    this.navCtrl.navigateBack('/home');
  }
}
