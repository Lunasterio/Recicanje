import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Database, ref, set, get, update } from '@angular/fire/database';
import { AuthService } from 'src/app/services/auth-user.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {
  private db = inject(Database); 

  ResName = "";
  ResType = "";
  ResTypes: string[] = ['Plastico', 'Papel & Carton', 'Metal', "Organico"];
  selectedImage: string | null = null; 

  constructor(
    private fAuth: AuthService,
    private navCtrl: NavController,
    private toastController: ToastController
   ) { }

  ngOnInit() {
    this.fAuth.getCurrentUser()
    .then(user => {
      if (user === null) {
        this.Notificacion('Debes estar logeado para escanear residuos', 'danger');
      }
    })
    .catch(error => {
      console.error('Error al obtener el usuario actual:', error);
    });
  }

  async Notificacion(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,  
      position: 'top', 
      color: color    
    });
    toast.present();
  }

  onImageSelected(imageBase64: string) {
    console.log(imageBase64);
    this.selectedImage = imageBase64; 
  }

  sendData() {
    console.log('Enviar datos:', this.ResName, this.ResType, this.selectedImage); 
    console.log();
    this.fAuth.getCurrentUser()
    .then(user => {
      if (this.ResName && this.ResType && this.selectedImage) {
        const data = {
          UserId: user.uid,
          ResName: this.ResName,
          ResType: this.ResType,
          ImageUrl: this.selectedImage
        };
    
        const dbRef = ref(this.db, 'residuos/' + Date.now());
        const userRef = ref(this.db, 'users/' + user.uid);
        
        //Guardar residuo en BD
        set(dbRef, data)
          .then(() => {
            console.log('Datos enviados a Firebase');
            this.navCtrl.navigateForward('/home');
          })
          .catch(error => {
            console.error('Error al enviar los datos a Firebase:', error);
            this.Notificacion('Error al guardar el residuo, intente nuevamente', 'danger');
          });

          //Cargar puntos al usuario
          get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              const currentPoints = userData.coins || 0;
              let newPoints = 0;
              //Puntaje por tipo de residuo
              if(this.ResType == 'Plastico' || this.ResType == 'Papel & Carton'){
                newPoints = currentPoints + 10;
              }
              else if(this.ResType == 'Metal'){
                newPoints = currentPoints + 20;
              }
              else if(this.ResType == 'Organico'){
                newPoints = currentPoints + 5;
              } else {
                newPoints = currentPoints;
              }
              //Update a la BD
              update(userRef, {coins: newPoints })
              .then(() => {
                console.log('Points: ', currentPoints, ' Coins: ', newPoints)
                console.log('Puntos añadidos correctamente')
                this.ResName = '';
                this.ResType = '';
                this.selectedImage = null;
                this.Notificacion('Felicidades! ahora tienes ' + newPoints, 'success');
              })
              .catch((error) => {
                console.error('Error al sumar los puntos: ', error);
              });
            } else {
              console.log('No hay datos disponibles');
            }
          })
          .catch((error) => {
            console.error('Error al obtener datos: ', error);
          });
      } else {
        console.error('Por favor completa todos los campos antes de enviar.');
        this.Notificacion('Por favor completa todos los campos antes de enviar', 'danger');
      }
    })
    .catch(error => {
      console.error('Error al obtener el usuario actual:', error);
    });
    
  }

  goHome() {
    this.navCtrl.navigateForward('/home');
  }
}
