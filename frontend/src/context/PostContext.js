// @flow
import * as React from 'react';
import { createContext, useState } from 'react';
import type { Post } from '../type/PostTypes';

type Data = $ReadOnly<{
    posts: Array<Post> | [],
    updatePost: Function 
}>

type Props = $ReadOnly<{
    children?:React.Node,
}>


export const PostContext: React$Context<Data> = createContext<Data>({});

export function PostProvider(props: Props): React.MixedElement {
    const [posts, setPosts] = useState<Array<Post>>([]);
    const updatePost = data => {
        setPosts(data);
    }

    const deletePost = async id => {

    }
    
    return (
        <PostContext.Provider value={{posts, updatePost}}>
            {props.children}
        </PostContext.Provider>
    )
}