import { useState, useEffect, useCallback } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTranslations } from "next-intl";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface DownloadCertificateProps {
  userIsEnrolled: boolean;
  isPassed: boolean;
  userId?: number;
  programId: number;
  programTitle: string;
  onSuccess: (certificateUrl: string, message: string) => void;
  onError: (message: string) => void;
  autoDownload?: boolean;
}

export default function DownloadCertificate({
  userIsEnrolled,
  isPassed,
  userId,
  programId,
  programTitle,
  onSuccess,
  onError,
  autoDownload = false,
}: DownloadCertificateProps) {
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
  const t = useTranslations("class.overview");

  const generateCertificate = useCallback(
    async (isAutoDownload = false) => {
      if (!userIsEnrolled) {
        onError("User belum enroll");
        return;
      }

      if (!isPassed) {
        onError("Anda belum lulus post-test atau belum mengerjakan post-test");
        return;
      }

      setIsGeneratingCertificate(true);

      try {
        // Fetch user and program data from backend
        const response = await fetch("/api/certificate-data", {
          method: "POST",
          body: JSON.stringify({
            userId,
            programId,
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Gagal mendapatkan data sertifikat"
          );
        }

        const data = await response.json();
        const { userName, issueDate, programTitle: fetchedTitle } = data;

        // Generate certificate PDF on frontend
        const certificateUrl = await createCertificatePDF(
          userName,
          fetchedTitle || programTitle,
          issueDate || new Date().toLocaleDateString("id-ID")
        );

        onSuccess(
          certificateUrl,
          isAutoDownload
            ? "Sertifikat sedang diunduh otomatis!"
            : "Sertifikat berhasil diunduh!"
        );
      } catch (error) {
        console.error("Error generating certificate:", error);
        onError(
          "Error: " + (error instanceof Error ? error.message : String(error))
        );
      } finally {
        setIsGeneratingCertificate(false);
      }
    },
    [
      userIsEnrolled,
      isPassed,
      userId,
      programId,
      programTitle,
      onSuccess,
      onError,
    ]
  );

  // Check for auto download when component mounts
  useEffect(() => {
    if (autoDownload && isPassed && userIsEnrolled) {
      generateCertificate(true);
    }
  }, [autoDownload, isPassed, userIsEnrolled, generateCertificate]);

  // Function to create PDF certificate using pdf-lib
  const createCertificatePDF = async (
    userName: string,
    title: string,
    issueDate: string
  ) => {
    try {
      // Load certificate template from public folder
      const templateResponse = await fetch(
        "/assets/certificate/Template Certificate.pdf"
      );
      if (!templateResponse.ok) {
        throw new Error("Gagal memuat template sertifikat");
      }

      const templateArrayBuffer = await templateResponse.arrayBuffer();

      // Load PDF template using pdf-lib
      const pdfDoc = await PDFDocument.load(templateArrayBuffer);

      // Get standard fonts
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Get first page from template
      const page = pdfDoc.getPages()[0];
      const { width, height } = page.getSize();

      // Posisi teks berdasarkan templat sertifikat dari gambar
      const nameY = height / 2 + 20;
      const programY = height / 2 - 40;
      const dateY = height / 4;

      // nama penerima
      const nameWidth = fontBold.widthOfTextAtSize(userName, 28);
      page.drawText(userName, {
        x: (width - nameWidth) / 2,
        y: nameY,
        size: 28,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      const programText = `Telah menyelesaikan program:`;
      const programWidth = fontRegular.widthOfTextAtSize(programText, 16);
      page.drawText(programText, {
        x: (width - programWidth) / 2,
        y: programY,
        size: 16,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });

      const titleWidth = fontBold.widthOfTextAtSize(title, 20);
      page.drawText(title, {
        x: (width - titleWidth) / 2,
        y: programY - 30,
        size: 20,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      const dateText = `Diterbitkan pada: ${issueDate}`;
      const dateWidth = fontRegular.widthOfTextAtSize(dateText, 14);
      page.drawText(dateText, {
        x: (width - dateWidth) / 2,
        y: dateY,
        size: 14,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });

      // Save document as Uint8Array
      const pdfBytes = await pdfDoc.save();

      // Convert Uint8Array to Blob, then to URL
      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);

      // Download file automatically
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `sertifikat_${title.replace(/\s+/g, "_")}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return url;
    } catch (error) {
      console.error("Error creating PDF:", error);
      throw new Error(
        "Gagal membuat PDF sertifikat: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  return (
    <Box mb={2} display="flex" alignItems="center" gap={1}>
      <LoadingButton
        variant="contained"
        onClick={() => generateCertificate(false)}
        disabled={!isPassed}
        loading={isGeneratingCertificate}
        sx={{
          bgcolor: "primary.main",
          "&.Mui-disabled": {
            color: "#FFF",
            bgcolor: "primary.main",
            opacity: 0.7,
          },
        }}
      >
        {t("button.download_certificate")}
      </LoadingButton>

      <Tooltip
        title={
          isPassed
            ? "Selesaikan post-test terlebih dahulu untuk mengunduh sertifikat"
            : "Selesaikan post-test terlebih dahulu untuk mengunduh sertifikat"
        }
      >
        <InfoOutlinedIcon sx={{ color: "#999", cursor: "pointer" }} />
      </Tooltip>
    </Box>
  );
}

// Hook for auto-download functionality
export function useAutoDownloadCertificate(
  isPassed: boolean,
  userIsEnrolled: boolean,
  autoDownloadFlag: boolean
) {
  const [shouldAutoDownload, setShouldAutoDownload] = useState(false);

  useEffect(() => {
    if (isPassed && userIsEnrolled && autoDownloadFlag) {
      setShouldAutoDownload(true);
    }
  }, [isPassed, userIsEnrolled, autoDownloadFlag]);

  return { shouldAutoDownload };
}
