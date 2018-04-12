import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from '../../List/List';
import RowLabel from '../../List/RowLabel';
import MandatoryField from '../../List/MandatoryField';
import * as Constants from '../../Constants';

class SchemaClassNameProvider {
	updateProps(props) {
		this.props = props;
	}

	get(element, key) {
		const {
			dataAccessor,
			selection,
			side,
			pendingItem,
			dnd,
			focusedElements,
			mappedElements,
			isHighlighted,
			isMapped,
			isSelected,
		} = this.props;
		if (element && key) {
			return `comp-list-row-data-${key} ${side}`;
		} else if (element) {
			return {
				'schema-element': true,
				highlighted: isHighlighted(
					dataAccessor,
					element,
					selection,
					side,
					pendingItem,
					focusedElements,
					dnd,
				),
				mapped: isMapped(dataAccessor, element, mappedElements),
				selected: isSelected(dataAccessor, selection, element, side),
				input: side === Constants.MappingSide.INPUT,
				output: side === Constants.MappingSide.OUTPUT,
			};
		}
		return `schema-content ${side}`;
	}
}

class SchemaDndListener {
	updateProps(props) {
		this.props = props;
	}

	beginDrag(element) {
		return this.props.dndListener.beginDrag(element, this.props.side);
	}

	canDrop(sourceItem, targetElement) {
		const targetItem = { element: targetElement, side: this.props.side };
		return this.props.dndListener.canDrop(sourceItem, targetItem);
	}

	drop(sourceItem, targetElement) {
		const targetItem = { element: targetElement, side: this.props.side };
		this.props.dndListener.drop(sourceItem, targetItem);
	}

	endDrag() {
		this.props.dndListener.endDrag();
	}
}

class RowDataGetter {
	updateProps(props) {
		this.props = props;
	}

	getId(element) {
		return this.props.dataAccessor.getElementId(element);
	}

	getData(element, key) {
		switch (key) {
			case Constants.Schema.DATA_KEYS.NAME:
				if (this.props.side === Constants.MappingSide.INPUT) {
					return this.props.dataAccessor.getElementName(element);
				}
				return {
					value: this.props.dataAccessor.getElementName(element),
					mandatory: this.props.dataAccessor.isElementMandatory(element),
				};
			case Constants.Schema.DATA_KEYS.TYPE:
				return this.props.dataAccessor.getElementType(element);
			case Constants.Schema.DATA_KEYS.DESC:
				return this.props.dataAccessor.getElementDescription(element);
			default:
				return 'No data available!';
		}
	}
}

class RowRenderers {
	constructor(side) {
		this.side = side;
	}

	getComponent(key) {
		switch (key) {
			case Constants.Schema.DATA_KEYS.NAME:
				if (this.side === Constants.MappingSide.INPUT) {
					return RowLabel;
				}
				return MandatoryField;
			default:
				return RowLabel;
		}
	}
}

export default class ListRenderer extends Component {
	constructor(props) {
		super(props);
		this.select = this.select.bind(this);
		this.revealConnectedElement = this.revealConnectedElement.bind(this);
		this.onEnterElement = this.onEnterElement.bind(this);
		this.onLeaveElement = this.onLeaveElement.bind(this);
		this.classNameProvider = new SchemaClassNameProvider();
		this.dndListener = new SchemaDndListener();
		this.rowDataGetter = new RowDataGetter();
		this.rowRenderers = new RowRenderers(props.side);
	}

	getElement(ev) {
		const node = ev.currentTarget;
		const elementId = node.dataset.id;
		return this.props.dataAccessor.getSchemaElementFromId(this.props.schema, elementId);
	}

	select(ev) {
		const element = this.getElement(ev);
		this.props.onSelect(ev.ctrlKey, element, this.props.side);
	}

	revealConnectedElement(ev) {
		const element = this.getElement(ev);
		this.props.revealConnectedElement(element, this.props.side);
	}

	onEnterElement(element) {
		this.props.onEnterElement(element, this.props.side);
	}

	onLeaveElement(element) {
		this.props.onLeaveElement(element, this.props.side);
	}

	render() {
		this.classNameProvider.updateProps(this.props);
		this.dndListener.updateProps(this.props);
		this.rowDataGetter.updateProps(this.props);
		const {
			dataAccessor,
			schema,
			draggable,
			onScroll,
			columnKeys,
			updateContentNodeRef,
		} = this.props;
		return (
			<List
				classNameProvider={this.classNameProvider}
				elements={dataAccessor.getSchemaElements(schema, true)}
				dataKeys={columnKeys}
				rowDataGetter={this.rowDataGetter}
				rowRenderers={this.rowRenderers}
				onScroll={onScroll}
				draggable={draggable}
				dndListener={this.dndListener}
				onClick={this.select}
				onDoubleClick={this.revealConnectedElement}
				updateListNodeRef={updateContentNodeRef}
				onEnterElement={this.onEnterElement}
				onLeaveElement={this.onLeaveElement}
			/>
		);
	}
}

ListRenderer.propTypes = {
	dataAccessor: PropTypes.object,
	schema: PropTypes.object,
	draggable: PropTypes.bool,
	onScroll: PropTypes.func,
	columnKeys: PropTypes.array,
	updateContentNodeRef: PropTypes.func,
};
