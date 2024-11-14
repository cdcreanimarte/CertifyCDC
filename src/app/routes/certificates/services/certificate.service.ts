import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(private http: HttpClient) {}

  async generatePDF(element: HTMLElement): Promise<Blob> {
    // Configuración para mejor calidad
    const scale = 2;
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Crear PDF en orientación horizontal (landscape)
    const pdf = new jsPDF('landscape', 'mm', 'letter');

    // Calcular dimensiones para ajustar la imagen al PDF
    const imgWidth = 279.4; // Ancho carta en mm
    const imgHeight = 215.9; // Alto carta en mm

    // Agregar la imagen del canvas al PDF
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

    return pdf.output('blob');
  }

  sendEmail(email: string, pdfBlob: Blob) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('pdf', pdfBlob, 'certificate.pdf');

    //return this.http.post(`${environment.apiUrl}/send-email`, formData);
  }
}
