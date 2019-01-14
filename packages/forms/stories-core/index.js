import { storiesOf } from '@storybook/react';

import jsonStories from './jsonStories';

const coreFieldsStories = storiesOf('Core fields', module);

jsonStories.forEach(({ name, story }) => {
	coreFieldsStories.add(name, story);
});
