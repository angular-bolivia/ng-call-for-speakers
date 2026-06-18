import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-speaker-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './speaker-form.component.html',
  styleUrl: './speaker-form.component.css'
})
export class SpeakerFormComponent {
  private fb = inject(FormBuilder);
  private firebaseService = inject(FirebaseService);
  private router = inject(Router);

  // Wizard state signals
  public currentStep = signal<number>(1);
  public isSubmitting = signal<boolean>(false);
  public submitSuccess = signal<boolean>(false);
  public submitError = signal<string | null>(null);

  // Photo upload state signals
  public photoPreviewUrl = signal<string | null>(null);
  public uploadingPhoto = signal<boolean>(false);
  public uploadProgress = signal<number>(0);
  public photoError = signal<string | null>(null);

  // Form Group configuration
  public speakerForm: FormGroup = this.fb.group({
    // Step 1: Personal Info
    fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    countryOfOrigin: ['', [Validators.required]],
    countryOfResidence: ['', [Validators.required]],
    bio: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(1000)]],
    photoUrl: ['', [Validators.required]],
    photoStoragePath: ['', [Validators.required]],

    // Step 2: Talk Info
    talkTitle: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(150)]],
    talkDescription: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(2000)]],
    duration: [30, [Validators.required]], // Default 30 mins
    type: ['talk', [Validators.required]], // Default 'talk'
    level: ['intermediate', [Validators.required]], // Default 'intermediate'
    modality: ['presencial', [Validators.required]], // Default 'presencial'

    // Step 3: Social & Confirm
    twitter: ['', [Validators.pattern('^(https:\\/\\/(www\\.)?twitter\\.com\\/|https:\\/\\/(www\\.)?x\\.com\\/|@)?[a-zA-Z0-9_]{1,15}$')]],
    linkedin: ['', [Validators.pattern('^(https:\\/\\/(www\\.)?linkedin\\.com\\/in\\/)?[a-zA-Z0-9_-]+\\/?$')]],
    github: ['', [Validators.pattern('^(https:\\/\\/(www\\.)?github\\.com\\/)?[a-zA-Z0-9_-]+\\/?$')]],
    website: ['', [Validators.pattern('^(https?:\\/\\/)?(www\\.)?[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}(\\/\\S*)?$')]],
    repository: ['', [Validators.pattern('^(https:\\/\\/(www\\.)?(github|gitlab|bitbucket)\\.com\\/)[a-zA-Z0-9_.-]+\\/[a-zA-Z0-9_.-]+\\/?$')]],
    acceptedTerms: [false, [Validators.requiredTrue]]
  });

  // Check validity of fields per step
  public isStepValid(step: number): boolean {
    if (step === 1) {
      return this.speakerForm.get('fullName')?.valid &&
             this.speakerForm.get('email')?.valid &&
             this.speakerForm.get('phone')?.valid &&
             this.speakerForm.get('countryOfOrigin')?.valid &&
             this.speakerForm.get('countryOfResidence')?.valid &&
             this.speakerForm.get('bio')?.valid &&
             this.speakerForm.get('photoUrl')?.valid &&
             this.speakerForm.get('photoStoragePath')?.valid ? true : false;
    }
    if (step === 2) {
      return this.speakerForm.get('talkTitle')?.valid &&
             this.speakerForm.get('talkDescription')?.valid &&
             this.speakerForm.get('duration')?.valid &&
             this.speakerForm.get('type')?.valid &&
             this.speakerForm.get('level')?.valid ? true : false;
    }
    if (step === 3) {
      return this.speakerForm.get('acceptedTerms')?.valid &&
             this.speakerForm.get('twitter')?.valid &&
             this.speakerForm.get('linkedin')?.valid &&
             this.speakerForm.get('github')?.valid &&
             this.speakerForm.get('website')?.valid &&
             this.speakerForm.get('repository')?.valid ? true : false;
    }
    return false;
  }

  // Navigation handlers
  public nextStep(): void {
    const step = this.currentStep();
    if (this.isStepValid(step) && step < 3) {
      this.currentStep.set(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Mark all controls in current step as touched to trigger CSS :user-invalid fallbacks
      this.touchStepFields(step);
    }
  }

  public prevStep(): void {
    const step = this.currentStep();
    if (step > 1) {
      this.currentStep.set(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // File Upload Handler
  public onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validation: Type check
      if (!file.type.match('image/.*')) {
        this.photoError.set('Por favor, selecciona una imagen válida (PNG, JPG, JPEG).');
        return;
      }
      
      // Validation: Size check (2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.photoError.set('La foto debe pesar menos de 2MB.');
        return;
      }

      this.photoError.set(null);
      this.uploadPhotoToFirebase(file);
    }
  }

  private uploadPhotoToFirebase(file: File): void {
    this.uploadingPhoto.set(true);
    this.uploadProgress.set(0);

    // Create unique path in storage
    const storagePath = `speaker-photos/${Date.now()}_${file.name}`;
    const storageRef = ref(this.firebaseService.storage, storagePath);
    
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        // Calculate progress percentage
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        this.uploadProgress.set(progress);
      }, 
      (error) => {
        // Upload error
        console.error('Photo upload failed:', error);
        this.photoError.set('Hubo un error al subir la foto. Intenta nuevamente.');
        this.uploadingPhoto.set(false);
      }, 
      () => {
        // Upload success
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            this.speakerForm.patchValue({
              photoUrl: downloadURL,
              photoStoragePath: storagePath
            });
            this.photoPreviewUrl.set(downloadURL);
            this.uploadingPhoto.set(false);
          })
          .catch((error) => {
            console.error('Error getting download URL:', error);
            this.photoError.set('Error obteniendo la URL de la imagen. Por favor, verifica tu conexión o las reglas de seguridad.');
            this.uploadingPhoto.set(false);
          });
      }
    );
  }

  private touchStepFields(step: number): void {
    if (step === 1) {
      const fields = ['fullName', 'email', 'phone', 'countryOfOrigin', 'countryOfResidence', 'bio', 'photoUrl'];
      fields.forEach(field => this.speakerForm.get(field)?.markAsTouched());
    } else if (step === 2) {
      const fields = ['talkTitle', 'talkDescription', 'duration', 'type', 'level'];
      fields.forEach(field => this.speakerForm.get(field)?.markAsTouched());
    } else if (step === 3) {
      const fields = ['acceptedTerms', 'twitter', 'linkedin', 'github', 'website', 'repository'];
      fields.forEach(field => this.speakerForm.get(field)?.markAsTouched());
    }
  }

  // Submit Handler
  public onSubmit(): void {
    if (this.speakerForm.valid) {
      this.isSubmitting.set(true);
      this.submitError.set(null);

      const formData = {
        ...this.speakerForm.value,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      // Save to Cloud Firestore
      addDoc(collection(this.firebaseService.db, 'applicants'), formData)
        .then(() => {
          this.isSubmitting.set(false);
          this.submitSuccess.set(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch((error) => {
          console.error('Error submitting application:', error);
          this.submitError.set('Hubo un error al enviar tu postulación. Por favor, intenta de nuevo.');
          this.isSubmitting.set(false);
        });
    } else {
      this.touchStepFields(1);
      this.touchStepFields(2);
      this.touchStepFields(3);
    }
  }
}
