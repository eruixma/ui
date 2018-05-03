import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import PropTypes from 'prop-types';
import flow from 'lodash/flow';

export const DRAGGABLE_ELEMENT_TYPE = 'element';

/**
 * This function adds the 'drag & drop' behaviour on the given component.
 * Its returns a new component which encaspulates the given one.
 * The new component is draggable and dropppable.
 */
export default function getDraggable(Comp) {
	const elementSource = {
		beginDrag(props) {
			return props.extra.beginDrag(props.element);
		},
		endDrag(props) {
			props.extra.endDrag();
		},
	};

	const elementTarget = {
		canDrop(props, monitor) {
			const sourceItem = monitor.getItem();
			return props.extra.canDrop(sourceItem, props.element);
		},
		drop(props, monitor) {
			props.extra.drop(monitor.getItem(), props.element);
		},
	};

	function collectForDragSource(connect, monitor) {
		return {
			connectDragSource: connect.dragSource(),
			isDragging: monitor.isDragging(),
		};
	}

	function collectForDropTarget(connect, monitor) {
		return {
			connectDropTarget: connect.dropTarget(),
			dragOver: monitor.isOver(),
		};
	}

	class DraggableComponent extends Component {
		render() {
			const {
				element,
				data,
				className,
				extra,
				isDragging,
				dragOver,
				connectDragSource,
				connectDropTarget,
			} = this.props;
			return connectDragSource(
				connectDropTarget(
					<div className="draggable-component">
						<Comp
							element={element}
							data={data}
							className={className}
							extra={extra}
							isDragging={isDragging}
							dragOver={dragOver}
						/>
					</div>,
				),
			);
		}
	}

	DraggableComponent.propTypes = {
		element: PropTypes.object,
		data: PropTypes.string,
		className: PropTypes.string,
		extra: PropTypes.object,
		isDragging: PropTypes.bool,
		dragOver: PropTypes.bool,
		connectDragSource: PropTypes.func,
		connectDropTarget: PropTypes.func,
	};

	return flow(
		DragSource(DRAGGABLE_ELEMENT_TYPE, elementSource, collectForDragSource),
		DropTarget(DRAGGABLE_ELEMENT_TYPE, elementTarget, collectForDropTarget),
	)(DraggableComponent);
}
