// @flow
import * as React from 'react';
import { useState, useRef, useContext, useEffect, useCallback } from 'react';
import Dropzone, { useDropzone } from 'react-dropzone';
import { useMutation, gql } from '@apollo/client';
import { PostContext } from '../../context/PostContext';
import { CREATE_POST_MUTATION, FEED_QUERY } from '../../graphQLqueries/PostQueries';
import type { Post as postType } from '../../type/PostTypes';

import Post from './Post';
import Preview from '../imgs/Preview';


type File = $ReadOnly<{
	path: string,
	name: string,
	lastModified: number,
	lastModifiedDate: Date,
	size: number,
	type: string,
	webkitRelativePath: string
}>;

function CreatePost(): React.MixedElement {
	const { posts, updatePost } = useContext(PostContext);
	const [ text: string, setText ] = useState('');
	const [ isOverMax, setIsOverMax ] = useState(false);
	const [ file: ?File, setFile ] = useState(null);
	const [ fileReaderRes, setFileReaderRes ] = useState('');
	const [ preview, setPreview ] = useState(null);

	const [ createPost, { data, loading, error, reset } ] = useMutation(CREATE_POST_MUTATION, {
		onCompleted: (data: [postType]) => console.log(data),
		refetchQueries: [ FEED_QUERY, 'GetPosts' ]
	});

	const contentInput = useRef(null);

	const handleSubmitPost = (e: SyntheticEvent<HTMLButtonElement>): void => {
		// fileInput.current && fileInput.current.click();
		if (!file) return;
		e.preventDefault();
		console.log('File on submit:');
		console.log(file);
		createPost({ variables: { file, content: text } });
		// updatePost([ ...posts, data ]);
		setText('');
		setFile(null);
	};

	const onDrop = useCallback(
		([ file: File ]): void => {
			setFile(file);
			console.log('----ONDROP----');
			console.log(file);

			const fileReader = new FileReader();
			const url = fileReader.readAsDataURL(file);

			fileReader.onloadend = (e) => {
				console.log('load ended!');
				setPreview(fileReader.result);
				console.log(preview);
			};
			// readImgFile(file);
			if (file.size > 1000000) {
				setIsOverMax(true);
			}
		},
		[ CREATE_POST_MUTATION ]
	);

	useEffect(
		() => {
			console.log('preview updated');
			contentInput?.current?.focus();
		},
		[ preview ]
	);

	// TODO: display image on Drop
	const readImgFile = async (file) => {
		if (!file) return;

		const fileReader = new FileReader();
		const url = fileReader.readAsDataURL(file);
		console.log(fileReader.result);
		console.log(url);
		fileReader.onloadend = (e) => {
			setPreview(fileReader.result);
			console.log(preview);
		};
		console.log(fileReader);
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

		return (
			<div className="CreatePost">
				<h1>Create a Post</h1>
				<form method="post" onSubmit={handleSubmitPost}>
					{loading && <p>Loading...</p>}
					{error && <p>{`Submission error! ${error.message}`}</p>}

					<div style={{ border: '2px red solid' }} {...getRootProps()}>
						<input accept="image/*" {...getInputProps()} />
						{isDragActive ? (
							<p>Drop the files here ...{`isDragActive: ${isDragActive}`}</p>
						) : (
							<p>
								Drop 'n' drop some files here, or click to select files{`isDragActive: ${isDragActive}`}
							</p>
						)}
					</div>

					{file && <p>{file.name}</p>}
					{preview && <Preview preview={preview} />}

					<input
						type="text"
						className="PostForm-input-content"
						placeholder="content"
						value={text}
						onChange={(e) => setText(e.target.value)}
						ref={contentInput}
					/>
					<button type="submit">Post</button>
				</form>
				{isOverMax && (
					<div className="file-size-error">
						<p>File size cannot exceed more than 200KB.</p>
					</div>
				)}
			</div>
		);

}

export default CreatePost;
