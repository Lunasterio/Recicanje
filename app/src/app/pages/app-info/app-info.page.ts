import { User } from 'src/app/models/user.model';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Database, ref, get, child } from '@angular/fire/database';
import { inject } from '@angular/core';
import { compileNgModule } from '@angular/compiler';
import { AuthService } from 'src/app/services/auth-user.service';
import { user } from '@angular/fire/auth';
import { Residuo } from 'src/app/models/residuo.model';

@Component({
  selector: 'app-app-info',
  templateUrl: './app-info.page.html',
  styleUrls: ['./app-info.page.scss'],
})
export class AppInfoPage implements OnInit {
  private db: Database = inject(Database);
  public residuos: Residuo[] = [];

  constructor(private navCtrl: NavController, private fAuth: AuthService) { }

  ngOnInit() {
    this.fetchResiduos();
  }

  fetchResiduos() {
    const residuosRef = ref(this.db, 'residuos/'); 

    get(residuosRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.residuos = []; // se vacia la lista para cargarla con la base de datos segun uid del user
          let b = Object.keys(snapshot.val()).map(key => snapshot.val()[key]); //lista completa de los residuos
          //Filtro por uid del user, asi solo se carga lo que el usuario ha escaneado
          for (let index = 0; index < b.length; index++) {
            const element = b[index];
           if (element.UserId == this.obtenerUser()) {
              this.residuos.push(element);
              console.log(this.residuos);
            }
          }         
        } else {
          console.log('No hay datos disponibles');
        }
      })
      .catch((error) => {
        console.error('Error al obtener datos: ', error);
      });
  }
  obtenerUser(): any{
    return this.fAuth.getLocalStorageItem('uid');
  }

  goHome(){
    this.navCtrl.navigateForward('/home'); 
  }
}

