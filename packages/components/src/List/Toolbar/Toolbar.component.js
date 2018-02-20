import PropTypes from 'prop-types';
import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import omit from 'lodash/omit';
import { translate } from 'react-i18next';

import SelectAll from './SelectAll';
import SelectDisplayMode from './SelectDisplayMode';
import SelectSortBy from './SelectSortBy';
import Pagination from './Pagination';
import FilterBar from '../../FilterBar';
import Label from './Label';
import ActionBar from '../../ActionBar';

import theme from './Toolbar.scss';
import I18N_DOMAIN_COMPONENTS from '../../constants';
import { DEFAULT_I18N } from '../../translate';

function adaptActionsIds(actions, parentId) {
	return (
		actions &&
		actions.map(action => {
			if (action.id) {
				return {
					...action,
					id: `${parentId}-actions-${action.id}`,
				};
			}
			return action;
		})
	);
}

function adaptLeftAndRightActions(actions, parentId) {
	return (
		actions && {
			left: adaptActionsIds(actions.left, parentId),
			right: adaptActionsIds(actions.right, parentId),
		}
	);
}

/**
 * @param {string} id the id of Toolbar
 * @param {object} actionBar the ActionBar properties
 * @param {object} selectAllCheckbox the select all checkbox props
 * @param {object} display the SelectDisplayMode properties
 * @param {object} sort the SelectSortBy properties
 * @param {object} pagination the Pagination properties
 * @param {object} filter the Filter properties
 * @param {function} t the translate function
 * @example
 <Toolbar id="my-toolbar"></Toolbar>
 */
function Toolbar({
	id,
	actionBar,
	selectAllCheckbox,
	display,
	sort,
	pagination,
	filter,
	t,
	renderers,
}) {
	let actionBarProps = actionBar;
	if (id && actionBar) {
		const { actions, multiSelectActions } = actionBar;
		actionBarProps = {
			...actionBar,
			actions: adaptLeftAndRightActions(actions, id),
			multiSelectActions: adaptLeftAndRightActions(multiSelectActions, id),
		};
	}
	const displayModeId = id && `${id}-display-mode`;
	const hasToolbarItem = selectAllCheckbox || display || sort || pagination || filter;

	return (
		<div className="tc-list-toolbar">
			{actionBar && <renderers.ActionBar {...actionBarProps} />}
			{hasToolbarItem && (
				<Navbar componentClass="div" className={theme['tc-list-toolbar']} role="toolbar" fluid>
					{selectAllCheckbox && <SelectAll {...selectAllCheckbox} t={t} />}
					{display && (
						<Label
							text={t('LIST_TOOLBAR_DISPLAY', { defaultValue: 'Display:' })}
							htmlFor={displayModeId}
						/>
					)}
					{display && <SelectDisplayMode id={displayModeId} {...display} t={t} />}
					{sort && (
						<Label
							text={t('LIST_TOOLBAR_SORT_BY', { defaultValue: 'Sort by:' })}
							htmlFor={id && `${id}-sort-by`}
						/>
					)}
					{sort && <SelectSortBy id={id && `${id}-sort`} {...sort} t={t} />}
					{pagination && (
						<Label
							text={t('LIST_TOOLBAR_PAGINATION_SHOW', { defaultValue: 'Show:' })}
							htmlFor={id && `${id}-pagination-size`}
						/>
					)}
					{pagination && <Pagination id={id && `${id}-pagination`} {...pagination} />}
					{filter && (
						<FilterBar
							id={id && `${id}-filter`}
							{...filter}
							t={t}
							navbar
							className="navbar-right"
						/>
					)}
				</Navbar>
			)}
		</div>
	);
}

Toolbar.propTypes = {
	id: PropTypes.string,
	actionBar: PropTypes.shape(ActionBar.propTypes),
	selectAllCheckbox: PropTypes.shape(omit(SelectAll.propTypes, 't')),
	display: PropTypes.shape(omit(SelectDisplayMode.propTypes, 't')),
	sort: PropTypes.bool,
	pagination: PropTypes.shape(Pagination.propTypes),
	filter: PropTypes.shape(omit(FilterBar.propTypes, 't')),
	t: PropTypes.func.isRequired,
	renderers: PropTypes.shape({
		ActionBar: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
	}),
};

Toolbar.defaultProps = {
	renderers: {
		ActionBar,
	},
};

export default translate(I18N_DOMAIN_COMPONENTS, { i18n: DEFAULT_I18N })(Toolbar);
