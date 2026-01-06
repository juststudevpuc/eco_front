import React from "react";
import { Card, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { addItemCart, clearItemCart, decrementCart } from "@/store/cartSlice";
import { Minus, Plus, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const CartCard = ({ data }) => {
  // const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  // const totalItem = cart?.reduce((acc, item) => acc + item?.qty, 0);
  return (
    <div className="">
      {/* <div className="">
        <h1>item : {totalItem} </h1>
      </div> */}
      <Card className={"p-2 flex flex-row gap-3"}>
        <div className="w-20 h-20 rounded-xl overflow-hidden">
          <img className="w-full h-full" src={data?.image_url} alt="" />
        </div>
        <div className="flex-1 ">
          <p className="font-bold">{data?.name}</p>
          <div className="flex gap-3 text-muted-foreground">
            <p>{data?.brand?.name}</p> |<p>{data?.category?.name}</p> |
            <p>
              {data?.status ? (
                <Badge
                  className={"text-white bg-blue-700"}
                  variant={"Secondary"}
                >
                  Active
                </Badge>
              ) : (
                <Badge variant={"destructive"}>Inactive</Badge>
              )}
            </p>
          </div>

          <div className="flex gap-1 mt-2">
            <p>Quantity : {data?.qty}</p>
            <button
              onClick={() => {
                dispatch(addItemCart(data));
              }}
              className=" bg-gray-200 rounded transition-all duration-300 hover:bg-gray-100 hover:scale-105"
            >
              <Plus />
            </button>
            <button
              onClick={() => {
                dispatch(decrementCart(data));
              }}
              className=" bg-gray-200 rounded transition-all duration-300 hover:bg-gray-100 hover:scale-105"
            >
              <Minus />
            </button>
          </div>
        </div>
        <div className="">
          <button
            onClick={() => {
              dispatch(clearItemCart(data));
            }}
            className=" bg-gray-200 rounded transition-all duration-300 hover:bg-gray-100 hover:scale-105"
          >
            <X />
          </button>
        </div>
      </Card>
    </div>
  );
};

export default CartCard;
