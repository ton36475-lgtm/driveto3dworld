import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/copy";
import { getPortfolioProfile, PORTFOLIO_PROFILES } from "@/lib/portfolio-profiles";
import { loc } from "@/lib/works";

export const Route = createFileRoute("/people/$person")({
  loader: ({ params }) => {
    const profile = getPortfolioProfile(params.person);
    if (!profile) throw notFound();
    return profile;
  },
  component: PortfolioProfilePage,
  notFoundComponent: ProfileMissing,
});

function PortfolioProfilePage() {
  const profile = Route.useLoaderData();
  const lang = useLocale();
  const thai = lang === "th";

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
      <nav
        aria-label={thai ? "เลือกพอร์ตโฟลิโอ" : "Choose a portfolio"}
        className="flex flex-wrap gap-2"
      >
        {PORTFOLIO_PROFILES.map((person) => (
          <Link
            key={person.id}
            to="/people/$person"
            params={{ person: person.id }}
            aria-current={person.id === profile.id ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-full border px-5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              person.id === profile.id
                ? "border-foreground bg-foreground text-background"
                : "border-line text-muted hover:text-foreground"
            }`}
          >
            {loc(person.name, lang)}
          </Link>
        ))}
      </nav>

      <header className="mt-14 grid gap-10 border-b border-line pb-12 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-xs tracking-[0.22em] text-muted uppercase">
            {loc(profile.label, lang)}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl tracking-tight sm:text-6xl">
            {loc(profile.name, lang)}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {loc(profile.introduction, lang)}
          </p>
        </div>
        <div
          aria-hidden="true"
          className="flex size-32 items-center justify-center rounded-full border border-line font-display text-4xl text-muted sm:size-40"
        >
          {profile.monogram}
        </div>
      </header>

      <section className="mt-12" aria-labelledby="profile-focus">
        <h2 id="profile-focus" className="font-display text-2xl tracking-tight">
          {thai ? "แนวทางงาน" : "Focus"}
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {profile.focus.map((item, index) => (
            <li key={item.en} className="rounded-xl bg-surface p-6">
              <p className="text-xs tabular-nums text-faint">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-4 text-base text-foreground">{loc(item, lang)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="mt-12 rounded-xl border border-line p-6 sm:p-8"
        aria-labelledby="profile-project"
      >
        <p className="text-xs tracking-widest text-muted uppercase">
          {loc(profile.project.status, lang)}
        </p>
        <h2 id="profile-project" className="mt-3 font-display text-2xl">
          {loc(profile.project.title, lang)}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          {loc(profile.project.description, lang)}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/contact">
              {thai ? "พูดคุยเกี่ยวกับโครงการ" : "Discuss a project"}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
          {profile.id === "studio" ? (
            <Button asChild variant="outline">
              <Link to="/work">{thai ? "ดูงานศึกษาแนวคิด" : "Explore concept studies"}</Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link to="/people/$person" params={{ person: "studio" }}>
                {thai ? "ดูพื้นที่โครงการร่วม" : "Explore shared projects"}
              </Link>
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}

function ProfileMissing() {
  const lang = useLocale();

  return (
    <main className="mx-auto flex min-h-[70svh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-3xl">
        {lang === "th" ? "ไม่พบพอร์ตโฟลิโอนี้" : "Portfolio not found"}
      </h1>
      <Button asChild className="mt-8">
        <Link to="/people/$person" params={{ person: "studio" }}>
          {lang === "th" ? "ดูโครงการร่วม" : "View shared projects"}
        </Link>
      </Button>
    </main>
  );
}
