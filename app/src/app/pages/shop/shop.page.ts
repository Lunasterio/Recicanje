import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { itemShop } from 'src/app/models/itemShop.model';
import { AlertController, NavController } from '@ionic/angular';  
import QRCode from 'qrcode';
import { Database, ref, set, get, update } from '@angular/fire/database';
import { AuthService } from 'src/app/services/auth-user.service';


@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  private db = inject(Database); 
  itemsShop: itemShop[] = [
    {
      uid: '1',
      name: 'cafe',
      stock: 5,
      imageUrl: 'https://tofuu.getjusto.com/orioneat-local/resized2/PnS4KYYj75HL5co8A-1200-1200.webp',
      price: 200,
    },
    {
      uid: '2',
      name: 'dona',
      stock: 5,
      imageUrl: 'https://buenprovecho.hn/wp-content/uploads/2019/06/iStock-624745020-1.jpg',
      price: 400
    },
    {
      uid: '3',
      name: 'empanada',
      stock: 5,
      imageUrl: 'https://lanuevamendez.cl/wp-content/uploads/2021/06/IMG_0153.jpeg',
      price: 500
    },
    {
      uid: '4',
      name: 'muffin',
      stock: 5,
      imageUrl: 'https://bakingwithbutter.com/wp-content/uploads/2022/08/6-blueberry-muffins-1-720x720.jpg',
      price: 300
    },
    {
      uid: '5',
      name: 'medialuna',
      stock: 5,
      imageUrl: 'https://assets.elgourmet.com/wp-content/uploads/2011/09/shutterstock_1366373012-1024x683.jpg.webp',
      price: 500
    },
    {
      uid: '6',
      name: 'hallula',
      stock: 5,
      imageUrl: 'https://dailyfresh.cl/cdn/shop/files/hallullajamonqueso.jpg?v=1700499925&width=1445',
      price: 600
    }
  ];

  
            
            
  money: number = 0;
  // qrCodeData: string = '';
  qrCodeData: string | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private alertController: AlertController, 
    private navCtrl: NavController,
    private fAuth: AuthService,
  ) {}

  
  ngOnInit() {

    this.loadUserMoney(); // Cargar los puntos del usuario al iniciar la página

  }

  async loadUserMoney() {
    try {
      const user = await this.fAuth.getCurrentUser();
      if (user) {
        const userRef = ref(this.db, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          this.money = userData.coins || 0; // Asigna los puntos a la variable `money`
          console.log(`Puntos cargados: ${this.money}`);
        } else {
          console.error('No se encontraron datos para el usuario.');
        }
      } else {
        console.error('Usuario no autenticado.');
      }
    } catch (error) {
      console.error('Error al cargar los puntos del usuario:', error);
    }
  }

  async confirmarCompra(precio: number, productId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmación de compra',
      message: `¿Estás seguro de que deseas comprar este producto por ${precio} puntos?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Compra cancelada.');
          }
        },
        {
          text: 'Comprar',
          handler: () => {
            this.Comprar(precio, productId); // se agrego el productId para saber que producto esta comprando el usuario
            alert.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

  async Comprar(precio: number, productId: string) {
    const item = this.itemsShop.find(item => item.uid === productId);
    if (item && this.money >= precio && item.stock > 0) {
      const user = await this.fAuth.getCurrentUser();
      if (!user) {
        console.error('Usuario no autenticado.');
        return;
      }

      // Deduce el precio de los puntos del usuario
      this.money -= precio;
      item.stock -= 1;

      // Actualizar puntos del usuario en la base de datos
      const userRef = ref(this.db, `users/${user.uid}`);
      try {
        await update(userRef, { coins: this.money });
        console.log(`Puntos actualizados: ${this.money}`);
      } catch (error) {
        console.error('Error al actualizar los puntos:', error);
      }

      // Generar código QR
      const date = new Date().toISOString();
      const data = {
        date: date,
        id: productId,
        unit: 1
      };
      const qrCodeUrl = await this.generateQRCode(JSON.stringify(data));
      const qrAlert = await this.alertController.create({
        header: 'Código QR',
        message: `<img src="${qrCodeUrl}" alt="photo" />`,
        buttons: ['OK']
      });
      await qrAlert.present();
    } else {
      const qrAlert = await this.alertController.create({
        header: 'Error',
        message: `No tienes suficientes puntos para canjear este producto o el producto no está disponible.`,
        buttons: ['OK']
      });
      await qrAlert.present();
      console.log("No tienes suficientes puntos para canjear este producto o el producto no está disponible.");
    }
  }

  generateQRCode(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(data, (err: Error | null, url: string | undefined) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(url || '');
        }
      });
    });
  }
  goHome(){
    this.navCtrl.navigateBack('/home');
  }

}
