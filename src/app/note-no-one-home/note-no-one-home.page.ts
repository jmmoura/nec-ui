import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note-no-one-home',
  templateUrl: './note-no-one-home.page.html',
  styleUrls: ['./note-no-one-home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule to imports
    HttpClientModule,
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
  territories: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadTerritories();
  }

  loadTerritories() {
    this.http.get<any[]>('assets/territories.json').subscribe({
      next: (data) => {
        this.territories = data;
      },
      error: (err) => {
        console.error('Error loading territories:', err);
      },
    });
  }

  selectTerritory(territory: any) {
    console.log('Selected territory:', territory);
    this.router.navigate(['/territory-details'], { state: { territory } });
  }
}
