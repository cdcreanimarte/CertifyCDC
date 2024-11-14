import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./routes/certificates/views/certificate-form/certificate-form.component').then(m => m.CertificateFormComponent)
  }
];
