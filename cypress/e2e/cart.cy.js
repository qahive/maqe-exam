const SELECTORS = Object.freeze({
	PRODUCT_DETAIL: '.cart-product-detail',
	PRODUCT_ITEMS: '.cart-product-item',
	PRODUCT_NAME: '.name',
	PRODUCT_IMAGE: '.product-image',
	PRODUCT_PRICE: '.product-price .price-total',
	PRODUCT_DISCOUNT: '.product-price .price-discount',
	CART_BADGE: '.cart-badge',
	INCREASE_BUTTON: '.btn-increase',
	DECREASE_BUTTON:'.btn-decrease',
	QUANTITY_INPUT: '.input-product-quantity',
	DELETE_BUTTON: 'button.btn-delete',
	CART_EMPTY: '.cart-product-empty',
	SUB_TOTAL: '.price-detail .sub',
	DISCOUNT: '.price-detail .discount',
	GRAND_TOTAL: '.price-estimated',
	MINI_CART_ICON: '.btn-shopping-cart',
	CART_BUTTON: '.mini-cart .btn',
	INSTALLMENT_LABEL: 'button.btn-see-installment',
	FREEBIE_NAME: '.free-gift-items .cart-product-item',
	ERROR_MESSAGE: '.error-message'
});

const token = Cypress.env('token');
const api_server = Cypress.env('api_server');
const username = Cypress.env('username');
const password = Cypress.env('password');
const authorization = `Bearer ${token}`;
let subTotal = 0;
let subTotalAdjust = 0;

describe('Normal Product in cart', () => {
	before(() => {
		cy.ignoreJavascriptError();
		cy.fixture('product/freebie-product.json').then((freebieProduct) => {
			cy.deleteProductInCart(freebieProduct.sku);
		});
		cy.fixture('product/bundle-product.json').then((bundleProduct) => {
			cy.deleteProductInCart(bundleProduct.sku);
			cy.deleteProductInCart(bundleProduct.bundle[0].sku);
		});
		cy.fixture('product/normal-product.json').then((normalProduct) => {
			cy.addProductToCart(normalProduct.sku);
		});
	});

	it('Cart displays normal product data correctly', () => {
		cy.visit('/');
		cy.login(username, password);
		cy.get(SELECTORS.MINI_CART_ICON).click();
		cy.get(SELECTORS.CART_BUTTON).click();

		cy.fixture('product/normal-product.json').then((normalProduct) => {
			cy.get(SELECTORS.PRODUCT_DETAIL).should(($detail) => {
				expect($detail.find(SELECTORS.PRODUCT_NAME)).to.contain(normalProduct.name);
				expect($detail.find(SELECTORS.PRODUCT_PRICE)).to.contain(normalProduct.price);
			});
			cy.get(SELECTORS.INSTALLMENT_LABEL).should('contain', normalProduct.installmentLabel);
			cy.get(SELECTORS.SUB_TOTAL).should('contain', normalProduct.price);
			cy.get(SELECTORS.DISCOUNT).should('contain', '0');
			cy.get(SELECTORS.GRAND_TOTAL).should('contain', normalProduct.price);
		});
	});
});

describe('Freebie Product in cart', () => {
	before(() => {
		cy.ignoreJavascriptError();
		cy.fixture('product/normal-product.json').then((normalProduct) => {
			cy.deleteProductInCart(normalProduct.sku);
		});
		cy.fixture('product/bundle-product.json').then((bundleProduct) => {
			cy.deleteProductInCart(bundleProduct.sku);
			cy.deleteProductInCart(bundleProduct.bundle[0].sku);
		});
		cy.fixture('product/freebie-product.json').then((freebieProduct) => {
			cy.addProductToCart(freebieProduct.sku);
		});
	});

	it('Cart displays freebie product data correctly', () => {
		cy.visit('/');
		cy.login(username, password);
		cy.get(SELECTORS.MINI_CART_ICON).click();
		cy.get(SELECTORS.CART_BUTTON).click();

		cy.fixture('product/freebie-product.json').then((freebieProduct) => {
			cy.get(SELECTORS.PRODUCT_ITEMS).eq(0).should(($detail) => {
				expect($detail.find(SELECTORS.PRODUCT_NAME)).to.contain(freebieProduct.name);
				expect($detail.find(SELECTORS.PRODUCT_PRICE)).to.contain(freebieProduct.price);
				expect($detail.find(SELECTORS.INSTALLMENT_LABEL)).to.contain(freebieProduct.installmentLabel);
				expect($detail.find(SELECTORS.FREEBIE_NAME)).to.contain(freebieProduct.freebie[0].name);
			});
			cy.get(SELECTORS.SUB_TOTAL).should('contain', freebieProduct.price);
			cy.get(SELECTORS.DISCOUNT).should('contain', '0');
			cy.get(SELECTORS.GRAND_TOTAL).should('contain', freebieProduct.price);
		});
	});
});

