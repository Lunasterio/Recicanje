import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, AlertController } from '@ionic/angular';
import { ShopPage } from './shop.page';
import { NavController } from '@ionic/angular';
import QRCode from 'qrcode';

describe('ShopPage', () => {
  let component: ShopPage;
  let fixture: ComponentFixture<ShopPage>;
  let alertController: AlertController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopPage],
      imports: [IonicModule.forRoot()],
      providers: [
        AlertController,
        { provide: NavController, useValue: jasmine.createSpyObj('NavController', ['navigateBack']) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopPage);
    component = fixture.componentInstance;
    alertController = TestBed.inject(AlertController);
    fixture.detectChanges();
  });

  it('3. Deberia crear notificacion de confirmacion de compra', async () => {
    spyOn(alertController, 'create').and.callThrough();
  
    await component.confirmarCompra(200, '1');
  
    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Confirmación de compra',
      message: '¿Estás seguro de que deseas comprar este producto por 200 puntos?',
      buttons: jasmine.any(Array),
    });
  });

  it('4. Se debe completar la compra y restar el saldo correctamente', async () => {

    const productId = '1';
    const product = component.itemsShop.find(item => item.uid === productId);
    const initialMoney = component.money;

    expect(product).toBeDefined();
    await component.Comprar(product!.price, productId);
    expect(component.money).toEqual(initialMoney - product!.price);
  });
});
