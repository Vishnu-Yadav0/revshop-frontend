import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingService } from '../../../services/tracking.service';
import { TrackingDetail } from '../../../models/tracking.model';

@Component({
  selector: 'app-tracking-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tracking-modal.html',
  styleUrl: './tracking-modal.css'
})
export class TrackingModalComponent implements OnInit {
  @Input() orderId!: number;
  @Input() orderNumber!: string;
  @Output() close = new EventEmitter<void>();

  trackingDetails: TrackingDetail[] = [];
  loading = true;
  error = false;

  constructor(private trackingService: TrackingService) { }

  ngOnInit(): void {
    this.loadTrackingDetails();
  }

  loadTrackingDetails(): void {
    this.loading = true;
    this.trackingService.getTrackingDetails(this.orderId).subscribe({
      next: (res: any) => {
        const sorted = (res.data || []).slice().sort(
          (a: any, b: any) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
        );
        this.trackingDetails = sorted;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
