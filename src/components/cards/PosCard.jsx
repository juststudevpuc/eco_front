import React from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const PosCard = ({ data }) => {
  const navigate = useNavigate();

  return (
    <Card className="group border-none shadow-none bg-white flex flex-col gap-4 transition-all duration-300">
      {/* Image Container */}
      <div 
        className="relative w-full aspect-[3/4] overflow-hidden bg-slate-50 cursor-pointer"
        onClick={() => navigate(`/user/product/${data?.id}`)}
      >
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={data?.image_url}
          alt={data?.name}
        />
        {/* Discount Badge - Subtle Overlay */}
        {data?.discount > 0 && (
          <div className="absolute top-3 left-3 bg-white px-2 py-1 text-[10px] font-bold tracking-widest uppercase text-slate-900 border border-slate-100">
            {data?.discount}% Off
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow px-1">
        {/* Brand & Category */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">
          <span>{data?.brand?.name}</span>
          <span>•</span>
          <span>{data?.category?.name}</span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold tracking-tight text-slate-900 uppercase mb-1 truncate">
          {data?.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-medium text-slate-900">
            ${data?.price}
          </span>
          {data?.qty < 5 && data?.qty > 0 && (
            <span className="text-[10px] uppercase tracking-tighter text-orange-600 font-bold">
              Only {data?.qty} left
            </span>
          )}
        </div>

        {/* Hidden Actions - Show on Hover for a cleaner look, or keep static for UX */}
        <div className="flex flex-col gap-2 mt-auto opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
          <Button
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-none py-5 text-[10px] uppercase tracking-[0.2em] transition-all"
            onClick={() => data?.addToCart(data)}
            disabled={!data?.status}
          >
            {data?.status ? "Add to Cart" : "Out of Stock"}
          </Button>
          
          <button
            className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 transition py-2"
            onClick={() => navigate(`/user/product/${data?.id}`)}
          >
            View Details
          </button>
        </div>
      </div>
    </Card>
  );
};

export default PosCard;