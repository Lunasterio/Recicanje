import { Component, OnInit } from '@angular/core';
import { homeBtn } from 'src/app/models/homeBtn.model';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth-user.service';
import { ChangeDetectorRef, NgZone } from '@angular/core';
import { user } from '@angular/fire/auth';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  displayName: string = 'Usuario'; // Inicializar como cadena vacía

  constructor(private navCtrl: NavController, private afAuth: AuthService, private cdr: ChangeDetectorRef, private ngZone: NgZone ) { }

  homeBtns: homeBtn[] = [
    {
      id: '1',
      title: 'Shop',
      name: 'Tienda', 
      action: () => this.goShop(),
      imageUrl: '../../../assets/icon/Tienda.png',
      status: 'Enable',
      class: 'shop-btn',
    },
    {
      id: '2',
      title: 'Info',
      name: 'Informacion',
      action: () => this.goInfo(),
      imageUrl: '../../../assets/icon/Info.png',
      status: 'Enable',
      class: 'info-btn',
    }
  ];

  

  ngOnInit() {
    this.loadUserDisplayName(); // Cargar el nombre de usuario
  }

  async loadUserDisplayName() {
    try {
      const user = await this.afAuth.getCurrentUser();
      if (user) {
        await user.reload(); // Asegurarse de obtener datos actualizados
        this.ngZone.run(() => {
          this.displayName = user.displayName || 'Usuario';
        });
      } else {
        this.navCtrl.navigateForward('/login');
      }
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
    }
  }

  goShop(){
    this.navCtrl.navigateForward('/shop');
  }
  goInfo(){
    this.navCtrl.navigateForward('/app-info');
  }
  navToScan(){    
    this.navCtrl.navigateForward('/scan');
  }
  navToProfile(){
    this.navCtrl.navigateForward('/user-profile')
  }
}
