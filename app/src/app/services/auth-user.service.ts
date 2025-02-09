import { Injectable, inject } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { Database, ref, set } from '@angular/fire/database';
import { NavController, ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth : AngularFireAuth,
    private router: Router
  ) { }
  private db = inject(Database);

  register(user: User): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        console.log('Usuario creado satisfactoriamente', result);   //usuario se crea
        const dbRef = ref(this.db, 'users/' + result.user?.uid);    //se crea el usuario en la bd
        const data = {                                              //se crea el objeto con los datos del usuario
          UserId: result.user?.uid,
          coins: 0,
          role: 'user',
        };
        set(dbRef, data)
          .then(() => {
            console.log('Datos enviados a Firebase');                //se envian los datos a la bd
          })
          .catch(error => {                                          //error al enviar los datos a la bd
            console.error('Error al enviar los datos a Firebase:', error);
          });
        this.router.navigate(['/home']);                             //redirige a la pagina home
      })
      .catch((error) => {                                            //error al crear el usuario
        console.log('Error al crear el usuario', error);
        throw error;
      });
  }

  // Iniciar sesión con Firebase
  login(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
    .then((result) => {
      console.log('Sesion iniciada satisfactoriamente', result);
      this.setLocalStorageItem('uid',result.user?.uid);
      this.setLocalStorageItem('displayName', result.user?.displayName);
      console.log('displayName: ', result.user?.displayName);
      this.router.navigate(['/home']);
    })
    .catch((error) => {
      console.log('Error al iniciar sesión', error);
      throw error;
    });
  }

  // Cerrar sesión
  logout(): Promise<any> {
    return this.afAuth.signOut()
      .then(() => {
        console.log('Sesion cerrada satisfactoriamente');
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.log('Error al cerrar sesion', error);
        throw error;
      });
  }

  // Cambio de contraseña
  resetPassword(email: string): Promise<any> {
    return this.afAuth.sendPasswordResetEmail(email)
      .then(() => {
        console.log('Se envio un correo para restablecer la contraseña');
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.log('Error al enviar correo', error);
        throw error;
      });
  }

  isLoggedIn(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => !!user)
    );
  }

  getCurrentUser(): Promise<any> {
    console.log(this.afAuth.currentUser);
    return this.afAuth.currentUser;
  }

  getLocalStorageItem = <T>(key: string): T | null => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) as T : null;
  }
  setLocalStorageItem = <T>(key: string, value: T): void => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  destoyLocalStorageItem = <T>(key: string) : void => {
    window.localStorage.removeItem(key);
  }

  updateName(displayName: string): Promise<any> {
    return this.afAuth.currentUser
      .then((user) => {
        if (user) {
          return user.updateProfile({ displayName: displayName }).then(() => {
            return user.reload(); // Recargar el usuario para obtener datos actualizados
          });
        } else {
          throw new Error('No hay un usuario autenticado.');
        }
      })
      .then(() => {
        return this.afAuth.currentUser; // Obtener al usuario actualizado
      })
      .then((updatedUser) => {
        this.setLocalStorageItem('displayName', updatedUser?.displayName || '');
        console.log('Nombre actualizado satisfactoriamente:', updatedUser?.displayName);
      })
      .catch((error) => {
        console.log('Error al actualizar el nombre', error);
        throw error;
      });
  }

}