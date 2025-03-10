"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import CookieDisplay from "./cookie-display"
import BuildingsPanel from "./buildings-panel"
import UpgradesPanel from "./upgrades-panel"
import StatsPanel from "./stats-panel"
import ViewBuildings from "./view-buildings"
import InfoPanel from "./info-panel"
import CookieGenerator from "./cookie-generator"
import OptionsPanel from "./options-panel"
import ShopPanel from "./shop-panel"
import { initialBuildings, initialUpgrades, achievements } from "@/lib/game-data"
import { formatNumber } from "@/lib/utils"
import cookie_bg from "../public/game-sprites/Backgrounds/bgCandy.jpg"

export default function CookieClicker() {
  const [gameState, setGameState] = useState({
    cookies: 0,
    totalCookies: 0,
    cookiesPerClick: 1,
    cookiesPerSecond: 0,
    buildings: initialBuildings,
    upgrades: initialUpgrades,
    achievements: achievements.map((a) => ({ ...a, unlocked: false })),
    startTime: Date.now(),
    lastUpdated: Date.now(), // Track when the game was last updated
  })

  const [activeTab, setActiveTab] = useState("buildings")
  const [cookieg, setCookieg] = useState(0)

  // Mobile UI state
  const [isMobileView, setIsMobileView] = useState(false)
  const [showMobileShop, setShowMobileShop] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Refs to track game state between renders and for background processing
  const gameStateRef = useRef(gameState)
  const isTabActive = useRef(true)

  // Update ref when state changes
  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  // Check if mobile view on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }

    // Check on mount
    checkIfMobile()

    // Add resize listener
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Update page title with cookie count every 3 seconds
  useEffect(() => {
    const updateTitle = () => {
      document.title = `${formatNumber(Math.floor(gameStateRef.current.cookies))} - Cookie Clicker`
    }

    // Update immediately on mount
    updateTitle()

    // Set up interval for updates
    const titleInterval = setInterval(updateTitle, 3000)

    return () => {
      clearInterval(titleInterval)
      // Reset title on unmount
      document.title = "Cookie Clicker"
    }
  }, [])

  // Track tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabActive.current = document.visibilityState === "visible"

      // If returning to the tab, calculate cookies earned while away
      if (isTabActive.current) {
        const now = Date.now()
        const timeAway = now - gameStateRef.current.lastUpdated

        if (timeAway > 1000 && gameStateRef.current.cookiesPerSecond > 0) {
          const cookiesEarned = (gameStateRef.current.cookiesPerSecond * timeAway) / 1000

          setGameState((prevState) => ({
            ...prevState,
            cookies: prevState.cookies + cookiesEarned,
            totalCookies: prevState.totalCookies + cookiesEarned,
            lastUpdated: now,
          }))

          // Show notification of cookies earned while away
          if (cookiesEarned > 0) {
           console.log(`You earned ${formatNumber(cookiesEarned)} cookies while away!`)
          }
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // Load game from localStorage
  useEffect(() => {
    const savedGame = localStorage.getItem("cookieClickerSave")
    if (savedGame) {
      try {
        const parsedGame = JSON.parse(savedGame)
        setCookieg(parsedGame.cookies)

        // Calculate offline progress
        const now = Date.now()
        const lastSaved = parsedGame.lastUpdated || parsedGame.startTime || now
        const timeAway = now - lastSaved

        if (timeAway > 1000 && parsedGame.cookiesPerSecond > 0) {
          const cookiesEarned = (parsedGame.cookiesPerSecond * timeAway) / 1000
          parsedGame.cookies += cookiesEarned
          parsedGame.totalCookies += cookiesEarned

          // Show notification of cookies earned while away
          if (cookiesEarned > 0) {
            setTimeout(() => {
              console.log(`Welcome back! You earned ${formatNumber(cookiesEarned)} cookies while away!`)
            }, 500)
          }
        }

        setGameState((prevState) => ({
          ...prevState,
          ...parsedGame,
          lastUpdated: now,
          startTime: parsedGame.startTime || now,
        }))
      } catch (e) {
        console.error("Failed to load saved game", e)
      }
    }
  }, [])

  // Save game to localStorage every 5 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const currentState = {
        ...gameStateRef.current,
        lastUpdated: Date.now(),
      }
      localStorage.setItem("cookieClickerSave", JSON.stringify(currentState))
    }, 5000) // Save every 5 seconds

    return () => clearInterval(saveInterval)
  }, [])

  // Game loop for passive cookie generation
  useEffect(() => {
    let lastUpdate = Date.now()

    const gameLoop = setInterval(() => {
      if (gameStateRef.current.cookiesPerSecond > 0) {
        const now = Date.now()
        const deltaTime = now - lastUpdate
        lastUpdate = now

        // Only update state if tab is active or if significant time has passed
        if (isTabActive.current || deltaTime > 1000) {
          const cookiesEarned = (gameStateRef.current.cookiesPerSecond * deltaTime) / 1000

          setGameState((prevState) => ({
            ...prevState,
            cookies: prevState.cookies + cookiesEarned,
            totalCookies: prevState.totalCookies + cookiesEarned,
            lastUpdated: now,
          }))
        }
      }
    }, 100) // Update 10 times per second for smoother counting when active

    return () => clearInterval(gameLoop)
  }, [])

  // Background processing using requestAnimationFrame for better performance
  useEffect(() => {
    let animationFrameId
    let lastUpdate = Date.now()

    const updateGame = () => {
      const now = Date.now()
      const deltaTime = now - lastUpdate

      // Only process if we have CPS and either tab is active or significant time passed
      if (gameStateRef.current.cookiesPerSecond > 0 && (isTabActive.current || deltaTime > 1000)) {
        lastUpdate = now

        // Update cookies based on time passed
        const cookiesEarned = (gameStateRef.current.cookiesPerSecond * deltaTime) / 1000

        setGameState((prevState) => ({
          ...prevState,
          cookies: prevState.cookies + cookiesEarned,
          totalCookies: prevState.totalCookies + cookiesEarned,
          lastUpdated: now,
        }))
      }

      animationFrameId = requestAnimationFrame(updateGame)
    }

    // Start the animation frame loop
    animationFrameId = requestAnimationFrame(updateGame)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Check for achievements
  useEffect(() => {
    const newAchievements = gameState.achievements.map((achievement) => {
      if (achievement.unlocked) return achievement

      let unlocked = false

      if (achievement.type === "cookies" && gameState.totalCookies >= achievement.threshold) {
        unlocked = true
      } else if (achievement.type === "building") {
        const building = gameState.buildings.find((b) => b.id === achievement.buildingId)
        if (building && building.count >= achievement.threshold) {
          unlocked = true
        }
      }

      return { ...achievement, unlocked }
    })

    if (JSON.stringify(newAchievements) !== JSON.stringify(gameState.achievements)) {
      setGameState((prevState) => ({
        ...prevState,
        achievements: newAchievements,
      }))
    }
  }, [gameState.totalCookies, gameState.buildings, gameState.achievements])

  // Handle cookie click
  const handleCookieClick = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      cookies: prevState.cookies + prevState.cookiesPerClick,
      totalCookies: prevState.totalCookies + prevState.cookiesPerClick,
      lastUpdated: Date.now(),
    }))
  }, [])

  // Buy building
  const buyBuilding = useCallback((buildingId) => {
    setGameState((prevState) => {
      const buildingIndex = prevState.buildings.findIndex((b) => b.id === buildingId)
      if (buildingIndex === -1) return prevState

      const building = prevState.buildings[buildingIndex]
      const cost = Math.floor(building.baseCost * Math.pow(1.15, building.count))

      if (prevState.cookies < cost) return prevState

      const updatedBuildings = [...prevState.buildings]
      updatedBuildings[buildingIndex] = {
        ...building,
        count: building.count + 1,
      }

      // Recalculate CPS
      const newCps = updatedBuildings.reduce((total, building) => total + building.cps * building.count, 0)

      return {
        ...prevState,
        cookies: prevState.cookies - cost,
        buildings: updatedBuildings,
        cookiesPerSecond: newCps,
        lastUpdated: Date.now(),
      }
    })
  }, [])

  // Buy upgrade
  const buyUpgrade = useCallback((upgradeId) => {
 
    try{
      console.log("buying upgrade", upgradeId)
      setGameState((prevState) => {
        const upgradeIndex = prevState.upgrades.findIndex((u) => u.id === upgradeId)

        
        if (upgradeIndex === -1) return prevState
  
        const upgrade = prevState.upgrades[upgradeIndex]
        console.log(upgrade)
  
        if (upgrade.purchased || prevState.cookies < upgrade.cost) {
          console.log("not enough money")
          return prevState
        }
        
        const updatedUpgrades = [...prevState.upgrades]
        updatedUpgrades[upgradeIndex] = {
          ...upgrade,
          purchased: true,
        }
  
        let newCookiesPerClick = prevState.cookiesPerClick
        let newCookiesPerSecond = prevState.cookiesPerSecond
        let updatedBuildings = [...prevState.buildings]
  
        // Apply upgrade effects
        if (upgrade.type === "click") {
          newCookiesPerClick *= upgrade.multiplier
        } else if (upgrade.type === "building") {
          const buildingIndex = updatedBuildings.findIndex((b) => b.id === upgrade.buildingId)
          
          if (buildingIndex !== -1) {
            updatedBuildings[buildingIndex] = {
              ...updatedBuildings[buildingIndex],
              cps: updatedBuildings[buildingIndex].cps * upgrade.multiplier,
            }
  
            // Recalculate CPS
            newCookiesPerSecond = updatedBuildings.reduce((total, building) => total + building.cps * building.count, 0)
          }
        } else if (upgrade.type === "global") {
          
          newCookiesPerSecond *= upgrade.multiplier
          updatedBuildings = updatedBuildings.map((building) => ({
            ...building,
            cps: building.cps * upgrade.multiplier,
          }))
        }
        return {
          ...prevState,
          cookies: prevState.cookies - upgrade.cost,
          cookiesPerClick: newCookiesPerClick,
          cookiesPerSecond: newCookiesPerSecond,
          buildings: updatedBuildings,
          upgrades: updatedUpgrades,
          lastUpdated: Date.now(),
        }
      })
      
    }
    catch(err){
      console.error(err)
    }
  }, [])

  // Reset game
  const resetGame = useCallback(() => {
    if (window.confirm("Are you sure you want to reset your game? All progress will be lost!")) {
      localStorage.removeItem("cookieClickerSave")
      setGameState({
        cookies: 0,
        totalCookies: 0,
        cookiesPerClick: 1,
        cookiesPerSecond: 0,
        buildings: initialBuildings,
        upgrades: initialUpgrades,
        achievements: achievements.map((a) => ({ ...a, unlocked: false })),
        startTime: Date.now(),
        lastUpdated: Date.now(),
      })
    }
  }, [])

  // Manual save function
  const saveGame = useCallback(() => {
    const currentState = {
      ...gameStateRef.current,
      lastUpdated: Date.now(),
    }
    localStorage.setItem("cookieClickerSave", JSON.stringify(currentState))
    alert("Game saved successfully!")
  }, [])

  // Calculate available upgrades
  const availableUpgrades = gameState.upgrades.filter((upgrade) => {
    if (upgrade.purchased) return false

    if (upgrade.requiredCookies && gameState.totalCookies < upgrade.requiredCookies) {
      return false
    }

    if (upgrade.requiredBuilding) {
      const building = gameState.buildings.find((b) => b.id === upgrade.requiredBuilding.id)
      if (!building || building.count < upgrade.requiredBuilding.count) {
        return false
      }
    }

    return true
  })

  // Get cursor count
  const cursorCount = gameState.buildings.find((b) => b.id === "cursor")?.count || 0

  // Get buildings except cursors
  const buildingsExceptCursors = gameState.buildings.filter((b) => b.id !== "cursor" && b.count > 0)

  const handleGenerateCookies = (amount) => {
    setCookieg((prev) => prev + amount)
  }

  // Handler to close mobile modals when an action is taken
  const handleMobileAction = useCallback(() => {
    setShowMobileShop(false)
    setShowMobileMenu(false)
  }, [])

  // Render the main content
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Left Section - Cookie */}
      <div className="w-full md:w-[31%] py-4 flex flex-col items-center justify-center overflow-y-auto"
        style={{
          backgroundImage: `url(/game-sprites/Backgrounds/bgCandy.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center mb-4 w-full">
          <h1 className="text-4xl font-bold py-1  text-amber-800 decored-text mb-2">Cafeteria cookiemaster</h1>

          <div className="text-3xl font-bold text-amber-900">{formatNumber(Math.floor(gameState.cookies))} <span className="decored-text">cookies</span></div>
          <div className="text-amber-700 decored-text">per second: <span className="normal-font font-bold text-xs">
          {formatNumber(gameState.cookiesPerSecond, 1)}
            </span>
             </div>
        </div>
        <CookieGenerator onGenerateCookies={handleGenerateCookies} cookiesPerSecond={gameState.cookiesPerSecond} />
        <CookieDisplay
          onCookieClick={handleCookieClick}
          cookiesPerClick={gameState.cookiesPerClick}
          cursorCount={cursorCount}
        />

        {/* Mobile Navigation Buttons */}
        {isMobileView && (
          <div className="w-full flex justify-center gap-4 mt-4">
            <button
              className="bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg shadow-md text-lg font-medium flex-1"
              onClick={() => {
                setShowMobileMenu(!showMobileMenu)
                setShowMobileShop(false)
              }}
            >
              Menu
            </button>
            <button
              className="bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg shadow-md text-lg font-medium flex-1"
              onClick={() => {
                setShowMobileShop(!showMobileShop)
                setShowMobileMenu(false)
              }}
            >
              Shop
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Modal (only for mobile) */}
      {isMobileView && showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            className="w-11/12 max-h-[80vh] bg-white rounded-lg shadow-xl overflow-y-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b border-amber-200 pb-2">
              <h2 className="text-xl font-bold text-amber-800">Menu</h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowMobileMenu(false)}>
                ✕
              </button>
            </div>

            <div className="bg-white shadow-sm p-2 mb-4">
              <div className="flex border-b border-amber-200 mb-4">
                <button
                  className={`flex-1 py-2 ${activeTab === "buildings" ? "font-bold border-b-2 border-amber-500" : ""}`}
                  onClick={() => {
                    setActiveTab("buildings")
                    handleMobileAction()
                  }}
                >
                  Inicio
                </button>
                <button
                  className={`flex-1 py-2 ${activeTab === "stats" ? "font-bold border-b-2 border-amber-500" : ""}`}
                  onClick={() => {
                    setActiveTab("stats")
                    handleMobileAction()
                  }}
                >
                  Stats
                </button>
                <button
                  className={`flex-1 py-2 ${activeTab === "info" ? "font-bold border-b-2 border-amber-500" : ""}`}
                  onClick={() => {
                    setActiveTab("info")
                    handleMobileAction()
                  }}
                >
                  Info
                </button>
                <button
                  className={`flex-1 py-2 ${activeTab === "options" ? "font-bold border-b-2 border-amber-500" : ""}`}
                  onClick={() => {
                    setActiveTab("options")
                    handleMobileAction()
                  }}
                >
                  Options
                </button>
              </div>

              {activeTab === "buildings" && <ViewBuildings buildings={gameState.buildings} />}
              {activeTab === "stats" && (
                <div>
                  <StatsPanel
                    cookies={gameState.cookies}
                    totalCookies={gameState.totalCookies}
                    cookiesPerSecond={gameState.cookiesPerSecond}
                    cookiesPerClick={gameState.cookiesPerClick}
                    buildings={gameState.buildings}
                    achievements={gameState.achievements}
                    startTime={gameState.startTime}
                    onReset={resetGame}
                  />
                  {buildingsExceptCursors.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
                      <h2 className="text-xl font-bold text-amber-800 mb-4">Your Buildings</h2>
                      <BuildingsPanel buildings={buildingsExceptCursors} />
                    </div>
                  )}
                </div>
              )}
              {activeTab === "info" && <InfoPanel achievements={gameState.achievements} />}
              {activeTab === "options" && <OptionsPanel onReset={resetGame} onSave={saveGame} />}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Shop Modal (only for mobile) */}
      {isMobileView && showMobileShop && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setShowMobileShop(false)}
        >
          <div
            className="w-11/12 max-h-[80vh] bg-white rounded-lg shadow-xl overflow-y-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b border-amber-200 pb-2">
              <h2 className="text-xl font-bold text-amber-800">Shop</h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowMobileShop(false)}>
                ✕
              </button>
            </div>

            {availableUpgrades.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <h2 className="text-xl font-bold text-amber-800 mb-2">Upgrades</h2>
                <UpgradesPanel
                  upgrades={availableUpgrades}
                  cookies={gameState.cookies}
                  onBuyUpgrade={(id) => {
                    buyUpgrade(id)
                    // Don't close the shop after buying an upgrade
                  }}
                />
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="font-bold text-amber-800 mb-4 text-xl ">Shop</h2>
              <ShopPanel
                buildings={gameState.buildings}
                cookies={gameState.cookies}
                onBuyBuilding={(id) => {
                  buyBuilding(id)
                  // Don't close the shop after buying a building
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Center Section - Content (hidden on mobile) */}
      <div className={`w-full text-2xl text-amber-900 decored-text md:w-[45%] container overflow-y-auto ${isMobileView ? "hidden" : ""}`}>
        <div className="bg-white rounded-lg shadow-md py-4 mb-4">
          {/* Tabs */}
          <div className="flex border-b border-amber-200 mb-4">
            <button
              className={`flex-1 py-2 ${activeTab === "buildings" ? "font-bold border-b-2 border-amber-500" : ""}`}
              onClick={() => setActiveTab("buildings")}
              >
              Inicio
            </button>
            <button
              className={`flex-1 py-2 ${activeTab === "stats" ? "font-bold border-b-2 border-amber-500" : ""}`}
              onClick={() => setActiveTab("stats")}
            >
              Statistics
            </button>
            <button
              className={`flex-1 py-2 ${activeTab === "info" ? "font-bold border-b-2 border-amber-500" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              Info
            </button>
            <button
              className={`flex-1 py-2 ${activeTab === "options" ? "font-bold border-b-2 border-amber-500" : ""}`}
              onClick={() => setActiveTab("options")}
            >
              Options
            </button>
          </div>
          {/* Content */}

          {activeTab === "buildings" && <ViewBuildings buildings={gameState.buildings} />}
          {activeTab === "stats" && (
            <div>
              <StatsPanel
                cookies={gameState.cookies}
                totalCookies={gameState.totalCookies}
                cookiesPerSecond={gameState.cookiesPerSecond}
                cookiesPerClick={gameState.cookiesPerClick}
                buildings={gameState.buildings}
                achievements={gameState.achievements}
                startTime={gameState.startTime}
                onReset={resetGame}
              />
              {buildingsExceptCursors.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-4 mt-4">
                  <h2 className="text-xl font-bold text-amber-800 mb-4">Your Buildings</h2>
                  <BuildingsPanel buildings={buildingsExceptCursors} />
                </div>
              )}
            </div>
          )}
          {activeTab === "info" && <InfoPanel achievements={gameState.achievements} />}
          {activeTab === "options" && <OptionsPanel onReset={resetGame} onSave={saveGame} />}
        </div>
      </div>

      {/* Right Section - Shop (hidden on mobile) */}
      <div
        className={`w-full md:w-[24%] py-4 bg-gradient-to-b from-amber-200 to-amber-100 overflow-y-auto container ${isMobileView ? "hidden" : ""}`}
      >
      <h2 className="text-5xl text-center font-bold text-white mb-4 decored-text text-border">Shop</h2>
        {availableUpgrades.length > 0 && (
          <div className="bg-white shadow-md px-8 py-2 mb-4">
            <UpgradesPanel upgrades={availableUpgrades} cookies={gameState.cookies} onBuyUpgrade={buyUpgrade} />
          </div>
        )}

        <div className="bg-white shadow-md py-2 ">
          <ShopPanel buildings={gameState.buildings} cookies={gameState.cookies} onBuyBuilding={buyBuilding} totalCookies={gameState.totalCookies} />
        </div>
      </div>
    </div>
  )
}

