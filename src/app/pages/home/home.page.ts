import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public ingresos;
  public egresos;

  constructor(private menuCtrl: MenuController) { 
    this.ingresos = 4324;
    this.egresos = 5435;
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }
}
