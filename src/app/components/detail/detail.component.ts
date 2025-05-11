import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  // Main JSON data object from the backend
  projectData: any;

  // Index and data of the currently selected entry
  selectedIndex: number | null = null;
  selectedEntry: any = null;

  // Form-bound properties
  projectName = '';
  constructionCount = 0;
  isConstructionCompleted = false;
  lengthOfRoad = 0;

  constructor(private http: HttpClient) { }

  // Lifecycle hook: Load data on component initialization
  ngOnInit() {
    this.loadData();
  }

  // Load JSON data from the backend API
  loadData() {
    this.http.get<any>('http://localhost:3000/data').subscribe({
      next: (data) => {
        this.projectData = data;

        // Auto-select the first entry for editing
        if (data?.Datas?.length > 0) {
          this.onEntryClick(0);
        }
      },
      error: (err) => {
        console.error('Error loading data:', err);
      }
    });
  }

  // Handle user click on a specific data entry
  onEntryClick(index: number) {
    this.selectedIndex = index;
    this.selectedEntry = this.projectData?.Datas[index];

    const props = this.selectedEntry?.Properties || [];

    // Extract and assign values to form fields
    this.projectName = this.getPropertyValue(props, 'Project Name') || '';
    this.constructionCount = this.getPropertyValue(props, 'Construction Count') || 0;
    this.isConstructionCompleted = this.getPropertyValue(props, 'Is Construction Completed') || false;
    this.lengthOfRoad = this.getPropertyValue(props, 'Length of the road') || 0;
  }

  // Utility function to extract a property's value by label
  getPropertyValue(properties: any[], key: string): any {
    const prop = properties.find(p => p.Label.toLowerCase() === key.toLowerCase());
    return prop ? prop.Value : null;
  }

  // Format date using moment.js for display
  formatDateWithMoment(dateString: string): string {
    return moment(dateString).format('DD-MM-YYYY hh:mm A');
  }

  // Save changes to the selected entry and send updated data to backend
  saveChanges() {
    if (!this.selectedEntry) return;

    const props = this.selectedEntry.Properties;

    // Update or add a property by label
    const updateValue = (label: string, value: any) => {
      const prop = props.find((p: any) => p.Label.toLowerCase() === label.toLowerCase());
      if (prop) {
        prop.Value = value;
      } else {
        props.push({ Label: label, Value: value });
      }
    };

    // Apply updates from form inputs
    updateValue('Project Name', this.projectName);
    updateValue('Construction Count', this.constructionCount);
    updateValue('Is Construction Completed', this.isConstructionCompleted);
    updateValue('Length of the road', this.lengthOfRoad);

    // Send updated entry to backend using SamplingTime as identifier
    this.http.put(`http://localhost:3000/data/${this.selectedEntry.SamplingTime}`, {
      Properties: this.selectedEntry.Properties
    }).subscribe({
      next: () => {
        console.log('Data saved successfully to backend');
        alert('Changes saved successfully!');
      },
      error: (err) => {
        console.error('Error saving data:', err);
        alert('Failed to save data.');
      }
    });
  }
}
