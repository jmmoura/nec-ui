import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TerritoryAssignment } from 'src/app/model/TerritoryAssignment';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private readonly apiUrl = `${environment.baseUrl}/api/v1/assignment`;

  constructor(private http: HttpClient) {}

  getCurrentAssignments(): Observable<TerritoryAssignment[]> {
    return this.http.get<TerritoryAssignment[]>(`${this.apiUrl}/current`);
  }

  // Get assignment by id
  // getAssignment(id: number | string): Observable<TerritoryAssignment> {
  //   return this.http.get<TerritoryAssignment>(`${this.apiUrl}/${id}`);
  // }

  // Get assignments for a specific territory
  // getAssignmentsByTerritory(territoryId: number | string): Observable<TerritoryAssignment[]> {
  //   return this.http.get<TerritoryAssignment[]>(`${this.apiUrl}?territoryId=${territoryId}`);
  // }

  // Create new assignment
  // createAssignment(payload: Partial<TerritoryAssignment>): Observable<TerritoryAssignment> {
  //   return this.http.post<TerritoryAssignment>(this.apiUrl, payload);
  // }

  // Update an assignment
  updateAssignment(payload: Partial<TerritoryAssignment>): Observable<TerritoryAssignment> {
    return this.http.put<TerritoryAssignment>(`${this.apiUrl}`, payload);
  }

  // Delete an assignment
  // deleteAssignment(id: number | string): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`);
  // }
}
