import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Counter } from '../_models/counter';
import { Payload } from '../_models/payload';
import { ReportService } from '../_services/report.service';
import { SignalrService } from '../_services/signalr.service';


@Component({
  selector: 'app-generate-random',
  templateUrl: './generate-random.component.html',
  styleUrls: ['./generate-random.component.css']
})
export class GenerateRandomComponent implements OnInit {

  counter: Counter;

 

  form: FormGroup;
  Data: Array<any> = [
    { name: 'Numeric', value: 0 },
    { name: 'Alphanumeric', value: 1 },
    { name: 'Float', value: 2 }
  ];

  constructor(private fb: FormBuilder,
    private router: Router,
    private reportService: ReportService,
    public signalrService: SignalrService) {
    this.form = this.fb.group({
      checkArray: this.fb.array([], [Validators.required]),
      fileSize:[1, [ Validators.required]],
    });
  }

  onCheckboxChange(e: any) {
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  ngOnInit(): void {
    this.signalrService.counter.subscribe((counter: Counter) => {
      this.counter = counter;
    });

    this.signalrService.connection
    .invoke('GenerateRandomNumber')
    .catch(error => {
      console.log(`Signalr error: ${error}`);
      alert('Signalr  error!, see console for details.');
    }
  );
  }

  submitForm() {

 
    const payload = {

      selectedOptions : this.form.value.checkArray.map(Number),
      fileSize: +this.form.value.fileSize,
    }
    this.reportService.generateRandom(payload).subscribe((result: any) => {
      if (result != null) {
        console.log(result);
      }
    });
   // console.log(this.form.value);
 
  }

  stopGenerateRandom()
  {
    this.reportService.stopRandom().subscribe((result: any) => {
      if (result != null) {
        console.log(result);
      }
    });
  }

  reportGenerate()
  {
    this.router.navigate(['/report']);
  }
  
}
