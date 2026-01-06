import CartCard from "@/components/card/CartCard";
import CheckoutCard from "@/components/card/CheckoutCard";
import PosCard from "@/components/card/PosCard";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { addItemCart, clearAllCart } from "@/store/cartSlice";

import { request } from "@/utils/request/request";
import { Search, SearchSlash, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PosPage() {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const fetchingData = async () => {
    setLoading(true);
    const res = await request("product", "get");

    if (res) {
      console.log("Response Product : ", res);
      setProduct(res?.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  const addToCart = (itemAddTocart) => {
    console.log("Data item add to cart : ", itemAddTocart);
    dispatch(addItemCart(itemAddTocart));
  };
  const totalItem = cart?.reduce((acc, item) => acc + item?.qty, 0);

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <h1>Product</h1>
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
                console.log("Response Product : ", res);
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
      <div className="mt-7 grid grid-cols-3 gap-3">
        <div className="col-span-2">
          {loading ? (
            <div className="flex justify-center items-center mt-7">
              <Spinner className={"size-7"} />
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {product?.map((item, index) => (
                <PosCard
                  key={index}
                  data={{ ...item, addToCart: () => addToCart(item) }}
                />
              ))}
            </div>
          )}
        </div>
        <div className="col-span-1 border-l-2 pl-2">
          <div className="mb-2 flex justify-between">
            <h1 className="font-bold ">item : {totalItem}</h1>
            <button
              onClick={() => {
                dispatch(clearAllCart());
              }}
              className="p-0.5 bg-gray-200 rounded transition-all duration-300 hover:bg-gray-100 hover:scale-105"
            >
              <Trash />
            </button>
          </div>
          <div className="">
            {Array.isArray(cart) && cart.length ? (
              <div className="flex flex-col gap-2">
                {Array.isArray(cart) &&
                  cart?.map((item, index) => (
                    <CartCard key={index} data={item} />
                  ))}
              </div>
            ) : (
              <div>
                <h1 className="font-bold text-muted-foreground text-center mt-5">
                  No Data
                </h1>
              </div>
            )}
          </div>
          <div className="mt-5">
            <CheckoutCard data={cart} />
          </div>
        </div>
      </div>
    </div>
  );
}
