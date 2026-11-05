const CART_STORAGE_KEY = "cart";

export function getCart() {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (!storedCart) {
    return [];
  }

  const cart = JSON.parse(storedCart);
  if (!Array.isArray(cart)) {
    throw new Error("Stored cart must be an array.");
  }

  return cart;
}

export function addToCart(product, quantity = 1) {
  if (!product || !Number.isInteger(quantity) || quantity < 1) {
    throw new Error("A product and a positive integer quantity are required.");
  }

  const productId = product.productId || product._id;
  if (!productId) {
    throw new Error("The product must have an ID to be added to the cart.");
  }

  const cart = getCart();
  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...product, productId, quantity });
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  return cart;
}
