import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import TableHeaderCell from './TableHeaderCell';
import TableSortHeader from './TableSortHeader';
import theme from './TableHeader.scss';

const PART = 'head';

function getHeaderComponent(column, sorters, onSortChange) {
	if (column.headRenderer) {
		return column.headRenderer;
	}
	if (onSortChange && sorters && sorters[column.key]) {
		return TableSortHeader;
	}
	return TableHeaderCell;
}

function renderHeaderCell(column, sorters, onSortChange) {
	const HeaderComponent = getHeaderComponent(column, sorters, onSortChange);
	const key = column.key;
	const thKey = `th-${key}`;
	return (
		<th key={thKey} className={classnames(thKey, theme['tc-table-head-th'])}>
			<HeaderComponent
				key={column.key}
				column={column}
				className={classnames(
					'tc-table-head-label',
					theme['tc-table-head-label'],
					`tc-table-head-label-${key}`,
				)}
				sorter={sorters && sorters[column.key]}
				onSortChange={onSortChange}
			/>
		</th>
	);
}

/**
 * This component displays the header of the table.
 */
export default class TableHeader extends React.Component {
	constructor(props) {
		super(props);
		this.updateHeadNodeRef = this.updateHeadNodeRef.bind(this);
	}

	componentDidMount() {
		if (this.props.renderingListener && this.props.renderingListener.onMounted) {
			this.props.renderingListener.onMounted(PART, this.headNode);
		}
	}

	componentDidUpdate() {
		if (this.props.renderingListener && this.props.renderingListener.onUpdated) {
			this.props.renderingListener.onUpdated(PART, this.headNode);
		}
	}

	updateHeadNodeRef(ref) {
		this.headNode = ref;
	}

	render() {
		const { columns, sorters, onSortChange } = this.props;
		return (
			<thead className={classnames('tc-table-head', theme['tc-table-head'])}>
				<tr className={classnames('tc-table-head-row', theme['tc-table-head-row'])}>
					{columns.map(column => renderHeaderCell(column, sorters, onSortChange))}
				</tr>
			</thead>
		);
	}
}

TableHeader.propTypes = {
	columns: PropTypes.arrayOf(
		PropTypes.shape({
			key: PropTypes.string.isRequired,
			label: PropTypes.string,
			headRenderer: PropTypes.func,
			headExtraProps: PropTypes.object,
		}),
	).isRequired,
	sorters: PropTypes.object,
	onSortChange: PropTypes.func,
	renderingListener: PropTypes.shape({
		onMounted: PropTypes.func,
		onUpdated: PropTypes.func,
	}),
};
