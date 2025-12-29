import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../service/authentication/auth.service';
import { logOutOutline } from 'ionicons/icons';

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
  readonly logOutIcon = logOutOutline;
  constructor(private router: Router, private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }

  navigateToNoteNoOneHome() {
    this.router.navigate(['/note-no-one-home']);
  }

  navigateToManageTerritories() {
    this.router.navigate(['/manage-territories']);
  }

  navigateToManagePeople() {
    this.router.navigate(['/manage-persons']);
  }
}
