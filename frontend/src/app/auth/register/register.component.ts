import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      bio: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  register() {
    const email = this.registerForm.get('email')?.value;
    const username = this.registerForm.get('username')?.value;
    const password = this.registerForm.get('password')?.value;
    const bio = this.registerForm.get('bio')?.value;
    this.authService.createUser(email, username, password, bio).then(
      (response) => {
        console.log(response)
        this.authService.loginUser(email, password).then(
          () => {
            this.router.navigate(['/messages']);
          }
        )
      }
    ).catch((error) => {
      console.log(error);

    })
  }

}
