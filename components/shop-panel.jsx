"use client";

import { formatNumber } from "@/lib/utils";

export default function ShopPanel({
  buildings,
  cookies,
  onBuyBuilding,
  totalCookies,
}) {
  return (
    <div className="">
      {buildings.map((building) => {
        const cost = Math.floor(
          building.baseCost * Math.pow(1.15, building.count)
        );
        const canAfford = cookies >= cost;
        if (totalCookies >(cost * 0.9) || building.id == "cursor") {
          return (
            <div
              key={building.id}
              className={`flex items-center p-3 border-y transition-colors ${
                canAfford
                  ? "border-amber-300 bg-amber-50 hover:bg-amber-200 cursor-pointer shadow-md hover:shadow-lg"
                  : "border-gray-300 bg-gray-100 opacity-70 cursor-not-allowed"
              }`}
              onClick={() => canAfford && onBuyBuilding(building.id)}
            >
              <div className="w-16 h-16 flex-shrink-0 bg-amber-200 rounded-lg flex items-center justify-center mr-4">
                <img className="text-2xl" src={building.image} alt="emoji"/>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <span className="font-bold text-amber-50 decored-text text-2xl text-border-2">
                    {building.name}
                  </span>
                  <span className="text-amber-800 font-bold">
                    {building.count}
                  </span>
                </div>
                <div className="flex justify-between text-sm ">
                  <span>{formatNumber(building.cps, 1)} c/Sec</span>
                  <span
                    className={`font-medium ${
                      canAfford ? "text-yellow-600 border p-1 rounded-md" : "text-yellow-600 border p-1 rounded-md"
                    }`}
                  >
                    🍪 {formatNumber(cost)}
                  </span>
                </div>
                <div className="text-xs text-amber-700 mt-1">
                  {building.description}
                </div>
              </div>
            </div>
          );
        }else{
          return null
        }
      })}
    </div>
  );
}
