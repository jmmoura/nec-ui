import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<Person[]>(this.apiUrl);
  }
}
