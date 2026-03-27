import { error } from '@sveltejs/kit';
import { getQuestionDemo, questionKinds } from '$lib/gallery/data.js';

export function load({ params }) {
	const kind = params.kind;
	if (
		!questionKinds.includes(kind as (typeof questionKinds)[number]) ||
		!getQuestionDemo(kind as (typeof questionKinds)[number])
	) {
		error(404, 'Question render not found');
	}

	return {
		kind
	};
}
