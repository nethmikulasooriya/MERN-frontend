import "./productCard.css";

export default function ProductCard() {
  return (
    <div className="card">
      <img className="productImage" src="https://picsum.photos/id/1/200/300" />
      <h1>Gaming Laptop</h1>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi, magni!</p>
      <h2>Price: $1000</h2>
      <button className="addToCart">Add to Cart</button>
      <button className="buyNow">Buy Now</button>
    </div>
  );
}