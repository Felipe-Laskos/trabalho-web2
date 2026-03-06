import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]]
  });

  constructor(private fb: FormBuilder, private router: Router) {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      if (email?.includes('mario') || email?.includes('maria')) {
        this.router.navigate(['/funcionario/home']);
      } else {
        this.router.navigate(['/cliente/home']);
      }
    }
  }
}