let EventObject = require("../objects/EventObject.js");

class EventHandler {

	constructor(ticker){
		ticker.add(this._loop.bind(this));

		this._queue = [];
	}

	_loop(dt){
		for(let i = this._queue.length-1; i >= 0; i--){
			if(this._queue[i].isComplete === true){
				this._queue.splice(i, 1);
			}
		}

		for(let i = 0; i < this._queue.length; i++){
			this._queue[i].update(dt);
		}
	}

	ScheduleEvent(func, timer, loop){
		let event = new EventObject(func,timer,loop);
		this._queue.push(event);
		return this._queue[this._queue.length - 1];
	}
}

module.exports = EventHandler;