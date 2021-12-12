// @flow
import * as React from 'react';
import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

import PostList from './post/PostList';
import CreatePost from './post/CreatePost';

function TimeFeed(): React.MixedElement {
	const [ isPostFormActive, setIsPostFormActive ] = useState(true);
	const triggerPostWindow = (e) => {
		setIsPostFormActive(true);
	};

	return (
		<div className="TimeFeed">
			<h1>TimeFeed</h1>
			<button onClick={triggerPostWindow}>Create a Post</button>
			{isPostFormActive && <CreatePost />}
			<PostList />
		</div>
	);
}
export default TimeFeed;
