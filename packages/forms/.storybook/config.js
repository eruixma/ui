import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import IconsProvider from '@talend/react-components/lib/IconsProvider';

import '@talend/bootstrap-theme/src/theme/theme.scss';

function loadStories() {
	require('../stories-core');
}

const withFormLayout = story => {
	return (
		<div className="container-fluid">
			<IconsProvider />
			<div
				className="col-md-offset-1 col-md-10"
				style={{ marginTop: '20px', marginBottom: '20px' }}
			>
				{story()}
			</div>
		</div>
	);
};

addDecorator(withFormLayout);
configure(loadStories, module);
