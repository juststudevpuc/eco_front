import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setRefresh } from "@/store/refreshSlice";
import { request } from "@/utils/request/request";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const refresh = useSelector((state) => state.refresh.value);

  const fetchingData = async () => {
    setLoading(true);
    try {
      const res = await request(`product/${id}`, "get");
      if (res?.data) {
        setProduct(res.data);
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error("Error fetching product detail:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingData();
    if (refresh) {
      dispatch(setRefresh(false));
    }
  }, [id, refresh]);

  if (loading) return (
    <div className="flex h-96 items-center justify-center text-sm tracking-widest uppercase text-slate-400">
      Loading details...
    </div>
  );
  
  if (!product) return (
    <div className="flex h-96 items-center justify-center text-sm tracking-widest uppercase text-red-400">
      Product not found
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-12">
        {/* Back Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition mb-8"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left: Product Image */}
          <div className="lg:col-span-7 group">
            <div className="overflow-hidden bg-slate-50 rounded-sm">
              <img
                className="w-full h-auto object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                src={product?.image_url}
                alt={product?.name}
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">
                {product.product_detail?.made_in || "Imported"}
              </p>
              <h1 className="text-3xl font-serif text-slate-900 tracking-tight lg:text-4xl">
                {product?.name}
              </h1>
              <p className="text-xl font-light text-slate-600">
                ${product?.price?.toLocaleString()}
              </p>
            </div>

            <p className="text-slate-600 leading-relaxed text-sm">
              {product?.description}
            </p>

            {/* Specifications Table */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <div className="flex justify-between text-xs uppercase tracking-widest">
                <span className="text-slate-400">Color</span>
                <span className="text-slate-900 font-medium">{product.product_detail?.color}</span>
              </div>
              <div className="flex justify-between text-xs uppercase tracking-widest">
                <span className="text-slate-400">Size</span>
                <span className="text-slate-900 font-medium">{product.product_detail?.size}</span>
              </div>
              <div className="flex justify-between text-xs uppercase tracking-widest">
                <span className="text-slate-400">Availability</span>
                <span className={product.product_detail?.status ? "text-slate-900" : "text-red-500"}>
                  {product.product_detail?.status ? "In Stock" : "Sold Out"}
                </span>
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-4 pt-4">
              <Button
                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-none py-7 text-xs uppercase tracking-[0.2em] transition-all"
                // onClick={() => console.log("Added to cart")}
                // disabled={!product.product_detail?.status}
                onClick={() => navigate(-1)}
              >
                Add to Cart
              </Button>
              <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest">
                Complimentary Shipping & Returns
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;