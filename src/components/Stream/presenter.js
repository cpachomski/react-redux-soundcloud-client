import React from 'react';
import ReactDOM from 'react-dom';
import Results from '../Results';
import Details from '../Details';
import Tracks from '../Tracks';
import classNames from 'classnames';
import moment from 'moment';
import Arrow from 'react-icons/lib/md/play-arrow';
import Pause from 'react-icons/lib/md/pause';
import SCIcon from 'react-icons/lib/fa/soundcloud';
import AudioVisualizer from '../../visualizers/audioVisualizer';
import { CLIENT_ID } from '../../constants/auth';
import './style.scss';

export default React.createClass ({


	componentDidMount() {
		this.playing = false;
		this.viz = {};
		window.animation = null;
	},

	componentDidUpdate() {
		const audioElement = ReactDOM.findDOMNode(this.refs.audio);
		
		if (audioElement) {
			const { activeTrack } = this.props;
			if ( activeTrack ) {
				audioElement.play();
			} else {
				audioElement.pause();
			}
		}

	},

	startVisualization() {
		setTimeout(() => {
			this.viz = new AudioVisualizer(this.refs.audio);
			this.viz.active = true;
			this.viz.renderFreqs();
		}, 50);
	},

	stopVisualization() {
		this.viz.active = false;
		if (!document.getElementById('viz')){return}
		document.getElementById('viz').parentNode.removeChild(document.getElementById('viz'));
	},

	handleSearchTermChange(e){
		this.props.onUpdateSearchTerm(e.target.value)
	},

	handleSubmit(e) {
		e.preventDefault();
	},



	render() {
		const { 
			user,
			loginInProgress,
			loginSuccess,
			tracks = [],
			activeTrack,
			searchComplete,
		 	onAuth,
		 	onPlay,
		 	onPause } = this.props;

		const loginClass = classNames({
			'login': true,
			'login active': loginInProgress,
			'login complete': loginSuccess
		});

		const searchClass = classNames({
			'': true,
			'complete': searchComplete
		});


		let streamClass = 'stream';
		if (tracks.length > 0) {
			streamClass = 'stream loaded';
			document.getElementById('visualizer').classList.add('loaded');
		}



		return (
			<div className='stream-presenter'>
				{ !user ?

					<div className={ loginClass } ref='login'>
						<h1>Soundski
							<br/>
							<SCIcon />
						</h1>
						<button className='btn' onClick={ onAuth }>Login</button>
						<form className='search-form' onSubmit={ this.handleSubmit }>
							<input type='text'
								   placeholder="Search"
								   onChange={ this.handleSearchTermChange }
								   className={ searchClass }
								   ref='searchBox' />
							<input type='submit'
								   value='Search'/>
							<Results />
						</form>

					</div> :
					<div className={ streamClass }>
						<div className='left-col'>
							<Details user={ user }/>
							<Tracks tracks={ tracks } />
						</div>
						<div className='active-track'>
							{
								activeTrack ?
								<div id='viz-container'>
									<audio crossOrigin='anonymous' ref='audio' src={`${ activeTrack.stream_url }?client_id=${ CLIENT_ID }`}> { this.startVisualization() }</audio>

								</div>

								:

								<div>
									{ this.stopVisualization() }
								</div>
							}
						</div>

					</div>
				}
			</div>
		)
	}
});
