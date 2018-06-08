import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Constants from '../Constants';
import TableRenderer from './TableRenderer';

function isMapped(dataAccessor, element, mappedElements) {
	return mappedElements == null ? false : dataAccessor.includes(mappedElements, element);
}

/**
 * isSelected indicates if the given (element, side) is selected
 * (i.e. if it appears in the selection)
 */
export function isSelected(dataAccessor, selection, element, side) {
	return (
		selection != null &&
		dataAccessor.areElementsEqual(selection.element, element) &&
		selection.side === side
	);
}

function isHighlighted(dataAccessor, element, selection, side, pendingItem, focusedElements, dnd) {
	const connected =
		selection == null
			? false
			: selection.side !== side &&
			  selection.connected != null &&
			  dataAccessor.includes(selection.connected, element);
	const pending =
		pendingItem != null &&
		pendingItem.side === side &&
		dataAccessor.areElementsEqual(pendingItem.element, element);
	const focused = focusedElements != null && dataAccessor.includes(focusedElements, element);
	const isTarget = dnd && dnd.target && dataAccessor.areElementsEqual(dnd.target.element, element);
	return connected || pending || focused || isTarget;
}

function getColumns(schemaConfiguration, side) {
	if (schemaConfiguration && schemaConfiguration.getColumns) {
		return schemaConfiguration.getColumns(side);
	}
	return [];
}

function getClassNameProvider(schemaConfiguration, side) {
	if (schemaConfiguration && schemaConfiguration.getClassNameProvider) {
		return schemaConfiguration.getClassNameProvider(side);
	}
	return null;
}

function getRowRenderer(schemaConfiguration, side) {
	if (schemaConfiguration && schemaConfiguration.getRowRenderer) {
		return schemaConfiguration.getRowRenderer(side);
	}
	return null;
}

function withHeader(schemaConfiguration, side) {
	if (schemaConfiguration && schemaConfiguration.withHeader(side)) {
		return schemaConfiguration.withHeader(side);
	}
	return false;
}

function getHeaderRenderer(schemaConfiguration, side) {
	const renderHeader = withHeader(schemaConfiguration, side);
	if (renderHeader && schemaConfiguration && schemaConfiguration.getHeaderRenderer) {
		return schemaConfiguration.getHeaderRenderer(side);
	}
	return null;
}

function withTitle(schemaConfiguration, side) {
	if (schemaConfiguration && schemaConfiguration.withTitle(side)) {
		return schemaConfiguration.withTitle(side);
	}
	return false;
}

export default class Schema extends Component {
	constructor(props) {
		super(props);
		this.updateRendererNodeRef = this.updateRendererNodeRef.bind(this);
		this.onContentScroll = this.onContentScroll.bind(this);
		this.meanDist = -1;
	}

	shouldComponentUpdate(nextProps) {
		// check first is a drag and drop is in progress
		let needUpdate = true;
		if (nextProps.dnd) {
			needUpdate = !(nextProps.dnd.source != null && nextProps.dnd.source.side === nextProps.side);
		}
		// then check if rendering focused elements is needed
		if (
			needUpdate &&
			nextProps.trigger &&
			(nextProps.trigger.code === Constants.Events.ENTER_ELEM ||
				nextProps.trigger.code === Constants.Events.LEAVE_ELEM)
		) {
			if (
				this.props.dataAccessor.haveSameContent(
					this.props.focusedElements,
					nextProps.focusedElements,
				)
			) {
				needUpdate = false;
			}
		}
		return needUpdate;
	}

	getNode(element) {
		const index = this.props.dataAccessor.getSchemaElementIndex(this.props.schema, element, true);
		const children = this.getRendererNode().getChildNodes();
		const childrenArray = Array.from(children);
		return childrenArray[index];
	}

	getYPosition(element) {
		const scrollTop = this.getRendererNode().getScrollTop();
		const child = this.getNode(element);
		const childOffsetTop = this.getRendererNode().getChildOffsetTop(child);
		const y = childOffsetTop + child.clientHeight / 2 - scrollTop;
		return y;
	}

	getElementAtPosition(position) {
		let theElement = null;
		if (this.isRendererNodeDefined()) {
			let previousDist = -1;
			let currentDist = -1;
			const contentHeight = this.getRendererNode().getOffsetHeight();
			const elements = this.props.dataAccessor.getSchemaElements(this.props.schema, true);
			const children = this.getRendererNode().getChildNodes();
			const childrenArray = Array.from(children);
			for (let i = 0; i < childrenArray.length; i += 1) {
				previousDist = currentDist;
				const element = elements[i];
				const elemYPos = this.getYPosition(element);
				if (elemYPos > 0 && elemYPos < contentHeight) {
					currentDist = Math.abs(elemYPos - position);
					if (previousDist >= 0 && currentDist > previousDist) {
						break;
					}
					theElement = element;
				} else if (elemYPos > contentHeight) {
					break;
				}
			}
		}
		return theElement;
	}

