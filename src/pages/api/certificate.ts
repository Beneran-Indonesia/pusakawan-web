/* eslint-disable */

import { PDFDocument, rgb } from "pdf-lib";
import fontkit from '@pdf-lib/fontkit'
import { NextApiRequest, NextApiResponse } from "next";
import PDFTemplate from "@public/Template Certificate.pdf";
import { getSession } from "next-auth/react";

type ResponseData = {
    success: boolean;
    certificate?: Uint8Array;
    message?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>,
) {
    if (req.method !== "POST") return res.status(400).json({ success: false, message: "Method is not POST." });
    // const session = await getSession({ req });
    // if (!session) return res.status(400).json({ success: false, message: "User unauthenticated." });

    const { student_name: studentName, program_name: programName, program_id: programID } = req.body;

    if (!studentName || !programID || !programName) return res.status(400).json({ success: false, message: "Missing body / needed data." });

    try {
        const pdf = await generateCertificate({ studentName, programName, programID });
        return res.status(200).send({ success: true, certificate: pdf });
    } catch (e) {
        console.log("GETTING PDF ERROR:", e)
    }
}

type GenerateCertificateProps = {
    studentName: string;
    programName: string;
    programID: string;
}

async function generateCertificate({ studentName, programName, programID }: GenerateCertificateProps): Promise<Uint8Array> {
    const certificatePDF = "/assets/Template Certificate.pdf";
    const certificatePDFBytes = await fetch(certificatePDF).then((res) => res.arrayBuffer());

    const pdf = await PDFDocument.load(certificatePDFBytes);

    pdf.registerFontkit(fontkit);

    const beauRivage = await fetch("/assets/BeauRivage.ttf").then((res) => res.arrayBuffer());
    const poppinsLight = await fetch("/assets/PoppinsLight.ttf").then((res) => res.arrayBuffer());
    const poppinsRegular = await fetch("/assets/PoppinsRegular.ttf").then((res) => res.arrayBuffer());

    const beauRivageFont = await pdf.embedFont(beauRivage);
    const poppinsLightFont = await pdf.embedFont(poppinsLight);
    const poppinsRegularFont = await pdf.embedFont(poppinsRegular);

    const doc = pdf.getPage(0);
    const { width, height } = doc.getSize();

    // Add program ID text
    doc.drawText(programID, {
        x: 0,
        y: 143,
        size: 16,
        font: poppinsLightFont,
        color: rgb(0, 0, 0),
        // element has a font-size set to 16px , with a line-height of 120% . The computed line height value is (16px * 120)/100 = 19.2px .
        lineHeight: (16 * 120) / 100,
    })

    // Add name text
    doc.drawText(studentName, {
        x: 0,
        y: 256,
        size: 64,
        font: beauRivageFont,
        color: rgb(0, 0, 0),
        lineHeight: (64 * 120) / 100,
    })

    // Add program name text
    doc.drawText(programName, {
        x: 90,
        y: 379,
        size: 20,
        font: poppinsRegularFont,
        // #AE1622
        color: rgb(174, 22, 34),
        lineHeight: (20 * 120) / 100,
    })

    const pdfBytes = await pdf.save();

    return pdfBytes;

}