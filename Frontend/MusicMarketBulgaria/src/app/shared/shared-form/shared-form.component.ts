// shared-form.component.ts
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-form',
  standalone: true,
  imports: [ReactiveFormsModule], // Ensure this is imported
  styleUrl: './shared-form.component.css',
  templateUrl: './shared-form.component.html',
})
export class SharedFormComponent implements OnInit {
  @Input() title!: string;
  @Input() fields: { name: string; label: string; type: string; required: boolean }[] = [];
  @Output() formSubmit = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

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
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    }
  }
}
