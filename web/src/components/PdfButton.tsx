"use client";

import { useState } from "react";

export default function PdfButton({ targetRef }: { targetRef: React.RefObject<HTMLDivElement | null> }) {
  const [loading, setLoading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!targetRef.current) return;
    setLoading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jspdfModule = await import("jspdf");
      const jsPDF = jspdfModule.jsPDF;

      const canvas = await html2canvas(targetRef.current, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const pdfWidth = 210;
      const pdfPageHeight = 297;
      const ratio = pdfWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;

      const pdf = new jsPDF("p", "mm", "a4");
      let position = 0;

      while (position < scaledHeight) {
        if (position > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -position, pdfWidth, scaledHeight);
        position += pdfPageHeight;
      }

      pdf.save("evaluation_report.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownloadPdf}
      disabled={loading}
      className="text-sm border rounded px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
    >
      {loading ? "生成中..." : "PDF"}
    </button>
  );
}
