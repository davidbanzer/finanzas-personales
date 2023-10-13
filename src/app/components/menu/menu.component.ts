import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { MenuItem } from 'src/app/interfaces/MenuItem';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public menuItems: MenuItem[];

  constructor(private menuCtrl: MenuController) {
    this.menuItems = [
      {
        text: 'Inicio',
        route: '/home',
        icon: 'home-outline'
      },
      {
        text: 'Ingresos',
        route: '/incomes',
        icon: 'trending-up-outline'
      },
      {
        text: 'Egresos',
        route: '/expenses',
        icon: 'trending-down-outline'
      },
      {
        text: 'Transferencias',
        route: '/transfers',
        icon: 'swap-horizontal-outline'
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
        text: 'Cerrar Sesión',
        route: '/login',
        icon: 'log-out-outline'
      }
    ]
  }

  ngOnInit() { }

  toggleMenu(event: any) {
    this.menuCtrl.toggle();
    
    if(event.target.textContent === 'Cerrar Sesión'){
      this.logOut();
    }
  }

  logOut(){
    localStorage.removeItem('user');
  }
}
