
const inputClass =
  "mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100";

const labelClass = "text-sm font-medium text-stone-700";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f7f2] text-stone-900">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-stone-200 bg-white px-5 py-4 sm:px-10">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800 text-xl text-white">
            ✳
          </div>
          <div>
            <p className="font-semibold tracking-tight">
              Meal Planner
            </p>
            <p className="text-xs text-stone-500">
              Pakistani food, made balanced
            </p>
          </div>
        </a>
        <span className="hidden text-sm text-stone-500 sm:block">
          Your journey starts here
        </span>
      </header>

      {/* Page content */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:py-20">
        {/* Introduction */}
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900">
            Healthy meals. Pakistani flavours.
          </span>

          <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Eat better without giving up the food you love.
          </h1>

          <p className="max-w-lg text-base leading-7 text-stone-600 sm:text-lg">
            Get a personalized 7-day meal plan built around
            familiar Pakistani meals, sensible portions, and
            your daily nutrition goals.
          </p>

          <div className="space-y-4 pt-2">
            {[
              ["✓", "Everyday Pakistani meals"],
              ["✓", "Calories and macros made simple"],
              ["✓", "Your portion of a shared family meal"],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800">
                  {icon}
                </span>
                <span className="text-sm text-stone-700 sm:text-base">
                  {text}
                </span>
              </div>
            ))}
          </div>

          <div className="hidden rounded-2xl border border-stone-200 bg-white p-5 lg:block">
            <p className="text-sm font-medium text-stone-500">
              OUR APPROACH
            </p>
            <p className="mt-2 text-lg font-medium">
              Keep the food. Find your balance.
            </p>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              From daal and roti to biryani, healthy eating
              should fit your life and your table.
            </p>
          </div>
        </div>

        {/* Onboarding card */}
        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-7">
            <div className="mb-3 flex items-center justify-between text-xs text-stone-500">
              <span>YOUR PERSONAL PLAN</span>
              <span>STEP 1 OF 1 · WIREFRAME</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-stone-100">
              <div className="h-full w-1/3 rounded-full bg-emerald-800" />
            </div>

            <h2 className="mt-6 text-2xl font-semibold tracking-tight">
              Let’s get started
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Tell us a little about yourself so we can estimate
              your daily energy needs.
            </p>
          </div>

          <div className="space-y-5">
            {/* Age */}
            <div>
              <label htmlFor="age" className={labelClass}>
                Age
              </label>
              <div className="relative">
                <input
                  id="age"
                  type="number"
                  min="18"
                  max="100"
                  placeholder="e.g. 32"
                  className={inputClass}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                  years
                </span>
              </div>
            </div>

            {/* Height */}
            <div>
              <label htmlFor="height" className={labelClass}>
                Height
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    id="height"
                    type="number"
                    placeholder="e.g. 165"
                    className={inputClass}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                    cm
                  </span>
                </div>
                <div className="relative">
                  <input
                    aria-label="Height in feet and inches"
                    type="text"
                    placeholder="5 ft 5 in"
                    className={inputClass}
                  />
                </div>
              </div>
              <p className="mt-2 text-xs text-stone-400">
                Enter either centimetres or feet and inches.
              </p>
            </div>

            {/* Weight */}
            <div>
              <label htmlFor="weight" className={labelClass}>
                Current weight
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    id="weight"
                    type="number"
                    placeholder="e.g. 72"
                    className={inputClass}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                    kg
                  </span>
                </div>
                <div className="relative">
                  <input
                    aria-label="Weight in pounds"
                    type="number"
                    placeholder="e.g. 159"
                    className={inputClass}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                    lb
                  </span>
                </div>
              </div>
            </div>

            {/* Activity */}
            <div>
              <label htmlFor="activity" className={labelClass}>
                Activity level
              </label>
              <select id="activity" defaultValue="" className={inputClass}>
                <option value="" disabled>
                  Select your activity level
                </option>
                <option value="sedentary">
                  Mostly sitting, little exercise
                </option>
                <option value="light">
                  Light activity, 1–3 days/week
                </option>
                <option value="moderate">
                  Moderate activity, 3–5 days/week
                </option>
                <option value="high">
                  Very active most days
                </option>
              </select>
            </div>

            {/* Goal */}
            <fieldset>
              <legend className={labelClass}>
                What is your goal?
              </legend>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  ["lose", "Lose weight"],
                  ["maintain", "Maintain"],
                  ["gain", "Gain weight"],
                ].map(([value, text]) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-stone-200 p-3 text-sm transition hover:border-emerald-700 has-[:checked]:border-emerald-800 has-[:checked]:bg-emerald-50"
                  >
                    <input
                      type="radio"
                      name="goal"
                      value={value}
                      className="accent-emerald-800"
                    />
                    <span>{text}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Action */}
            <button
              type="button"
              className="w-full rounded-xl bg-emerald-800 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
            >
              Create my 7-day plan
              <span className="ml-2" aria-hidden="true">→</span>
            </button>

            <p className="text-center text-xs leading-5 text-stone-400">
              Your calorie target is an estimate. You can review
              your details before your plan is generated.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-200 px-5 py-5 text-center text-xs text-stone-500">
        Made for real life, real food, and balanced eating.
      </footer>
    </main>
  );
}
