export default function BuildingsPanel({ buildings }) {
  return (
    <div className="space-y-4">
      {buildings.map((building) => (
        <div
          key={building.id}
          className="flex items-center p-3 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-colors"
        >
          <div className="w-16 h-16 flex-shrink-0 bg-amber-200 rounded-lg flex items-center justify-center mr-4 shadow-md">
            <span className="text-2xl">{building.image}</span>
          </div>
          <div className="flex-grow">
            <div className="flex justify-between">
              <span className="font-bold text-amber-800">{building.name}</span>
              <span className="text-amber-800 font-bold">{building.count}</span>
            </div>
            <div className="text-sm text-amber-700">
              Producing {(building.cps * building.count).toFixed(1)} cookies/sec
            </div>
            <div className="text-xs text-amber-600 mt-1">{building.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

