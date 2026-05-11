import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

const FEATURES = [
  {
    title: 'Visual simulation',
    description: 'Gantt timelines and charts with a clear, readable layout.',
  },
  {
    title: 'Single & dual core',
    description: 'FCFS, SJF, Round Robin, and Priority in both modes.',
  },
  {
    title: 'Explainable metrics',
    description: 'Short explanations tied to each run so results make sense.',
  },
  {
    title: 'Compare mode',
    description: 'Run dual-core algorithms together and rank them on one screen.',
  },
]

const PROJECT_STEPS = [
  'Generate or edit process data',
  'Choose mode and algorithm, set time quantum if needed',
  'Run the schedule and read the Gantt + metrics',
  'Switch to compare mode when you want rankings across algorithms',
]

const GLANCE_ITEMS = [
  'Eight scheduling variants (single + dual-core)',
  'Timeline playback and step mode',
  'Algorithm explain panel tied to your current run',
]

const STATS = [
  { value: '8', label: 'Schedulers' },
  { value: '3', label: 'View modes' },
  { value: 'Live', label: 'Playback' },
]

export default function Home() {
  return (
    <div className="page-shell">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <header className="nav-top">
          <div className="flex items-center gap-6">
            <Link href="/" className="nav-brand">
              Core<span>Balance</span>
            </Link>
            <nav className="hidden items-center gap-2 sm:flex">
              <Link
                href="/simulator"
                className="rounded-full border border-[var(--cb-border)] bg-[var(--cb-accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--cb-accent)] transition-colors hover:border-[var(--cb-accent)]"
              >
                Open simulator →
              </Link>
            </nav>
          </div>
          <ThemeToggle />
        </header>

        <section className="hero-shell">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="hero-eyebrow">CPU scheduling lab</p>
              <h1 className="hero-title">
                Simulate and compare
                <span className="hero-title-accent gradient-text">multi-core schedulers</span>
              </h1>
              <p className="section-subtitle mt-5 max-w-xl">
                A focused tool for operating systems coursework: edit workloads, run algorithms, and inspect
                waiting time, turnaround, and utilization—without noisy chrome.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/simulator" className="btn-primary">
                  Open simulator
                </Link>
                <a href="#how" className="btn-secondary">
                  How it works
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="home-stat flex min-w-[5.5rem] flex-col rounded-[var(--cb-radius)] border border-[var(--cb-border)] bg-[var(--cb-bg-elevated)] px-4 py-3"
                  >
                    <span className="text-xl font-semibold tabular-nums tracking-tight text-[var(--cb-accent)]">
                      {s.value}
                    </span>
                    <span className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-[var(--cb-text-muted)]">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="section-shell !border-[var(--cb-border)] !p-5 md:!p-6">
                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-[var(--cb-text-muted)]">
                  At a glance
                </p>
                <ul className="space-y-3.5 text-sm leading-relaxed text-[var(--cb-text)]">
                  {GLANCE_ITEMS.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ background: 'var(--cb-accent)' }}
                        aria-hidden
                      >
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          className="mb-10 overflow-hidden rounded-[var(--cb-radius-lg)] border border-[var(--cb-border)] bg-[var(--cb-bg-elevated)] shadow-[var(--cb-shadow-md)]"
          aria-label="Scheduling preview"
        >
          <div className="home-preview-strip border-b border-[var(--cb-border)] px-6 py-3 md:px-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--cb-accent)]">
              What you will see inside
            </p>
          </div>
          <div className="grid gap-8 p-6 md:grid-cols-2 md:items-stretch md:p-10">
            <div className="flex flex-col justify-center">
              <h2 className="mb-3 text-xl font-semibold tracking-tight text-[var(--cb-text)] md:text-2xl">
                Readable timelines, dual cores side by side
              </h2>
              <p className="text-sm leading-relaxed text-[var(--cb-text-muted)]">
                Bars and labels follow the same calm palette as this page. Jump in when you are ready—no sign-up, no
                extra panels.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Core 0', bars: [68, 42, 76] },
                { label: 'Core 1', bars: [55, 82, 38] },
              ].map((core) => (
                <div
                  key={core.label}
                  className="rounded-[var(--cb-radius)] border border-[var(--cb-border)] bg-[var(--cb-bg)] p-4 md:p-5"
                >
                  <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--cb-text-muted)]">
                    {core.label}
                  </p>
                  <div className="space-y-2.5">
                    {core.bars.map((width, i) => (
                      <div
                        key={`${core.label}-${i}`}
                        className="h-2 overflow-hidden rounded-full bg-[var(--cb-border)]"
                      >
                        <div
                          className="h-full rounded-full bg-[var(--cb-accent)]"
                          style={{ width: `${width}%`, opacity: 0.92 - i * 0.14 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-[var(--cb-border)] bg-[var(--cb-bg)] px-6 py-4 md:px-10">
            <span className="badge">FCFS</span>
            <span className="badge">SJF</span>
            <span className="badge">RR</span>
            <span className="badge">Priority</span>
            <span className="badge">Dual-core</span>
            <span className="badge">Compare</span>
          </div>
        </section>

        <section id="how" className="section-shell mb-10 scroll-mt-24">
          <h2 className="section-heading">How to use it</h2>
          <p className="section-subtitle mb-8 max-w-2xl">
            Follow this order once; after that you can experiment freely.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PROJECT_STEPS.map((step, idx) => (
              <div key={step} className="step-card flex gap-4">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: 'var(--cb-accent)' }}
                  aria-hidden
                >
                  {idx + 1}
                </span>
                <p className="step-text pt-1">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="feature-grid mb-4">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </section>

        <footer className="mt-12 border-t border-[var(--cb-border)] pt-10 text-center">
          <p className="text-sm text-[var(--cb-text-muted)]">
            <span className="font-semibold text-[var(--cb-text)]">CoreBalance</span>
            {' · '}
            OS scheduling simulator for coursework and demos.
          </p>
          <Link
            href="/simulator"
            className="mt-3 inline-block text-sm font-semibold text-[var(--cb-accent)] hover:text-[var(--cb-accent-hover)]"
          >
            Go to simulator →
          </Link>
        </footer>
      </div>
    </div>
  )
}
