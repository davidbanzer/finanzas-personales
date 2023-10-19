import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController } from '@ionic/angular';
import { AccountsService } from 'src/app/api/accounts.service';
import { MovementsService } from 'src/app/api/movements.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  {
  date: string;
  totalBalance: number;
  accountsList: any[];
  movementsList: any[];

  constructor(
    private menuCtrl: MenuController,
    private accountsService: AccountsService,
    private movementsService: MovementsService,
    private loadingService: LoadingService
  ) {
    this.totalBalance = 0;
    this.accountsList = [];
    this.movementsList = [];
    this.date = new Date().toISOString();
  }


  ionViewDidEnter() {
    this.listAccounts();
    this.listMovements();
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  // Listar cuentas
  async listAccounts() {
    await this.loadingService.presentLoading('Cargando...');

    const user = JSON.parse(localStorage.getItem('user')!);
    this.accountsService.getAccountsByUserId(user.id).subscribe({
      next: (response: any) => this.handleListAccountsSuccess(response),
      error: (error: any) => this.handleListAccountsError(error),

    });
  }
  async handleListAccountsSuccess(response: any) {
    this.accountsList = response;
    this.totalBalance = 0;

    // Iterate through accounts and get balances
    for (const account of this.accountsList) {
      this.getBalanceForAccount(account.id);
    }
    await this.loadingService.dismissLoading();
  }

  async handleListAccountsError(error: any) {
    await this.loadingService.dismissLoading();
    console.log(error);
  }

  // Obtener balance por cuentas
  async getBalanceForAccount(accountId: string) {
    this.accountsService.getBalanceByAccountId(accountId).subscribe({
      next: (balanceResponse: any) => this.handleBalanceSuccess(balanceResponse, accountId),
      error: (error: any) => this.handleBalanceError(error),
    });
  }
  async handleBalanceSuccess(balanceResponse: any, accountId: string) {
    // Find the corresponding account in accountsList and update its balance field
    const accountToUpdate = this.accountsList.find(account => account.id === accountId);
    if (accountToUpdate) {
      accountToUpdate.balance = balanceResponse; // Actualizar con el valor del balance
      this.totalBalance += balanceResponse; // Actualizar el total
    }
  }
  async handleBalanceError(error: any) {
    console.log(error)
  }

  // Obtener movimientos
  async listMovements(){
    const user = JSON.parse(localStorage.getItem('user')!);
    // Parsear fecha a formado MM/yyyy
    const date = new Date(this.date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthString = month < 10 ? `0${month}` : `${month}`;
    const dateString = `${monthString}/${year}`;
    
    this.movementsService.getMovementsByDate(user.id, dateString).subscribe({
      next: (response: any) => this.handleListMovementsSuccess(response),
      error: (error: any) => this.handleListMovementsError(error),
    });
  }

  handleListMovementsSuccess(response: any): void {
    this.movementsList = response;
  }
  handleListMovementsError(error: any): void {
    console.log(error);
  }

  getCardColorClass(movementType: string): string {
    if (movementType === 'I') {
      return 'ion-color-success'; // Clase de color verde
    } else if (movementType === 'E') {
      return 'ion-color-danger'; // Clase de color rojo
    } else {
      return ''; // Clase predeterminada si no es "I" ni "E"
    }
  }

  changeDate() {
    this.listMovements();
  }
}
