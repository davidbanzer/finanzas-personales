import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonModal, MenuController, ToastController } from '@ionic/angular';
import { CategoriesService } from 'src/app/api/categories.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  @ViewChild('addModal') addCategoryModal!: IonModal;
  @ViewChild('editModal') editCategoryModal!: IonModal;

  categoriesList: any[];
  categoryForm: FormGroup;
  editCategoryForm: FormGroup;

  constructor(
    private menuCtrl: MenuController,
    private loadingService: LoadingService,
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private toastController: ToastController
  ) {
    this.categoriesList = [];
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
    this.editCategoryForm = this.formBuilder.group({
      id: ['', [Validators.required]],
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

  // Listar categorías
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
    this.presentToast(error.error.detail);
    console.log(error);
  }
  handleAddCategorySuccess(response: any): void {
    this.loadingService.dismissLoading();
    this.categoryForm.reset();
    this.listCategories();
    this.addCategoryModal.dismiss();
  }

  // Eliminar categoría
  deleteCategory(id: string){
    this.loadingService.presentLoading('Eliminando categoría...');
    this.categoriesService.deleteCategory(id).subscribe({
      next: (response: any) => this.handleDeleteCategorySuccess(response),
      error: (error: any) => this.handleDeleteCategoryError(error)
    });
  }
  handleDeleteCategoryError(error: any): void {
    this.loadingService.dismissLoading();
    console.log(error);
  }
  handleDeleteCategorySuccess(response: any): void {
    this.loadingService.dismissLoading();
    this.listCategories();
  }

  // Actualizar categoría
  updateCategory(){
    if(this.editCategoryForm.valid){
      this.loadingService.presentLoading('Actualizando categoría...');
      const formValues = this.editCategoryForm.value;
      const user = JSON.parse(localStorage.getItem('user')!);
      this.categoriesService.updateCategory(user.id, formValues).subscribe({
        next: (response: any) => this.handleUpdateCategorySuccess(response),
        error: (error: any) => this.handleUpdateCategoryError(error)
      });
    }
  }
  handleUpdateCategoryError(error: any): void {
    this.loadingService.dismissLoading();
    this.presentToast(error.error.detail);
    console.log(error);
  }
  handleUpdateCategorySuccess(response: any): void {
    this.loadingService.dismissLoading();
    this.editCategoryForm.reset();
    this.listCategories();
    this.editCategoryModal.dismiss();
  }

  cancelModal(){
    this.addCategoryModal.dismiss();
  }

  cancelEditModal(){
    this.editCategoryModal.dismiss();
  }

  openEditModal(category: any){
    this.editCategoryForm.setValue({
      id: category.id,
      name: category.name,
      description: category.description
    });
    this.editCategoryModal.present();
  }

  openModal(){
    this.addCategoryModal.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });

    await toast.present();
  }
}
