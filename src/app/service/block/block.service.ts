import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BlockDetails } from 'src/app/model/BlockDetails';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlockService {
  private readonly apiUrl = `${environment.baseUrl}/api/v1/block`;

  constructor(private http: HttpClient) { }

  getBlock(id: number): Observable<BlockDetails> {
    return this.http.get<BlockDetails>(`${this.apiUrl}/${id}`);
  }

}
