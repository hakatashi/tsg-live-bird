const React = require('react');

require('./index.pcss');

require('@babel/polyfill');
require('core-js/stage/4');
require('core-js/stage/3');
require('core-js/stage/2');
require('core-js/stage/1');

module.exports = class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			y: 100,
			vy: -10,
			frame: 0,
		};

		this.interval = setInterval(() => {
			this.handleTick();
		}, 30);

		window.addEventListener('keydown', (event) => {
			if (event.code === 'Space') {
				this.handleJump();
			}
		});

		window.addEventListener('click', (event) => {
			this.handleJump();
		});

		window.addEventListener('touchstart', (event) => {
			this.handleJump();
		});
	}

	handleRef = (node) => {
		this.svg = node;
	};

	handleJump = () => {
		this.setState({
			vy: -10,
			frame: 0,
		});
	};

	handleTick = () => {
		this.setState(({y, vy, frame}) => ({
			y: Math.min(Math.max(y + vy, 0), 200),
			vy: vy + 1.5,
			frame: frame + 1,
		}));
	};

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		const frame = Math.floor(this.state.frame / 2.5);
		const imageFile = `ojigineko${Math.min(frame + 1, 8).toString().padStart(2, '0')}.png`;

		return (
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 100 200"
				onMouseMove={this.handleMouseMove}
				ref={this.handleRef}
				onMouseDown={this.handleMouseDown}
			>
				<image
					x="30"
					y={this.state.y - 15}
					width="30"
					height="30"
					href={imageFile}
				/>
			</svg>
		);
	}
};
