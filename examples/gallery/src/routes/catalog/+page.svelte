<script lang="ts">
	import { Markdown, Sheet, SheetFeedbackCard, SheetFeedbackThread } from '@ljoukov/sheet';
	import {
		feedbackCardStates,
		feedbackThreadStates,
		markdownStates,
		type FeedbackCardState
	} from '$lib/gallery/component-demos.js';
	import {
		getQuestionDemo,
		getWorksheetById,
		questionKinds,
		type QuestionKind
	} from '$lib/gallery/data.js';
	import { sheetCatalogCategories, sheetCatalogItems } from '$lib/gallery/catalog.js';

	const questionKindSet = new Set(questionKinds);
	const rootSheet = getWorksheetById('roman');
	const reviewSummarySheet = getWorksheetById('hamilton-2023');

	const categorySections = sheetCatalogCategories.map((category) => ({
		...category,
		items: sheetCatalogItems.filter((item) => item.categoryId === category.id)
	}));

	const supportMetrics = [
		{
			label: 'Catalogued surfaces',
			value: sheetCatalogItems.length.toString()
		},
		{
			label: 'Question input types',
			value: questionKinds.length.toString()
		},
		{
			label: 'Feedback / runtime states',
			value: '7'
		},
		{
			label: 'Adjacent surfaces',
			value: sheetCatalogItems.filter((item) => item.categoryId === 'adjacent').length.toString()
		}
	] as const;

	const sourceFiles = [
		'src/lib/Sheet.svelte',
		'src/lib/SheetFeedbackCard.svelte',
		'src/lib/SheetFeedbackThread.svelte',
		'src/lib/components/sheet/paper-sheet.svelte',
		'src/lib/components/sheet/paper-sheet-question-feedback.svelte',
		'src/lib/components/sheet/paper-sheet-feedback-response-modal.svelte',
		'src/lib/components/sheet/paper-sheet-feedback-chat.svelte'
	] as const;

	let drafts = $state<Record<string, string>>({});
	let threadDraft = $state('');

	function getDraft(key: string): string {
		return drafts[key] ?? '';
	}

	function setDraft(key: string, value: string): void {
		drafts = {
			...drafts,
			[key]: value
		};
	}
</script>

