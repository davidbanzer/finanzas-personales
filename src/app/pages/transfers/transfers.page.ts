import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController, ToastController } from '@ionic/angular';
import { AccountsService } from 'src/app/api/accounts.service';
import { CategoriesService } from 'src/app/api/categories.service';
import { TransfersService } from 'src/app/api/transfers.service';
import { LoadingService } from 'src/app/services/loading.service';
import { TransfersPageModule } from './transfers.module';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.page.html',
  styleUrls: ['./transfers.page.scss'],
})
export class TransfersPage implements OnInit {
  @ViewChild('addModal') addTransferModal!: any;
  transferForm: FormGroup;
  transfersList: any[];
  accountsList: any[];
  categoriesList: any[];
  maxDate: string;

  constructor(
    private menuCtrl: MenuController,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private accountsService: AccountsService,
    private transfersService: TransfersService,
    private toastController: ToastController,
    private categoriesService: CategoriesService
  ) {
    this.transfersList = [];
    this.accountsList = [];
    this.categoriesList = [];
    this.maxDate = new Date().toISOString();
    this.transferForm = this.formBuilder.group({
      description: ['', Validators.required],
      amount: ['', Validators.required],
      originAccountId: ['', Validators.required],
      destinationAccountId: ['', Validators.required],
      categoryId: ['', Validators.required],
      createdDate: [this.maxDate, Validators.required]
    });
  }

  ngOnInit() {
    this.listTransfers();
    this.listAccounts();
    this.listCategories();
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  cancelModal() {
    this.transferForm.reset();
    this.addTransferModal.dismiss();
  }

  openModal() {
    this.addTransferModal.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  // Agregar transferencia
  addTransfer() {
    if (this.transferForm.valid) {

      if (this.transferForm.value.originAccountId === this.transferForm.value.destinationAccountId) {
        this.presentToast('La cuenta de origen y destino no pueden ser iguales');
        return;
      }

      this.loadingService.presentLoading('Agregando transferencia...');
      const formValues = this.transferForm.value;

      this.transfersService.addTransfer(formValues).subscribe({
        next: (response: any) => this.handleAddTransferSuccess(response),
        error: (error: any) => this.handleAddTransferError(error)
      });
    }
  }
  handleAddTransferError(error: any): void {
    this.loadingService.dismissLoading();
    console.log(error);
  }
  handleAddTransferSuccess(response: any): void {
    this.loadingService.dismissLoading();
    this.transferForm.reset();
    this.addTransferModal.dismiss();
    this.listTransfers();
  }

  // Listar transferncias
  listTransfers() {
    this.loadingService.presentLoading('Cargando transferencias...');
    const user = JSON.parse(localStorage.getItem('user')!);
    this.transfersService.getTransfersByUserId(user.id).subscribe({
      next: (response: any) => this.handleListTransfersSuccess(response),
      error: (error: any) => this.handleListTransfersError(error)
    });
  }
  async handleListTransfersError(error: any): Promise<void> {
    await this.loadingService.dismissLoading();
    console.log(error);
  }
  async handleListTransfersSuccess(response: any): Promise<void> {
    this.transfersList = response;

    for (const transfer of this.transfersList) {
      this.getAccountsForTransfer(transfer);
    }

    await this.loadingService.dismissLoading();

  }

  // Listar cuentas
  listAccounts() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.accountsService.getAccountsByUserId(user.id).subscribe({
      next: (response: any) => this.handleListAccountsSuccess(response),
      error: (error: any) => this.handleListAccountsError(error)
    });
  }
  async handleListAccountsError(error: any) {
    console.log(error);
  }
  async handleListAccountsSuccess(response: any) {
    this.accountsList = response;

  }

  // Listar categorías
  listCategories() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.categoriesService.getCategoriesByUserId(user.id).subscribe({
      next: (response: any) => this.handleListCategoriesSuccess(response),
      error: (error: any) => this.handleListCategoriesError(error)
    });
  }
  handleListCategoriesSuccess(response: any): void {
    this.categoriesList = response;
  }
  handleListCategoriesError(error: any): void {
    console.log(error);
  }

  // Cuentas por id
  getAccountsForTransfer(transfer: any){
    const user = JSON.parse(localStorage.getItem('user')!);

    const originAccount = this.accountsService.getAccountById(transfer.originAccountId).subscribe({
      next: (response: any) => this.handleGetAccountsForTransferSuccess(response, transfer),
      error: (error: any) => this.handleGetAccountsForTransferError(error)
    });

    const destinationAccount = this.accountsService.getAccountById(transfer.destinationAccountId).subscribe({
      next: (response: any) => this.handleGetAccountsForTransferSuccess2(response, transfer),
      error: (error: any) => this.handleGetAccountsForTransferError(error)
    });
  }
  handleGetAccountsForTransferError(error: any): void {
    console.log(error);
  }
  handleGetAccountsForTransferSuccess(response: any, transfer: any): void {
    transfer.originAccount = response.name;
  }
  handleGetAccountsForTransferSuccess2(response: any, transfer: any): void {
    transfer.destinationAccount = response.name;
  }

  // Eliminar transferencia
  deleteTransfer(id: string){
    this.loadingService.presentLoading('Eliminando transferencia...');
    this.transfersService.deleteTransfer(id).subscribe({
      next: (response: any) => this.handleDeleteTransferSuccess(response),
      error: (error: any) => this.handleDeleteTransferError(error)
    })
  }
  handleDeleteTransferError(error: any): void {
    this.loadingService.dismissLoading();
    console.log(error);
  }
  handleDeleteTransferSuccess(response: any): void {
    this.loadingService.dismissLoading();
    this.listTransfers();
  }
}
