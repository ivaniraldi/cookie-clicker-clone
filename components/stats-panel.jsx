import { formatNumber } from "@/lib/utils"

export default function StatsPanel({
  cookies,
  totalCookies,
  cookiesPerSecond,
  cookiesPerClick,
  buildings,
  achievements,
  startTime,
}) {
  const totalBuildings = buildings.reduce((total, building) => total + building.count, 0)
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length
  const playTime = Math.floor((Date.now() - startTime) / 1000)

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours}h ${minutes}m ${secs}s`
  }

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
        <h3 className="font-bold text-amber-800 border-b border-amber-100 pb-1 mb-2">Cookies</h3>
        <ul className="space-y-1 text-sm">
          <li className="flex justify-between">
            <span>Current:</span>
            <span className="font-medium">{formatNumber(Math.floor(cookies))}</span>
          </li>
          <li className="flex justify-between">
            <span>Total baked:</span>
            <span className="font-medium">{formatNumber(Math.floor(totalCookies))}</span>
          </li>
          <li className="flex justify-between">
            <span>Per click:</span>
            <span className="font-medium">{formatNumber(cookiesPerClick, 1)}</span>
          </li>
          <li className="flex justify-between">
            <span>Per second:</span>
            <span className="font-medium">{formatNumber(cookiesPerSecond, 1)}</span>
          </li>
        </ul>
      </div>

      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
        <h3 className="font-bold text-amber-800 border-b border-amber-100 pb-1 mb-2">Buildings</h3>
        <ul className="space-y-1 text-sm">
          <li className="flex justify-between">
            <span>Total buildings:</span>
            <span className="font-medium">{totalBuildings}</span>
          </li>
          {buildings.map((building) => (
            <li key={building.id} className="flex justify-between">
              <span>{building.name}:</span>
              <span className="font-medium">{building.count}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
        <h3 className="font-bold text-amber-800 border-b border-amber-100 pb-1 mb-2">General</h3>
        <ul className="space-y-1 text-sm">
          <li className="flex justify-between">
            <span>Play time:</span>
            <span className="font-medium">{formatTime(playTime)}</span>
          </li>
          <li className="flex justify-between">
            <span>Achievements:</span>
            <span className="font-medium">
              {unlockedAchievements}/{achievements.length}
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

