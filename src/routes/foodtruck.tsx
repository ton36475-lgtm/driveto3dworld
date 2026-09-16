import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUpRight,
  Download,
  MapPin,
  MoveUpRight,
  Truck,
  Utensils,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/lib/copy";
import { foodtruckCopy } from "@/lib/foodtruck/copy";
import {
  bangkokTimestamp,
  directionsUrl,
  exportFoodtruck,
  FOODTRUCK_KEY,
  FOODTRUCK_MAX_BYTES,
  parseFoodtruck,
  parsePrice,
  stopPhase,
  truckLanguages,
  type FoodtruckProfile,
  type MenuItem,
  type ServiceStop,
} from "@/lib/foodtruck/model";
import { useFoodtruck } from "@/lib/foodtruck/use-foodtruck";

export const Route = createFileRoute("/foodtruck")({ component: Foodtruck });
const localeNames = { en: "en-GB", th: "th-TH", zh: "zh-CN" };

function download(text: string, name: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function dateInput(value: string) {
  const bangkok = new Date(Date.parse(value) + 7 * 60 * 60 * 1000);
  return bangkok.toISOString().slice(0, 16);
}

function Foodtruck() {
  const lang = useLocale();
  const c = foodtruckCopy[lang];
  const { profile, ready, error, save } = useFoodtruck();
  const [notice, setNotice] = useState<"saved" | "invalid" | "large" | "exportError" | null>(null);
  const importGeneration = useRef(0);
  const [incoming, setIncoming] = useState<FoodtruckProfile | null>(null);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [editingStop, setEditingStop] = useState<ServiceStop | null>(null);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const blocked = !ready || !!error;
  const formatter = new Intl.NumberFormat(localeNames[lang], {
    style: "currency",
    currency: profile.currency,
  });
  const dateFormatter = new Intl.DateTimeFormat(localeNames[lang], {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  });

  function commit(next: FoodtruckProfile, replace = false) {
    setNotice(null);
    if (save(next, replace)) {
      setNotice("saved");
      return true;
    }
    return false;
  }
  function labels(data: FormData, prefix: string) {
    return {
      en: String(data.get(`${prefix}-en`) ?? ""),
      th: String(data.get(`${prefix}-th`) ?? ""),
      zh: String(data.get(`${prefix}-zh`) ?? ""),
    };
  }
  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const next = parseFoodtruck(
        JSON.stringify({
          ...profile,
          name: String(data.get("truck-name") ?? ""),
          contactUrl: String(data.get("truck-contact") ?? "").trim(),
          currency: data.get("truck-currency"),
        }),
      );
      commit(next);
    } catch {
      setNotice("invalid");
    }
  }
  function saveMenu(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const item: MenuItem = {
        id: editingMenu?.id ?? crypto.randomUUID(),
        label: labels(data, "menu"),
        priceMinor: parsePrice(String(data.get("menu-price") ?? "")),
        soldOut: profile.menu.find((value) => value.id === editingMenu?.id)?.soldOut ?? false,
      };
      const menu = editingMenu
        ? profile.menu.map((value) => (value.id === item.id ? item : value))
        : [...profile.menu, item];
      const next = parseFoodtruck(JSON.stringify({ ...profile, menu }));
      if (commit(next)) {
        setEditingMenu(null);
        form.reset();
      }
    } catch {
      setNotice("invalid");
    }
  }
  function saveStop(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const stop: ServiceStop = {
        id: editingStop?.id ?? crypto.randomUUID(),
        label: labels(data, "stop"),
        latitude: Number(data.get("stop-latitude")),
        longitude: Number(data.get("stop-longitude")),
        startAt: bangkokTimestamp(String(data.get("stop-start"))),
        endAt: bangkokTimestamp(String(data.get("stop-end"))),
      };
      const stops = editingStop
        ? profile.stops.map((value) => (value.id === stop.id ? stop : value))
        : [...profile.stops, stop];
      const next = parseFoodtruck(JSON.stringify({ ...profile, stops }));
      if (commit(next)) {
        setEditingStop(null);
        form.reset();
      }
    } catch {
      setNotice("invalid");
    }
  }
  function field(id: string, label: string, options: React.ComponentProps<typeof Input> = {}) {
    return (
      <label key={id} className="truck-field" htmlFor={id}>
        <span>{label}</span>
        <Input id={id} name={id} data-testid={id} {...options} />
      </label>
    );
  }
  function localizedFields(prefix: string, initial?: MenuItem["label"]) {
    return (
      <div className="truck-language-fields">
        {truckLanguages.map((language) =>
          field(
            `${prefix}-${language}`,
            c[language === "en" ? "labelEn" : language === "th" ? "labelTh" : "labelZh"],
            {
              required: true,
              maxLength: 100,
              defaultValue: initial?.[language],
              lang: language === "zh" ? "zh-CN" : language,
            },
          ),
        )}
      </div>
    );
  }

  return (
    <main data-testid="foodtruck-page" className="truck-page">
      <section className="truck-hero">
        <div className="truck-hero-copy">
          <p className="editorial-kicker">
            <span className="status-dot" />
            {c.eyebrow}
          </p>
          <h1>
            {c.title.split("\n").map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="truck-intro">{c.intro}</p>
          <div className="truck-actions">
            <Button asChild size="lg">
              <Link to="/drive">
                {c.drive}
                <ArrowUpRight size={18} />
              </Link>
            </Button>
            <a className="truck-text-link" href="#truck-workspace">
              {c.plan}
              <ArrowDown size={16} />
            </a>
          </div>
        </div>
        <div className="truck-visual">
          <div className="truck-visual-grid" aria-hidden="true" />
          <div className="truck-visual-index" aria-hidden="true">
            S×B
            <br />
            <span>01 — MOBILE</span>
          </div>
          <img
            src="/images/foodtruck-preview.webp"
            width="1280"
            height="960"
            alt={c.concept}
            fetchPriority="high"
          />
          <p className="truck-caption">
            <Truck size={16} />
            {c.concept}
            <span aria-hidden="true">— 2026</span>
          </p>
        </div>
      </section>
      <section className="truck-story">
        <div>
          <p className="editorial-kicker">SIRAWAT × BALL</p>
          <h2>{c.body}</h2>
        </div>
        <div>
          <p>{c.detail}</p>
          <div className="truck-process">
            {[
              [c.detail1, c.text1],
              [c.detail2, c.text2],
              [c.detail3, c.text3],
            ].map(([title, text]) => (
              <div key={title}>
                <span>{title}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="truck-workspace" className="truck-workspace">
        <header className="truck-workspace-heading">
          <p className="editorial-kicker">S×B / WORKSPACE</p>
          <h2>{c.local}</h2>
          <p>{c.truth}</p>
        </header>
        {!ready && <p role="status">{c.loading}</p>}
        {error && (
          <div role="alert" className="truck-notice">
            <p>{c[error === "save" ? "saveError" : error]}</p>
            <div className="truck-actions">
              <Button variant="outline" onClick={() => location.reload()}>
                {c.reload}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  try {
                    download(
                      localStorage.getItem(FOODTRUCK_KEY) ?? "null",
                      "sxb-foodtruck-original.json",
                    );
                  } catch {
                    setNotice("exportError");
                  }
                }}
              >
                {c.raw}
              </Button>
            </div>
          </div>
        )}
        {notice && (
          <p
            data-testid="truck-notice"
            role={notice === "saved" ? "status" : "alert"}
            className="truck-notice"
          >
            {c[notice]}
          </p>
        )}
        <div className="truck-planner-grid">
          <div className="truck-config">
            <section className="truck-panel">
              <h3>
                <Truck size={20} />
                {c.profile}
              </h3>
              <form
                key={`profile-${ready}-${profile.name}-${profile.contactUrl}-${profile.currency}`}
                onSubmit={saveProfile}
              >
                <fieldset disabled={blocked} className="truck-form">
                  {field("truck-name", c.name, { maxLength: 100, defaultValue: profile.name })}
                  {field("truck-contact", c.contact, {
                    type: "url",
                    maxLength: 2000,
                    placeholder: "https://",
                    defaultValue: profile.contactUrl,
                  })}
                  <label className="truck-field" htmlFor="truck-currency">
                    <span>{c.currency}</span>
                    <select
                      id="truck-currency"
                      name="truck-currency"
                      data-testid="truck-currency"
                      defaultValue={profile.currency}
                    >
                      {["THB", "USD", "CNY"].map((currency) => (
                        <option key={currency}>{currency}</option>
                      ))}
                    </select>
                  </label>
                  <Button type="submit" data-testid="truck-save">
                    {c.save}
                  </Button>
                </fieldset>
              </form>
              {profile.contactUrl && (
                <a
                  href={profile.contactUrl}
                  className="truck-text-link mt-5"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="truck-contact-link"
                >
                  {c.contactLink}
                  <MoveUpRight size={16} />
                </a>
              )}
            </section>
            <section className="truck-panel">
              <h3>
                <Download size={20} />
                {c.backup}
              </h3>
              <Button
                variant="outline"
                disabled={!ready || error === "load"}
                data-testid="plan-export"
                onClick={() => {
                  try {
                    download(exportFoodtruck(profile), "sxb-foodtruck-plan.json");
                  } catch {
                    setNotice("exportError");
                  }
                }}
              >
                {c.export}
              </Button>
              <label className="truck-import mt-5">
                <span>{c.import}</span>
                <input
                  data-testid="plan-import"
                  aria-label={c.import}
                  type="file"
                  accept="application/json,.json"
                  disabled={!ready}
                  onChange={async (event) => {
                    const generation = ++importGeneration.current;
                    const file = event.currentTarget.files?.[0];
                    event.currentTarget.value = "";
                    setIncoming(null);
                    setNotice(null);
                    if (!file) return;
                    if (file.size > FOODTRUCK_MAX_BYTES) {
                      setNotice("large");
                      return;
                    }
                    try {
                      const text = await file.text();
                      if (generation === importGeneration.current)
                        setIncoming(parseFoodtruck(text));
                    } catch {
                      if (generation === importGeneration.current) setNotice("invalid");
                    }
                  }}
                />
              </label>
              {incoming && (
                <div className="truck-import-preview" data-testid="import-preview">
                  <p>{c.importPreview}</p>
                  <strong>{incoming.name || c.noName}</strong>
                  <p>
                    {incoming.menu.length} {c.items} · {incoming.stops.length} {c.stops}
                  </p>
                  <div className="truck-actions">
                    <Button
                      data-testid="import-apply"
                      disabled={error === "conflict"}
                      onClick={() => {
                        if (commit(incoming, true)) {
                          setIncoming(null);
                          setEditingMenu(null);
                          setEditingStop(null);
                        }
                      }}
                    >
                      {c.apply}
                    </Button>
                    <Button variant="ghost" onClick={() => setIncoming(null)}>
                      {c.dismiss}
                    </Button>
                  </div>
                </div>
              )}
            </section>
          </div>
          <div className="truck-content">
            <section className="truck-panel">
              <div className="truck-panel-heading">
                <h3>
                  <Utensils size={20} />
                  {c.menu}
                </h3>
                <span className="truck-count">{String(profile.menu.length).padStart(2, "0")}</span>
              </div>
              {profile.menu.length === 0 && <p className="truck-empty">{c.menuEmpty}</p>}
              <div className="truck-menu-list">
                {profile.menu.map((item) => (
                  <article key={item.id} data-testid="menu-item" className="truck-menu-item">
                    <div>
                      <h4>{item.label[lang]}</h4>
                      <p>{formatter.format(item.priceMinor / 100)}</p>
                      <small>{item.soldOut ? c.soldOut : c.available}</small>
                    </div>
                    <div className="truck-item-actions">
                      <label className="truck-checkbox">
                        <input
                          type="checkbox"
                          data-testid="item-sold-out"
                          checked={item.soldOut}
                          disabled={blocked}
                          onChange={(event) =>
                            commit({
                              ...profile,
                              menu: profile.menu.map((value) =>
                                value.id === item.id
                                  ? { ...value, soldOut: event.target.checked }
                                  : value,
                              ),
                            })
                          }
                        />
                        {c.soldOut}
                      </label>
                      <button
                        data-testid="item-edit"
                        disabled={blocked}
                        onClick={() => {
                          setEditingMenu(item);
                          setNotice(null);
                        }}
                      >
                        {c.edit}
                      </button>
                      <button
                        data-testid="item-remove"
                        disabled={blocked}
                        onClick={() => {
                          if (
                            commit({
                              ...profile,
                              menu: profile.menu.filter((value) => value.id !== item.id),
                            }) &&
                            editingMenu?.id === item.id
                          )
                            setEditingMenu(null);
                        }}
                      >
                        {c.remove}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <form onSubmit={saveMenu} key={`menu-${editingMenu?.id ?? "new"}`}>
                <fieldset disabled={blocked} className="truck-form truck-add-form">
                  <legend>{editingMenu ? c.updateMenu : c.addMenu}</legend>
                  {localizedFields("menu", editingMenu?.label)}
                  {field("menu-price", `${c.price} · ${profile.currency}`, {
                    type: "text",
                    inputMode: "decimal",
                    pattern: "[0-9]+([.][0-9]{1,2})?",
                    required: true,
                    maxLength: 10,
                    defaultValue: editingMenu
                      ? (editingMenu.priceMinor / 100).toFixed(2)
                      : undefined,
                  })}
                  <div className="truck-actions">
                    <Button data-testid="menu-submit" type="submit">
                      {editingMenu ? c.updateMenu : c.addMenu}
                    </Button>
                    {editingMenu && (
                      <Button type="button" variant="ghost" onClick={() => setEditingMenu(null)}>
                        {c.cancel}
                      </Button>
                    )}
                  </div>
                </fieldset>
              </form>
            </section>
            <section className="truck-panel">
              <div className="truck-panel-heading">
                <h3>
                  <MapPin size={20} />
                  {c.route}
                </h3>
                <span className="truck-count">{String(profile.stops.length).padStart(2, "0")}</span>
              </div>
              <p className="truck-helper">{c.zone}</p>
              {profile.stops.length === 0 && <p className="truck-empty">{c.stopEmpty}</p>}
              <div className="truck-stops">
                {[...profile.stops]
                  .sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt))
                  .map((stop) => (
                    <article key={stop.id} data-testid="service-stop" className="truck-stop">
                      <span className="truck-stop-state">{c[stopPhase(stop, now)]}</span>
                      <h4>{stop.label[lang]}</h4>
                      <p>
                        {dateFormatter.format(new Date(stop.startAt))}
                        <br />— {dateFormatter.format(new Date(stop.endAt))}
                      </p>
                      <p className="truck-helper">
                        {stop.latitude}, {stop.longitude}
                        <br />
                        {c.ownerData}
                      </p>
                      <div className="truck-actions">
                        <a
                          className="truck-text-link"
                          href={directionsUrl(stop)}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid="stop-directions"
                        >
                          {c.directions}
                          <MoveUpRight size={16} />
                        </a>
                        <button
                          data-testid="stop-edit"
                          disabled={blocked}
                          onClick={() => {
                            setEditingStop(stop);
                            setNotice(null);
                          }}
                        >
                          {c.edit}
                        </button>
                        <button
                          data-testid="stop-remove"
                          disabled={blocked}
                          onClick={() => {
                            if (
                              commit({
                                ...profile,
                                stops: profile.stops.filter((value) => value.id !== stop.id),
                              }) &&
                              editingStop?.id === stop.id
                            )
                              setEditingStop(null);
                          }}
                        >
                          {c.remove}
                        </button>
                      </div>
                    </article>
                  ))}
              </div>
              <form key={`stop-${editingStop?.id ?? "new"}`} onSubmit={saveStop}>
                <fieldset disabled={blocked} className="truck-form truck-add-form">
                  <legend>{editingStop ? c.updateStop : c.addStop}</legend>
                  {localizedFields("stop", editingStop?.label)}
                  <div className="truck-pair">
                    {field("stop-latitude", c.latitude, {
                      type: "number",
                      min: -90,
                      max: 90,
                      step: "any",
                      required: true,
                      defaultValue: editingStop?.latitude,
                    })}
                    {field("stop-longitude", c.longitude, {
                      type: "number",
                      min: -180,
                      max: 180,
                      step: "any",
                      required: true,
                      defaultValue: editingStop?.longitude,
                    })}
                  </div>
                  <div className="truck-pair">
                    {field("stop-start", c.start, {
                      type: "datetime-local",
                      required: true,
                      min: "2000-01-01T00:00",
                      max: "2200-12-31T23:59",
                      defaultValue: editingStop ? dateInput(editingStop.startAt) : undefined,
                    })}
                    {field("stop-end", c.end, {
                      type: "datetime-local",
                      required: true,
                      min: "2000-01-01T00:00",
                      max: "2200-12-31T23:59",
                      defaultValue: editingStop ? dateInput(editingStop.endAt) : undefined,
                    })}
                  </div>
                  <div className="truck-actions">
                    <Button type="submit" data-testid="stop-submit">
                      {editingStop ? c.updateStop : c.addStop}
                    </Button>
                    {editingStop && (
                      <Button type="button" variant="ghost" onClick={() => setEditingStop(null)}>
                        {c.cancel}
                      </Button>
                    )}
                  </div>
                </fieldset>
              </form>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
