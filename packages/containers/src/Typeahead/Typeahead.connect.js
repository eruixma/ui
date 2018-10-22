import { cmfConnect } from '@talend/react-cmf';
import Typeahead, { DEFAULT_STATE } from './Typeahead.container';

export default cmfConnect({
	defaultState: DEFAULT_STATE,
})(Typeahead);
