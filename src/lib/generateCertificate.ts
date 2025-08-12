import { PDFDocument, PDFFont, PDFPage, RGB, rgb } from "pdf-lib";
import fontkit from '@pdf-lib/fontkit';

type CertificateData = {
    participant_name: string;
    program_name: string;
    certificate_sequence: string;
    year: string;
    user_id: string; 
}

type PropsData = {
    data: string;
    font: PDFFont;
    size: number;
    lineHeight: number;
    color: RGB;
    Y: number;
}

type DrawProps = {
    doc: PDFPage;
    pdfData: PropsData;
    pdfWidth: number;
    pdfHeight: number;
}

// Helper functions
const getY = (Y: number, pdfHeight: number, fontSize: number) => (pdfHeight - fontSize) - Y;
const getFontWidth = (font: PDFFont, text: string, fontSize: number) => ~~font.widthOfTextAtSize(text, fontSize) + 1;
const getX = (pdfWidth: number, fontWidth: number) => (~~(~~(pdfWidth / 2) - ~~(fontWidth / 2))) + 13;

// Function to convert text to Title Case
const toTitleCase = (text: string): string => {
    return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

function draw({ doc, pdfData, pdfWidth, pdfHeight }: DrawProps): void {
    const { data, color, font, lineHeight, size, Y } = pdfData;
    doc.drawText(data, {
        size,
        lineHeight,
        font,
        color,
        x: getX(pdfWidth, getFontWidth(font, data, size)),
        y: getY(Y, pdfHeight, size),
    });
}

// Fungsi untuk load file dari public folder
const loadAsset = async (filename: string): Promise<ArrayBuffer> => {
    const response = await fetch(`/assets/certificate/${filename}`);
    if (!response.ok) {
        throw new Error(`Failed to load ${filename}`);
    }
    return await response.arrayBuffer();
};

export const generateCertificate = async (certificateData: CertificateData): Promise<Uint8Array> => {
    try {
        // Load template dan fonts
        const [templateBytes, beauRivageBytes, poppinsLightBytes, poppinsRegularBytes] = await Promise.all([
            loadAsset("Template Certificate.pdf"),
            loadAsset("BeauRivage.ttf"),
            loadAsset("PoppinsLight.ttf"),
            loadAsset("PoppinsRegular.ttf")
        ]);

        // Load PDF template
        const pdf = await PDFDocument.load(templateBytes);
        const doc = pdf.getPage(0);
        const { width: pdfWidth, height: pdfHeight } = doc.getSize();

        // Register fontkit
        pdf.registerFontkit(fontkit);

        // Embed fonts
        const beauRivageFont = await pdf.embedFont(beauRivageBytes);
        const poppinsLightFont = await pdf.embedFont(poppinsLightBytes);
        const poppinsRegularFont = await pdf.embedFont(poppinsRegularBytes);

        const formattedCertificateId = `${certificateData.certificate_sequence}/${certificateData.user_id}/program/${certificateData.year}`;

        // Setup text data
        const certificateIdData: PropsData = {
            data: formattedCertificateId, 
            font: poppinsLightFont,
            size: 16,
            lineHeight: 120,
            color: rgb(0, 0, 0),
            Y: 143,
        };

        const studentData: PropsData = {
            data: toTitleCase(certificateData.participant_name),
            font: beauRivageFont,
            color: rgb(0, 0, 0),
            lineHeight: 120,
            size: 64,
            Y: 241,
        };

        const programData: PropsData = {
            data: certificateData.program_name,
            font: poppinsRegularFont,
            color: rgb(174 / 255, 0.22 / 255, 0.34 / 255),
            size: 20,
            Y: 379,
            lineHeight: 120,
        };

        // Draw text pada PDF
        draw({ doc, pdfData: certificateIdData, pdfWidth, pdfHeight });
        draw({ doc, pdfData: studentData, pdfWidth, pdfHeight });
        draw({ doc, pdfData: programData, pdfWidth, pdfHeight });

        // Return PDF bytes
        return await pdf.save();
    } catch (error) {
        console.error("Error generating certificate:", error);
        throw error;
    }
};