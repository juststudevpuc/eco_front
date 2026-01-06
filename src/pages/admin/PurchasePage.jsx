import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader } from "@/components/ui/card";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import CheckoutCard2 from "@/components/cards/CheckoutCard2";
import { setRefresh } from "@/store/refreshSlice";
import { useSelector, useDispatch } from "react-redux";
import { request } from "@/utils/request/request";
import { clearAllCart } from "@/store/cartSlice";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

export const PurchasePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartData = useSelector((state) => state.cart);
  const refresh = useSelector((state) => state.refresh.value);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    country: "",
    province: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phone: "",
  });
  // Calculate totals from cart
  const totalOriginal = Array.isArray(cartData)
    ? cartData.reduce(
        (acc, item) => acc + Number(item?.qty || 0) * Number(item?.price || 0),
        0
      )
    : 0;
  const totalDiscount = Array.isArray(cartData)
    ? cartData.reduce(
        (acc, item) =>
          acc +
          ((Number(item?.price || 0) * Number(item?.discount || 0)) / 100) *
            Number(item?.qty || 0),
        0
      )
    : 0;

  const shippingCost = 2.0;
  const total = totalOriginal - totalDiscount + shippingCost;
  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  // Complete Purchase
  const onDelivery = async () => {
    // Validate form
    if (
      !formData.email ||
      !formData.phone ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.address ||
      !formData.province ||
      !formData.country
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (cartData.length === 0) {
      alert("Your cart is empty");
      return;
    }
    setLoading(true);

    try {
      const payload = {
        total_amount: total,
        total_paid: total, // Assuming full payment
        remark: `Customer: ${formData.firstName} ${formData.lastName}, Email: ${formData.email}, Phone: ${formData.phone}, Address: ${formData.address}, ${formData.city}, ${formData.province}, ${formData.country}, `,
        payment_method: "online", // You can add payment method selection
        detail: cartData.map((item) => ({
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
      const res = await request("order", "post", payload);

      if (orderRes?.id) {
        const deliveryPayload = {
          order_id: orderRes.id,
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
        console.log("Delivery created:", deliveryRes); // Reset state after success
        setPaidAmount("");
        setRemark("");
        setPaymentMethod("");
        setFormData({
          email: "",
          phone: "",
          firstName: "",
          lastName: "",
          address: "",
          province: "",
          country: "cambodia",
        });
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

  useEffect(() => {
    if (refresh) {
      dispatch(setRefresh(false));
    }
  }, [refresh, dispatch]);

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
    <div className="m-8">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        {/* Left: Customer Info + Shipping */}
        <div className="flex-1 space-y-6 ml-8">
          {/* Customer Info */}
          <div className="space-y-6">
            <div>
              <Label className="font-semibold">Email or Phone *</Label>
              <Input
                type="email"
                placeholder="Email"
                className="mt-2"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={loading}
              />
            </div>
            <Label className="font-semibold">Delivery</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="">
                <Select
                  value={formData.country}
                  onValueChange={(value) => handleInputChange("country", value)}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="cambodia">Cambodia</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="">
                <Select
                  value={formData.province}
                  onValueChange={(value) =>
                    handleInputChange("province", value)
                  }
                  disabled={loading}
                >
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Select a Province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Banteay Meanchey">
                        Banteay Meanchey
                      </SelectItem>
                      <SelectItem value="Battambang">Battambang</SelectItem>
                      <SelectItem value="Kampong Cham">Kampong Cham</SelectItem>
                      <SelectItem value="Kampong Chhnang">
                        Kampong Chhnang
                      </SelectItem>
                      <SelectItem value="Kampong Speu">Kampong Speu</SelectItem>
                      <SelectItem value="Kampong Thom">Kampong Thom</SelectItem>
                      <SelectItem value="Kampot">Kampot</SelectItem>
                      <SelectItem value="Kandal">Kandal</SelectItem>
                      <SelectItem value="Kep">Kep</SelectItem>
                      <SelectItem value="Koh Kong">Koh Kong</SelectItem>
                      <SelectItem value="Kratié">Kratié</SelectItem>
                      <SelectItem value="Mondulkiri">Mondulkiri</SelectItem>
                      <SelectItem value="Oddar Meanchey">
                        Oddar Meanchey
                      </SelectItem>
                      <SelectItem value="Pailin">Pailin</SelectItem>
                      <SelectItem value="Phnom Penh">Phnom Penh</SelectItem>
                      <SelectItem value="Preah Sihanouk">
                        Preah Sihanouk (Sihanoukville)
                      </SelectItem>
                      <SelectItem value="Preah Vihear">Preah Vihear</SelectItem>
                      <SelectItem value="Prey Veng">Prey Veng</SelectItem>
                      <SelectItem value="Pursat">Pursat</SelectItem>
                      <SelectItem value="Ratanakiri">Ratanakiri</SelectItem>
                      <SelectItem value="Siem Reap">Siem Reap</SelectItem>
                      <SelectItem value="Stung Treng">Stung Treng</SelectItem>
                      <SelectItem value="Svay Rieng">Svay Rieng</SelectItem>
                      <SelectItem value="Takéo">Takéo</SelectItem>
                      <SelectItem value="Tbong Khmum">Tbong Khmum</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="First name *"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={loading}
              />
              <Input
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={loading}
              />
            </div>

            <Input
              placeholder="Address *"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              disabled={loading}
            />

            <Input
              type="tel"
              placeholder="Phone *"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Shipping Method */}
          <div>
            <Label className="font-semibold">Shipping Method</Label>
            <Card className="w-full border mt-2 bg-purple-50 border-gray-200 shadow-sm rounded-xl">
              <CardHeader className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Local Delivery (2–3 Days)
                  </h3>
                  <span className="text-gray-700 font-medium">$2.00</span>
                </div>
                <p className="text-sm text-gray-500">
                  ភ្នំពេញ (Phnom Penh Only)
                </p>
                <div className="flex justify-center pt-4">
                  <QRCodeCanvas
                    value="https://your-delivery-info-url.com"
                    size={128}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
        {/* Right: Checkout Summary */}
        <div className="flex-1">
          <CheckoutCard2 formData={formData}/>
        </div>
      </div>
    </div>
  );
};
