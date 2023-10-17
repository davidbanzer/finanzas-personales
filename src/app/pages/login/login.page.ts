import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/api/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
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

  async loginUser() {
    const formValues = this.loginForm.value;

    await this.loadingCtrl.create({
      message: 'Iniciando sesión...'
    }).then(loading => loading.present());

    this.authService.login(formValues).subscribe({
      next: (response: any) => this.handleLoginSuccess(response),
      error: (error: any) => this.handleLoginError(error)
    })
  }

  async handleLoginSuccess(response: any) {
    await this.loadingCtrl.dismiss();
    this.loginForm.reset();
    localStorage.setItem('user', JSON.stringify(response));
    this.router.navigate(['/home']);
  }

  async handleLoginError(error: any) {
    await this.loadingCtrl.dismiss();
    console.log(error);
  }

}
