import { Component, OnInit } from '@angular/core';
import { LoadingSpinnerService } from '../../services/loading-spinner.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: false,
  
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent implements OnInit {
  
  constructor(public loadingSpinnerService: LoadingSpinnerService) {}

  ngOnInit(): void {
    
  }

}
