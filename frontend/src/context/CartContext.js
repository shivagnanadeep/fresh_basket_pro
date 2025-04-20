import React from 'react';

const CartContext = React.createContext({
	cartList: [],
	addCartItem: () => {},
	deleteCartItem: () => {},
	increaseQuantity: () => {},
	descreaseQuantity: () => {},
	emptyCart: () => {},
});
export default CartContext;
