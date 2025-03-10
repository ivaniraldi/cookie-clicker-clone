"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"

import cookie_img from "../public/game-sprites/Big Cookie-Related/perfectCookie.png"

export default function CookieDisplay({ onCookieClick, cookiesPerClick, cursorCount }) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [clickEffects, setClickEffects] = useState([])
  const cookieRef = useRef(null)
  const containerRef = useRef(null)
  const nextId = useRef(0)
  const [cursors, setCursors] = useState([])
  const [activeCursor, setActiveCursor] = useState(null)

  // Generate cursor positions in a circle
  useEffect(() => {
    if (cursorCount > 0) {
      const newCursors = []
      const radius = 150 // Distance from center

      for (let i = 0; i < cursorCount; i++) {
        // Calculate position on circle
        const angle = (i / cursorCount) * 2 * Math.PI
        const x = radius * Math.cos(angle)
        const y = radius * Math.sin(angle)

        // Add cursor with position and rotation
        newCursors.push({
          id: i,
          x,
          y,
          rotation: (angle * 180) / Math.PI + 90, // Convert to degrees and add offset
          isActive: false,
        })
      }

      setCursors(newCursors)
    } else {
      setCursors([])
    }
  }, [cursorCount])

  // Animate cursors clicking
  useEffect(() => {
    if (cursorCount > 0) {
      const interval = setInterval(
        () => {
          // Simulate a click from a random cursor
          const randomCursorIndex = Math.floor(Math.random() * cursorCount)

          // Set the active cursor
          setActiveCursor(randomCursorIndex)

          // Add visual feedback for the click
          if (cookieRef.current && containerRef.current && cursors[randomCursorIndex]) {
            const cookieRect = cookieRef.current.getBoundingClientRect()
            const containerRect = containerRef.current.getBoundingClientRect()

            // Calculate center of cookie relative to container
            const centerX = cookieRect.width / 2 + (cursors[randomCursorIndex].x || 0)
            const centerY = cookieRect.height / 2 + (cursors[randomCursorIndex].y || 0)

            // Add click effect
            setClickEffects((prev) => {
              const newEffects = [
                ...prev,
                {
                  id: `cursor-${nextId.current}`,
                  x: centerX,
                  y: centerY,
                },
              ]

              // Limit the number of concurrent effects to 10
              if (newEffects.length > 10) {
                return newEffects.slice(-10)
              }

              return newEffects
            })
            nextId.current += 1
          }

          // Reset active cursor after a short delay
          setTimeout(() => {
            setActiveCursor(null)
          }, 300)
        },
        Math.max(10000 / cursorCount, 500),
      ) // Frequency based on cursor count, but not faster than 500ms

      return () => clearInterval(interval)
    }
  }, [cursorCount, cursors])

  const handleClick = (e) => {
    // Get click position relative to the cookie
    if (cookieRef.current) {
      const rect = cookieRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Add click effect
      setClickEffects((prev) => {
        const newEffects = [...prev, { id: `manual-${nextId.current}`, x, y }]
        nextId.current += 1

        // Limit the number of concurrent effects to 10
        if (newEffects.length > 10) {
          return newEffects.slice(-10)
        }

        return newEffects
      })
    }

    // Trigger cookie animation
    setIsAnimating(true)

    // Call the click handler
    onCookieClick()
  }

  // Remove click effects after animation
  useEffect(() => {
    if (clickEffects.length > 0) {
      const timer = setTimeout(() => {
        setClickEffects((prev) => prev.slice(1))
      }, 500) // Reduced from 1000ms to 500ms for quicker cleanup

      return () => clearTimeout(timer)
    }
  }, [clickEffects])

  // Reset animation state
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  return (
    <div ref={containerRef} className="relative w-[350px] h-[350px] flex items-center justify-center">
      {/* Cursors */}
      {cursors.map((cursor, i) => (
        <div
          key={i}
          className={`absolute pointer-events-none transition-transform duration-300 ${
            activeCursor === cursor.id ? "scale-110" : "scale-100"
          }`}
          style={{
            transform: `translate(${cursor.x}px, ${cursor.y}px) rotate(${cursor.rotation}deg)`,
            transformOrigin: "center",
            left: "50%",
            top: "50%",
          }}
        >
          <div className={`w-6 h-6 text-amber-800 ${activeCursor === cursor.id ? "opacity-100" : "opacity-70"}`}>
            <img src="https://i.imgur.com/hgUcjEh.png" style={{
              transform: "scaleY(-1)",
              rotate: "30deg"
            }} />
          </div>
        </div>
      ))}

      {/* Cookie */}
      <div
        ref={cookieRef}
        className={`relative cursor-pointer transition-transform duration-100 z-10 ${isAnimating ? "scale-95" : "scale-100 hover:scale-105"}`}
        onClick={handleClick}
      >
        <Image
          src={cookie_img}
          alt="Cookie"
          width={200}
          height={200}
          className="ml-6 mt-4"
        />

        {/* Click effects */}
        {clickEffects.map((effect) => (
          <div
            key={effect.id}
            className="absolute pointer-events-none text-white font-bold animate-float-up"
            style={{ left: effect.x, top: effect.y }}
          >
            +{cookiesPerClick}
          </div>
        ))}
      </div>
    </div>
  )
}

