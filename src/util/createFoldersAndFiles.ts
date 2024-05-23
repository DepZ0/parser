import fs from "fs";
import path from "path";

export const createDirectoryIfNotExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const writeJsonToFile = (filePath: string, data: unknown) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const readJsonFromFile = <T>(filePath: string): T | null => {
  if (fs.existsSync(filePath)) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      if (fileContent) {
        return JSON.parse(fileContent) as T;
      }
    } catch (error) {
      console.warn(`Error reading or parsing ${filePath}, returning null.`);
    }
  }
  return null;
};

export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const pdfDir = path.join(__dirname, "../parserResult", getTodayDateString(), "pdf");
