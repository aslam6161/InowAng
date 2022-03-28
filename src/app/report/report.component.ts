import { Component, OnInit } from '@angular/core';
import { ReportInfo } from '../_models/report-info';
import { ReportService } from '../_services/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  report:ReportInfo={numericPercentage:0,alphaNumericPercentage:0,floatPercentage:0};
  
  NumericPercentage:number;
  AlphaNumericPercentage:number;
  FloatPercentage:number;

  constructor(private reportService: ReportService) { 


  }

  ngOnInit(): void {
    this.reportService.getReportInfo().subscribe((res: any) => {

      console.log(res.data);
      this.report = res.data;
    });
  }

}
