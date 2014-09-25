L.FilterToolbar = L.FontAwesomeToolbar.extend({

	options: {
		rectangle: {}
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

		L.FontAwesomeToolbar.prototype.initialize.call(this, options);
	},

	getModeHandlers: function (map) {
		var handlers = [];
		if(null != L.Filter.Rectangle){
			handlers.push({
				enabled: this.options.rectangle,
				handler: new L.Filter.Rectangle(map, this.options.rectangle),
				title: L.drawLocal.filter.toolbar.buttons.rectangle,
				icon: 'fa fa-square-o'
			});
		}
		if(null != L.Filter.Clear){
			handlers.push({
				enabled: true,
				handler: new L.Filter.Clear(map, this.options.clear),
				title: L.drawLocal.filter.toolbar.buttons.clear,
				icon: 'fa fa-trash-o'
			});
		}

		return handlers;
	},

	// Get the actions part of the toolbar
	getActions: function () {
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

	addToolbar: function (map) {
		var container = L.FontAwesomeToolbar.prototype.addToolbar.call(this, map);
		this.setFiltered(false);
		return container;
	},

	setFiltered: function(filtered){
		var type;

		if(filtered){
			for(type in this._modes){
				// The two draw buttons are disabled when we are filtered
				L.DomUtil.addClass(this._modes[type].button, 'leaflet-disabled');
				this._modes[type].button.setAttribute('title', L.drawLocal.filter.toolbar.buttons.disabled);
				this._modes[type].handler.lock();
			}

			// Clear button is enabled
			L.DomUtil.removeClass(this._modes.clear.button, 'leaflet-disabled');
			this._modes.clear.button.setAttribute('title', L.drawLocal.filter.toolbar.buttons.clear);
			this._modes.clear.handler.unlock();


		} else {
			for(type in this._modes){
				// The two draw buttons are enabled when there are no filters
				L.DomUtil.removeClass(this._modes[type].button, 'leaflet-disabled');
				this._modes[type].button.setAttribute('title', L.drawLocal.filter.toolbar.buttons[type]);
				this._modes[type].handler.unlock();
			}

			// Clear button is disabled
			L.DomUtil.addClass(this._modes.clear.button, 'leaflet-disabled');
			this._modes.clear.button.setAttribute('title', L.drawLocal.filter.toolbar.buttons.clearDisabled);
			this._modes.clear.handler.lock();
		}
	},

	getGeo: function(layerType, layer){
		return this._modes[layerType].handler.getGeo(layer);
	}

});
