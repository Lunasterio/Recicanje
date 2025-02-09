import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth-user.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  userDisplayName: string = "";

  constructor(private navCtrl: NavController, private toastController: ToastController, private fAuth: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.cdr.detectChanges();
  }

  async MensajeLogin(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,  
      position: 'top', 
      color: color    
    });
    toast.present();
  }

  ActName(){
    if(this.userDisplayName.trim() == ""){
      this.MensajeLogin('Debes ingresar un nombre para continuar','danger');
    }
    else if(this.userDisplayName.length > 15){
      this.MensajeLogin('Maximo de 15 Caracteres','danger');
    }
    else{
      // Obtener el usuario actual desde AuthService para actualizarlo
      const UserId: string = this.fAuth.getLocalStorageItem('uid') as string; // Asumiendo que tienes una forma de obtener el usuario actual
      this.cdr.detectChanges();
      this.fAuth.updateName(this.userDisplayName)
      this.navCtrl.navigateForward('/home');
      this.cdr.detectChanges();
    }
  }

  Cierre(){
    this.fAuth.destoyLocalStorageItem('uid');
    this.navCtrl.navigateForward('/login');
  }
  goHome(){
    this.navCtrl.navigateBack('/home');
  }
}
