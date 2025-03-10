"use client"

import { formatNumber } from "@/lib/utils"
import { useState, useCallback, useMemo } from "react"

export default function BuildingsPanel({ buildings }) {
  // Modificar el estado para almacenar tanto el ID del icono como el mensaje
  const [hoveredIcon, setHoveredIcon] = useState(null)
  const [tooltipMessages, setTooltipMessages] = useState({})

  // Random messages for hover tooltip - moved outside component for better performance
  const randomMessages = useMemo(
    () => [
      "Baking cookies like a pro!",
      "Who needs a real job?",
      "Clicking is my cardio.",
      "Cookies are life.",
      "Grandma's secret recipe!",
      "Farm-fresh cookies!",
      "Mining for cookie gold.",
      "Time is cookies.",
      "Sweet profits!",
      "Cookie empire growing!",
      "Dough-licious!",
      "Cookie wizard at work!",
      "Crumbs of wisdom!",
      "Baking up a storm!",
      "Cookie-conomy booming!",
    ],
    [],
  )

  // Function to get a random message - memoized for performance
  const getRandomMessage = useCallback(
    () => randomMessages[Math.floor(Math.random() * randomMessages.length)],
    [randomMessages],
  )

  // Function to get building icon based on type - memoized
  const getBuildingIcon = useCallback((buildingId) => {
    switch (buildingId) {
      case "grandma":
        return "👵"
      case "farm":
        return "🌾"
      case "mine":
        return "⛏️"
      case "factory":
        return "🏭"
      case "bank":
        return "🏦"
      case "temple":
        return "🏛️"
      case "wizard-tower":
        return "🧙‍♂️"
      case "shipment":
        return "🚀"
      case "alchemy_lab":
        return "⚗️"
      case "portal":
        return "🌀"
      case "time_machine":
        return "⏳"
      default:
        return "🏠" // Default icon for unknown buildings
    }
  }, [])

  // Filter out cursors and buildings with zero count
  const visibleBuildings = useMemo(
    () => buildings.filter((building) => building.id !== "cursor" && building.count > 0),
    [buildings],
  )

  // Modificar la función handleMouseEnter para generar y almacenar el mensaje una sola vez
  const handleMouseEnter = useCallback(
    (buildingId, index) => {
      const iconId = `${buildingId}-${index}`
      if (!tooltipMessages[iconId]) {
        setTooltipMessages((prev) => ({
          ...prev,
          [iconId]: getRandomMessage(),
        }))
      }
      setHoveredIcon(iconId)
    },
    [getRandomMessage, tooltipMessages],
  )

  // Handle mouse leave for tooltips
  const handleMouseLeave = useCallback(() => {
    setHoveredIcon(null)
  }, [])

  // If no buildings to display
  if (visibleBuildings.length === 0) {
    return (
      <div className="text-center p-4 bg-amber-50 border border-amber-200">
        <p className="text-amber-800">No buildings yet! Start purchasing some from the shop.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {visibleBuildings.map((building) => (
        <div
          key={building.id}
          className={`py-4 shadow-sm transition-all hover:shadow-md bg-amber-50`}
        >

          {/* Building Icons Grid with responsive layout */}
          <div
            className="flex flex-col items-end justify-end overflow-hidden relative border-amber-600"
            style={{
              backgroundImage: `url(${building.image_bg})`,
              backgroundSize: "auto 100%",
              backgroundRepeat: "repeat-x",
              height: "180px",
              position: "relative",
            }}
          >
            <div
              className="w-full overflow-x-auto pb-2"
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100px",
                justifyContent: "flex-end",
              }}
            >
              {/* Top row */}
              <div
                className="flex overflow-x-auto container"
                style={{
                  paddingLeft: "20px",
                  minHeight: "40px",
                }}
              >
                {Array.from({ length: Math.min(building.count, 30) }).map((_, index) =>
                  index % 2 === 0 ? (
                    <div
                      key={`${building.id}-${index}`}
                      className="relative tooltip-container group w-10 h-10 min-w-[40px] flex items-center justify-center 
                             transition-all duration-200 transform hover:scale-110 mx-1"
                      style={{
                        backgroundImage: `url(${building.image_preview})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                      onMouseEnter={() => handleMouseEnter(building.id, index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* Enhanced Tooltip */}
                      {hoveredIcon === `${building.id}-${index}` && (
                        <div
                          className={`absolute bottom-full left-1/2
                          transform -translate-x-1/2 mb-2 px-3 py-1.5 w-30
                                    bg-amber-800 text-white text-sm rounded-lg shadow-lg z-10
                                    animate-in fade-in duration-200`}
                        >
                          {tooltipMessages[`${building.id}-${index}`] || "Cookie power!"}
                          <div className="absolute w-2 h-2 bg-amber-800 transform rotate-45 left-1/2 -ml-1 -bottom-1"></div>
                        </div>
                      )}
                    </div>
                  ) : null,
                )}
              </div>

              {/* Bottom row */}
              <div
                className="flex overflow-x-auto container"
                style={{
                  minHeight: "40px",
                }}
              >
                {Array.from({ length: Math.min(building.count, 30) }).map((_, index) =>
                  index % 2 === 1 ? (
                    <div
                      key={`${building.id}-${index}`}
                      className="relative tooltip-container group w-10 h-10 min-w-[50px] flex items-center justify-center
                             transition-all duration-200 transform hover:scale-110 mx-1"
                      style={{
                        backgroundImage: `url(${building.image_preview})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                      onMouseEnter={() => handleMouseEnter(building.id, index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* Enhanced Tooltip */}
                      {hoveredIcon === `${building.id}-${index}` && (
                        <div
                          className={`absolute bottom-full left-1/2
                          transform -translate-x-1/2 mb-2 px-3 py-1.5 w-30
                                    bg-amber-800 text-white text-sm rounded-lg shadow-lg z-10
                                    animate-in fade-in duration-200`}
                        >
                          {tooltipMessages[`${building.id}-${index}`] || "Cookie power!"}
                          <div className="absolute w-2 h-2 bg-amber-800 transform rotate-45 left-1/2 -ml-1 -bottom-1"></div>
                        </div>
                      )}
                    </div>
                  ) : null,
                )}
              </div>
            </div>

            {/* Show count indicator if there are more than 30 buildings */}
            {building.count > 30 && (
              <div className="absolute right-0 bottom-0 px-2 py-1 rounded-tl-md text-gray-300 text-sm font-bold hover:text-white"             
              >
                +{building.count - 30} more
              </div>
            )}
          </div>

          {/* Production Stats */}
          <div className="mt-3 pt-2 border-t normal-font text-xs border-amber-200 text-sm text-amber-600 flex justify-between">
            <span>Total production: {formatNumber(building.cps * building.count * 60, 0)}/min</span>
            <span>
              {Math.round(
                ((building.cps * building.count) / (buildings.reduce((sum, b) => sum + b.cps * b.count, 0) || 1)) * 100,
              )}
              % of total CPS
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

