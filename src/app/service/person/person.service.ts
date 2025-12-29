import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Person } from 'src/app/model/Person';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private readonly apiUrl = `${environment.baseUrl}/api/v1/person`;

  constructor(private http: HttpClient) { }

  getAllPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(this.apiUrl);
  }

  add(person: Omit<Person, 'id'>): Observable<Person> {
    return this.http.post<Person>(this.apiUrl, person);
  }

  update(person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${person.id}`, person);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}
