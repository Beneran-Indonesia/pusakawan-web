/* eslint-disable */

import { PDFDocument, PDFFont, PDFPage, RGB, rgb } from "pdf-lib";
import fontkit from '@pdf-lib/fontkit'
import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs/promises';
import path from 'path';
import { getSession } from "next-auth/react";

type ResponseData = {
    success: boolean;
    certificate?: string;
    message?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>,
) {
    if (req.method !== "POST") return res.status(400).json({ success: false, message: "Method is not POST." });
    const session = await getSession({ req });
    if (!session) return res.status(400).json({ success: false, message: "User unauthenticated." });

    const { student_name: studentName, program_name: programName, program_id: programID } = req.body;

    if (!studentName || !programID || !programName) return res.status(400).json({ success: false, message: "Missing body / needed data." });

    try {
        const pdf = await generateCertificate({ studentName, programName, programID });
        return res.status(200).send({ success: true, certificate: pdf });
    } catch (e) {
        console.error("GETTING PDF ERROR:", e)
    }
}

type GenerateCertificateProps = {
    studentName: string;
    programName: string;
    programID: string;
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

/*
So basically in Figma, 0 means it's on top of the pdf. 
In pdf-lib, 0 means it's on the bottom of the pdf.
In figma, if you want to have it equal to 0 in pdf-lib, you need to count height - fontsize (with line height)
*/

// This function basically: Y in figma converted to pdf-lib Y.
const getY = (Y: number, pdfHeight: number, fontSize: number) => (pdfHeight - fontSize) - Y;
// The whole text width
const getFontWidth = (font: PDFFont, text: string, fontSize: number) => ~~font.widthOfTextAtSize(text, fontSize) + 1
// Basically (pdfWidth / 2)- (fontWidth / 2) + 13 bcs it's not center aligned.
const getX = (pdfWidth: number, fontWidth: number) => (~~(~~(pdfWidth / 2) - ~~(fontWidth / 2))) + 13;

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
    return;
}

async function generateCertificate({ studentName, programName, programID }: GenerateCertificateProps): Promise<string> {
    const certificatePDFBytes = await getFile("Template Certificate.pdf");

    const pdf = await PDFDocument.load(certificatePDFBytes);

    const doc = pdf.getPage(0);
    // 595 , 842
    const { width: pdfWidth, height: pdfHeight } = doc.getSize();

    const beauRivage = await getFile("BeauRivage.ttf");
    const poppinsLight = await getFile("PoppinsLight.ttf");
    const poppinsRegular = await getFile("PoppinsRegular.ttf");

    pdf.registerFontkit(fontkit);

    const beauRivageFont = await pdf.embedFont(beauRivage);
    const poppinsLightFont = await pdf.embedFont(poppinsLight);
    const poppinsRegularFont = await pdf.embedFont(poppinsRegular);

    const programIDData: PropsData = {
        data: programID,
        font: poppinsLightFont,
        size: 16,
        lineHeight: 120,
        color: rgb(0, 0, 0),
        Y: 143,
    }

    const studentData: PropsData = {
        data: studentName,
        font: beauRivageFont,
        color: rgb(0, 0, 0),
        lineHeight: 120,
        size: 64,
        Y: 256,
    }

    const programData: PropsData = {
        data: programName,
        font: poppinsRegularFont,
        color: rgb(174 / 255, 0.22 / 255, 0.34 / 255),
        size: 20,
        Y: 379,
        lineHeight: 120,
    }

    // Add program ID text
    draw({ doc, pdfData: programIDData, pdfWidth, pdfHeight })
    draw({ doc, pdfData: studentData, pdfWidth, pdfHeight })
    draw({ doc, pdfData: programData, pdfWidth, pdfHeight })

    const pdfBytes = await pdf.saveAsBase64();

    return pdfBytes;

}

const getFile = async (filename: string) => await fs.readFile(path.join(process.cwd(), 'public', 'assets', 'certificate', filename));