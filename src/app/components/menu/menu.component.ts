import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  menuItems: any;

  constructor(private menuCtrl: MenuController) {
    this.menuItems = [
      {
        text: 'Inicio',
        route: '/home',
        icon: 'home-outline'
      },
      {
        text: 'Cuentas',
        route: '/accounts',
        icon: 'wallet-outline'
      },
      {
        text: 'Categorías',
        route: '/categories',
        icon: 'pricetags-outline'
      },
      {
        text: 'Movimientos',
        route: '/movements',
        icon: 'swap-vertical-outline'
      },
      {
        text: 'Transferencias',
        route: '/transfers',
        icon: 'swap-horizontal-outline'
      },
      {
        text: 'Cerrar Sesión',
        route: '/login',
        icon: 'log-out-outline'
      }
    ]
  }

  ngOnInit() { }

  toggleMenu(event: any) {
    this.menuCtrl.toggle();

    if (event.target.textContent === 'Cerrar Sesión') {
      this.logOut();
    }
  }

  logOut() {
    localStorage.removeItem('user');
  }
}
