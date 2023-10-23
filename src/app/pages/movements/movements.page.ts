import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { AccountsService } from 'src/app/api/accounts.service';
import { CategoriesService } from 'src/app/api/categories.service';
import { MovementsService } from 'src/app/api/movements.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.page.html',
  styleUrls: ['./movements.page.scss'],
})
export class MovementsPage implements OnInit {
  @ViewChild('addModal') addMovementModal!: any;
  movementsList: any[];
  movementsListFiltered: any[];
  accountsList: any[];
  categoriesList: any[];
  selectedCriterion: string;
  movementForm: FormGroup;

  constructor(
    private menuCtrl: MenuController,
    private loadingService: LoadingService,
    private movementsService: MovementsService,
    private categoriesService: CategoriesService,
    private accountsService: AccountsService,
    private formBuilder: FormBuilder
  ) {
    this.movementsList = [];
    this.movementsListFiltered = [];
    this.accountsList = [];
    this.categoriesList = [];
    this.selectedCriterion = '';
    this.movementForm = this.formBuilder.group({
      description: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      type: ['', [Validators.required]],
      createdDate: [new Date().toISOString(), [Validators.required]],
      categoryId: ['', [Validators.required]],
      accountId: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.listMovements();
    this.getAccountsByUserId();
    this.getCategoriesByUserId();
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  // Listar movimientos
  listMovements() {
    this.loadingService.presentLoading('Cargando movimientos...');
    const user = JSON.parse(localStorage.getItem('user')!);
    this.movementsService.getMovementsByUserId(user.id).subscribe({
      next: (response: any) => this.handleListMovementsSuccess(response),
      error: (error: any) => this.handleListMovementsError(error)
    });

  }
  handleListMovementsError(error: any): void {
    this.loadingService.dismissLoading();
    console.log(error);
  }
  handleListMovementsSuccess(response: any): void {
    this.movementsList = response;

    this.movementsList.forEach((movement: any) => {
      this.getCategoryForMovement(movement);
      this.getAccountForMovement(movement);
    });

    this.movementsListFiltered = this.movementsList;
    this.loadingService.dismissLoading();
  }

  getCategoryForMovement(movement: any) {
    this.categoriesService.getCategoryById(movement.categoryId).subscribe({
      next: (response: any) => this.handleGetCategoryForMovementSuccess(response, movement),
      error: (error: any) => this.handleGetCategoryForMovementError(error)
    });
  }
  handleGetCategoryForMovementError(error: any): void {
    console.log(error);
  }
  handleGetCategoryForMovementSuccess(response: any, movement: any): void {
    movement.category = response.name;
  }

  getAccountForMovement(movement: any){
    this.accountsService.getAccountById(movement.accountId).subscribe({
      next: (response: any) => this.handleGetAccountForMovementSuccess(response, movement),
      error: (error: any) => this.handleGetAccountForMovementError(error)
    });
  }
  handleGetAccountForMovementError(error: any): void {
    console.log(error);
  }
  handleGetAccountForMovementSuccess(response: any, movement: any): void {
    movement.account = response.name;
  }

  // Obtener cuentas del usuario
  getAccountsByUserId() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.accountsService.getAccountsByUserId(user.id).subscribe({
      next: (response: any) => this.handleGetAccountsByUserIdSuccess(response),
      error: (error: any) => this.handleGetAccountsByUserIdError(error)
    });
  }
  handleGetAccountsByUserIdError(error: any): void {
    console.log(error)
  }
  handleGetAccountsByUserIdSuccess(response: any): void {
    this.accountsList = response;
  }

  // Obtener categorias del usuario
  getCategoriesByUserId() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.categoriesService.getCategoriesByUserId(user.id).subscribe({
      next: (response: any) => this.handleGetCategoriesByUserIdSuccess(response),
      error: (error: any) => this.handleGetCategoriesByUserIdError(error)
    });
  }
  handleGetCategoriesByUserIdError(error: any): void {
    console.log(error);
  }
  handleGetCategoriesByUserIdSuccess(response: any): void {
    this.categoriesList = response;
  }

  // Agregar movimiento
  addMovement(){
    if(this.movementForm.valid){
      this.loadingService.presentLoading('Agregando movimiento...');
      const formValues = this.movementForm.value;
      
      this.movementsService.addMovement(formValues).subscribe({
        next: (response: any) => this.handleAddMovementSuccess(response),
        error: (error: any) => this.handleAddMovementError(error)
      });
    }
  }
  handleAddMovementError(error: any): void {
    this.loadingService.dismissLoading();
    console.log(error);
  }
  handleAddMovementSuccess(response: any): void {
    this.loadingService.dismissLoading();
    this.addMovementModal.dismiss();
    this.listMovements();
    this.movementForm.reset();
  }

  changeDate(event: Event){
    this.movementForm.controls['createdDate'].setValue((event.target as HTMLInputElement).value);
  }

  cancelModal(){
    this.addMovementModal.dismiss();
  }

  // Buscador
  selectCriterion(event: Event) {
    this.selectedCriterion =  (event.target as HTMLInputElement).value.toLowerCase();
    this.movementsListFiltered = this.movementsList;

  }
  
  search(event: Event) {
    let query = (event.target as HTMLInputElement).value.toLowerCase();

    this.movementsListFiltered = this.movementsList.filter((movement: any) => {
      if (this.selectedCriterion === 'description') {
        return movement.description.toLowerCase().includes(query);
      } else if (this.selectedCriterion === 'category') {
        return movement.categoryId.toLowerCase().includes(query);
      } else if (this.selectedCriterion === 'date') {
        query = query.split('t')[0];
        return movement.createdDate.split('T')[0].toLowerCase().includes(query);
      } else if (this.selectedCriterion === 'type') {
        return movement.type.toLowerCase().includes(query);
      } else if(this.selectedCriterion === 'account'){
        return movement.accountId.toLowerCase().includes(query);
      }
    });
  }

  clearFilters(){
    this.movementsListFiltered = this.movementsList;
    this.selectedCriterion = '';
  }

  
}
