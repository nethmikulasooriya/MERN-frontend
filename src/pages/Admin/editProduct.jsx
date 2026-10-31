import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import mediaUpload from '../../utils/mediaUpload';

export default function EditProductPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Guard against null location.state if the page is reloaded directly
  const state = location.state || {};

  const [productId, setProductId] = useState(state.productId || '');
  const [name, setName] = useState(state.name || '');
  const [altNames, setAltNames] = useState(
    state.altNames ? state.altNames.join(',') : ''
  );
  const [description, setDescription] = useState(state.description || '');
  const [images, setImages] = useState([]);
  const [labelledPrice, setLabelledPrice] = useState(state.labelledPrice || 0);
  const [price, setPrice] = useState(state.price || 0);
  const [stock, setStock] = useState(state.stock || 0);

  async function UpdateProduct() {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      return;
    }

    // Default to the existing images passed through route state
    let imageUrls = state.images || [];

    try {
      // If the user selected new files to upload, upload them
      if (images && images.length > 0) {
        const promisesArray = [];
        for (let i = 0; i < images.length; i++) {
          promisesArray[i] = mediaUpload(images[i]);
        }
        imageUrls = await Promise.all(promisesArray);
      }

      const altNamesArray = altNames
        ? altNames.split(',').map((item) => item.trim())
        : [];

      const product = {
        name,
        altNames: altNamesArray,
        description,
        images: imageUrls,
        labelledPrice,
        price,
        stock,
      };

      // Added missing "/" before productId
      await axios.put(
        import.meta.env.VITE_BACKEND_URL + '/api/products/' + productId,
        product,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );

      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update product');
      console.error(e);
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

      <input
        type="text"
        disabled
        placeholder="Product ID"
        className="input input-bordered w-full max-w-xs mb-2"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />

      <input
        type="text"
        placeholder="Name"
        className="input input-bordered w-full max-w-xs mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Alt Names (comma separated)"
        className="input input-bordered w-full max-w-xs mb-2"
        value={altNames}
        onChange={(e) => setAltNames(e.target.value)}
      />

      <input
        type="text"
        placeholder="Description"
        className="input input-bordered w-full max-w-xs mb-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="file"
        multiple
        className="input input-bordered w-full max-w-xs mb-2"
        onChange={(e) => setImages(e.target.files)}
      />

      <input
        type="number"
        placeholder="Labelled Price"
        className="input input-bordered w-full max-w-xs mb-2"
        value={labelledPrice}
        onChange={(e) => setLabelledPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        className="input input-bordered w-full max-w-xs mb-2"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Stock"
        className="input input-bordered w-full max-w-xs mb-2"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />

      <div className="w-full flex justify-center flex-row items-center mt-4">
        <Link
          to="/admin/products"
          className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-4"
        >
          Cancel
        </Link>

        <button
          onClick={UpdateProduct}
          className="bg-green-500 text-white font-bold py-2 px-4 rounded"
        >
          Update Product
        </button>
      </div>
    </div>
  );
}