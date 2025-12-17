import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCheckbox, IonList, IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';
import { BlockDetails } from '../model/BlockDetails';
import { TerritoryDetails } from '../model/TerritoryDetails';
import { Address } from '../model/Address';
import { BlockService } from '../service/block/block.service';
import { AddressService } from '../service/address/address.service';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.page.html',
  styleUrls: ['./blocks.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonCheckbox,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
  ],
})
export class BlocksPage implements OnInit {
  territory: TerritoryDetails | null = null;
  block: BlockDetails | null = null;
  addressList: Address[] = [];

  constructor(private router: Router, private blockSvc: BlockService, private addressSvc: AddressService) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.territory = navigation?.extras.state?.territory;
    const blockSummary = navigation?.extras.state?.block;
    console.log('State:', navigation?.extras.state);

    if (!this.territory || !blockSummary) {
      console.error('Territory or block data is missing!');
      this.router.navigate(['/territory-details']);
    } else {
      this.loadBlockData(blockSummary.id);
    }
  }

  loadBlockData(blockId: number) {
    this.blockSvc.getBlock(blockId).subscribe({
      next: (blockDetails) => {
        this.block = blockDetails;
        this.addressList = blockDetails.addressList || [];
        this.addressList.map(address => {
          address.id = address.id || 0;
          address.street = address.street || '';
          address.number = address.number || '';
          address.visitUnallowed = address.visitUnallowed || false;
          address.visitedAt = address.visitedAt || null;
          address.visitTime = address.visitedAt ? this.getTimeOfDay(address.visitedAt) : null;
          address.visited = !!address.visitedAt;
        });          
      },
      error: (err) => {
        console.error('Error fetching block details:', err);
      }
    });
  }

  getTotalHouses(): number {
    // Exclude houses marked as "Não bater"
    return this.addressList?.filter(address => !address.visitUnallowed).length || 0;
  }

  getVisitedHouses(): number {
    // Exclude houses marked as "Não bater"
    return this.addressList?.filter(address => address.visitedAt && !address.visitUnallowed).length || 0;
  }

  getVisitedPercentage(): number {
    const total = this.getTotalHouses();
    const visited = this.getVisitedHouses();
    return total ? Math.round((visited / total) * 100) : 0;
  }

  getNoOneHomeHouses(): number {
    return this.getTotalHouses() - this.getVisitedHouses();
  }

  getNoOneHomePercentage(): number {
    const total = this.getTotalHouses();
    const noOneHome = this.getNoOneHomeHouses();
    return total ? Math.round((noOneHome / total) * 100) : 0;
  }

  getUniqueStreets(): string[] {
    return [...new Set(this.addressList.map(address => address.street))];
  }

  getHousesByStreet(street: string): any[] {
    return this.addressList.filter(address => address.street === street);
  }

  markVisited(house: Address, event: any) {
    if (!house.visitUnallowed) {
      if (event.detail.checked) {
        // Mark as visited
        house.visited = true;
        house.visitedAt = new Date().toISOString();
        house.visitTime = this.getTimeOfDay(house.visitedAt);
      } else {
        // Clear date and time when unchecked
        house.visited = false;
        house.visitedAt = null;
        house.visitTime = null;
      }

      this.addressSvc.updateAddress(house).subscribe({
        next: (updatedAddress) => {
          console.log('Address updated successfully:', updatedAddress);
        },
        error: (err) => {
          console.error('Error updating address:', err);
        }
      });

    }
  }

  getTimeOfDay(date: string): string {
    const hours = new Date(date).getHours();
    if (hours < 6) return 'N'; // Noite
    if (hours < 12) return 'M'; // Manhã
    if (hours < 18) return 'T'; // Tarde
    return 'N'; // Noite
  }
}