import type {
	PaperSheetAnswers as SchemaPaperSheetAnswers,
	PaperSheetBlank,
	PaperSheetCalcQuestion,
	PaperSheetContentSection as SchemaPaperSheetContentSection,
	PaperSheetData as SchemaPaperSheetData,
	PaperSheetFeedbackAttachment,
	PaperSheetFeedbackThread,
	PaperSheetFeedbackTurn,
	PaperSheetFillQuestion,
	PaperSheetHookSection,
	PaperSheetInfoBox,
	PaperSheetLinesQuestion,
	PaperSheetMatchQuestion,
	PaperSheetMcqQuestion,
	PaperSheetQuestionReview,
	PaperSheetQuestionReviewStatus,
	PaperSheetReview,
	PaperSheetScore,
	PaperSheetSpellingQuestion,
	SparkGraderWorksheetReferences,
	SparkGraderWorksheetReport
} from './schema.js';

export type {
	PaperSheetBlank,
	PaperSheetCalcQuestion,
	PaperSheetFeedbackAttachment,
	PaperSheetFeedbackThread,
	PaperSheetFeedbackTurn,
	PaperSheetFillQuestion,
	PaperSheetHookSection,
	PaperSheetInfoBox,
	PaperSheetLinesQuestion,
	PaperSheetMatchQuestion,
	PaperSheetMcqQuestion,
	PaperSheetQuestionReview,
	PaperSheetQuestionReviewStatus,
	PaperSheetReview,
	PaperSheetScore,
	PaperSheetSpellingQuestion,
	SparkGraderWorksheetReferences,
	SparkGraderWorksheetReport
};

export type PaperSheetAnswers = SchemaPaperSheetAnswers;
export type PaperSheetMockReview = PaperSheetReview;

export type PaperSheetComposerAttachmentDraft = {
	localId: string;
	file: File;
	filename: string;
	contentType: string;
	sizeBytes: number;
	previewUrl?: string | null;
};

export type PaperSheetQuestion =
	| PaperSheetFillQuestion
	| PaperSheetMcqQuestion
	| PaperSheetLinesQuestion
	| PaperSheetCalcQuestion
	| PaperSheetMatchQuestion
	| PaperSheetSpellingQuestion;

export type PaperSheetContentSection = Omit<SchemaPaperSheetContentSection, 'questions'> & {
	questions?: PaperSheetQuestion[];
};

export type PaperSheetSection = PaperSheetHookSection | PaperSheetContentSection;

export type SheetDocument = Omit<SchemaPaperSheetData, 'sections'> & {
	sections: PaperSheetSection[];
};

export type PaperSheetData = SheetDocument & {
	initialAnswers?: PaperSheetAnswers;
	mockReview?: PaperSheetMockReview;
};

export type SheetMode = 'interactive' | 'readonly' | 'review' | 'demo';
export type SheetRuntimeStatus = 'connecting' | 'thinking' | 'responding';

export type SheetFeedbackState = {
	sending?: boolean;
	runtimeStatus?: SheetRuntimeStatus | null;
	thinkingText?: string | null;
	assistantDraftText?: string | null;
};

export type SheetFeedbackStateMap = Record<string, SheetFeedbackState>;

export type SheetReplyAttachmentOptions = {
	enabled?: boolean;
	allowCamera?: boolean;
	accept?: string;
	maxFiles?: number;
	maxFileSizeBytes?: number;
	maxTotalSizeBytes?: number;
};

export type SheetReplyPayload = {
	text: string;
	attachments: File[];
	review: PaperSheetQuestionReview | null;
	thread: PaperSheetFeedbackThread | null;
};

export type SheetSample = {
	id: string;
	document: SheetDocument;
	seedAnswers?: PaperSheetAnswers;
	mockReview?: PaperSheetReview;
};

export type SheetAnswers = PaperSheetAnswers;
export type SheetBlank = PaperSheetBlank;
export type SheetCalculationQuestion = PaperSheetCalcQuestion;
export type SheetComposerAttachmentDraft = PaperSheetComposerAttachmentDraft;
export type SheetContentSection = PaperSheetContentSection;
export type SheetFeedbackAttachment = PaperSheetFeedbackAttachment;
export type SheetFeedbackThreadData = PaperSheetFeedbackThread;
export type SheetFeedbackTurn = PaperSheetFeedbackTurn;
export type SheetFillQuestion = PaperSheetFillQuestion;
export type SheetHookSection = PaperSheetHookSection;
export type SheetInfoBox = PaperSheetInfoBox;
export type SheetLinesQuestion = PaperSheetLinesQuestion;
export type SheetMatchQuestion = PaperSheetMatchQuestion;
export type SheetMultipleChoiceQuestion = PaperSheetMcqQuestion;
export type SheetQuestion = PaperSheetQuestion;
export type SheetQuestionReview = PaperSheetQuestionReview;
export type SheetQuestionReviewStatus = PaperSheetQuestionReviewStatus;
export type SheetReferences = SparkGraderWorksheetReferences;
export type SheetReport = SparkGraderWorksheetReport;
export type SheetReview = PaperSheetReview;
export type SheetScore = PaperSheetScore;
export type SheetSection = PaperSheetSection;
export type SheetSpellingQuestion = PaperSheetSpellingQuestion;
