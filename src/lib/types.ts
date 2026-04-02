import type {
	PaperSheetAnswers as SchemaPaperSheetAnswers,
	PaperSheetAnswerBankOption,
	PaperSheetAnswerBankQuestion,
	PaperSheetBlank,
	PaperSheetCalcQuestion,
	PaperSheetClozeQuestion,
	PaperSheetContentSection as SchemaPaperSheetContentSection,
	PaperSheetData as SchemaPaperSheetData,
	PaperSheetFeedbackAttachment,
	PaperSheetFeedbackThread,
	PaperSheetFeedbackTurn,
	PaperSheetFillQuestion,
	PaperSheetFlowQuestion,
	PaperSheetHookSection,
	PaperSheetInfoBox,
	PaperSheetLinesQuestion,
	PaperSheetMatchQuestion,
	PaperSheetMcqOption,
	PaperSheetMcqQuestion,
	PaperSheetQuestionEntry as SchemaPaperSheetQuestionEntry,
	PaperSheetQuestionGroup,
	PaperSheetQuestionReview,
	PaperSheetQuestionReviewStatus,
	PaperSheetReview,
	PaperSheetScore,
	PaperSheetSpellingQuestion,
	SparkGraderWorksheetReferences,
	SparkGraderWorksheetReport
} from './schema.js';

export type {
	PaperSheetAnswerBankOption,
	PaperSheetAnswerBankQuestion,
	PaperSheetBlank,
	PaperSheetCalcQuestion,
	PaperSheetClozeQuestion,
	PaperSheetFeedbackAttachment,
	PaperSheetFeedbackThread,
	PaperSheetFeedbackTurn,
	PaperSheetFillQuestion,
	PaperSheetFlowQuestion,
	PaperSheetHookSection,
	PaperSheetInfoBox,
	PaperSheetLinesQuestion,
	PaperSheetMatchQuestion,
	PaperSheetMcqOption,
	PaperSheetMcqQuestion,
	PaperSheetQuestionGroup,
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
	| PaperSheetAnswerBankQuestion
	| PaperSheetFillQuestion
	| PaperSheetMcqQuestion
	| PaperSheetLinesQuestion
	| PaperSheetCalcQuestion
	| PaperSheetMatchQuestion
	| PaperSheetSpellingQuestion
	| PaperSheetClozeQuestion
	| PaperSheetFlowQuestion;

export type PaperSheetQuestionEntry = SchemaPaperSheetQuestionEntry;

export type PaperSheetContentSection = Omit<SchemaPaperSheetContentSection, 'questions'> & {
	questions?: PaperSheetQuestionEntry[];
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
export type SheetAnswerBankOption = PaperSheetAnswerBankOption;
export type SheetAnswerBankQuestion = PaperSheetAnswerBankQuestion;
export type SheetBlank = PaperSheetBlank;
export type SheetCalculationQuestion = PaperSheetCalcQuestion;
export type SheetClozeQuestion = PaperSheetClozeQuestion;
export type SheetComposerAttachmentDraft = PaperSheetComposerAttachmentDraft;
export type SheetContentSection = PaperSheetContentSection;
export type SheetFeedbackAttachment = PaperSheetFeedbackAttachment;
export type SheetFeedbackThreadData = PaperSheetFeedbackThread;
export type SheetFeedbackTurn = PaperSheetFeedbackTurn;
export type SheetFillQuestion = PaperSheetFillQuestion;
export type SheetFlowQuestion = PaperSheetFlowQuestion;
export type SheetHookSection = PaperSheetHookSection;
export type SheetInfoBox = PaperSheetInfoBox;
export type SheetLinesQuestion = PaperSheetLinesQuestion;
export type SheetMatchQuestion = PaperSheetMatchQuestion;
export type SheetMultipleChoiceOption = PaperSheetMcqOption;
export type SheetMultipleChoiceQuestion = PaperSheetMcqQuestion;
export type SheetQuestion = PaperSheetQuestion;
export type SheetQuestionEntry = PaperSheetQuestionEntry;
export type SheetQuestionGroup = PaperSheetQuestionGroup;
export type SheetQuestionReview = PaperSheetQuestionReview;
export type SheetQuestionReviewStatus = PaperSheetQuestionReviewStatus;
export type SheetReferences = SparkGraderWorksheetReferences;
export type SheetReport = SparkGraderWorksheetReport;
export type SheetReview = PaperSheetReview;
export type SheetScore = PaperSheetScore;
export type SheetSection = PaperSheetSection;
export type SheetSpellingQuestion = PaperSheetSpellingQuestion;
