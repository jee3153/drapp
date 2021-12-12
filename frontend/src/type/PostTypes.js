// @flow
export type Post = $ReadOnly<{
	id: string,
	content: ?string,
	url: string,
	createdAt: number
}>;
