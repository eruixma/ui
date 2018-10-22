import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { checkA11y } from '@storybook/addon-a11y';
import { Typeahead } from '../src';
import IconsProvider from '../src/IconsProvider';

const items = [
	{
		title: 'category 1',
		icon: {
			name: 'talend-filter',
			title: 'icon',
		},
		suggestions: [
			{
				title: 'le title 1',
				description:
					'description: Uxoresque est in pacto est marito est hastam nomine in eos discessura incredibile tempus ardore.',
			},
			{
				title: 'title 2 Les elephants elementaires ont des aile ',
				description:
					'description: Aut aut cum satis inter Epicuri quidem cum erat inquam controversia autem mihi utrumque Attico.',
			},
		],
	},
	{
		title: 'category 2',
		icon: {
			name: 'fa fa-asterisk',
			title: 'icon',
		},
		suggestions: [
			{
				title: 'title 3',
				description:
					'description: In sanciatur libere audeamus exspectemus amicitia et dum ne audeamus causa monendum honesta studium valeat.',
			},
		],
	},
	{
		title: 'category 3',
		icon: {
			name: 'fa fa-asterisk',
			title: 'icon',
		},
		suggestions: [
			{
				title: 'title 4',
				description:
					'description: Praesentibus genero ne in Africani mandavi saepius ipsam C in libro et hoc Laeli cum.',
			},
			{
				title: 'title 5',
				description:
					'description: Feceris unde tot illo tot clientes dederis numerando et indiscretus cum paria et unde ubi.',
			},
			{
				title: 'title 6',
				description:
					'description: Gradu quos cedentium sunt appeterent ita ancoralia instar luna sunt etiam ubi incendente nihil observabant.',
			},
			{
				title: 'without description',
			},
			{
				description: 'without title',
			},
		],
	},
];

const noHeaderItems = [
	{
		suggestions: [
			{
				title: 'le title 1',
				description:
					'description: Uxoresque est in pacto est marito est hastam nomine in eos discessura incredibile tempus ardore.',
			},
			{
				title: 'title 2 les elephants elementaires ont des aile ',
				description:
					'description: Aut aut cum satis inter Epicuri quidem cum erat inquam controversia autem mihi utrumque Attico.',
			},
		],
	},
];

const decoratedStories = storiesOf('Typeahead', module)
	.addDecorator(checkA11y)
	.addDecorator(story => (
		<div>
			<IconsProvider />
			{story()}
		</div>
	));

decoratedStories
	.addWithInfo('default with debounce input', () => {
		const props = {
			placeholder: 'Search...',
			onBlur: action('onBlur'),
			onChange: action('onChange'),
			debounceTimeout: 300,
			role: 'searchbox',
		};
		return <Typeahead {...props} />;
	})
	.addWithInfo('searching', () => {
		const props = {
			value: 'Lorem ipsum',
			onBlur: action('onBlur'),
			onChange: action('onChange'),
			searching: true,
			role: 'searchbox',
		};
		return <Typeahead {...props} />;
	})
	.addWithInfo('with results', () => {
		const props = {
			value: 'le',
			items,
			onBlur: action('onBlur'),
			onChange: action('onChange'),
			onSelect: action('onSelect'),
			role: 'searchbox',
		};
		return <Typeahead {...props} />;
	})
	.addWithInfo('without results', () => {
		const props = {
			value: 'Text without results',
			onBlur: action('onBlur'),
			onChange: action('onChange'),
			items: [],
			role: 'searchbox',
		};
		return <Typeahead {...props} />;
	})
	.addWithInfo('on the right', () => {
		const props = {
			value: 'le',
			items,
			onBlur: action('onBlur'),
			onChange: action('onChange'),
			onSelect: action('onSelect'),
			position: 'right',
			role: 'searchbox',
		};
		return <Typeahead {...props} />;
	})
	.addWithInfo('with toggle button', () => {
		const props = {
			icon: {
				name: 'talend-search',
				title: 'Toggle search input',
				bsStyle: 'link',
				role: 'search',
			},
			onToggle: action('onToggle'),
			docked: true,
		};
		return <Typeahead {...props} />;
	})
	.addWithInfo('with focused item', () => {
		const props = {
			icon: {
				name: 'talend-search',
				title: 'Toggle search input',
				bsStyle: 'link',
			},
			onKeyDown: action('onKeyDown'),
			items,
			focusedSectionIndex: 1,
			focusedItemIndex: 0,
			role: 'searchbox',
		};
		return <Typeahead {...props} />;
	})
	.addWithInfo('without section header', () => {
		const props = {
			value: 'le',
			items: noHeaderItems,
			onBlur: action('onBlur'),
			onChange: action('onChange'),
			onSelect: action('onSelect'),
			role: 'searchbox',
		};
		return <Typeahead {...props} />;
	});
