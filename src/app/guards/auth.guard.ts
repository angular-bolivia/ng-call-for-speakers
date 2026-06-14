import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { onAuthStateChanged } from 'firebase/auth';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const firebaseService = inject(FirebaseService);

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(firebaseService.auth, (user) => {
      unsubscribe();
      if (user) {
        resolve(true);
      } else {
        router.navigate(['/admin/login']);
        resolve(false);
      }
    });
  });
};
