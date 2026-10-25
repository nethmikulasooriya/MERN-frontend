import { useEffect, useState } from "react";
import { sampleProducts } from "../../assets/sampleData";
import axios from "axios";

export default function AdminProductsPage() {
  const [products, setProducts] = useState(sampleProducts);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/products")
        console.log(res.data);
        setProducts(res.data);
      });
  }; [];

  return (
    <div className="w-full h-full max-h-full overflow-y-scroll">
      <table className="w-full text-center">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Image</th>
            <th>Labelled Price</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, index) => (
            <tr key={index}>
              <td>{item.productId || item._id}</td>
              <td>{item.productName || item.name}</td>
              <td>
                <img
                  src={item.image || (item.images && item.images[0])}
                  alt={item.name}
                  className="w-12 h-12 object-cover mx-auto"
                />
              </td>
              <td>{item.labelledPrice}</td>
              <td>{item.price}</td>
              <td>{item.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
