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
			isGameOver: false,
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
		if (this.state.isGameOver) {
			return;
		}

		this.setState({
			vy: -10,
			frame: 0,
		});
	};

	handleTick = () => {
		if (this.state.isGameOver) {
			return;
		}

		this.setState(({y, vy, frame}) => {
			const newY = Math.max(y + vy, 0);
			let isGameOver = false;

			if (newY > 200) {
				isGameOver = true;
			}

			return {
				y: Math.min(newY, 200),
				vy: vy + 1.5,
				frame: frame + 1,
				isGameOver,
			};
		});
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
				{this.state.isGameOver && (
					<text
						x="50"
						y="100"
						fill="red"
						fontWeight="bold"
						textAnchor="middle"
					>
						GAME OVER
					</text>
				)}
			</svg>
		);
	}
};