<div class="gallery-page gallery-page--wide">
	<header class="gallery-page__intro">
		<div class="gallery-page__eyebrow">Catalog</div>
		<h1 class="gallery-page__title">Sheet UI surface catalog.</h1>
		<p class="gallery-page__description">
			Canonical inventory of the current `@ljoukov/sheet` surfaces. Each preview renders the actual
			exported component or the underlying sheet renderer, not a static mock.
		</p>
	</header>

	<section class="gallery-stage">
		<div class="gallery-stage__header">
			<div>
				<p class="gallery-stage__title">Coverage</p>
				<p class="gallery-stage__copy">
					Use this route to check what the library already supports before adding exam-specific
					variants or consumer-specific wrappers.
				</p>
			</div>
		</div>

		<div class="gallery-grid gallery-grid--three">
			{#each supportMetrics as metric (metric.label)}
				<div class="gallery-stat">
					<p class="gallery-stat__value">{metric.value}</p>
					<p class="gallery-stat__label">{metric.label}</p>
				</div>
			{/each}
		</div>

		<div class="gallery-source-list">
			{#each sourceFiles as source (source)}
				<span class="gallery-source-chip">{source}</span>
			{/each}
		</div>
	</section>

	{#each categorySections as category (category.id)}
		<section class="gallery-stage">
			<div class="gallery-stage__header">
				<div>
					<p class="gallery-stage__title">{category.title}</p>
					<p class="gallery-stage__copy">{category.description}</p>
				</div>
			</div>

			<div class="gallery-catalog">
				{#each category.items as item (item.id)}
					<div class="gallery-catalog__item">
						<div class="gallery-catalog__copy">
							<div class="gallery-catalog__heading">
								<h2 class="gallery-catalog__title">{item.title}</h2>
								<span class="gallery-pill">{item.component}</span>
							</div>
							<p class="gallery-catalog__description">{item.description}</p>

							<div class="gallery-token-group">
								<p class="gallery-token-group__label">Required inputs</p>
								<div class="gallery-token-row">
									{#each item.requiredInputs as input (input)}
										<span class="gallery-token gallery-token--required">{input}</span>
									{/each}
								</div>
							</div>

							{#if item.optionalInputs}
								<div class="gallery-token-group">
									<p class="gallery-token-group__label">Optional inputs</p>
									<div class="gallery-token-row">
										{#each item.optionalInputs as input (input)}
											<span class="gallery-token">{input}</span>
										{/each}
									</div>
								</div>
							{/if}

							{#if item.answerShape}
								<div class="gallery-token-group">
									<p class="gallery-token-group__label">Answer payload</p>
									<code class="gallery-code-block">{item.answerShape}</code>
								</div>
							{/if}

							{#if item.note}
								<p class="gallery-note">{item.note}</p>
							{/if}
						</div>

						<div class="gallery-catalog__preview">
							{#if item.previewKind === 'sheet-root' && rootSheet}
								<div class="gallery-canvas gallery-canvas--sheet">
									<Sheet
										document={rootSheet.document}
										seedAnswers={rootSheet.seedAnswers}
										mode="interactive"
										showFooter={false}
									/>
								</div>
							{:else if item.previewKind === 'review-summary' && reviewSummarySheet}
								<div class="gallery-canvas gallery-canvas--sheet">
									<Sheet
										document={reviewSummarySheet.document}
										seedAnswers={reviewSummarySheet.seedAnswers}
										review={reviewSummarySheet.mockReview ?? undefined}
										mode="review"
										showFooter={false}
									/>
								</div>
							{:else if questionKindSet.has(item.previewKind as QuestionKind)}
								{@const questionDemo = getQuestionDemo(item.previewKind as QuestionKind)}
								{#if questionDemo}
									<div class="gallery-canvas gallery-canvas--sheet">
										<Sheet
											document={questionDemo.sheet}
											seedAnswers={questionDemo.seedAnswers}
											mode="interactive"
											showFooter={false}
										/>
									</div>
								{/if}
							{:else if item.previewKind === 'feedback-card'}
								<div class="gallery-frame">
									<SheetFeedbackCard
										review={feedbackCardStates.open.review}
										thread={feedbackCardStates.open.thread}
										questionLabel="question 4"
										draft={getDraft(item.id)}
										onDraftChange={(value) => {
											setDraft(item.id, value);
										}}
									/>
								</div>
							{:else if item.previewKind === 'feedback-attachments'}
								<div class="gallery-frame">
									<SheetFeedbackThread
										thread={feedbackThreadStates.attachments.thread}
										questionLabel="question 1"
										draft={threadDraft}
										onDraftChange={(value) => {
											threadDraft = value;
										}}
									/>
								</div>
							{:else if item.previewKind === 'feedback-runtime'}
								<div class="gallery-grid gallery-grid--two">
									{#each ['pending', 'thinking', 'responding', 'resolved'] as state (state)}
										{@const runtimeState = state as FeedbackCardState}
										<div class="gallery-frame">
											<SheetFeedbackCard
												review={feedbackCardStates[runtimeState].review}
												thread={feedbackCardStates[runtimeState].thread}
												questionLabel="question runtime"
												draft=""
												processing={feedbackCardStates[runtimeState].processing ?? false}
												runtimeStatus={feedbackCardStates[runtimeState].runtimeStatus ?? null}
												thinkingText={feedbackCardStates[runtimeState].thinkingText ?? null}
												assistantDraftText={feedbackCardStates[runtimeState].assistantDraftText ??
													null}
												showComposer={!feedbackCardStates[runtimeState].showFollowUpButton}
												showFollowUpButton={feedbackCardStates[runtimeState].showFollowUpButton ??
													false}
											/>
										</div>
									{/each}
								</div>
							{:else if item.previewKind === 'markdown'}
								<div class="gallery-frame">
									<Markdown markdown={markdownStates.block.markdown} />
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/each}
</div>
