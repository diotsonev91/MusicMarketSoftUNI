import { Component, EventEmitter, Input, Output, OnInit, QueryList, ElementRef, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  styleUrls: ['./shared-form.component.css'],
  templateUrl: './shared-form.component.html',
})
export class SharedFormComponent implements OnInit {
  @Input() title!: string;
  @Input() fields: { name: string; label: string; type: string; required: boolean }[] = [];
  @Input() errorMessage: string | null = null; // New Input for error message
  @Output() formSubmit = new EventEmitter<any>();

  form!: FormGroup;
  @ViewChildren('formField') formFields!: QueryList<ElementRef>;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    const formControls = this.fields.reduce((controls, field) => {
      controls[field.name] = ['', field.required ? Validators.required : []];
      return controls;
    }, {} as { [key: string]: any });

    this.form = this.fb.group(formControls);
  }

  onSubmit() {
    console.log(this.errorMessage)
    
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      // Mark all fields as touched to trigger validation messages
      this.form.markAllAsTouched();

      // Focus on the first invalid field
      const firstInvalidControl = this.formFields.find((field, index) =>
        this.form.get(this.fields[index].name)?.invalid ===true
      );
      if (firstInvalidControl) {
        firstInvalidControl.nativeElement.focus();
      }

      this.cdr.detectChanges();
    }
  }

  updateFormValues(values: { [key: string]: any }): void {
    if (!this.form) return; // Ensure the form is initialized
  
    Object.keys(values).forEach((key) => {
      if (this.form.controls[key]) {
        this.form.controls[key].setValue(values[key]); // Update the form control value
      }
    });
  }
}
