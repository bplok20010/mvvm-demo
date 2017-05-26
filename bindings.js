//数据绑定
function applyBindings(scope, el){
	//遍历node节点
	function parseBinds(el){
		var attrs = el.attributes;
		for( var k in attrs ) {
			var attr = attrs[k];	
			if( !/^bind\-/.test(attr.nodeName) ) {
				continue;
			}
			//找出所育绑定属性eg: bind-text bind-value bind-click bind-hidden ...
			var bind = (attr.nodeName+'').replace(/^bind\-/, '');
			if( applyBindings.binds[bind] ) {
				//属性绑定
				applyBindings.binds[bind].call(attr, scope, el);	
			}
		}
		
		for( var i=0; i<el.children.length; i++ ) {
			parseBinds(el.children[i]);
		}
		
	}
	parseBinds(el);
}
//属性绑定
applyBindings.binds = {
	value : function(scope, el){
		var p = this.nodeValue;
		
		var listener = new Function('scope','with(scope){ return '+p+'; }');
		//init 
		el.value = listener(scope);
		
		function change(){
			scope.info = el.value;
			scope.$digest();	
		}
		
		scope.$watch( listener, function(newValue){
			el.value = newValue;	
		} );	
		
		el.addEventListener('keyup', change);
		el.addEventListener('mousedown', change)
	},
	text : function(scope, el){
		var p = this.nodeValue;
		
		var listener = new Function('scope','with(scope){ return '+p+'; }');
		
		el.innerText = listener(scope);
		
		scope.$watch( listener, function(newValue){
			el.innerText = newValue;	
		} );
	},
	click : function(scope, el){
		var p = this.nodeValue;
		
		var listener = new Function('scope','with(scope){ '+p+';$digest(); }');
		
		
		el.addEventListener('click', function(){
			listener(scope);	
		});
	},
	hidden : function(scope, el){
		var p = this.nodeValue;
		
		var listener = new Function('scope','with(scope){ return '+p+'; }');
		
		function change(newValue){
			if( newValue ) {
				el.style.display = "none";	
			} else {
				el.style.display = "block";	
			}	
		}
		
		//init
		change(listener(scope));
		
		scope.$watch( listener, change );
	},
	background : function(scope, el){
		var p = this.nodeValue;
		
		var listener = new Function('scope','with(scope){ return '+p+'; }');
		
		function change(newValue){
			el.style.backgroundColor = newValue;	
		}
		//init
		change(listener(scope));
		
		scope.$watch( listener, change);
	}			
};