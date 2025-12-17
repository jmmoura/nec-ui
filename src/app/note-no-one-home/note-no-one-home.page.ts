import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonButtons, IonBackButton } from '@ionic/angular/standalone';
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

  constructor(
    private router: Router,
    private territorySvc: TerritoryService
  ) {}

  ngOnInit() {
    this.loadTerritories();
  }

  loadTerritories() {
    this.territorySvc.getAllTerritories().subscribe({
      next: (data) => {
        this.territories = data;
      },
      error: (err) => {
        console.error('Error loading territories:', err);
      },
    });
  }

  selectTerritory(territory: TerritorySummary) {
    console.log('Selected territory:', territory);
    this.router.navigate(['/territory-details'], { state: { territory } });
  }
}
