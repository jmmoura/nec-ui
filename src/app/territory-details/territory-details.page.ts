import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-territory-details',
  templateUrl: './territory-details.page.html',
  styleUrls: ['./territory-details.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule, // Add HttpClientModule here
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

  constructor(private router: Router, private http: HttpClient) {} // Inject HttpClient

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const territoryId = navigation?.extras.state?.territory.id;

    console.log('State:', navigation?.extras.state);

    // Fetch mock data from JSON file
    this.http.get<any[]>('/assets/territories.json').subscribe((data) => {
      const territory = data.find((t) => t.id === territoryId);
      if (territory) {
        this.territory = territory;
        this.warningMessage = territory.warningMessage;
        this.assignedTo = territory.assignedTo;
        this.assignmentDate = territory.assignmentDate;
        this.daysSinceAssignment = this.calculateDaysSinceAssignment(territory.assignmentDate);
        this.totalHouses = territory.totalHouses;
        this.visitedHouses = territory.visitedHouses;
        this.visitedPercentage = Math.round((territory.visitedHouses / territory.totalHouses) * 100);
        this.noOneHomeHouses = territory.noOneHomeHouses;
        this.noOneHomePercentage = Math.round((territory.noOneHomeHouses / territory.totalHouses) * 100);

        // Generate blocks for the territory (example: 5 blocks)
        this.blocks = Array.from({ length: 5 }, (_, i) => i + 1);
      }
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
