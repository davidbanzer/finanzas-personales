import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController, ToastController } from '@ionic/angular';
import { AccountsService } from 'src/app/api/accounts.service';
import { CategoriesService } from 'src/app/api/categories.service';
import { TransfersService } from 'src/app/api/transfers.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.page.html',
  styleUrls: ['./transfers.page.scss'],
})
export class TransfersPage implements OnInit {
  @ViewChild('addModal') addTransferModal!: any;
  transferForm: FormGroup;
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
  }

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
    console.log(this.categoriesList);
  }

  handleListCategoriesError(error: any): void {
    console.log(error);
  }
}
