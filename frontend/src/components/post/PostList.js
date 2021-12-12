// @flow
import * as React from 'react';
import { useEffect, useContext } from 'react';
import { useQuery, refetchQueries } from '@apollo/client';

import { PostContext } from '../../context/PostContext';
import { FEED_QUERY } from '../../graphQLqueries/PostQueries';
import Post from './Post';

function PostList(): React.MixedElement {
	const { data, loading, error } = useQuery(FEED_QUERY);
	const { posts, updatePost } = useContext(PostContext);

	useEffect(() => {
		if (data) {
			updatePost(data.allFeed);
		}
	}, []);

	return (
		<div className="PostList">
			{data &&
				data.allFeed.map((post) => (
					<Post id={post.id} url={post.url} content={post.content} createdAt={post.createdAt} key={post.id} />
				))}
		</div>
	);
}

export default PostList;
