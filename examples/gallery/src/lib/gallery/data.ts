import {
	sampleSheets,
	type SheetAnswers,
	type SheetContentSection,
	type SheetDocument,
	type SheetQuestion,
	type SheetSample
} from '@ljoukov/sheet';

export const galleryNavigation = [
	{ href: '/', label: 'Overview', caption: 'Poster, routes, and visual context' },
	{ href: '/catalog', label: 'Catalog', caption: 'Supported surfaces, inputs, and live previews' },
	{ href: '/worksheet', label: 'Worksheets', caption: 'Whole sheet demos with seeded content' },
	{ href: '/feedback', label: 'Feedback cards', caption: 'Question-level tutor note states' },
	{ href: '/thread', label: 'Feedback thread', caption: 'Conversation bubbles and reply composer' },
	{ href: '/questions/fill', label: 'Fill', caption: 'Blank and inline-answer question row' },
	{ href: '/questions/mcq', label: 'MCQ', caption: 'Choice layout and review rhythm' },
	{ href: '/questions/lines', label: 'Lines', caption: 'Ruled long-answer surface' },
	{ href: '/questions/calc', label: 'Calc', caption: 'Formula prompt and unit input' },
	{ href: '/questions/match', label: 'Match', caption: 'Pairing interactions and spacing' },
	{ href: '/questions/spelling', label: 'Spelling', caption: 'Word correction layout' },
	{ href: '/markdown', label: 'Markdown', caption: 'Rich text, code, and maths rendering' }
] as const;

export const worksheetEntries = sampleSheets.map((sheet) => ({
	id: sheet.id,
	title: sheet.document.title,
	subject: sheet.document.subject,
	level: sheet.document.level,
	subtitle: sheet.document.subtitle,
	href: `/worksheet/${sheet.id}`,
	accent: sheet.document.color
}));

export const questionKinds = ['fill', 'mcq', 'lines', 'calc', 'match', 'spelling'] as const;

export type QuestionKind = (typeof questionKinds)[number];

type QuestionDemoSelection = {
	sheetId: string;
	sectionId: string;
	questionId: string;
	label: string;
	description: string;
};

const questionSelections = {
	fill: {
		sheetId: 'roman',
		sectionId: 'A',
		questionId: 'A1',
		label: 'Fill Question',
		description: 'Single-blank retrieval prompt with inline paper styling.'
	},
	mcq: {
		sheetId: 'roman',
		sectionId: 'A',
		questionId: 'A3',
		label: 'Multiple Choice',
		description: 'Objective question row with roomy options and paper accents.'
	},
	lines: {
		sheetId: 'roman',
		sectionId: 'B',
		questionId: 'B4',
		label: 'Lines Question',
		description: 'Ruled writing area for longer student responses.'
	},
	calc: {
		sheetId: 'iron',
		sectionId: 'A',
		questionId: 'A3',
		label: 'Calculation Question',
		description: 'Formula-led prompt with compact answer and unit treatment.'
	},
	match: {
		sheetId: 'roman',
		sectionId: 'C',
		questionId: 'C1',
		label: 'Match Question',
		description: 'Term-to-definition layout with two aligned columns.'
	},
	spelling: {
		sheetId: 'english',
		sectionId: 'A',
		questionId: 'A4',
		label: 'Spelling Question',
		description: 'Correction rows that keep prompt text and answer rhythm aligned.'
	}
} satisfies Record<QuestionKind, QuestionDemoSelection>;

function cloneValue<T>(value: T): T {
	return JSON.parse(JSON.stringify(value)) as T;
}

export function getWorksheetById(id: string): SheetSample | null {
	for (const sheet of sampleSheets) {
		if (sheet.id === id) {
			return cloneValue(sheet);
		}
	}

	return null;
}

function findQuestionSelection(selection: QuestionDemoSelection): {
	sample: SheetSample;
	section: SheetContentSection;
	question: SheetQuestion;
	seedAnswers?: SheetAnswers;
} | null {
	for (const sample of sampleSheets) {
		if (sample.id !== selection.sheetId) {
			continue;
		}

		for (const section of sample.document.sections) {
			if (!('id' in section) || section.id !== selection.sectionId) {
				continue;
			}
			const typedSection = section as SheetContentSection;
			for (const question of typedSection.questions ?? []) {
				if (question.id === selection.questionId) {
					const answer = sample.seedAnswers?.[question.id];
					return {
						sample: cloneValue(sample),
						section: cloneValue(typedSection),
						question: cloneValue(question),
						...(answer !== undefined ? { seedAnswers: { [question.id]: cloneValue(answer) } } : {})
					};
				}
			}
		}
	}

	return null;
}

export function getQuestionDemo(kind: QuestionKind): {
	description: string;
	label: string;
	sheet: SheetDocument;
	seedAnswers?: SheetAnswers;
} | null {
	const selection = questionSelections[kind];
	const match = findQuestionSelection(selection);
	if (!match) {
		return null;
	}

	return {
		label: selection.label,
		description: selection.description,
		sheet: {
			...match.sample.document,
			id: `${match.sample.id}-${kind}-demo`,
			title: selection.label,
			subtitle: selection.description,
			sections: [
				{
					type: 'hook',
					text: `Focused demo of the ${selection.label.toLowerCase()} surface.`
				},
				{
					...match.section,
					questions: [match.question]
				}
			]
		},
		...(match.seedAnswers ? { seedAnswers: match.seedAnswers } : {})
	};
}
