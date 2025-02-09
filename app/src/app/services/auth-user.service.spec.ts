import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './auth-user.service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let afAuthMock: any;
  let routerMock: any;

  beforeEach(() => {
    afAuthMock = {
      createUserWithEmailAndPassword: jasmine.createSpy('createUserWithEmailAndPassword'),
      signInWithEmailAndPassword: jasmine.createSpy('signInWithEmailAndPassword'),
      signOut: jasmine.createSpy('signOut'),
      authState: of(null)
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AngularFireAuth, useValue: afAuthMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('1. Se debe registrar el usuario', async () => {
    const mockUser = { email: 'test@example.com', password: '123456' };
    afAuthMock.createUserWithEmailAndPassword.and.returnValue(Promise.resolve({ user: { uid: '12345' } }));
  
    await service.register(mockUser);
  
    expect(afAuthMock.createUserWithEmailAndPassword).toHaveBeenCalledWith(mockUser.email, mockUser.password);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });
  
  it('2. Debe manejar el error', async () => {
    const mockUser = { email: 'test@example.com', password: '123456' };
    afAuthMock.createUserWithEmailAndPassword.and.returnValue(Promise.reject('Error al registrarse'));
  
    await expectAsync(service.register(mockUser)).toBeRejectedWith('Error al registrarse');
  
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
