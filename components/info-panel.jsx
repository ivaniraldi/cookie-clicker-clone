export default function InfoPanel({ achievements }) {
  const unlockedAchievements = achievements.filter((a) => a.unlocked)

  return (
    <div>
      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mb-4">
        <h3 className="font-bold text-amber-800 border-b border-amber-100 pb-1 mb-2">
          Achievements ({unlockedAchievements.length}/{achievements.length})
        </h3>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg border ${
                achievement.unlocked ? "border-amber-300 bg-amber-100" : "border-gray-300 bg-gray-100 opacity-50"
              }`}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 flex-shrink-0 bg-amber-200 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-xl">{achievement.unlocked ? achievement.image : "?"}</span>
                </div>
                <div>
                  <div className="font-bold">{achievement.unlocked ? achievement.name : "???"}</div>
                  <div className="text-xs text-amber-700">
                    {achievement.unlocked ? achievement.description : "Achievement locked"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
        <h3 className="font-bold text-amber-800 border-b border-amber-100 pb-1 mb-2">How to Play</h3>
        <div className="text-sm space-y-2">
          <p>
            Click the cookie to earn cookies. Use your cookies to buy buildings that automatically produce cookies for
            you.
          </p>
          <p>
            As you progress, you'll unlock upgrades that make your buildings more efficient and your clicks more
            powerful.
          </p>
          <p>Try to unlock all achievements and discover all the secrets of Cookie Clicker!</p>
        </div>
      </div>
    </div>
  )
}

