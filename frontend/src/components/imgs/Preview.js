// @flow
import * as React from 'react';

type Prop = $ReadOnly<{
	preview: string | ArrayBuffer
}>;

const style = {
	adjustImgSize: { width: '500px', height: 'auto' }
};

function Preview({ preview }: Prop): React.MixedElement {
	return <img src={preview} style={style.adjustImgSize} />;
}

export default Preview;
