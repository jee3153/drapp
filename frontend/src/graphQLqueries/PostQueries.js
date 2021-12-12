import { gql } from '@apollo/client';

export const FEED_QUERY = gql`
	{
		allFeed {
			id
			content
			url
			createdAt
		}
	}
`;

export const CREATE_POST_MUTATION = gql`
	mutation uploadPost($content: String, $file: Upload!) {
		uploadPost(file: $file, content: $content) {
			id
			content
			url
		}
	}
`;
