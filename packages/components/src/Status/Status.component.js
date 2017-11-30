import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Actions from './../Actions/Actions.component';
import CircularProgress from './../CircularProgress/CircularProgress.component';
import Icon from './../Icon/Icon.component';

import css from './Status.scss';

/**
 * @param {object} props react props
 * @example
 const status = {
			status: 'Successful',
			label: 'Successful',
			icon: 'fa fa-check',
			actions: [
					{
						label: 'cancel',
						icon: 'fa fa-cancel',
						onClick: action('onCancel'),
					},
					{
						label: 'delete',
						icon: 'fa fa-delete',
						onClick: action('onDelete'),
					}],
	};
 <Status {...status}/>
 */

export const STATUS = {
	IN_PROGRESS: 'inProgress',
	SUCCESSFUL: 'successful',
	FAILED: 'failed',
	CANCELED: 'canceled',
};

function getbsStyleFromStatus(status) {
	switch (status) {
		case STATUS.IN_PROGRESS:
			return 'info';
		case STATUS.SUCCESSFUL:
			return 'success';
		case STATUS.FAILED:
			return 'danger';
		case STATUS.CANCELED:
			return 'muted';
		default:
			return '';
	}
}

function renderIcon(status, icon, progress) {
	if (status === STATUS.IN_PROGRESS) {
		if (icon) {
			return <Icon name={icon} />;
		}
		return <CircularProgress size={'small'} percent={progress} />;
	}
	return (icon && <Icon name={icon} />);
}

function Status(props) {
	const {
		status,
		label,
		icon,
		actions,
		progress,
	} = props;

	const rootClassnames = classNames(
		css['tc-status'],
		'tc-status',
		`text-${getbsStyleFromStatus(status)}`,
		{ [css.action]: actions && actions.length },
	);

	return (
		<div role="status" className={rootClassnames} >
			{renderIcon(status, icon, progress)}
			<span className={classNames(css['tc-status-label'], 'tc-status-label')}>{label}</span>
			<span className={classNames(css['tc-status-actions'], 'tc-status-actions')}>
				<Actions actions={actions} />
			</span>
		</div>
	);
}

Status.propTypes = {
	status: PropTypes.oneOf([
		STATUS.IN_PROGRESS,
		STATUS.SUCCESSFUL,
		STATUS.FAILED,
		STATUS.CANCELED,
	]),
	label: PropTypes.string.isRequired,
	icon: PropTypes.string,
	actions: Actions.propTypes.actions,
	progress: PropTypes.number,
};

Status.defaultProps = {
	actions: [],
};

export default Status;
