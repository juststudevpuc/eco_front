import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import CartCard from "./CartCard";
import InvoiceCard from "./InvoiceCard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { clearAllCart } from "@/store/cartSlice";
import { setRefresh } from "@/store/usersSlice";
import { request } from "@/utils/request/request";
import { Spinner } from "../ui/spinner";

export default function CheckoutCard2({ formData }) {
  const data = useSelector((state) => state.cart);

  const totalItem = Array.isArray(data)
    ? data.reduce((acc, item) => acc + Number(item?.qty || 0), 0)
    : 0;

  const totalOriginal = Array.isArray(data)
    ? data.reduce(
        (acc, item) => acc + Number(item?.qty || 0) * Number(item?.price || 0),
        0
      )
    : 0;

  const totalDiscount = Array.isArray(data)
    ? data
        .reduce(
          (acc, item) =>
            acc +
            ((Number(item?.price || 0) * Number(item?.discount || 0)) / 100) *
              Number(item?.qty || 0),
          0
        )
        .toFixed(2)
    : "0.00";

  const total = totalOriginal - Number(totalDiscount);

  const [paid_amount, setPaidAmount] = useState("");
  const [payment_method, setPaymentMethod] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const ref = useRef();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.value);

  const onPrint = useReactToPrint({
    contentRef: ref,
  });

  const onClearAll = () => {
    dispatch(clearAllCart());
    dispatch(setRefresh(true));
  };

  const onCheckout = async () => {
    if (!paid_amount || !payment_method) {
      alert("Please fill in payment amount and method");
      return;
    }

    if (data.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setLoading(true);

    const payload = {
      total_amount: total,
      total_paid: paid_amount,
      remark: remark,
      payment_method: payment_method,
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

    try {
      const orderRes = await request("order", "post", payload);

      const orderId = orderRes?.data?.id;

      if (orderId) {
        const deliveryPayload = {
          order_id: orderId,
          email: formData.email,
          phone: formData.phone,
          first_name: formData.firstName,
          last_name: formData.lastName,
          address: formData.address,
          province: formData.province,
          country: formData.country || "Cambodia",
          status: true,
        };
        const deliveryRes = await request("delivery", "post", deliveryPayload);
        console.log("Delivery created:", deliveryRes);
      }
      if (orderRes) {
        console.log("order created : ", orderRes);
        setPaidAmount("");
        setRemark("");
        setPaymentMethod("");
        dispatch(clearAllCart());
        dispatch(setRefresh(true));
        alert("Order and delivery placed successfully!");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading overlay when processing
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4">
          <Spinner className="size-12 text-blue-600" />
          <p className="text-lg font-semibold text-gray-800">
            Processing your order...
          </p>
          <p className="text-sm text-gray-500">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Checkout</CardTitle>
            <CardDescription>
              Review your cart and confirm payment
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearAll}
            title="Clear All Cart"
            className="mt-2"
          >
            <Trash2 className="text-red-600" />
          </Button>
        </div>
      </CardHeader>

      {/* Cart Items */}
      <div className="flex flex-col gap-2 mb-4">
        {Array.isArray(data) && data.length > 0 ? (
          data.map((item) => <CartCard key={item.id} data={item} />)
        ) : (
          <p className="text-center text-muted-foreground">
            Your cart is empty.
          </p>
        )}
      </div>

      {/* Totals + Payment */}
      <div className="p-2 rounded-xl flex flex-col gap-2">
        <div className="flex justify-between border-b">
          <p>Item :</p>
          <p>{totalItem}</p>
        </div>
        <div className="flex justify-between border-b">
          <p>Total original :</p>
          <p>${totalOriginal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between border-b">
          <p>Total discount :</p>
          <p>${totalDiscount}</p>
        </div>
        <div className="flex justify-between border-b">
          <p>Total :</p>
          <p>${total.toFixed(2)}</p>
        </div>

        <div className="flex justify-between gap-3 border-b">
          <Input
            className="mb-2"
            value={paid_amount}
            onChange={(e) => setPaidAmount(e.target.value)}
            placeholder="Paid amount"
            disabled={loading}
          />
          <Select
            value={payment_method}
            onValueChange={(value) => setPaymentMethod(value)}
            disabled={loading}
          >
            <SelectTrigger className="w-full mb-2">
              <SelectValue placeholder="Pls select payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aba">ABA</SelectItem>
              <SelectItem value="ac">ACLEDA</SelectItem>
              <SelectItem value="wing">WING</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="remark"
          disabled={loading}
        />

        <div className="flex justify-end">
          <Button className="mr-2" onClick={onPrint} disabled={loading}>
            Print
          </Button>
          <Button onClick={onCheckout} disabled={loading}>
            Checkout
          </Button>
        </div>

        <div className="hidden">
          <InvoiceCard ref={ref} />
        </div>
      </div>
    </Card>
  );
}
