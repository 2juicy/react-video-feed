export const videoTagString = (props) => {
	const classOrClassName = props.className || props.class;
	const classString = classOrClassName ? ` class="${classOrClassName}"` : ``;
	const muted = props.muted ? ` muted` : ``;
	const autoPlay = props.autoPlay ? ` autoplay` : ``;
	const playsInline = props.playsInline ? ` playsinline` : ``;
	const loop = props.loop ? ` loop` : ``;
	const poster = props.poster ? ` poster="${props.poster}"` : ``;
	const id = props.id ? ` id="${props.id}"` : ``; // required
	const srcId = props.id ? ` id="${props.id}-source"` : ``; // required
	const src = props.src ? ` src="${props.src}"` : ` src=""`; // required
	const type = props.type ? ` type="${props.type}"` : ``;
	const style = props.style ? ` style="${props.style}"` : ``;

	return `<video playsinline ${id}${style}${classString}${muted}${autoPlay}${playsInline}${loop}${poster}><source${srcId}${src}${type}></video>`
};