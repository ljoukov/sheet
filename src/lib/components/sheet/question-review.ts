import type { PaperSheetFeedbackThread, PaperSheetQuestionReview } from './types.js';

function hasFiniteScore(
	score: PaperSheetQuestionReview['score'] | undefined
): score is NonNullable<PaperSheetQuestionReview['score']> {
	return (
		score !== undefined &&
		Number.isFinite(score.got) &&
		Number.isFinite(score.total) &&
		score.got >= 0 &&
		score.total > 0
	);
}

export function formatQuestionMarksLabel(
	questionMarks: number,
	review: PaperSheetQuestionReview | null
): string {
	if (!hasFiniteScore(review?.score)) {
		return `[${questionMarks}m]`;
	}

	const markLabel = review.score.total === 1 ? 'mark' : 'marks';
	return `[${review.score.got}/${review.score.total} ${markLabel}]`;
}

export function shouldShowQuestionFeedback(
	review: PaperSheetQuestionReview | null,
	thread: PaperSheetFeedbackThread | null,
	showCompletedFeedbackCards: boolean
): boolean {
	if (review === null) {
		return false;
	}

	if (showCompletedFeedbackCards) {
		return true;
	}

	if (thread?.status === 'resolved') {
		return false;
	}

	return !(review.status === 'correct' && (thread?.turns.length ?? 0) === 0);
}
