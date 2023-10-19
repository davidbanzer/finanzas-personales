import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonModal, MenuController } from '@ionic/angular';
import { AccountsService } from 'src/app/api/accounts.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss'],
})
export class AccountsPage implements OnInit {
  @ViewChild('addModal') modal!: IonModal;
  accountsList: any[];
  accountForm: FormGroup;

  constructor(
    private menuCtrl: MenuController,
    private accountsService: AccountsService,
    private loadingService: LoadingService,
    private formBuilder: FormBuilder
  ) {
    this.accountsList = [];
    this.accountForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      initialBalance: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.listAccounts();
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  listAccounts() {
    this.loadingService.presentLoading('Cargando...');
    const user = JSON.parse(localStorage.getItem('user')!);
    this.accountsService.getAccountsByUserId(user.id).subscribe({
      next: (response: any) => this.handleListAccountsSuccess(response),
      error: (error: any) => this.handleListAccountsError(error)
    });
  }
  async handleListAccountsError(error: any) {
    this.loadingService.dismissLoading();
    console.log(error);
  }
  async handleListAccountsSuccess(response: any) {
    this.accountsList = response;

    for (const account of this.accountsList) {
      this.getBalanceForAccount(account.id);
    }

    console.log(this.accountsList);
    await this.loadingService.dismissLoading();
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
    }
  }
  async handleBalanceError(error: any) {
    console.log(error)
  }
  
  // Agregar cuenta
  addAccount(){
    if(this.accountForm.valid){
      this.loadingService.presentLoading('Agregando cuenta...');
      const formValues = this.accountForm.value;
      const user = JSON.parse(localStorage.getItem('user')!);
      
      this.accountsService.addAccount(user.id, formValues).subscribe({
        next: (response: any) => this.handleAddAccountSuccess(response),
        error: (error: any) => this.handleAddAccountError(error)
      });
    }
  }
  handleAddAccountError(error: any): void {
    this.loadingService.dismissLoading();
    console.log(error);
  }
  handleAddAccountSuccess(response: any): void {
    this.loadingService.dismissLoading();
    this.accountForm.reset();
    this.listAccounts();
    this.modal.dismiss();
  }

  cancelModal(){
    this.modal.dismiss();
  }

  // Eliminar cuenta
  deleteAccount(id: string){
    this.loadingService.presentLoading('Eliminando cuenta...');
    this.accountsService.deleteAccount(id).subscribe({
      next: (response: any) => this.handleDeleteAccountSuccess(response),
      error: (error: any) => this.handleDeleteAccountError(error)
    });
  }
  handleDeleteAccountError(error: any): void {
    this.loadingService.dismissLoading();
    console.log(error);
  }
  handleDeleteAccountSuccess(response: any): void {
    this.loadingService.dismissLoading();
    this.listAccounts();
  }

  // Editar cuenta
  openEditModal(account: any){
    console.log(account);
  }

}
