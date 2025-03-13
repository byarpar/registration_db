import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonService } from '../services/person.service';
import { Person } from '../models/person.model';

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

  constructor(
    private fb: FormBuilder,
    private personService: PersonService
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      nrc: ['', Validators.required],
      dob: [''],
      fatherName: [''],
      phone: [''],
      email: ['', Validators.email],
      township: [''],
      address: ['']
    });
    
    this.loadPeople();
  }

  loadPeople(): void {
    this.personService.getAllPeople().subscribe({
      next: (data) => {
        this.people = data;
      },
      error: (error) => {
        console.error('Error fetching people:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      alert('Please fill in required fields');
      return;
    }

    const person: Person = this.registrationForm.value;

    if (person.id) {
      // Update existing person
      this.personService.updatePerson(person).subscribe({
        next: () => {
          this.resetForm();
          this.loadPeople();
        },
        error: (error) => {
          console.error('Error updating person:', error);
        }
      });
    } else {
      // Create new person
      this.personService.createPerson(person).subscribe({
        next: () => {
          this.resetForm();
          this.loadPeople();
        },
        error: (error) => {
          console.error('Error creating person:', error);
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

    this.personService.deletePerson(id).subscribe({
      next: () => {
        this.resetForm();
        this.loadPeople();
      },
      error: (error) => {
        console.error('Error deleting person:', error);
      }
    });
  }

  onList(): void {
    this.activeTab = 'search';
  }

  onSearch(): void {
    if (this.searchQuery) {
      this.personService.searchPeople(this.searchQuery).subscribe({
        next: (data) => {
          this.people = data;
        },
        error: (error) => {
          console.error('Error searching people:', error);
        }
      });
    } else {
      this.loadPeople();
    }
  }

  onRowClick(person: Person): void {
    this.registrationForm.patchValue(person);
    this.activeTab = 'register';
  }

  resetForm(): void {
    this.registrationForm.reset();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}