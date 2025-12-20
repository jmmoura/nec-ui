import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewChecked,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
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
  IonModal,
} from "@ionic/angular/standalone";
import { Router } from "@angular/router";
import { TerritoryDetails } from "../model/TerritoryDetails";
import { TerritoryService } from "../service/territory/territory.service";
import { BlockSummary } from "../model/BlockSummary";

@Component({
  selector: "app-territory-details",
  templateUrl: "./territory-details.page.html",
  styleUrls: ["./territory-details.page.scss"],
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
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonModal,
  ],
})
export class TerritoryDetailsPage implements OnInit, AfterViewChecked {
  @ViewChild("mapImage", { static: false })
  mapImage!: ElementRef<HTMLImageElement>;
  @ViewChild("mapContainer", { static: false })
  mapContainer!: ElementRef<HTMLDivElement>;

  territory: TerritoryDetails | null = null;
  warningMessage: string | null = null;
  assignedTo: string | null = null;
  assignmentDate: string | null = null;
  daysSinceAssignment: number | null = null;
  totalHouses = 0;
  visitedHouses = 0;
  visitedPercentage = 0;
  noOneHomeHouses = 0;
  noOneHomePercentage = 0;
  blocks: BlockSummary[] = [];
  isMapModalOpen = false;

  private scale = 1;
  private startX = 0;
  private startY = 0;
  private panX = 0;
  private panY = 0;
  private initialDistance = 0;
  private listenersAdded = false;

  constructor(
    private router: Router,
    private territorySvc: TerritoryService,
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const territoryId = navigation?.extras.state?.territory.id;

    console.log("State:", navigation?.extras.state);

    this.territorySvc.getTerritory(territoryId).subscribe((territory) => {
      this.territory = territory;
      this.territory.territoryMapPath = `/assets/maps/${territory.territoryNumber}.jpeg`
      this.warningMessage = territory.territoryWarningMessage || null;
      this.assignedTo = territory.assignedTo || null;
      this.assignmentDate = territory.assignmentDate || null;
      this.daysSinceAssignment = territory.assignmentDate
        ? this.calculateDaysSinceAssignment(territory.assignmentDate)
        : null;

      this.fetchBlockData();
    });
  }

  // ionViewWillEnter() {
  //     this.fetchBlockData();
  // }

  fetchBlockData() {
    
      console.log("Blocks for territory:", this.territory?.blocks);

      this.totalHouses = this.territory?.territoryTotalHouses || 0;
      this.visitedHouses = this.territory?.territoryVisitedHouses || 0;
      this.noOneHomeHouses = this.totalHouses - this.visitedHouses;

      this.visitedPercentage = this.totalHouses
        ? Math.round((this.visitedHouses / this.totalHouses) * 100)
        : 0;
      this.noOneHomePercentage = this.totalHouses
        ? Math.round((this.noOneHomeHouses / this.totalHouses) * 100)
        : 0;

      this.blocks = this.territory?.blocks || [];
  }

  calculateDaysSinceAssignment(date: string): number {
    const parts = date.split("-");
    const assignmentDate = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    const today = new Date();
    const diffTime = today.getTime() - assignmentDate.getTime();
    if (diffTime < 0) {
      return 0; // Assignment date is in the future
    }
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  selectBlock(block: BlockSummary) {
    console.log("Selected block:", block);
    this.router.navigate(["/blocks"], {
      state: { territory: this.territory, block },
    });
  }

  openMapModal() {
    this.isMapModalOpen = true;
  }

  closeMapModal() {
    this.isMapModalOpen = false;
    this.listenersAdded = false; // Reset the flag to reinitialize listeners when the modal is reopened
  }

  ngAfterViewChecked() {
    if (
      this.isMapModalOpen &&
      !this.listenersAdded &&
      this.mapImage &&
      this.mapContainer
    ) {
      const mapImage = this.mapImage.nativeElement;
      const mapContainer = this.mapContainer.nativeElement;

      // Add event listeners for zooming and panning
      mapContainer.addEventListener("wheel", (event) => this.onWheel(event));
      mapImage.addEventListener("mousedown", (event) =>
        this.onMouseDown(event)
      );
      mapImage.addEventListener("mousemove", (event) =>
        this.onMouseMove(event)
      );
      mapImage.addEventListener("mouseup", () => this.onMouseUp());
      mapImage.addEventListener("mouseleave", () => this.onMouseUp());

      // Add touch event listeners for mobile devices
      mapImage.addEventListener("touchstart", (event) =>
        this.onTouchStart(event)
      );
      mapImage.addEventListener("touchmove", (event) =>
        this.onTouchMove(event)
      );
      mapImage.addEventListener("touchend", () => this.onTouchEnd());

      this.listenersAdded = true; // Ensure listeners are added only once per modal open
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
    this.mapImage.nativeElement.style.cursor = "grabbing";
  }

  onMouseMove(event: MouseEvent) {
    if (event.buttons !== 1) return; // Only pan when the left mouse button is pressed
    this.panX = event.clientX - this.startX;
    this.panY = event.clientY - this.startY;
    this.updateTransform();
  }

  onMouseUp() {
    this.mapImage.nativeElement.style.cursor = "grab";
  }

  onTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      // Single touch for panning
      const touch = event.touches[0];
      this.startX = touch.clientX - this.panX;
      this.startY = touch.clientY - this.panY;
    } else if (event.touches.length === 2) {
      // Two fingers for zooming
      this.initialDistance = this.getDistance(event.touches);
    }
  }

  onTouchMove(event: TouchEvent) {
    event.preventDefault();
    if (event.touches.length === 1) {
      // Single touch for panning
      const touch = event.touches[0];
      this.panX = touch.clientX - this.startX;
      this.panY = touch.clientY - this.startY;
      this.updateTransform();
    } else if (event.touches.length === 2) {
      // Two fingers for zooming
      const currentDistance = this.getDistance(event.touches);
      const scaleChange = currentDistance / this.initialDistance;
      this.scale = Math.min(Math.max(this.scale * scaleChange, 1), 3); // Limit zoom between 1x and 3x
      this.initialDistance = currentDistance;
      this.updateTransform();
    }
  }

  onTouchEnd() {
    // Reset initial distance when touch ends
    this.initialDistance = 0;
  }

  getDistance(touches: TouchList): number {
    const [touch1, touch2] = [touches[0], touches[1]];
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  updateTransform() {
    const transform = `scale(${this.scale}) translate(${
      this.panX / this.scale
    }px, ${this.panY / this.scale}px)`;
    this.mapImage.nativeElement.style.transform = transform;
  }
}
