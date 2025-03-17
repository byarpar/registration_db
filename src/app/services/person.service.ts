import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private apiUrl = 'http://localhost:8080/api/people';
  private excelApiUrl = 'http://localhost:8080/api/excel';

  constructor(private http: HttpClient) { }

  exportToExcel(): Observable<Blob> {
    return this.http.get(`${this.excelApiUrl}/export`, {
      responseType: 'blob'
    });
  }

  importFromExcel(file: File): Observable<Person[]> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<Person[]>(`${this.excelApiUrl}/import`, formData);
  }

  getAllPeople(): Observable<Person[]> {
    return this.http.get<Person[]>(this.apiUrl);
  }

  getPersonById(id: string): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }

  createPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(this.apiUrl, person);
  }

  updatePerson(person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${person.id}`, person);
  }

  deletePerson(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchPeople(query: string): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/search?query=${query}`);
  }
}