import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/api/auth.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.loginUser();
    }
  }

  ngOnInit() {

  }

  async loginUser() {
    const formValues = this.loginForm.value;

    await this.loadingService.presentLoading('Iniciando sesión...');

    this.authService.login(formValues).subscribe({
      next: (response: any) => this.handleLoginSuccess(response),
      error: (error: any) => this.handleLoginError(error)
    })
  }

  async handleLoginSuccess(response: any) {
    await this.loadingService.dismissLoading();
    this.loginForm.reset();
    localStorage.setItem('user', JSON.stringify(response));
    this.router.navigate(['/home']);
  }

  async handleLoginError(error: any) {
    await this.loadingService.dismissLoading();
    console.log(error);
  }

}
