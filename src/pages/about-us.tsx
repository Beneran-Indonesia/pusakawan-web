import React from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import MaintenancePage from '@/components/Maintenance';

// { certificateData }
const MyCertificatePage = () => {

    async function createPdf() {
        const pdfDoc = await PDFDocument.create()
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

        const page = pdfDoc.addPage()
        const { width, height } = page.getSize()
        const fontSize = 30
        page.drawText('Creating PDFs in JavaScript is awesome!', {
            x: 50,
            y: height - 4 * fontSize,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0.53, 0.71),
        })

        const pdfBytes = await pdfDoc.save()
        console.log(pdfBytes)
    }

    return (
        <MaintenancePage />
        // <div>
        //   <h1>Certificate of Completion</h1>
        //   <p>This is to certify that</p>
        //   <p>{certificateData.studentName}</p>
        //   <p>has successfully completed the course</p>
        //   <p>{certificateData.courseName}</p>
        //   <p>Course Number: {certificateData.courseNumber}</p>

        //   <button onClick={createPdf}>Save as PDF</button>
        // </div>
    );
};

// export async function getServerSideProps() {
//     // Fetch your data from the server-side (replace this with your actual data fetching logic)
//     //   const certificateData = await fetchDataFromServer();
//     const certificateData = { studentName: 'Sarah', courseName: "Course Name", courseNumber: "Program/01/2023" };
//     // Pass the data as props to the page component
//     return {
//         props: {
//             certificateData,
//         },
//     };
// }

export async function getStaticProps({ locale }: { locale: "en" | "id" }) {
    return {
        props: {
            messages: (await import(`../locales/${locale}.json`)).default,
        },
    };
}

export default MyCertificatePage;
