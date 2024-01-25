import { PDFDocument } from "pdf-lib";
import fontkit from '@pdf-lib/fontkit'

export default async function GenerateCertificate() {
    const certificatePDF = "/assets/Template Certificate.pdf";
    const certificatePDFBytes = await fetch(certificatePDF).then((res) => res.arrayBuffer());

    const pdf = await PDFDocument.load(certificatePDFBytes);

    pdf.registerFontkit(fontkit);

    const beauRivage = await fetch("/assets/BeauRivage.ttf").then((res) => res.arrayBuffer());
    const poppinsLight = await fetch("/assets/PoppinsLight.ttf").then((res) => res.arrayBuffer());
    const poppinsRegular = await fetch("/assets/PoppinsLight.ttf").then((res) => res.arrayBuffer());

    const beauRivageFont = await pdf.embedFont(beauRivage);
    const poppinsLightFont = await pdf.embedFont(poppinsLight);
    const poppinsRegularFont = await pdf.embedFont(poppinsRegular);
    
}