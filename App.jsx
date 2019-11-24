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
		};

		this.interval = setInterval(() => {
			this.handleTick();
		}, 30);
	}

	handleRef = (node) => {
		this.svg = node;
	};

	handleTick = () => {
		this.setState(({y, vy}) => ({
			y: y + vy,
			vy: vy + 1,
		}));
	};

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		return (
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 100 200"
				onMouseMove={this.handleMouseMove}
				ref={this.handleRef}
				onMouseDown={this.handleMouseDown}
			>
				<circle cx="50" cy={this.state.y} r="5"/>
			</svg>
		);
	}
};
