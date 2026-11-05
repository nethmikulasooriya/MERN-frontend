const CART_STORAGE_KEY = "cart";

export function getCart() {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (storedCart === null) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
    return [];
  }

  const cart = JSON.parse(storedCart);
  if (!Array.isArray(cart)) {
    throw new Error("Stored cart must be an array.");
  }

  return cart.map((item) => {
    if (item.qty === undefined && item.quantity !== undefined) {
      return { ...item, qty: item.quantity };
    }
    return item;
  });
}

export function addToCart(product, qty = 1) {
  if (!product || !Number.isInteger(qty) || qty === 0) {
    throw new Error("A product and a non-zero integer quantity are required.");
  }

  const productId = product.productId || product._id;
  if (!productId) {
    throw new Error("The product must have an ID to be added to the cart.");
  }

  const cart = getCart();
  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    const newQty = (existingItem.qty ?? 0) + qty;
    if (newQty <= 0) {
      removeFromCart(productId);
      return cart.filter((item) => item.productId !== productId);
    }
    existingItem.qty = newQty;
  } else if (qty > 0) {
    cart.push({
      productId,
      name: product.name,
      image: product.images?.[0] || product.image || "",
      price: product.price,
      labelledPrice: product.labelledPrice ?? product.labeledPrice,
      qty,
    });
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  return cart;
}

export function removeFromCart(productId) {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.productId !== productId);
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
  return updatedCart;
}
