import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TerritoryDetails } from 'src/app/model/TerritoryDetails';
import { TerritorySummary } from 'src/app/model/TerritorySummary';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TerritoryService {
  private readonly apiUrl = `${environment.baseUrl}/api/v1/territory`;

  constructor(private http: HttpClient) { }

  getTerritory(id: number): Observable<TerritoryDetails> {
    return this.http.get<TerritoryDetails>(`${this.apiUrl}/${id}`);
  }

  getAllTerritories(): Observable<TerritorySummary[]> {
    return this.http.get<TerritorySummary[]>(this.apiUrl);
  }

}
