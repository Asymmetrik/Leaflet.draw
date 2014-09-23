L.Filter = L.Filter || {};

L.Filter.Clear = L.Handler.extend({
	statics: {
		TYPE: 'clear'
	},

	includes: L.Mixin.Events,

	initialize: function (map, options) {
		L.Handler.prototype.initialize.call(this, map);

		L.Util.setOptions(this, options);

		this.type = L.Filter.Clear.TYPE;
	},

	enable: function () {
		this._map.fire('filter:cleared');
	},

	disable: function () {
	}

});