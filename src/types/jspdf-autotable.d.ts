declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';

  interface UserOptions {
    head?: any[][];
    body?: any[][];
    foot?: any[][];
    startY?: number;
    margin?: { top: number };
    theme?: string;
    styles?: any;
    headStyles?: any;
    bodyStyles?: any;
    footStyles?: any;
  }

  interface jsPDFWithAutoTable extends jsPDF {
    autoTable: (options: UserOptions) => void;
  }

  const autoTable: (pdf: jsPDF, options: UserOptions) => void;
  export default autoTable;
} 