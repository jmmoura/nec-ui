import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { LinkRequest } from 'src/app/model/LinkRequest';
import { SharedLink } from 'src/app/model/SharedLink';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LinkGeneratorService {
  private readonly apiUrl = `${environment.baseUrl}/api/v1/link/generate`;

  constructor(private http: HttpClient) {}

  generateTerritoryLink(linkRequest: LinkRequest): Observable<string | null> {
    let linkResponse: SharedLink | null = null;
    return this.getLink(linkRequest).pipe(
      map(data => {
        linkResponse = data;
        const origin = typeof window !== 'undefined' && window.location ? window.location.origin : '';
        return `${origin}?sharedLink=${encodeURIComponent(linkResponse?.access)}`;
      }
    )
    )
  }

  getLink(linkRequest: LinkRequest): Observable<SharedLink> {
    return this.http.post<SharedLink>(this.apiUrl, linkRequest);
  }
}
