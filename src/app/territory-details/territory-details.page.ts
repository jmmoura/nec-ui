import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonNote, IonModal } from '@ionic/angular/standalone';
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
    IonModal
  ],
})
export class TerritoryDetailsPage implements OnInit, AfterViewChecked {
  @ViewChild('mapImage', { static: false }) mapImage!: ElementRef<HTMLImageElement>;
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;

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
  isMapModalOpen = false;

  private scale = 1;
  private startX = 0;
  private startY = 0;
  private panX = 0;
  private panY = 0;
  private listenersAdded = false;

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

  openMapModal() {
    this.isMapModalOpen = true;
  }

  closeMapModal() {
    this.isMapModalOpen = false;
  }

  ngAfterViewChecked() {
    if (this.isMapModalOpen && !this.listenersAdded && this.mapImage && this.mapContainer) {
      const mapImage = this.mapImage.nativeElement;
      const mapContainer = this.mapContainer.nativeElement;

      // Add event listeners for zooming and panning
      mapContainer.addEventListener('wheel', (event) => this.onWheel(event));
      mapImage.addEventListener('mousedown', (event) => this.onMouseDown(event));
      mapImage.addEventListener('mousemove', (event) => this.onMouseMove(event));
      mapImage.addEventListener('mouseup', () => this.onMouseUp());
      mapImage.addEventListener('mouseleave', () => this.onMouseUp());

      this.listenersAdded = true; // Ensure listeners are added only once
    }
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    this.scale = Math.min(Math.max(this.scale + delta, 1), 3); // Limit zoom between 1x and 3x
    this.updateTransform();
  }

  onMouseDown(event: MouseEvent) {
    this.startX = event.clientX - this.panX;
    this.startY = event.clientY - this.panY;
    this.mapImage.nativeElement.style.cursor = 'grabbing';
  }

  onMouseMove(event: MouseEvent) {
    if (event.buttons !== 1) return; // Only pan when the left mouse button is pressed
    this.panX = event.clientX - this.startX;
    this.panY = event.clientY - this.startY;
    this.updateTransform();
  }

  onMouseUp() {
    this.mapImage.nativeElement.style.cursor = 'grab';
  }

  updateTransform() {
    const transform = `scale(${this.scale}) translate(${this.panX / this.scale}px, ${this.panY / this.scale}px)`;
    this.mapImage.nativeElement.style.transform = transform;
  }
}
