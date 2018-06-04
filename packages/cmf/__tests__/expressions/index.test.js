import Immutable from 'immutable';
import expressions from '../../src/expressions';
import mock from '../../src/mock';

describe('expressions', () => {
	it('should export some expressions', () => {
		expect(expressions['cmf.router.matchPath']).toBeDefined();
		expect(expressions['cmf.router.location']).toBeDefined();
		expect(expressions['cmf.collections.get']).toBeDefined();
		expect(expressions['cmf.components.get']).toBeDefined();
		expect(expressions['cmf.collections.getIn.includes']).toBeDefined();
		expect(expressions['cmf.components.getIn.includes']).toBeDefined();
	});
	describe('cmf.collections.get', () => {
		it('should get collection content', () => {
			const context = mock.context();
			const state = mock.state();
			state.cmf.collections = new Immutable.Map({
				article: new Immutable.Map({
					title: 'my title',
				}),
			});
			context.store.getState = () => state;
			expect(expressions['cmf.collections.get']({ context }, 'article.title', 'no title')).toBe(
				'my title',
			);
		});
		it("should return default value if collection doesn't exists", () => {
			const context = mock.context();
			const state = mock.state();
			context.store.getState = () => state;
			state.cmf.collections = new Immutable.Map({});
			expect(expressions['cmf.collections.get']({ context }, 'article.title', 'no title')).toBe(
				'no title',
			);
		});
	});

	describe('cmf.collections.getIn.includes', () => {
		it('should return true if the value is present in the list', () => {
			const context = mock.context();
			const state = mock.state();
			state.cmf.collections = new Immutable.Map({
				article: new Immutable.Map({
					title: 'title',
					tags: new Immutable.List(['test', 'test2', 'test3']),
				}),
			});
			context.store.getState = () => state;
			expect(
				expressions['cmf.collections.getIn.includes']({ context }, 'article.tags', 'test2'),
			).toBe(true);
		});
		it('should return false if the value is not present in the list', () => {
			const context = mock.context();
			const state = mock.state();
			state.cmf.collections = new Immutable.Map({
				article: new Immutable.Map({
					title: 'title',
					tags: new Immutable.List(['test', 'test2', 'test3']),
				}),
			});
			context.store.getState = () => state;
			expect(
				expressions['cmf.collections.getIn.includes']({ context }, 'article.tags', 'test4'),
			).toBe(false);
		});
		it("should return false if collection doesn't exists", () => {
			const context = mock.context();
			const state = mock.state();
			context.store.getState = () => state;
			state.cmf.collections = new Immutable.Map({});
			expect(
				expressions['cmf.collections.getIn.includes']({ context }, 'article.tags', 'test'),
			).toBe(false);
		});
	});

	describe('cmf.components.get', () => {
		it('should get component state', () => {
			const context = mock.context();
			const state = mock.state();
			state.cmf.components = new Immutable.Map({
				MyComponent: new Immutable.Map({
					default: new Immutable.Map({
						show: true,
					}),
				}),
			});
			context.store.getState = () => state;
			expect(
				expressions['cmf.components.get']({ context }, 'MyComponent.default.show', false),
			).toBe(true);
		});
		it('should return default value if no component state', () => {
			const context = mock.context();
			const state = mock.state();
			state.cmf.components = new Immutable.Map({});
			context.store.getState = () => state;
			expect(
				expressions['cmf.components.get']({ context }, 'MyComponent.default.show', false),
			).toBe(false);
		});
	});

	describe('cmf.components.getIn.includes', () => {
		it('should return true if the value is present in the list', () => {
			const context = mock.context();
			const state = mock.state();
			state.cmf.components = new Immutable.Map({
				MyComponent: new Immutable.Map({
					default: new Immutable.Map({
						tags: new Immutable.List(['tag1', 'tag2', 'tag3']),
						show: true,
					}),
				}),
			});
			context.store.getState = () => state;
			expect(
				expressions['cmf.components.getIn.includes'](
					{ context },
					'MyComponent.default.tags',
					'tag1',
				),
			).toBe(true);
		});
		it('should return default false if there is no component state', () => {
			const context = mock.context();
			const state = mock.state();
			state.cmf.components = new Immutable.Map({});
			context.store.getState = () => state;
			expect(
				expressions['cmf.components.getIn.includes'](
					{ context },
					'MyComponent.default.tags',
					'tag1',
				),
			).toBe(false);
		});
	});
});
