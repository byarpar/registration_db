import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonService } from '../services/person.service';
import { Person } from '../models/person.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  people: Person[] = [];
  activeTab = 'register';
  searchQuery = '';
  townships = ['Township 1', 'Township 2', 'Township 3', 'Township 4'];
  isLoading = false;
  submitError = '';
  searchError = '';
  
  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPeople();
  }

  initForm(): void {
    this.registrationForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      nrc: ['', [Validators.required, Validators.maxLength(50)]],
      dob: [''],
      fatherName: ['', Validators.maxLength(100)],
      phone: ['', Validators.maxLength(20)],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      township: [''],
      address: ['', Validators.maxLength(500)]
    });
  }

  loadPeople(): void {
    this.isLoading = true;
    this.personService.getAllPeople().subscribe({
      next: (data) => {
        this.people = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching people:', error);
        this.searchError = 'Failed to load data. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.submitError = '';
    const person: Person = this.registrationForm.value;

    if (person.id) {
      // Update existing person
      this.personService.updatePerson(person).subscribe({
        next: () => {
          this.resetForm();
          this.loadPeople();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating person:', error);
          this.submitError = 'Failed to update record. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      // Create new person
      this.personService.createPerson(person).subscribe({
        next: () => {
          this.resetForm();
          this.loadPeople();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creating person:', error);
          this.submitError = 'Failed to create record. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  onDelete(): void {
    const id = this.registrationForm.get('id')?.value;
    if (!id) {
      alert('Please select a record to delete');
      return;
    }

    if (!confirm('Are you sure you want to delete this record?')) {
      return;
    }

    this.isLoading = true;
    this.submitError = '';
    this.personService.deletePerson(id).subscribe({
      next: () => {
        this.resetForm();
        this.loadPeople();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error deleting person:', error);
        this.submitError = 'Failed to delete record. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onList(): void {
    this.activeTab = 'search';
  }

  onSearch(): void {
    this.isLoading = true;
    this.searchError = '';
    
    if (this.searchQuery) {
      this.personService.searchPeople(this.searchQuery).subscribe({
        next: (data) => {
          this.people = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error searching people:', error);
          this.searchError = 'Search failed. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      this.loadPeople();
    }
  }

  onRowClick(person: Person): void {
    this.registrationForm.patchValue({
      id: person.id,
      name: person.name,
      nrc: person.nrc,
      dob: person.dob,
      fatherName: person.fatherName,
      phone: person.phone,
      email: person.email,
      township: person.township,
      address: person.address
    });
    this.activeTab = 'register';
  }

  resetForm(): void {
    this.registrationForm.reset();
    this.submitError = '';
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'search') {
      this.loadPeople();
    }
  }

  // Helper methods for form validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    if (!field) return '';
    
    if (field.errors?.['required']) {
      return 'This field is required';
    }
    if (field.errors?.['email']) {
      return 'Please enter a valid email address';
    }
    if (field.errors?.['maxlength']) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `Maximum length is ${maxLength} characters`;
    }
    
    return '';
  }

  navigateToExcel(): void {
    this.router.navigate(['/excel']);
  }
}