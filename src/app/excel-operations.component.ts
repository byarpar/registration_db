import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { PersonService } from './services/person.service';
import { Person } from './models/person.model';

@Component({
  selector: 'app-excel-operations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './excel-operations.component.html',
  styleUrls: ['./excel-operations.component.scss']
})
export class ExcelOperationsComponent {
  selectedFile: File | null = null;
  importResult: { success: boolean; message: string; people?: Person[] } = {
    success: false,
    message: ''
  };
  isLoading = false;
  
  constructor(
    private personService: PersonService,
    private location: Location
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  importExcel(): void {
    if (!this.selectedFile) {
      this.importResult = {
        success: false,
        message: 'Please select a file to upload'
      };
      return;
    }

    // Check file extension
    const fileExt = this.selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'xlsx' && fileExt !== 'xls') {
      this.importResult = {
        success: false,
        message: 'Please upload an Excel file (xlsx or xls)'
      };
      return;
    }

    this.isLoading = true;
    this.personService.importFromExcel(this.selectedFile).subscribe({
      next: (people) => {
        this.isLoading = false;
        this.importResult = {
          success: true,
          message: `Successfully imported ${people.length} records`,
          people: people
        };
        this.selectedFile = null;
        // Reset file input
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.importResult = {
          success: false,
          message: error.error?.message || 'Failed to import data'
        };
      }
    });
  }

  exportExcel(): void {
    this.isLoading = true;
    this.personService.exportToExcel().subscribe({
      next: (blob) => {
        this.isLoading = false;
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        // Create a link element
        const a = document.createElement('a');
        a.href = url;
        a.download = 'people.xlsx';
        // Append to the document
        document.body.appendChild(a);
        // Trigger a click on the link to start the download
        a.click();
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Export failed:', error);
        alert('Failed to export data. Please try again.');
      }
    });
  }

  downloadTemplate(): void {
    // Create a simple Excel template with headers
    const headers = ['ID', 'Name', 'NRC', 'Date of Birth', 'Father\'s Name', 'Phone', 'Email', 'Township', 'Address'];
    
    // This is a simplified approach - in a real app, you might want to generate a proper Excel file
    // For now, we'll create a CSV file as a simple template
    let csvContent = headers.join(',') + '\n';
    csvContent += ',John Doe,12/ABC(N)123456,1990-01-01,Richard Doe,123456789,john@example.com,Township 1,123 Main St\n';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'people_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  goBack(): void {
    this.location.back();
  }
}