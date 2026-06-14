import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private firebaseService = inject(FirebaseService);
  private router = inject(Router);

  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  public onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      const { email, password } = this.loginForm.value;

      signInWithEmailAndPassword(this.firebaseService.auth, email!, password!)
        .then(() => {
          this.isLoading.set(false);
          this.router.navigate(['/admin/dashboard']);
        })
        .catch((error) => {
          this.isLoading.set(false);
          this.errorMessage.set('Credenciales inválidas. Por favor intente de nuevo.');
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
