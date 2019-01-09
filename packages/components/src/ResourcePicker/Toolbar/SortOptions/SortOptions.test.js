import React from 'react';
import { Button } from 'react-bootstrap';
import { mount } from 'enzyme';
import SortOptions, { TYPES } from './SortOptions.component';


describe('SortOptions', () => {
	it('should trigger onChange callback with the new state on click', () => {
		const onChange = jest.fn();
		const wrapper = mount(
			<SortOptions
				onChange={onChange}
				nameAsc={false}
				dateAsc
				icon={'talend-sort-desc'}
				types={[TYPES.NAME, TYPES.DATE]}
			/>);

		expect(onChange).not.toBeCalled();

		wrapper.find(Button).at(0).simulate('click');
		expect(onChange).toBeCalledWith(TYPES.NAME, true);

		wrapper.find(Button).at(1).simulate('click');
		expect(onChange).toBeCalledWith(TYPES.DATE, false);
	});
});
