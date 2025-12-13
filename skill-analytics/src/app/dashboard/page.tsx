import {
  badgeColor,
  buildEnrichedPredictions,
  buildRecommendations,
  buildSkillGaps,
  careerPaths,
  formatTimestamp,
  getAvgFit,
  inDemandRoles,
  marketEvolution,
  rolePredictions,
  studentSkills,
  trendingSkills,
  velocityCopy,
} from "../lib/mockData";

const skillGaps = buildSkillGaps(studentSkills);
const recommendations = buildRecommendations(skillGaps);
const enrichedPredictions = buildEnrichedPredictions(rolePredictions);
const avgFit = getAvgFit(skillGaps);

export default function DashboardPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 sm:px-10 sm:py-12">
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-700/70 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Live skill gap radar · Updated {formatTimestamp()}
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Skill Intelligence Dashboard
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Real-time comparison of your current skills against market demand,
              paired with AI-driven career predictions, prioritized upskilling,
              and visual dashboards to stay in sync with emerging roles.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-300">
              <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-100">
                Skill gap analysis
              </span>
              <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 font-medium text-cyan-100">
                Career predictions
              </span>
              <span className="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-3 py-1 font-medium text-indigo-100">
                Market dashboards
              </span>
              <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 font-medium text-amber-100">
                Pathway probabilities
              </span>
            </div>
          </div>
          <div className="grid w-full max-w-md grid-cols-2 gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 shadow-inner shadow-cyan-500/10">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Market Fit
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-semibold text-emerald-300">
                  {avgFit}%
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-200">
                  +4.2 vs last month
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Aggregate alignment of your profile vs. market demand.
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Priority Gap
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-semibold text-amber-200">
                  {Math.max(...skillGaps.map((s) => s.gap))}%
                </span>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-100">
                  biggest delta
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Close this gap to unlock next-level opportunities.
              </p>
            </div>
            <div className="col-span-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400"
                style={{ width: `${avgFit}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5 shadow-xl shadow-cyan-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Real-time Skill Gap Report
              </p>
              <h2 className="text-xl font-semibold text-white">
                Student skills vs market demand
              </h2>
            </div>
            <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-100">
              AI ranked by urgency
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {skillGaps.map((skill) => (
              <div
                key={skill.name}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">{skill.name}</p>
                    <p className="text-[11px] text-slate-500">
                      Focus: {skill.focus} · Trend {skill.trend} pts
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-medium ${badgeColor(skill.priority)}`}
                  >
                    {skill.priority} gap
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Student {skill.level}%</span>
                    <span>Market {skill.demand}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-rose-400"
                      style={{ width: `${skill.demand}%` }}
                    />
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
                  <span>
                    Gap: <span className="text-amber-200">{skill.gap}% behind market</span>
                  </span>
                  <span className="text-slate-400">
                    Recommended: {skill.gap >= 12 ? "Hands-on project sprint" : "Targeted micro-learning"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5 shadow-xl shadow-indigo-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Career Predictions
                </p>
                <h3 className="text-lg font-semibold text-white">Opportunity outlook</h3>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-100">
                Based on current skill set
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {enrichedPredictions.map((role) => (
                <div
                  key={role.role}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{role.role}</p>
                      <p className="text-[11px] text-slate-400">
                        {velocityCopy[role.velocity]} · {role.salaryRange}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Match</p>
                      <p className="text-2xl font-semibold text-emerald-300">{role.probability}%</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-300">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">
                        Strengths
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {role.strengths.length > 0 ? (
                          role.strengths.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-100"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500">Building</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">
                        Boost Next
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {role.gaps.length > 0 ? (
                          role.gaps.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-amber-500/10 px-2 py-1 text-[11px] text-amber-100"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-emerald-200">Ready to apply</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5 shadow-xl shadow-amber-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Skill Development
                </p>
                <h3 className="text-lg font-semibold text-white">Prioritized recommendations</h3>
              </div>
              <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-50">
                Highest ROI first
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {recommendations.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-amber-100">
                        {item.rank}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">{item.name}</p>
                        <p className="text-[11px] text-slate-400">
                          Gap {item.gap}% · {item.priority} priority
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-100">
                      +{item.trend} market trend
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{item.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5 shadow-xl shadow-indigo-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Trending Skills</p>
              <h3 className="text-lg font-semibold text-white">Visual dashboard</h3>
            </div>
            <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] text-indigo-100">
              Market velocity
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {trendingSkills.map((skill) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between text-sm text-slate-200">
                  <span>{skill.name}</span>
                  <span className="text-xs text-emerald-200">+{skill.change} pts</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400"
                    style={{ width: `${skill.demand}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5 shadow-xl shadow-emerald-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">In-demand Roles</p>
              <h3 className="text-lg font-semibold text-white">Hiring heatmap</h3>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-100">
              Live postings
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {inDemandRoles.map((role) => (
              <div
                key={role.name}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"
              >
                <div className="flex items-center justify-between text-sm text-slate-200">
                  <span>{role.name}</span>
                  <span className="text-xs text-slate-400">{role.openings} openings</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                    style={{ width: `${Math.min(100, role.openings / 15)}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-emerald-200">+{role.growth}% growth velocity</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5 shadow-xl shadow-cyan-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Market Evolution</p>
              <h3 className="text-lg font-semibold text-white">Demand trajectory</h3>
            </div>
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-[11px] text-cyan-100">
              Last 4 quarters
            </span>
          </div>
          <div className="mt-4 space-y-4">
            {marketEvolution.map((quarter) => (
              <div key={quarter.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>{quarter.label}</span>
                  <span className="text-xs text-slate-400">
                    AI {quarter.ai} · Web {quarter.web} · Data {quarter.data}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-300">
                  <div className="space-y-1">
                    <span className="text-slate-400">AI</span>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-emerald-400"
                        style={{ width: `${quarter.ai}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400">Web</span>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-indigo-400"
                        style={{ width: `${quarter.web}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400">Data</span>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-cyan-400"
                        style={{ width: `${quarter.data}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-emerald-500/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Career Pathways</p>
            <h3 className="text-xl font-semibold text-white">Predicted paths with probability scores</h3>
          </div>
          <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-100">
            Probability calibrated on skills
          </span>
        </div>
        <div className="mt-5 space-y-4">
          {careerPaths.map((path) => (
            <div
              key={path.title}
              className="relative rounded-2xl border border-slate-800 bg-slate-950/60 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{path.title}</p>
                  <p className="text-[11px] text-slate-400">{path.salary}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-12 w-12 rounded-full border border-emerald-400/50 bg-slate-900/60 text-center">
                    <div className="pt-2 text-lg font-semibold text-emerald-200">
                      {path.probability}%
                    </div>
                    <p className="text-[10px] text-slate-400">fit</p>
                  </div>
                  <div className="h-12 w-1.5 rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-b from-emerald-400 via-cyan-400 to-indigo-400"
                      style={{ height: `${path.probability}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {path.steps.map((step) => (
                  <span
                    key={step}
                    className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-200"
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
