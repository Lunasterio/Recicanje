import { User } from './../../models/user.model';
import { AuthService } from './../../services/auth-user.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = '';
  pass: string = '';

  constructor(private navCtrl: NavController, private toastController: ToastController, private AuthService: AuthService) { }

  ngOnInit() {
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

  VaLogin() {
    const isLogged = this.AuthService.login(this.email, this.pass);

    isLogged.then(() => {
      this.MensajeLogin('Inicio de sesion correcto', 'success');
      setTimeout(() => {
        this.navCtrl.navigateForward('/home');
      }, 1500);
    } )
    .catch(() => {
      this.MensajeLogin('Inicio de sesion incorrecto', 'danger');
    })
  }

  VaRegister() {
    const newUser: User = {
      name: '',
      email: this.email,
      password: this.pass
    };
    const isRegistered = this.AuthService.register(newUser); // Llamar al método de instancia
    isRegistered.then((result) => {
      this.MensajeLogin('Registro exitoso', 'success');
      setTimeout(() => {
        this.navCtrl.navigateForward('/home');
      }, 1500);
      // console.log(this.AuthService.users)
    })
    .catch((error) => {
      this.MensajeLogin('El usuario ya existe', 'danger');
    })
  }
}
