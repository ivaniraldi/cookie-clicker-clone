"use client"

export default function OptionsPanel({ onReset, onSave }) {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
        <h3 className="font-bold text-amber-800 border-b border-amber-100 pb-1 mb-2">Game Options</h3>
        <div className="space-y-2">
          <button
            className="w-full py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-md"
            onClick={onSave}
          >
            Save Game
          </button>

          <button
            className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
            onClick={onReset}
          >
            Reset Game
          </button>
        </div>
      </div>

      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
        <h3 className="font-bold text-amber-800 border-b border-amber-100 pb-1 mb-2">About</h3>
        <div className="text-sm">
          <p>This is a Cookie Clicker clone created with React and JavaScript.</p>
          <p className="mt-2">The original Cookie Clicker game was created by Orteil.</p>
          <p className="mt-2">Version 1.1.0</p>
          <p className="mt-2 text-amber-600">
            <span className="font-medium">New:</span> Game now continues to run in background tabs and saves every 5
            seconds!
          </p>
        </div>
      </div>

      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
        <h3 className="font-bold text-amber-800 border-b border-amber-100 pb-1 mb-2">Game Features</h3>
        <ul className="text-sm list-disc pl-5 space-y-1">
          <li>Automatic saving every 5 seconds</li>
          <li>Game continues to run when in another tab</li>
          <li>Offline progress calculation when you return</li>
          <li>Responsive design for all screen sizes</li>
        </ul>
      </div>
    </div>
  )
}

