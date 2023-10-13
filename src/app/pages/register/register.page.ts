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
    private loadingService: LoadingService,
    private router: Router) {

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

  private registerUser() {
    const formValues = this.registerForm.value;

    this.loadingService.showLoading('Registrando...');

    this.authService.register(formValues).subscribe({
      next: (response: any) => this.handleRegisterSuccess(response),
      error: (error: any) => this.handleRegisterError(error)
    })
  }

  private handleRegisterSuccess(response: any) {
    this.loadingService.hideLoading();
    this.registerForm.reset();
    localStorage.setItem('user', JSON.stringify(response.user));
    this.router.navigate(['/home']);
  }

  private handleRegisterError(error: any) {
    this.loadingService.hideLoading();
    console.log(error);
  }

}
