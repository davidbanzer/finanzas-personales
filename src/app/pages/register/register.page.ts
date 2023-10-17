import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/api/auth.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;

  constructor(
    private menuCtrl: MenuController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService) {

    this.menuCtrl.enable(false);

    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

  }

  ngOnInit() {
  }

  register() {
    if (this.registerForm.valid) {
      this.registerUser();
    }
  }

  private async registerUser() {
    const formValues = this.registerForm.value;

    await this.loadingService.presentLoading('Registrando usuario...');

    this.authService.register(formValues).subscribe({
      next: (response: any) => this.handleRegisterSuccess(response),
      error: (error: any) => this.handleRegisterError(error)
    })
  }

  private async handleRegisterSuccess(response: any) {
    await this.loadingService.dismissLoading();
    this.registerForm.reset();
    localStorage.setItem('user', JSON.stringify(response));
    this.router.navigate(['/home']);
  }

  private async handleRegisterError(error: any) {
    await this.loadingService.dismissLoading();
    console.log(error);
  }

}
