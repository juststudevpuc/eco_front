import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator"; // Assuming you have this, or use <hr />
import CartCard from "./CartCard";
import { clearAllCart } from "@/store/cartSlice";
import { setRefresh } from "@/store/usersSlice";
import { Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

export default function CheckoutCard({ open, onOpenChange }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state) => state.cart);

  // 1. Calculate Totals (Memoized for performance)
  const { totalItem, totalOriginal, totalDiscount, grandTotal } = useMemo(() => {
    const items = Array.isArray(data) ? data : [];
    
    const count = items.reduce((acc, item) => acc + Number(item?.qty || 0), 0);
    
    const original = items.reduce(
      (acc, item) => acc + Number(item?.qty || 0) * Number(item?.price || 0),
      0
    );

    const discount = items.reduce(
      (acc, item) =>
        acc +
        ((Number(item?.price || 0) * Number(item?.discount || 0)) / 100) *
          Number(item?.qty || 0),
      0
    );

    return {
      totalItem: count,
      totalOriginal: original,
      totalDiscount: discount,
      grandTotal: original - discount,
    };
  }, [data]);

  // 2. Handle Clear Cart
  const onClearAll = () => {
    if (confirm("Are you sure you want to clear the cart?")) {
      dispatch(clearAllCart());
      dispatch(setRefresh(true));
      onOpenChange(false);
    }
  };

  // 3. Handle Navigation / Checkout Logic
  const handleProceedToCheckout = () => {
    const payload = {
      total_amount: grandTotal,
      total_paid: 0, // Defaulting as per your previous logic
      remark: "",
      payment_method: "",
      detail: data?.map((item) => ({
        price: item?.price,
        qty: item?.qty,
        product_id: item?.id,
        discount: item?.discount,
        total:
          Number(item?.qty) * Number(item?.price) -
          ((Number(item?.price) * Number(item?.discount)) / 100) *
            Number(item?.qty),
      })),
    };

    navigate("/user/purchase", { state: { order: payload } });
    onOpenChange(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        
        {/* Header */}
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">My Cart</DialogTitle>
              <DialogDescription>
                Review {totalItem} {totalItem === 1 ? 'item' : 'items'} in your list
              </DialogDescription>
            </div>
            {data?.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Scrollable List Area */}
        <div className="max-h-[50vh] overflow-y-auto px-6 py-2">
          {Array.isArray(data) && data.length > 0 ? (
            <div className="flex flex-col gap-3">
              {data.map((item) => (
                <CartCard key={item.id} data={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
              <div className="bg-muted p-4 rounded-full">
                <ShoppingBag className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Your cart is empty.</p>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        {data?.length > 0 && (
          <div className="bg-slate-50/80 dark:bg-slate-900/50 p-6 space-y-4 border-t mt-2">
            
            {/* Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(totalOriginal)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- {formatCurrency(totalDiscount)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Action Button */}
            <Button 
              className="w-full h-11 text-md shadow-md" 
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}