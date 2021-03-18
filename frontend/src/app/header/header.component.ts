import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  isAuth$: boolean;
  authSubscription!: Subscription;
  

  constructor(private authService: AuthService) {
    this.isAuth$ = false;
    
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuth.subscribe(
      (auth) => {
        this.isAuth$ = auth;
      }
    );
  }

  onLogout() {
    this.authService.logoutUser();
  }

  // ngOnDestroy() {
  //   this.authSubscription.unsubscribe();
  // }

}
