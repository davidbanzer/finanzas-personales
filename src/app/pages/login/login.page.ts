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
    private loadingService: LoadingService,
    private authService: AuthService,
    private router: Router
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

  loginUser() {
    const formValues = this.loginForm.value;
    this.loadingService.showLoading('Iniciando sesión...');
    this.authService.login(formValues).subscribe({
      next: (response: any) => this.handleLoginSuccess(response),
      error: (error: any) => this.handleLoginError(error)
    })
  }

  handleLoginSuccess(response: any) {
    this.loadingService.hideLoading();
    this.loginForm.reset();
    localStorage.setItem('user', JSON.stringify(response));
    this.router.navigate(['/home']);
  }

  handleLoginError(error: any) {
    this.loadingService.hideLoading();
    console.log(error);
  }

}
