import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCheckbox, IonList, IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.page.html',
  styleUrls: ['./blocks.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
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
  territory: any;
  block: number | null = null;
  houses: any[] = [];
  warningMessage: string | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.territory = navigation?.extras.state?.territory;
    this.block = navigation?.extras.state?.block;
    console.log('State:', navigation?.extras.state);

    if (!this.territory || !this.block) {
      console.error('Territory or block data is missing!');
      this.router.navigate(['/territory-details']);
    } else {
      this.loadBlockData();
    }
  }

  loadBlockData() {
    this.http.get<any>('assets/blocks.json').subscribe(
      blocks => {
        const blockData = blocks.find(
          (b: any) => b.territoryId === this.territory.id && b.blockNumber === this.block
        );
        if (blockData) {
          this.houses = blockData.houses;
        } else {
          console.error('Block data not found!');
        }
      },
      error => {
        console.error('Error loading block data:', error);
      }
    );
  }

  getTotalHouses(): number {
    // Exclude houses marked as "Não bater"
    return this.houses?.filter(h => !h.readOnly).length || 0;
  }

  getVisitedHouses(): number {
    // Exclude houses marked as "Não bater"
    return this.houses?.filter(h => h.visited && !h.readOnly).length || 0;
  }

  getVisitedPercentage(): number {
    const total = this.getTotalHouses();
    const visited = this.getVisitedHouses();
    return total ? Math.round((visited / total) * 100) : 0;
  }

  getNoOneHomeHouses(): number {
    // Exclude houses marked as "Não bater"
    return this.houses?.filter(h => !h.visited && !h.readOnly).length || 0;
  }

  getNoOneHomePercentage(): number {
    const total = this.getTotalHouses();
    const noOneHome = this.getNoOneHomeHouses();
    return total ? Math.round((noOneHome / total) * 100) : 0;
  }

  getUniqueStreets(): string[] {
    return [...new Set(this.houses.map(house => house.street))];
  }

  getHousesByStreet(street: string): any[] {
    return this.houses.filter(house => house.street === street);
  }

  markVisited(house: any, event: any) {
    if (!house.readOnly) {
      if (event.detail.checked) {
        // Mark as visited
        house.visited = true;
        house.visitDate = new Date().toLocaleDateString("pt-BR");
        house.visitTime = this.getTimeOfDay();
      } else {
        // Clear date and time when unchecked
        house.visited = false;
        house.visitDate = null;
        house.visitTime = null;
      }
    }
  }

  getTimeOfDay(): string {
    const hours = new Date().getHours();
    if (hours < 6) return 'N'; // Noite
    if (hours < 12) return 'M'; // Manhã
    if (hours < 18) return 'T'; // Tarde
    return 'N'; // Noite
  }
}