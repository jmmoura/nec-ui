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

  // Fetch all persons (id, name)
  getAllPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(this.apiUrl).pipe(
      catchError(() => of([]))
    );
  }

  add(person: Omit<Person, 'id'>): Observable<Person | null> {
    return this.http.post<Person>(this.apiUrl, person).pipe(
      catchError(() => of(null))
    );
  }

  update(person: Person): Observable<Person | null> {
    return this.http.put<Person>(`${this.apiUrl}/${person.id}`, person).pipe(
      catchError(() => of(null))
    );
  }

  remove(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
  
}
