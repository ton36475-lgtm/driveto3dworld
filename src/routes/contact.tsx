import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { LocalData } from "@/components/ops/local-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCopy } from "@/lib/copy";
import { useOps } from "@/lib/ops/store";
import { downloadText } from "@/lib/ops/storage";
import { validateInquiry } from "@/lib/ops/engine";
import { CHANNELS, INQUIRY_TYPES, type Channel, type InquiryType } from "@/lib/ops/types";

export const Route = createFileRoute("/contact")({ component: ContactPage });
const OWNER_PROFILE = "https://www.facebook.com/share/1DkUFSTbkY/";

function ContactPage() {
  const copy = useCopy();
  const submitInquiry = useOps((state) => state.submitInquiry);
  const hydrated = useOps((state) => state.hydrated);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<Channel>("email");
  const [handle, setHandle] = useState("");
  const [type, setType] = useState<InquiryType>("brand");
  const [message, setMessage] = useState("");
  const brief = `${copy.contact.name}: ${name.trim()}\n${copy.contact.channel}: ${copy.contact.channels[channel]}\n${copy.contact.handle}: ${handle.trim()}\n${copy.contact.type}: ${copy.contact.types[type]}\n\n${message.trim()}`;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    const input = { name, channel, handle, type, message };
    const error = validateInquiry(input);
    if (error) {
      toast.error(
        error === "name"
          ? copy.contact.errName
          : error === "message"
            ? copy.contact.errMessage
            : copy.contact.errHandle,
      );
      return;
    }
    submitting.current = true;
    setPending(true);
    try {
      const result = submitInquiry(input);
      if (result) {
        toast.error(result === "storage" ? copy.ops.storageError : copy.ops.actionError);
        return;
      }
      setSaved(true);
      toast.success(copy.contact.sentTitle);
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  const handoff = (
    <div className="flex flex-wrap gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={() => downloadText("sirawat-ball-brief.txt", brief)}
      >
        {copy.contact.download}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(brief);
            toast.success(copy.contact.copied);
          } catch {
            toast.error(copy.contact.copyError);
          }
        }}
      >
        {copy.contact.copyBrief}
      </Button>
    </div>
  );

  return (
    <main className="mx-auto grid max-w-6xl gap-12 px-4 pb-24 pt-28 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="text-xs tracking-[0.22em] text-muted uppercase">{copy.contact.kicker}</p>
        <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-6xl">
          {copy.contact.title}
        </h1>
        <p className="mt-4 max-w-xl text-muted">{copy.contact.lede}</p>
        <div className="mt-8">
          <LocalData />
        </div>
        {saved ? (
          <div className="mt-8 space-y-5 rounded-xl bg-surface p-8" role="status">
            <h2 className="font-display text-2xl">{copy.contact.sentTitle}</h2>
            <p className="text-muted">{copy.contact.sentBody}</p>
            {handoff}
            <Button asChild variant="outline">
              <Link to="/desk">{copy.contact.deskHint}</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSaved(false);
                setName("");
                setHandle("");
                setMessage("");
              }}
            >
              {copy.contact.another}
            </Button>
          </div>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <Field>
              <Label htmlFor="name">{copy.contact.name}</Label>
              <Input
                id="name"
                name="name"
                required
                minLength={2}
                maxLength={120}
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="channel">{copy.contact.channel}</Label>
              <select
                id="channel"
                name="channel"
                value={channel}
                onChange={(event) => setChannel(event.target.value as Channel)}
                className="h-11 w-full rounded-lg bg-elevated px-3 text-sm"
              >
                {CHANNELS.map((key) => (
                  <option key={key} value={key}>
                    {copy.contact.channels[key]}
                  </option>
                ))}
              </select>
            </Field>
            <Field>
              <Label htmlFor="handle">{copy.contact.handle}</Label>
              <Input
                id="handle"
                name="handle"
                required
                maxLength={254}
                type={channel === "email" ? "email" : channel === "phone" ? "tel" : "text"}
                autoComplete={channel === "email" ? "email" : channel === "phone" ? "tel" : "off"}
                value={handle}
                onChange={(event) => setHandle(event.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="type">{copy.contact.type}</Label>
              <select
                id="type"
                name="type"
                value={type}
                onChange={(event) => setType(event.target.value as InquiryType)}
                className="h-11 w-full rounded-lg bg-elevated px-3 text-sm"
              >
                {INQUIRY_TYPES.map((key) => (
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
                required
                minLength={8}
                maxLength={10000}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </Field>
            <Button type="submit" disabled={pending || !hydrated}>
              {pending ? copy.contact.sending : copy.contact.send}
            </Button>
            <p className="text-xs leading-relaxed text-faint">{copy.contact.note}</p>
            {message.trim() ? handoff : null}
          </form>
        )}
      </div>
      <aside className="space-y-8 rounded-xl bg-surface p-6 sm:p-8 lg:mt-28">
        <div>
          <p className="text-xs tracking-widest text-faint uppercase">
            {copy.contact.addressLabel}
          </p>
          <p className="mt-2">{copy.contact.address}</p>
        </div>
        <div>
          <a
            className="inline-flex min-h-11 items-center text-foreground underline underline-offset-4 hover:text-accent"
            href={OWNER_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.contact.handoff}
          </a>
          <p className="mt-2 text-sm leading-relaxed text-muted">{copy.contact.handoffNote}</p>
        </div>
      </aside>
    </main>
  );
}
function Field({ children }: { children: ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}
