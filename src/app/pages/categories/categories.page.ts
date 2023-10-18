import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonModal, MenuController } from '@ionic/angular';
import { CategoriesService } from 'src/app/api/categories.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  categoriesList: any[];
  categoryForm: FormGroup;
  

  constructor(
    private menuCtrl: MenuController,
    private loadingService: LoadingService,
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder
  ) {
    this.categoriesList = [];
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });

  }

  ngOnInit() {
    this.listCategories();
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  listCategories() {
    this.loadingService.presentLoading('Cargando...');
    const user = JSON.parse(localStorage.getItem('user')!);
    this.categoriesService.getCategoriesByUserId(user.id).subscribe({
      next: (response: any) => this.handleListCategoriesSuccess(response),
      error: (error: any) => this.handleListCategoriesError(error)
    });
  }
  handleListCategoriesSuccess(response: any): void {
    this.categoriesList = response;
    console.log(this.categoriesList);
    this.loadingService.dismissLoading();
  }

  handleListCategoriesError(error: any): void {
    this.loadingService.dismissLoading();
    console.log(error);
  }
  
  // Agregar categoría
  addCategory(){
    if(this.categoryForm.valid){
      this.loadingService.presentLoading('Agregando categoría...');
      const formValues = this.categoryForm.value;
      const user = JSON.parse(localStorage.getItem('user')!);
      
      this.categoriesService.addCategory(user.id, formValues).subscribe({
        next: (response: any) => this.handleAddCategorySuccess(response),
        error: (error: any) => this.handleAddCategoryError(error)
      });
    }
  }
  handleAddCategoryError(error: any): void {
    this.loadingService.dismissLoading();
    console.log(error);
  }
  handleAddCategorySuccess(response: any): void {
    this.loadingService.dismissLoading();
    this.categoryForm.reset();
    this.listCategories();
    this.modal.dismiss();
  }

  cancelModal(){
    this.modal.dismiss();
  }

}
