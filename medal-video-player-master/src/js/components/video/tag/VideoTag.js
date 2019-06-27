import React from 'react'
import { videoTagString } from './videoTagString'

export const VideoTag = props => (
	<span
		dangerouslySetInnerHTML={{
			__html: videoTagString(props),
		}}
	/>
);