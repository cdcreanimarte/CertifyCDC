import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CertificateService } from '../../services/certificate.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-certificate-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './certificate-form.component.html',
  styleUrl: './certificate-form.component.scss',

})
export class CertificateFormComponent {

  @ViewChild('certificateElement') certificateElement!: ElementRef;

  certificateForm: FormGroup;
  certificateGenerated = false;
  currentDate = new Date();
  isGenerating = false;

  constructor(
    private fb: FormBuilder,
    private certificateService: CertificateService
  ) {
    this.certificateForm = this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(3)]],
      courseName: ['', [Validators.required, Validators.minLength(3)]],
      hours: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  generateCertificate(): void {
    if (this.certificateForm.valid) {
      this.certificateGenerated = true;
    }
  }

  async downloadCertificate(): Promise<void> {
    if (!this.certificateGenerated || this.isGenerating) return;

    try {
      this.isGenerating = true;
      const element = this.certificateElement.nativeElement;
      const pdfBlob = await this.certificateService.generatePDF(element);

      // Crear URL y link para descarga
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificado_${this.certificateForm.get('studentName')?.value}.pdf`;
      link.click();

      // Limpiar
      window.URL.revokeObjectURL(url);
      console.log('PDF generado exitosamente');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    } finally {
      this.isGenerating = false;
    }
  }

  async sendEmail(): Promise<void> {
    /* if (!this.certificateGenerated || this.isGenerating) return;

    try {
      this.isGenerating = true;
      const element = this.certificateElement.nativeElement;
      const pdfBlob = await this.certificateService.generatePDF(element);

      await this.certificateService.sendEmail(
        this.certificateForm.get('email')?.value,
        pdfBlob
      ).toPromise();

      console.log('Email enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el email:', error);
    } finally {
      this.isGenerating = false;
    } */
  }
}