	onContentScroll() {
		this.props.onScroll(this.props.side);
	}

	getVisibleElements() {
		let visibleElements = [];
		if (this.isRendererNodeDefined()) {
			const contentHeight = this.getRendererNode().getOffsetHeight();
			const elements = this.props.dataAccessor.getSchemaElements(this.props.schema, true);
			const children = this.getRendererNode().getChildNodes();
			const childrenArray = Array.from(children);
			if (elements.length != childrenArray.length) {
				visibleElements = visibleElements.concat(elements);
				return visibleElements;
			}
			if (this.meanDist < 0) {
				this.computeMeanDist(elements);
			}
			let startIndex = 0;
			if (this.meanDist > 0) {
				// compute start index
				const scrollTop = this.getRendererNode().getScrollTop();
				const n = Math.floor(scrollTop / this.meanDist);
				startIndex = Math.max(0, n);
			}
			const headerHeight = this.getRendererNode().getHeaderHeight();
			const bottomLimit = contentHeight + headerHeight;
			for (let i = startIndex; i < childrenArray.length; i += 1) {
				const element = elements[i];
				const elemYPos = this.getYPosition(element);
				if (elemYPos > headerHeight && elemYPos < bottomLimit) {
					// element is visible
					visibleElements = visibleElements.concat(element);
				} else if (elemYPos > bottomLimit) {
					break;
				}
			}
		}
		return visibleElements;
	}

	computeMeanDist(elements) {
		if (elements.length > 1) {
			const y1 = this.getYPosition(elements[0]);
			const y2 = this.getYPosition(elements[1]);
			this.meanDist = Math.abs(y2 - y1);
		}
	}

	reveal(element) {
		const node = this.getNode(element);
		const nodeHeight = node.clientHeight;
		const elemYPos = this.getYPosition(element);
		const contentHeight = this.getRendererNode().getOffsetHeight();
		const headerHeight = this.getRendererNode().getHeaderHeight();
		let revealed = false;
		const scrollTop = this.getRendererNode().getScrollTop();
		if (elemYPos < headerHeight) {
			const newScrollTop = scrollTop + elemYPos - headerHeight - nodeHeight / 2;
			this.getRendererNode().setScrollTop(newScrollTop);
			revealed = true;
		} else if (elemYPos > contentHeight + headerHeight - nodeHeight) {
			const offset = elemYPos + nodeHeight - contentHeight - headerHeight;
			this.getRendererNode().setScrollTop(scrollTop + offset);
			revealed = true;
		}
		return revealed;
	}

	isRendererNodeDefined() {
		return this.rendererNode;
	}

	getRendererNode() {
		if (this.rendererNode) {
			return this.rendererNode;
		}
		return {
			getChildNodes() {
				return [];
			},
			getScrollTop() {
				return 0;
			},
			setScrollTop(scrollTop) {},
			getChildOffsetTop(child) {
				return 0;
			},
			getOffsetHeight() {
				return 0;
			},
			getHeaderHeight() {
				return 0;
			},
		};
	}

	updateRendererNodeRef(ref) {
		this.rendererNode = ref;
	}

	render() {
		const { schemaConfiguration, ...tempProps } = this.props;
		const { dataAccessor, schema, side } = this.props;
		const contentProps = {
			...tempProps,
			isMapped,
			isSelected,
			isHighlighted,
			onScroll: this.onContentScroll,
		};
		const title = dataAccessor.getSchemaName(schema);
		return (
			<div className={`schema mapper-element ${side}`}>
				<TableRenderer
					{...contentProps}
					ref={this.updateRendererNodeRef}
					withTitle={withTitle(schemaConfiguration, side)}
					title={title}
					columnKeys={getColumns(schemaConfiguration, side)}
					classNameProvider={getClassNameProvider(schemaConfiguration, side)}
					rowRenderer={getRowRenderer(schemaConfiguration, side)}
					withHeader={withHeader(schemaConfiguration, side)}
					headerRenderer={getHeaderRenderer(schemaConfiguration, side)}
				/>
			</div>
		);
	}
}

Schema.propTypes = {
	dataAccessor: PropTypes.object,
	schema: PropTypes.object,
	schemaConfiguration: PropTypes.object,
	filters: PropTypes.array,
	filtersRenderer: PropTypes.object,
	onFilterChange: PropTypes.func,
	focusedElements: PropTypes.array,
	onScroll: PropTypes.func,
	side: PropTypes.string,
	isElementVisible: PropTypes.func,
};