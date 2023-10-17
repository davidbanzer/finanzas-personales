import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController } from '@ionic/angular';
import { AccountsService } from 'src/app/api/accounts.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  ingresos;
  egresos;

  accountsList: any[];

  constructor(
    private menuCtrl: MenuController,
    private accountsService: AccountsService,
    private loadingCtrl: LoadingController
  ) {
    this.ingresos = 0;
    this.egresos = 0;
    this.accountsList = [];
  }

  ngOnInit() {
    this.listAccounts();
  }
  toggleMenu() {
    this.menuCtrl.toggle();
  }

  async listAccounts() {
    await this.loadingCtrl.create({
      message: 'Cargando ...'
    }).then(loading => loading.present());

    const user = JSON.parse(localStorage.getItem('user')!);
    this.accountsService.getAccountsByUserId(user.id).subscribe({
      next: (response: any) => this.handleListAccountsSuccess(response),
      error: (error: any) => this.handleListAccountsError(error),

    });
  }
  async handleListAccountsSuccess(response: any) {
    await this.loadingCtrl.dismiss();
    this.accountsList = response;
    console.log(this.accountsList);
  }

  async handleListAccountsError(error: any) {
    await this.loadingCtrl.dismiss();
    console.log(error);
  }

}
