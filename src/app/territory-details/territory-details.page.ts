import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-territory-details',
  templateUrl: './territory-details.page.html',
  styleUrls: ['./territory-details.page.scss'],
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
    IonList,
    IonItem,
    IonLabel,
    IonNote,
  ],
})
export class TerritoryDetailsPage implements OnInit {
  territory: any;
  warningMessage: string | null = null;
  assignedTo: string | null = null;
  assignmentDate: string | null = null;
  daysSinceAssignment: number | null = null;
  totalHouses = 0;
  visitedHouses = 0;
  visitedPercentage = 0;
  noOneHomeHouses = 0;
  noOneHomePercentage = 0;
  blocks: number[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const territoryId = navigation?.extras.state?.territory.id;

    console.log('State:', navigation?.extras.state);

    // Fetch territory data from territories.json
    this.http.get<any[]>('/assets/territories.json').subscribe((territories) => {
      const territory = territories.find((t) => t.id === territoryId);
      if (territory) {
        this.territory = territory;
        this.warningMessage = territory.warningMessage;
        this.assignedTo = territory.assignedTo;
        this.assignmentDate = territory.assignmentDate;
        this.daysSinceAssignment = this.calculateDaysSinceAssignment(territory.assignmentDate);

        // Fetch block data from blocks.json
        this.fetchBlockData(territory.id);
      }
    });
  }

  fetchBlockData(territoryId: number) {
    this.http.get<any[]>('/assets/blocks.json').subscribe((blocks) => {
      const territoryBlocks = blocks.filter((block) => block.territoryId === territoryId);
      console.log('Blocks for territory:', territoryBlocks);
      // Calculate dashboard values based on blocks data
      this.totalHouses = territoryBlocks.reduce((sum, block) => sum + block.houses.length, 0);
      this.visitedHouses = territoryBlocks.reduce((sum, block) => sum + block.houses.filter((house: { visited: any; }) => house.visited ).length, 0);
      this.noOneHomeHouses = this.totalHouses - this.visitedHouses;

      this.visitedPercentage = this.totalHouses
        ? Math.round((this.visitedHouses / this.totalHouses) * 100)
        : 0;
      this.noOneHomePercentage = this.totalHouses
        ? Math.round((this.noOneHomeHouses / this.totalHouses) * 100)
        : 0;

      // Generate blocks for the territory
      this.blocks = territoryBlocks.map((block) => block.blockNumber);
    });
  }

  calculateDaysSinceAssignment(date: string): number {
    const assignmentDate = new Date(date.split('/').reverse().join('-'));
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - assignmentDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  selectBlock(block: number) {
    console.log('Selected block:', block);
    this.router.navigate(['/blocks'], { state: { territory: this.territory, block } });
  }
}
