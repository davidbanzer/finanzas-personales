import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isUserLogged();
  }

  isUserLogged() {
    const user = localStorage.getItem('user');
    if(user){
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
