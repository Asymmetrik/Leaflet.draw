L.Control.Filter = L.Control.extend({

	options: {
		position: 'topleft',
		filter: {}
	},

	initialize: function (options) {
		L.Control.prototype.initialize.call(this, options);

		// Initialize toolbars
		if (L.FilterToolbar && this.options.filter) {
			this._toolbar = new L.FilterToolbar(this.options.filter);
		}
	},

	onAdd: function (map) {
		var container = L.DomUtil.create('div', 'leaflet-draw'),
			addedTopClass = false,
			topClassName = 'leaflet-draw-toolbar-top',
			toolbarContainer;

		toolbarContainer = this._toolbar.addToolbar(map);
	
		if (toolbarContainer) {
			// Add class to the first toolbar to remove the margin
			if (!addedTopClass) {
				if (!L.DomUtil.hasClass(toolbarContainer, topClassName)) {
					L.DomUtil.addClass(toolbarContainer.childNodes[0], topClassName);
				}
				addedTopClass = true;
			}
			container.appendChild(toolbarContainer);
		}

		// register for create events
		map.on('filter:created', this._filterCreated, this);
		map.on('filter:cleared', this._filterCleared, this);

		return container;
	},

	onRemove: function (map) {
		// unregister create events
		map.off('filter:created', this._filterCreated, this);
		map.off('filter:cleared', this._filterCleared, this);

		this._toolbar.removeToolbar();
	},

	_filterCreated: function(e){
		this._updateFiltered(true);
		this.options.filterGroup.addLayer(e.layer);
	},

	_filterCleared: function(e){
		this._updateFiltered(false);
		this.options.filterGroup.clearLayers();
	},

	_updateFiltered: function(){
		var filterGroup = this.options.filterGroup;
		this._toolbar.setFiltered(true);
	},

	setFilteringOptions: function (options) {
		this._toolbar.setOptions(options);
	}
});

L.Map.mergeOptions({
	drawControlTooltips: false,
	filterControl: false
});

L.Map.addInitHook(function () {
	if (this.options.filterControl) {
		this.filterControl = new L.Control.Filter();
		this.addControl(this.filterControl);
	}
});
