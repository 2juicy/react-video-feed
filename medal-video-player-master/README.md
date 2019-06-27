# medal-video-player
A custom React video player component for Medal content. [Here it is in action.](https://medal.tv/clips/2846515/0ba07ce231d0)

## Install
Install is easy, simply run:

```npm install git+ssh://git@github.com/get-wrecked/medal-video-player.git```

## Usage
Here is an example of the basic usage:

```
import MedalPlayer from 'medal-video-player';

...

<MedalPlayer
  content={ medalContentObject }
  game={ medalCategoryObject }
  user={ medalUserObject }
/>

...

<MedalPlayer
  componentRef={ (ref) => this.player = ref }
  content={ medalContentObject }
  game={ medalCategoryObject }
  user={ medalUserObject }
  videoRef={ (ref) => this.video = ref }
  videoOpts={{
    autoplay : true, // should the video autoplay?
    loop : true, // should the video loop?
    muted : true, // is the video muted by default?
    controls : true, // are the video controls enabled?
    embedded : true, // is this an embedded player? should we include all branding components and enable player.js events?
    retry : true // if the video fails to load, for whatever reason, retry video.play() up to 10 times
  }}
/>
```

## Properties
Here is a list of properties you can pass down to the player.

|   Property    |     Type      |  Description  |
| ------------- | ------------- | ------------- |
| componentRef  | object        | Call back the player component reference when the [Video](https://github.com/get-wrecked/medal-video-player/blob/master/src/js/components/video/Video.js) component mounts _(optional)_ |
| content       | object        | Medal Content Object - the video content object |
| game          | object        | Medal Category Object - the game category of the video _(optional)_ |
| user          | object        | Medal User Object - the poster of the video |
| videoOpts     | object        | See [videoOpts](#videoopts) |
| videoRef      | func          | Call back the video DOM element reference when the raw video component mounts _(optional)_ |
| viewer        | object        | Medal User Object - the user watching the video _(optional)_ |

### videoOpts
Here is a list of properties you can pass as video options.

|   Property    |     Type      |    Default    |  Description  |
| ------------- | ------------- | ------------- | ------------- |
| autoplay      | bool          |    `false`    | If `true` the video will autoplay when the component mounts |
| controls      | bool          |    `true`     | If `true` enable video controls, otherwise hide them completely |
| embedded      | bool          |    `true`     | If `true`, additional branding, call-to-actions, and basic [player.js HTML5Adapter](https://github.com/embedly/player.js/blob/master/src/adapters/html.js) support for [Embedly](https://embed.ly/providers/new) are enabled |
| loop          | bool          |    `false`    | See the [HTML5 loop attribute](https://www.w3schools.com/tags/att_video_loop.asp) |
| muted         | bool          |    `false`    | See the [HTML5 muted attribute](https://www.w3schools.com/tags/att_video_muted.asp) |
| preload       | string        |   `metadata`  | See the [HTML5 preload attribute](https://www.w3schools.com/tags/att_video_preload.asp) |
| quality       | string        |  `standard`   | Can be `standard` for 360p or `high` for 720p for Medal content |
| retry         | bool          |    `true`     | If `true` then an attempt to reload the source will be made when the video fails to load up to 10 times |

## Events
This component supports all standard video player events, plus some extras.

|     Event     |  Parameters   |  Description  |
| ------------- | ------------- | ------------- |
| onPlay        | none          | Called when the video component starts or resumes playback |
| onPause       | none          | Called when the video component pauses playback |
| onTimeUpdate  | currentTime   | Called when the video component current time position updates |
| onEnd         | none          | Called when the video component finishes playing the full duration of the video |
| onReady       | none          | Called when the video component loaded metadata |
| onLoaded      | none          | Called when the video component loaded video data |
| onError       | none          | Called when the video component fails to load the video |
| onMute        | none          | Called when the video component is muted |
| onUnmute      | none          | Called when the video component is unmuted |
