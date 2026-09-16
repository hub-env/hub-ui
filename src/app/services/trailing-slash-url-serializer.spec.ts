import { TrailingSlashUrlSerializer } from './trailing-slash-url-serializer';

describe('TrailingSlashUrlSerializer', () => {
	let serializer: TrailingSlashUrlSerializer;

	beforeEach(() => {
		serializer = new TrailingSlashUrlSerializer();
	});

	/** Serializes a URL by parsing it first, mirroring what routerLink does. */
	const roundTrip = (url: string) => serializer.serialize(serializer.parse(url));

	it('appends the trailing slash the server answers with a 200', () => {
		expect(roundTrip('/en/paginable/overview')).toBe('/en/paginable/overview/');
	});

	it('leaves an already canonical URL untouched', () => {
		expect(roundTrip('/en/paginable/overview/')).toBe('/en/paginable/overview/');
	});

	it('keeps the language root addressable', () => {
		expect(roundTrip('/en')).toBe('/en/');
		expect(roundTrip('/en/')).toBe('/en/');
	});

	it('never emits a double slash for the site root', () => {
		expect(roundTrip('/')).toBe('/');
	});

	it('slashes the path without stranding the query string', () => {
		expect(roundTrip('/en/table/examples?source=nav&mode=compact')).toBe('/en/table/examples/?source=nav&mode=compact');
	});

	it('slashes the path without stranding the fragment', () => {
		expect(roundTrip('/en/paginable/api#inputs')).toBe('/en/paginable/api/#inputs');
	});

	it('handles a query and a fragment together', () => {
		expect(roundTrip('/en/table/examples?source=nav#results')).toBe('/en/table/examples/?source=nav#results');
	});

	it('parses the canonical form into the same tree as the slashless one', () => {
		const withSlash = serializer.parse('/en/paginable/overview/');
		const without = serializer.parse('/en/paginable/overview');

		// A trailing slash must not become an extra empty segment, or the route
		// would stop matching.
		expect(withSlash.toString()).toBe(without.toString());
	});
});
