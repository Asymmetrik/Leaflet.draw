L.FilterToolbar = L.Toolbar.extend({

	options: {
		rectangle: {},
		circle: {}
	},

	initialize: function (options) {
		// Ensure that the options are merged correctly since L.extend is only shallow
		for (var type in this.options) {
			if (this.options.hasOwnProperty(type)) {
				if (options[type]) {
					options[type] = L.extend({}, this.options[type], options[type]);
				}
			}
		}

		this._toolbarClass = 'leaflet-draw-filter';
		L.Toolbar.prototype.initialize.call(this, options);
	},

	getModeHandlers: function (map) {
		var handlers = [];
		if(null != L.Filter.Rectangle){
			handlers.push({
				enabled: this.options.rectangle,
				handler: new L.Filter.Rectangle(map, this.options.rectangle),
				title: L.drawLocal.draw.toolbar.buttons.rectangle
			});
		}
		if(null != L.Filter.Circle){
			handlers.push({
				enabled: this.options.circle,
				handler: new L.Filter.Circle(map, this.options.circle),
				title: L.drawLocal.draw.toolbar.buttons.circle
			});
		}
		if(null != L.Filter.Clear){
			handlers.push({
				enabled: true,
				handler: new L.Filter.Clear(map, this.options.clear),
				title: L.drawLocal.filter.toolbar.buttons.clear
			});
		}

		return handlers;
	},

	// Get the actions part of the toolbar
	getActions: function (handler) {
		return [
			{
				title: L.drawLocal.draw.toolbar.actions.title,
				text: L.drawLocal.draw.toolbar.actions.text,
				callback: this.disable,
				context: this
			}
		];
	},

	setOptions: function (options) {
		L.setOptions(this, options);

		for (var type in this._modes) {
			if (this._modes.hasOwnProperty(type) && options.hasOwnProperty(type)) {
				this._modes[type].handler.setOptions(options[type]);
			}
		}
	},

	setFiltered: function(filtered){
		console.log(filtered);
	}
});
