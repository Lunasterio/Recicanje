import { Component, Input, OnInit } from '@angular/core';
import { homeBtn } from 'src/app/models/homeBtn.model';

@Component({
  selector: 'app-home-btn',
  templateUrl: './home-btn.component.html',
  styleUrls: ['./home-btn.component.scss'],
})
export class HomeBtnComponent  implements OnInit {

  @Input() homeBtn?: homeBtn; //crea objeto boton en el home

  constructor() { }

  

  ngOnInit() {}

}
