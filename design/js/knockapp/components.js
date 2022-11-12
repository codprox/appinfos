/**
 * Custom Knockout components
 * A service-credits component
 */
ko.components.register('service-credits', {
	template: {
		//element: 'service-credits-template'
		fromUrl: 'serviceCredits.html'
	},
	viewModel: function (params) {

		this.customer = params.customer;
		this.serviceNames = ['Website Templates', 'Stock Images', 'Sound Tracks', 'Screen Savers', 'Wordpress Themes'];

		this.addService = function () {
			if (!this.customer().services) {
				this.customer().services = ko.observableArray();
			}
			this.customer().services.push(new Service({
				"name": "",
				"credit": "1"
			}));
		};

		/**
		 * Put any jQuery UI initialisation here or any code that
		 * needs to run after the component is rendered
		 * @param {Object} args
		 */
		this.afterRender = function (arg) {
			console.log('service-credits template rendered');
		};
	}
});
ko.components.register('template-closeapp', {
	template: {
		fromUrl: 'closeapp.view.html'
	},
	viewModel: function (params) {
		this.route = params;
		this.afterRender = function (arg) {
			console.log('closeapp.view.html rendered');
		};
		
		this.changeroute = function(route){
			pager.goTo(route);
		}

		this.closeApp = function(event){
			if (event.shiftKey) {
                //do something different when user has shift key down
				console.log('closeApp', event);
            } else {
                //do normal action
				// console.log('closeApp', event);
				ipcRenderer.send('closeApp');
            }
		}
	}
});
ko.components.register('template-home', {
	template: {
		fromUrl: 'home.view.html'
	},
	viewModel: function (params) {
		this.route = params;
		this.homeFolder = ko.observable();
		this.destinationFolder = ko.observable();
		this.isHomeLoading = ko.observable(true); 
		this.isDestinationLoading = ko.observable(true);

		// console.log( $parent.currentime )
		
		if(localstorage.get('homeFolder') !=null && localstorage.get('homeFolder') !=''){
			ko.computed(function() {  
				this.homeFolder(localstorage.get('homeFolder'));   
				this.isHomeLoading(false);
			}, this);
		} 
		if(localstorage.get('destinationFolder') !=null && localstorage.get('destinationFolder') !=''){
			ko.computed(function() {  
				this.destinationFolder(localstorage.get('destinationFolder'));   
				this.isDestinationLoading(false);
			}, this); 
		} 

		this.afterRender = function () {
			console.log('home.view.html rendered');
		}; 
		this.homefolderAction = function(event){
			if (event.shiftKey) { 
                //do something different when user has shift key down
				console.log('homefolderAction', event);
            } else {
                //do normal action
				getFolder('Select a folder to analyses', 'setHomeFolder');
				ipcRenderer.on('getHomeFolder', (event, data) => {
					ko.computed(function() {  
						this.homeFolder(data[0]);   
						this.isHomeLoading(false);
						localstorage.set('homeFolder', data[0]);
					}, this);
				})
            }
		}
		this.destinationfolderAction = function(event){
			if (event.shiftKey) {
                //do something different when user has shift key down
				console.log('destinationfolderAction', event);
            } else {
                //do normal action
				getFolder('Destination folder ', 'setDestinationFolder');
				ipcRenderer.on('getDestinationFolder', (event, data) => {
					ko.computed(function() {  
						this.destinationFolder(data[0]); 
						this.isDestinationLoading(false);
						localstorage.set('destinationFolder', data[0]);
					}, this); 
				})
            }
		}
		this.homefolderClose = function(event){
			if (event.shiftKey) { 
                //do something different when user has shift key down
            } else {
				ko.computed(function() {  
					this.homeFolder('');   
					this.isHomeLoading(true);
					localstorage.del('homeFolder');
				}, this); 
            }
		}
		this.destinationfolderClose = function(event){
			if (event.shiftKey) { 
                //do something different when user has shift key down
            } else {
				ko.computed(function() {  
					this.destinationFolder('');   
					this.isDestinationLoading(true);
					localstorage.del('destinationFolder');
				}, this); 
            }
		}
	}
});

/**
 * Customer component template loader
 * @see http://knockoutjs.com/documentation/component-loaders.html
 */
var templateFromUrlLoader = {
	loadTemplate: function (name, templateConfig, callback) {
		if (templateConfig.fromUrl) {
			// toastr.info("Loading template");
			// Uses jQuery's ajax facility to load the markup from a file
			// var fullUrl = 'templates/' + templateConfig.fromUrl;
			var fullUrl = 'views/' + templateConfig.fromUrl;
			$.get(fullUrl, function (markupString) {
				// We need an array of DOM nodes, not a string.
				// We can use the default loader to convert to the
				// required format.
				ko.components.defaultLoader.loadTemplate(name, markupString, callback);
				// toastr.success("Template loaded successfully");
			});
		} else {
			// Unrecognized config format. Let another loader handle it.
			callback(null);
		}
	}
};

// Register it
ko.components.loaders.unshift(templateFromUrlLoader);