import { samplePaperSheets } from './data/sample-sheets.js';
import type { PaperSheetData, SheetDocument, SheetSample } from './types.js';

function stripDocumentState(sheet: PaperSheetData): SheetSample {
	const { initialAnswers, mockReview, ...document } = sheet;

	return {
		id: sheet.id,
		document: document as SheetDocument,
		...(initialAnswers ? { seedAnswers: initialAnswers } : {}),
		...(mockReview ? { mockReview } : {})
	};
}

export const sampleSheets = (samplePaperSheets as PaperSheetData[]).map(stripDocumentState);
