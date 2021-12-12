// @flow
import * as React from 'react';

type Props = $ReadOnly<{
	url: string
}>;

const style = {
	adjustImgSize: { width: '700px', height: 'auto' }
};

function PostImg({ url }: Props): React.MixedElement {
	return <img className="PostImg" src={url} style={style.adjustImgSize} />;
}

export default PostImg;
