"use client"

import { formatNumber } from "@/lib/utils"

export default function UpgradesPanel({ upgrades, cookies, onBuyUpgrade }) {
  if (upgrades.length === 0) {
    return <div className="text-center text-amber-700 italic">No upgrades available yet. Keep baking cookies!</div>
  }

  return (
    <div className="flex flex-wrap gap-3">
      {upgrades.map((upgrade) => {
        const canAfford = cookies >= upgrade.cost
        return (
          <div key={upgrade.id} className="relative group">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 transition-colors ${
                canAfford
                  ? "border-amber-100 hover:border-amber-300 cursor-pointer shadow-md hover:shadow-lg"
                  : "border-gray-300 bg-gray-100 opacity-70 cursor-not-allowed"
              }`}
              style={{
                backgroundImage: `url(${upgrade.image})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }
            }
              onClick={() => canAfford && onBuyUpgrade(upgrade.id)}
            >
              
            </div>

            {/* Enhanced Tooltip */}
            <div
              className="absolute z-10 w-30 p-3 bg-white rounded-lg shadow-lg border border-amber-200 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                          pointer-events-none top-full left-1/2 transform -translate-x-1/2 mb-2"
            >
              <div className="font-bold text-amber-800 border-b border-amber-100 pb-1 mb-1">{upgrade.name}</div>
              <div className="text-sm mb-2">{upgrade.description}</div>
              <div className={`text-sm font-bold ${canAfford ? "text-green-600" : "text-red-600"}`}>
                Cost: {formatNumber(upgrade.cost)} cookies
              </div>
              {upgrade.type === "building" && (
                <div className="text-xs text-amber-700 mt-1">
                  Affects: {upgrade.buildingId.charAt(0).toUpperCase() + upgrade.buildingId.slice(1)}
                </div>
              )}
              {upgrade.type === "click" && <div className="text-xs text-amber-700 mt-1">Affects: Cookie clicks</div>}
              {upgrade.type === "global" && <div className="text-xs text-amber-700 mt-1">Affects: All buildings</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

