// @flow
import * as React from 'react';
import { getDateAndTime } from '../../Utils/dateAndTime';
import PostImg from '../imgs/PostImg';

type Props = $ReadOnly<{
	id: string,
	url: string,
	content: string,
	createdAt: number
}>;

type TimeStamp = $ReadOnly<{
	date: string
}>;

function Post({ id, url, content, createdAt }: Props): React.MixedElement {
	const timeStamp = getDateAndTime(createdAt);

	return (
		<div className="Post" id={`post-${id}`}>
			<h2>Post</h2>
			<p>
				<b>url:</b>
			</p>
			<PostImg url={url} />
			<p>
				<b>content:</b> {content}
			</p>
			<p>createdAt: {timeStamp}</p>
		</div>
	);
}

export default Post;
