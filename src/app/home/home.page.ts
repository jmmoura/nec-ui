import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule // Import IonicModule to include all Ionic components
  ],
})
export class HomePage {
  constructor(private router: Router) {}

  navigateToNoteNoOneHome() {
    this.router.navigate(['/note-no-one-home']);
  }

  navigateToManageTerritories() {
    this.router.navigate(['/manage-territories']);
  }
}