describe('Bundle Product in cart', () => {
	before(() => {
		cy.ignoreJavascriptError();
		cy.fixture('product/normal-product.json').then((normalProduct) => {
			cy.deleteProductInCart(normalProduct.sku);
		});
		cy.fixture('product/freebie-product.json').then((freebieProduct) => {
			cy.deleteProductInCart(freebieProduct.sku);
		});
		cy.fixture('product/bundle-product.json').then((bundleProduct) => {
			cy.addProductToCart(bundleProduct.sku);
			cy.addProductToCart(bundleProduct.bundle[0].sku);
		});
	});

	it('Cart displays bundle product data correctly', () => {
		cy.visit('/');
		cy.login(username, password);
		cy.get(SELECTORS.MINI_CART_ICON).click();
		cy.get(SELECTORS.CART_BUTTON).click();

		cy.fixture('product/bundle-product.json').then((bundleProduct) => {
			cy.get(SELECTORS.PRODUCT_DETAIL).eq(0).should(($detail) => {
				expect($detail.find(SELECTORS.PRODUCT_NAME).eq('0')).to.contain(bundleProduct.name);
				expect($detail.find(SELECTORS.PRODUCT_PRICE).eq('0')).to.contain(bundleProduct.price);
				expect($detail.find(SELECTORS.INSTALLMENT_LABEL).eq('0')).to.contain(bundleProduct.installmentLabel);

				expect($detail.find(SELECTORS.PRODUCT_NAME).eq('1')).to.contain(bundleProduct.bundle[0].name);
				expect($detail.find(SELECTORS.PRODUCT_PRICE).eq('1')).to.contain(bundleProduct.bundle[0].price);
				expect($detail.find(SELECTORS.INSTALLMENT_LABEL).eq('1')).to.contain(bundleProduct.bundle[0].installmentLabel);
			});
			cy.get(SELECTORS.SUB_TOTAL).should('contain', bundleProduct.total);
			cy.get(SELECTORS.DISCOUNT).should('contain', '0');
			cy.get(SELECTORS.GRAND_TOTAL).should('contain', bundleProduct.total);
		});
	});
});

describe('Empty cart', () => {
	before(() => {
		cy.ignoreJavascriptError();
		cy.fixture('product/freebie-product.json').then((freebieProduct) => {
			cy.deleteProductInCart(freebieProduct.sku);
		});
		cy.fixture('product/bundle-product.json').then((bundleProduct) => {
			cy.deleteProductInCart(bundleProduct.sku);
			cy.deleteProductInCart(bundleProduct.bundle[0].sku);
		});
		cy.fixture('product/normal-product.json').then((normalProduct) => {
			cy.addProductToCart(normalProduct.sku);
		});
	});

	it('Empty Cart displays correctly', () => {
		cy.visit('/');
		cy.login(username, password);
		cy.get(SELECTORS.MINI_CART_ICON).click();
		cy.get(SELECTORS.CART_BUTTON).click();

		cy.get(SELECTORS.DELETE_BUTTON).click();
		cy.get(SELECTORS.CART_EMPTY).should('be.visible');
	});
});


describe('Adjust Qty Of Product in cart', () => {
	before(() => {
		cy.ignoreJavascriptError();
		cy.fixture('product/freebie-product.json').then((freebieProduct) => {
			cy.deleteProductInCart(freebieProduct.sku);
		});
		cy.fixture('product/bundle-product.json').then((bundleProduct) => {
			cy.deleteProductInCart(bundleProduct.sku);
			cy.deleteProductInCart(bundleProduct.bundle[0].sku);
			cy.addProductToCart(bundleProduct.sku);
			subTotal = subTotal + parseInt(bundleProduct.price.replace(/,/g, ''));
			subTotalAdjust = subTotalAdjust + (parseInt(bundleProduct.price.replace(/,/g, '')) * 2);			
			cy.log(subTotalAdjust);
		});
		cy.fixture('product/normal-product.json').then((normalProduct) => {
			cy.addProductToCart(normalProduct.sku);
			subTotal = subTotal + parseInt(normalProduct.price.replace(/,/g, ''));
			subTotalAdjust = subTotalAdjust + parseInt(normalProduct.price.replace(/,/g, ''));			
			cy.log(subTotalAdjust);			
		});
	});

	it('Cart displays message when adjusted qty and product out of stock', () => {
		cy.visit('/');
		cy.login(username, password);
		cy.get(SELECTORS.MINI_CART_ICON).click();
		cy.get(SELECTORS.CART_BUTTON).click();
		cy.get(SELECTORS.INCREASE_BUTTON).eq('1').click();
		let subTotalStr = subTotal.toLocaleString("en-US");

		cy.fixture('product/normal-product.json').then((normalProduct) => {

			cy.get(SELECTORS.PRODUCT_DETAIL).eq('0').should(($detail) => {
				expect($detail.find(SELECTORS.ERROR_MESSAGE).eq('0')).to.contain('เหลือสินค้า 1 ชิ้น');
				expect($detail.find(SELECTORS.PRODUCT_PRICE).eq('1')).to.contain(normalProduct.price);
			});

			cy.get(SELECTORS.SUB_TOTAL).should('contain', subTotalStr);
			cy.get(SELECTORS.DISCOUNT).should('contain', '0');
			cy.get(SELECTORS.GRAND_TOTAL).should('contain', subTotalStr);
		});
	});

	it('Cart displays product data after adjust correctly', () => {
		cy.visit('/');
		cy.login(username, password);
		cy.get(SELECTORS.MINI_CART_ICON).click();
		cy.get(SELECTORS.CART_BUTTON).click();
		cy.get(SELECTORS.INCREASE_BUTTON).eq(0).click();
		let subTotalAdjustStr = subTotalAdjust.toLocaleString("en-US");
		let subTotalStr = subTotal.toLocaleString("en-US");

		cy.fixture('product/bundle-product.json').then((bundleProduct) => {
			cy.get(SELECTORS.SUB_TOTAL).should('contain', subTotalAdjustStr);
			cy.get(SELECTORS.DISCOUNT).should('contain', '0');
			cy.get(SELECTORS.GRAND_TOTAL).should('contain', subTotalAdjustStr);

			cy.get(SELECTORS.DECREASE_BUTTON).eq(0).click();

			cy.get(SELECTORS.SUB_TOTAL).should('contain', subTotalStr);
			cy.get(SELECTORS.DISCOUNT).should('contain', '0');
			cy.get(SELECTORS.GRAND_TOTAL).should('contain', subTotalStr);
		});
	});

	
});