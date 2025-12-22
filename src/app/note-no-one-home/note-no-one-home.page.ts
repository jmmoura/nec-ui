import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonButtons, IonBackButton, IonSpinner } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TerritorySummary } from '../model/TerritorySummary';
import { TerritoryService } from '../service/territory/territory.service';

@Component({
  selector: 'app-note-no-one-home',
  templateUrl: './note-no-one-home.page.html',
  styleUrls: ['./note-no-one-home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule to imports
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonButtons, // Import IonButtons
    IonBackButton // Import IonBackButton
  ],
})
export class NoteNoOneHomePage implements OnInit {
  territories: TerritorySummary[] = [];
  loading = false;

  constructor(
    private router: Router,
    private territorySvc: TerritoryService
  ) {}

  ngOnInit() {
    this.loadTerritories();
  }

  loadTerritories() {
    this.loading = true;
    this.territorySvc.getAllTerritories().subscribe({
      next: (data) => {
        this.territories = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading territories:', err);
        this.loading = false;
      },
    });
  }

  selectTerritory(territory: TerritorySummary) {
    console.log('Selected territory:', territory);
    this.router.navigate(['/territory-details'], { state: { territory } });
  }
}
