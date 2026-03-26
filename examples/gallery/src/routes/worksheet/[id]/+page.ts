import { error } from '@sveltejs/kit';
import { getWorksheetById } from '$lib/gallery/data.js';

export function load({ params }) {
	if (!getWorksheetById(params.id)) {
		error(404, 'Worksheet not found');
	}

	return {
		id: params.id
	};
}
