const React = require('react');
const {range} = require('lodash');

require('./index.pcss');

require('@babel/polyfill');
require('core-js/stage/4');
require('core-js/stage/3');
require('core-js/stage/2');
require('core-js/stage/1');

const isColide = (rect, circle) => {
	if (
		rect.x1 <= circle.x &&
		circle.x <= rect.x2 &&
		rect.y1 - circle.r * 2 <= circle.y &&
		circle.y <= rect.y2 + circle.r * 2
	) {
		return true;
	}

	if (
		rect.y1 <= circle.y &&
		circle.y <= rect.y2 &&
		rect.x1 - circle.r * 2 <= circle.x &&
		circle.x <= rect.x2 + circle.r * 2
	) {
		return true;
	}

	if ((rect.x1 - circle.x) ** 2 + (rect.y1 - circle.y) ** 2 <= (circle.r * 2) ** 2) {
		return true;
	}

	if ((rect.x1 - circle.x) ** 2 + (rect.y2 - circle.y) ** 2 <= (circle.r * 2) ** 2) {
		return true;
	}

	if ((rect.x2 - circle.x) ** 2 + (rect.y1 - circle.y) ** 2 <= (circle.r * 2) ** 2) {
		return true;
	}

	if ((rect.x2 - circle.x) ** 2 + (rect.y2 - circle.y) ** 2 <= (circle.r * 2) ** 2) {
		return true;
	}

	return false;
};

module.exports = class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			x: 0,
			y: 100,
			vy: -10,
			frame: 0,
			isGameOver: false,
			gates: range(2).map((i) => ({
				index: i,
				x: i * 150 + 200,
				y: Math.random() * 150 + 25,
			})),
			isColiding: false,
			score: 0,
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
			vy: -6,
			frame: 0,
		});
	};

	handleTick = () => {
		if (this.state.isGameOver) {
			this.setState(({y, vy, frame}) => ({
				y: Math.min(y + vy, 190),
				vy: vy + 0.6,
				frame: frame + 1,
			}));
			return;
		}

		this.setState(({x, y, vy, frame, gates, score}) => {
			const newY = Math.max(y + vy, 0);
			const newX = x + 1.5;
			let newScore = score;
			let isGameOver = false;

			if (newY > 250) {
				isGameOver = true;
			}

			let isColiding = false;

			for (const gate of gates) {
				if (x <= gate.x && gate.x < newX) {
					newScore++;
				}

				if (gate.x - x <= -100) {
					this.state.gates.shift();
					this.state.gates.push({
						index: gate.index + 2,
						x: gate.x + 2 * 150,
						y: Math.random() * 150 + 25,
					});
				}

				if (isColide(
					{
						x1: gate.x - x + 7,
						x2: gate.x - x + 57,
						y1: gate.y + 35,
						y2: gate.y + 235,
					},
					{
						x: 45,
						y,
						r: 1,
					},
				)) {
					isColiding = true;
					break;
				}

				if (isColide(
					{
						x1: gate.x - x + 7,
						x2: gate.x - x + 57,
						y1: gate.y - 235,
						y2: gate.y - 35,
					},
					{
						x: 45,
						y,
						r: 1,
					},
				)) {
					isColiding = true;
					break;
				}
			}

			if (isColiding) {
				isGameOver = true;
			}

			return {
				x: newX,
				y: Math.min(newY, 250),
				vy: isGameOver ? 0 : vy + 0.6,
				frame: frame + 1,
				isGameOver,
				isColiding,
				score: newScore,
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
				{this.state.gates.map((gate) => (
					<g key={gate.index}>
						<image
							x={gate.x - this.state.x}
							y={gate.y + 15}
							height="200"
							href="long-ojigineko.png"
						/>
						<image
							x={gate.x - this.state.x}
							y={-gate.y + 15}
							height="200"
							transform="scale(1, -1)"
							href="long-ojigineko.png"
						/>
						<rect
							x={gate.x - this.state.x + 7}
							y={gate.y + 35}
							width="50"
							height="200"
							fill="rgba(255, 0, 0, 0)"
						/>
						<rect
							x={gate.x - this.state.x + 7}
							y={gate.y - 235}
							width="50"
							height="200"
							fill="rgba(255, 0, 0, 0)"
						/>
					</g>
				))}
				<circle
					cx="45"
					cy={this.state.y}
					r="10"
					fill={this.state.isColiding ? 'rgba(0, 0, 255, 0)' : 'rgba(255, 0, 0, 0)'}
				/>
				<text
					x="50"
					y="20"
					fill="blue"
					fontWeight="bold"
					fontSize="10"
					textAnchor="middle"
				>
					Score: {this.state.score}
				</text>
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
