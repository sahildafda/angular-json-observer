import { Component } from '@angular/core';
import { ProjectData } from '../../models/project-data.model';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent {

  // Data model to hold the project JSON from the backend
  projectData!: ProjectData;

  constructor(private http: HttpClient) {
    // Load data when component is constructed
    this.loadData();
  }

  // Load data from the backend API
  loadData() {
    this.http.get<ProjectData>('http://localhost:16358/api/Home')
      .subscribe({
        next: (data) => {
          this.projectData = data;
        },
        error: (err) => {
          console.error('Error loading project data:', err);
        }
      });
  }

  // Get the value of a specific property by label
  getPropertyValue(properties: { Label: string; Value: any }[], label: string): any {
    const found = properties.find(p => p.Label.toLowerCase() === label.toLowerCase());
    return found ? found.Value : '';
  }

  // Format date using moment.js
  formatDateWithMoment(dateString: string): string {
    return moment(dateString).format('DD-MM-YYYY hh:mm A');
  }
}
