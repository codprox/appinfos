/**
 * Customer Admin view model
 * @param {Node} element - the DOM node to bind the view model to
 */
 function CustomerAdmin(element) {

	// save a reference to this object so that we can use it inside closures and other scopes
	var self = this;

	this.saving = ko.observable(false);

	this.selected = ko.observable(false);

	this.setSelected = function (customer) {
		this.selected(customer);
	};

	this.add = function () { 
		var customer = {
			name: ko.observable(''),
			emailAddress: ko.observable(''),
			age: ko.observable(0),
			bio: ko.observable('new customer'),
			edit: ko.observable(true),
			services: ko.observableArray()
		}; 
		this.customers.push(customer);
	};

	this.remove = function (index) {
		this.customers.splice(index(), 1);
		this.selected(false);
	};

	this.toggleEdit = function (customer, edit) {
		customer.edit(edit);
	};

	this.save = function () {
		var customers = ko.toJSON(this.customers);
		toastr.info("Saving customers");
		this.saving(true);

		$.ajax({
			url: "/data/customers",
			method: "POST",
			data: {
				customers: customers
			}

		}).done(function (status) {

			if (status && status.success) {
				toastr.success("Customers saved successfully");
				self.load(false);

			} else {
				toastr.error("Failed to save customers");
			}
			self.saving(false);

		}).fail(function () {
			toastr.error("Failed to save customers");
			self.saving(false);
		});

	};

	this.load = function (initialLoad) { 
		// toastr.info("Loading customers");
		// $.ajax({
		// 	url: "/data/customers",
		// 	method: "GET"

		// }).done(function (customers) {
			// var customersArray = ko.mapping.fromJS(customers, {
			// 	create: function (options) {
			// 		return new Customer(options.data);
			// 	}
			// });

			if (initialLoad) {
				// initial load
				// self.customers = customersArray;
				ko.applyBindings(self, element);
				$(element).removeClass('hidden');

			} else {
				// just a refresh
				// self.customers(customersArray());
			}
			self.selected(false);
			// toastr.success("Customers loaded successfully");

            var viewModel = {
                currentTime: ko.observable() // Initially blank
            };
            viewModel.currentTime("Hello, world!"); // Text appears

            
		// }).fail(function () {
		// 	toastr.error("Failed to loaded customers");
		// });
	};
}