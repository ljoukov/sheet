type BadgeLabelSource = {
	displayNumber?: string;
	badgeLabel?: string;
};

export function resolveBadgeLabel(source: BadgeLabelSource): string | undefined {
	return source.badgeLabel ?? source.displayNumber;
}
