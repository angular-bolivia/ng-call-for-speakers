import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { collection, query, onSnapshot, doc, updateDoc, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

interface Applicant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  countryOfOrigin: string;
  countryOfResidence: string;
  bio: string;
  photoUrl: string;
  talkTitle: string;
  talkDescription: string;
  duration: number;
  type: string;
  level: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  repository?: string;
  status: 'pending' | 'accepted' | 'waitlist' | 'rejected' | 'archived';
  notes?: string;
  createdAt: any;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  private router = inject(Router);

  public applicants = signal<Applicant[]>([]);
  public selectedApplicant = signal<Applicant | null>(null);
  
  public filterStatus = signal<string>('all');
  public searchQuery = signal<string>('');

  public isLoading = signal<boolean>(true);

  public filteredApplicants = computed(() => {
    let filtered = this.applicants();
    
    if (this.filterStatus() !== 'all') {
      filtered = filtered.filter(a => a.status === this.filterStatus());
    } else {
      filtered = filtered.filter(a => a.status !== 'archived');
    }
    
    const sq = this.searchQuery().toLowerCase();
    if (sq) {
      filtered = filtered.filter(a => 
        a.fullName.toLowerCase().includes(sq) || 
        a.talkTitle.toLowerCase().includes(sq)
      );
    }
    
    return filtered;
  });

  ngOnInit() {
    this.loadApplicants();
  }

  private loadApplicants() {
    const q = query(
      collection(this.firebaseService.db, 'applicants'),
      orderBy('createdAt', 'desc')
    );
    
    onSnapshot(q, (snapshot) => {
      const data: Applicant[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Applicant);
      });
      this.applicants.set(data);
      this.isLoading.set(false);
      
      // Update selected applicant if it changes
      const currentSelected = this.selectedApplicant();
      if (currentSelected) {
        const updated = data.find(a => a.id === currentSelected.id);
        if (updated) this.selectedApplicant.set(updated);
      }
    });
  }

  public selectApplicant(applicant: Applicant) {
    this.selectedApplicant.set(applicant);
  }

  public closeDetails() {
    this.selectedApplicant.set(null);
  }

  public async updateStatus(status: 'pending' | 'accepted' | 'waitlist' | 'rejected' | 'archived') {
    const applicant = this.selectedApplicant();
    if (!applicant) return;

    try {
      const applicantRef = doc(this.firebaseService.db, 'applicants', applicant.id);
      await updateDoc(applicantRef, { status });
    } catch (error) {
      console.error('Error updating status', error);
      alert('Error updating status');
    }
  }

  public async updateNotes(event: Event) {
    const element = event.target as HTMLTextAreaElement;
    const applicant = this.selectedApplicant();
    if (!applicant) return;

    try {
      const applicantRef = doc(this.firebaseService.db, 'applicants', applicant.id);
      await updateDoc(applicantRef, { notes: element.value });
    } catch (error) {
      console.error('Error updating notes', error);
      alert('Error updating notes');
    }
  }

  public getApplicantDate(app: any): Date | null {
    if (!app || !app.createdAt) return null;
    if (typeof app.createdAt.toDate === 'function') {
      return app.createdAt.toDate();
    }
    return new Date(app.createdAt);
  }

  public async logout() {
    await signOut(this.firebaseService.auth);
    this.router.navigate(['/']);
  }
}
