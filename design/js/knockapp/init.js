/**
 * document onload
 */
 $(function () {
	// toastr.options.extendedTimeOut = 100; //1000;
	// toastr.options.timeOut = 1000;
	// toastr.options.fadeOut = 250;
	// toastr.options.fadeIn = 250;
	// var admin = new CustomerAdmin($('.bodycontent')[0]);
	// //ko.applyBindings(admin, $('.container')[0]);
	// admin.load(true);

	// countDirFiles

	function MyViewModel() {
		this.currentime = datenfrancais();
		this.currentfolder = { name: 'folder', url: '/master/app' }; 
		this.changeroute = function(route){ pager.goTo(route); } 
		this.infoScan = ko.observableArray("");
		this.homeList = ko.observableArray("");
		this.autoRefresh= ko.observable();
		this.lastmodifydate= ko.observable();
 

		/**Home viewModel */ 
			this.homeFolder = ko.observable();
			this.destinationFolder = ko.observable();
			this.isHomeLoading = ko.observable(true); 
			this.isDestinationLoading = ko.observable(true);
			this.isFilesfind = ko.observable(false); 
			this.isDirsfind = ko.observable(false); 
	
			if(localstorage.get('homeFolder') !=null && localstorage.get('homeFolder') !=''){
				ko.computed(function() {  
					var linkFolder = localstorage.get('homeFolder');
					this.homeFolder(linkFolder);   
					this.isHomeLoading(false);

					var content = countDirFiles(linkFolder);
					this.infoScan(content); 

					watchFolder(linkFolder);
				}, this);
			}else{
				ko.computed(function() {  
					this.homeFolder('');   
					this.isHomeLoading(true);
					localstorage.del('homeFolder');
					
					var emptyArr = [];
					emptyArr['dir'] = [] 
					emptyArr['files'] = [] 
					this.infoScan(emptyArr);
				}, this); 
			}

			if(localstorage.get('autoRefresh') ==null){
				this.autoRefresh(false);
			}else{
				console.log(localstorage.get('autoRefresh'))
				// if(localstorage.get('autoRefresh') !=null){
				// 	this.autoRefresh(true);
				// }else{
					this.autoRefresh(false);
				// }
			}

			if(localstorage.get('destinationFolder') !=null && localstorage.get('destinationFolder') !=''){
				ko.computed(function() {  
					this.destinationFolder(localstorage.get('destinationFolder'));   
					this.isDestinationLoading(false);
				}, this); 
			}  
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

							var linkFolder = localstorage.get('homeFolder');
							var content = countDirFiles(linkFolder);
							this.infoScan(content); 

							watchFolder(linkFolder);
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
						ipcRenderer.send('closeWatchingInitialize',localstorage.get('homeFolder'));

						this.homeFolder('');   
						this.isHomeLoading(true);
						this.isFilesfind(false);
						this.isDirsfind(false); 
						localstorage.del('homeFolder');
						
						var emptyArr = [];
						emptyArr['dir'] = [] 
						emptyArr['files'] = [] 
						this.infoScan(emptyArr); 
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
			this.updateFolder = function(event){
				if (event.shiftKey) { 
					//do something different when user has shift key down
				} else { 
					ko.computed(function() {  
						if( this.isDestinationLoading() ){
							showDialogWin('Information','info','You must choose a destination folder. Try !');
						}else{
							// ipcRenderer.send('closeWatchingInitialize',localstorage.get('homeFolder'));
							this.isFilesfind(false);
							this.isDirsfind(false); 
	
							// this.homeFolder('');   
							// this.isHomeLoading(true);
							// localstorage.del('homeFolder');
							
							// var emptyArr = [];
							// emptyArr['dir'] = [] 
							// emptyArr['files'] = [] 
							// this.infoScan(emptyArr); 
						}
					}, this); 
				}
			}
			this.autoRefreshData = function(event){
				if (event.shiftKey) { 
					//do something different when user has shift key down
				} else { 
					ko.computed(function() {  
						if(this.autoRefresh()){
							this.autoRefresh(false);
						}else{
							this.autoRefresh(true);
						} 

						console.log(this.autoRefresh());
						// localstorage.set('autoRefresh', ); 
					}, this); 
				}
			}

			// copyfiles(foldersrc,folderdest, file)
			
			ipcRenderer.on('getWatching', (event, data) => {
				ko.computed(function() {  
					this.homeList.push(data); 

					if(data.type=='file'){
						this.isFilesfind(true);
					}else{
						this.isDirsfind(true);
					} 
				}, this);
			}) 
		/**Home viewModel */
	}

	var app = new MyViewModel();  
	pager.extendWithPage(app);  
	ko.options.deferUpdates = true;
	ko.options.useOnlyNativeEvents = true;
	ko.applyBindings(app); 
	pager.goTo('home');

	// console.log(pager)

});