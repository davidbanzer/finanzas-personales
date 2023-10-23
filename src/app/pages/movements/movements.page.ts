import { Component, OnInit } from '@angular/core';
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
  movementsList: any[];
  movementsListFiltered: any[];
  accountsList: any[];
  selectedCriterion: string;

  constructor(
    private menuCtrl: MenuController,
    private loadingService: LoadingService,
    private movementsService: MovementsService,
    private categoriesService: CategoriesService,
    private accountsService: AccountsService
  ) {
    this.movementsList = [];
    this.movementsListFiltered = [];
    this.accountsList = [];
    this.selectedCriterion = '';
  }

  ngOnInit() {
    this.listMovements();
    this.getAccountsByUserId();
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
        return movement.category.toLowerCase().includes(query);
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
