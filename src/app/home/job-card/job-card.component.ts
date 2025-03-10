import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css']
})
export class JobCardComponent {
  @Input() job!: any;
  getFormattedIndustry(industry: string): string {
    return industry.replace(/&amp;/g, '&');
  }
  
}
