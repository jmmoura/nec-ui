import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from 'src/app/model/Address';
import { AddressReset } from 'src/app/model/AddressReset';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly apiUrl = `${environment.baseUrl}/api/v1/address`;

  constructor(private http: HttpClient) { }

  updateAddress(address: Address): Observable<Address> {
    return this.http.put<Address>(this.apiUrl, address);
  }

  resetAddress(addressReset: AddressReset): Observable<void> {
    const url = `${this.apiUrl}/reset`;
    return this.http.put<void>(url, addressReset);
  }

}
