import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCopy } from "@/lib/copy";

export const Route = createFileRoute("/contact")({ component: ContactPage });

const STORAGE_KEY = "sxb-inquiries";
const TYPES = ["brand", "space", "motion", "three", "other"] as const;

function ContactPage() {
  const copy = useCopy();
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]>("brand");
  const [message, setMessage] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      toast.error(copy.contact.errName);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error(copy.contact.errEmail);
      return;
    }
    if (message.trim().length < 8) {
      toast.error(copy.contact.errMessage);
      return;
    }

    setPending(true);
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown[];
      const next = [
        ...existing,
        {
          id: crypto.randomUUID(),
          at: Date.now(),
          name: name.trim(),
          email: email.trim(),
          type,
          message: message.trim(),
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSent(true);
      toast.success(copy.contact.sentTitle);
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-12 px-4 pb-24 pt-28 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="text-xs tracking-[0.22em] text-muted uppercase">{copy.contact.kicker}</p>
        <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-6xl">
          {copy.contact.title}
        </h1>
        <p className="mt-4 max-w-xl text-muted">{copy.contact.lede}</p>

        {sent ? (
          <div className="mt-12 rounded-xl bg-surface p-8">
            <h2 className="font-display text-2xl">{copy.contact.sentTitle}</h2>
            <p className="mt-3 text-muted">{copy.contact.sentBody}</p>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => {
                setSent(false);
                setName("");
                setEmail("");
                setMessage("");
              }}
            >
              {copy.contact.another}
            </Button>
          </div>
        ) : (
          <form className="mt-12 space-y-5" onSubmit={onSubmit}>
            <Field>
              <Label htmlFor="name">{copy.contact.name}</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="email">{copy.contact.email}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="type">{copy.contact.type}</Label>
              <select
                id="type"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value as (typeof TYPES)[number])}
                className="h-11 w-full rounded-lg bg-elevated px-3.5 text-sm text-foreground shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              >
                {TYPES.map((key) => (
                  <option key={key} value={key}>
                    {copy.contact.types[key]}
                  </option>
                ))}
              </select>
            </Field>
            <Field>
              <Label htmlFor="message">{copy.contact.message}</Label>
              <Textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Field>
            <Button type="submit" disabled={pending}>
              {pending ? copy.contact.sending : copy.contact.send}
            </Button>
            <p className="text-xs leading-relaxed text-faint">{copy.contact.note}</p>
          </form>
        )}
      </div>

      <aside className="space-y-8 rounded-xl bg-surface p-6 sm:p-8 lg:mt-28">
        <div>
          <p className="text-xs tracking-widest text-faint uppercase">
            {copy.contact.addressLabel}
          </p>
          <p className="mt-2 text-foreground">{copy.contact.address}</p>
        </div>
        <div>
          <p className="text-xs tracking-widest text-faint uppercase">
            {copy.contact.mailLabel}
          </p>
          <a
            className="mt-2 inline-flex min-h-11 items-center text-foreground hover:text-accent"
            href={`mailto:${copy.contact.mail}`}
          >
            {copy.contact.mail}
          </a>
        </div>
      </aside>
    </main>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}
