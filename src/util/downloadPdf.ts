import * as fs from "fs";
import path from "path";
import axios from "axios";

interface PdfDownloadOptions {
  pdfLink: string;
  pdfDir: string;
  index: number;
}

export async function downloadPdf({ pdfLink, pdfDir, index }: PdfDownloadOptions): Promise<void> {
  try {
    const pdfFileName = `catalog_${index + 1}.pdf`;
    const pdfFilePath = path.join(pdfDir, pdfFileName);

    const response = await axios.get(pdfLink, {
      responseType: "arraybuffer",
      timeout: 60000,
    });

    if (response.status === 200) {
      fs.writeFileSync(pdfFilePath, response.data);
      console.log(`PDF ${pdfFileName} successfully downloaded.`);
    } else {
      console.error(`Error: Could not get PDF from link ${pdfLink}.`);
    }
  } catch (error) {
    console.error(`Error downloading PDF ${index + 1}: ${error}`);
  }
}
