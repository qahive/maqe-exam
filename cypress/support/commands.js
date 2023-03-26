const SELECTORS = Object.freeze({
	LOG_IN_BUTTON: '.header-right .text',
	LOG_IN_FIELD: '.modal-content .text-field',
	LOG_IN_SUBMIT: '.modal-content .btn.-primary',
});


Cypress.Commands.add('login', (email, password) => {
	cy.intercept('POST', '**/store/sessions?lang=th').as('login'); // TODO will update when CRM is implemented
	cy.get(SELECTORS.LOG_IN_BUTTON).click();
	cy.get(SELECTORS.LOG_IN_FIELD).eq(0).type(email);
	cy.get(SELECTORS.LOG_IN_FIELD).eq(1).type(password);
	cy.get(SELECTORS.LOG_IN_SUBMIT).click();
	cy.wait('@login').its('response.statusCode').should('eq', 200);
});

Cypress.Commands.add('ignoreJavascriptError', () => {
	Cypress.on('uncaught:exception', (err, runnable) => {
		return false
	});
});

Cypress.Commands.add('addProductToCart', (sku) => {
	const token = Cypress.env('token');
	const api_server = Cypress.env('api_server');
	const authorization = `Bearer ${token}`;

	const options = {
		method: 'DELETE',
		url: `${api_server}/store/me/carts?lang=th`,
		headers: {
			authorization,
		},
		body: {
			"items": [{ "sku": sku, "quantity": 1 }], "is_check_stock": true
		}
	};

	cy.request(options)
		.its('status')
		.should('eq', 200);

	const options1 = {
		method: 'POST',
		url: `${api_server}/store/me/carts?lang=th`,
		headers: {
			authorization,
		},
		body: {
			"items": [{ "sku": sku, "quantity": 1 }], "is_check_stock": true
		}
	};

	cy.request(options1)
		.its('status')
		.should('eq', 201);

});


Cypress.Commands.add('deleteProductInCart', (sku) => {
	const token = Cypress.env('token');
	const api_server = Cypress.env('api_server');
	const authorization = `Bearer ${token}`;

	const options = {
		method: 'DELETE',
		url: `${api_server}/store/me/carts?lang=th`,
		headers: {
			authorization,
		},
		body: {
			"items": [{ "sku": sku, "quantity": 1 }], "is_check_stock": true
		}
	};
	cy.request(options)
		.its('status')
		.should('eq', 200);

});
