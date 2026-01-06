import CheckoutCard from "@/components/cards/CheckoutCard";
import PosCard from "@/components/cards/PosCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { addItemCart } from "@/store/cartSlice";
import { request } from "@/utils/request/request";
import { Search, SearchSlash } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Shirt() {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false); // <-- FIX

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const fetchingData = async () => {
    setLoading(true);
    const res = await request("product", "get");
    if (res) {
      setProduct(res?.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  const addToCart = (itemAddToCart) => {
    dispatch(addItemCart(itemAddToCart));
    setDialogOpen(true); // <-- open dialog
  };

  return (
    <div className="">
      <div className="flex justify-between ml-15 mt-5">
        <div className="flex items-center gap-3 ">
          <h1>Search</h1>
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Product"
          />
          <Button
            onClick={async () => {
              setLoading(true);
              const res = await request(`product/search/?q=${query}`, "get");
              if (res) {
                setProduct(res?.data);
                setLoading(false);
              }
            }}
          >
            <Search />
          </Button>
          <Button
            onClick={() => {
              fetchingData();
              setQuery("");
            }}
          >
            <SearchSlash />
          </Button>
        </div>
      </div>

      <div className="flex justify-center mt-5">
        <div className="container">
          {loading ? (
            <div className="flex justify-center mt-10">
              <Spinner className="size-10" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {product.map((item) => (
                <PosCard
                  key={item.id}
                  data={{ ...item, addToCart: () => addToCart(item) }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Use CheckoutDialog instead of CheckoutCard */}
      <CheckoutCard
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        data={cart}
      />
    </div>
  );
}
