function Scope() {
  this.$$watchers = [];
}
Scope.prototype.$watch = function(watchFn, listenerFn) {
	var self = this;
	
	function isFunction(fn){
		return typeof fn === 'function';	
	}
	
	var expr = watchFn;
	
	var watchFn = isFunction(watchFn) ? watchFn : function(scope){
		return scope[expr];	
	};
	
	var watcher = {
		watchFn: watchFn,
		last : watchFn(self),
		listenerFn: listenerFn || function() {}
	};
	self.$$watchers.push(watcher);
	return function() {
		var index = self.$$watchers.indexOf(watcher);
		if (index >= 0) {
			self.$$watchers.splice(index, 1);
		}
	};
};
Scope.prototype.$digest = function() {
	var self  = this;
	var dirty;
	this.$$watchers.forEach(function(watch) {
		var newValue = watch.watchFn(self);
		var oldValue = watch.last;
		if( newValue !== oldValue ) {
		  watch.listenerFn(newValue, oldValue, self);
			watch.last = newValue;
		}
	});
};