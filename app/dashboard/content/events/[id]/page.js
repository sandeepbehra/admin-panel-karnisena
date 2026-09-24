"use client";

import {
  useEffect,
  useState,
  use,
} from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Pencil,
  CalendarDays,
  MapPin,
  Clock,
  Tag,
  Star,
  ExternalLink,
  Loader2,
} from "lucide-react";

import {
  getEventById,
} from "@/services/events";

export default function EventDetailsPage({
  params,
}) {
  const { id } = use(params);

  const router = useRouter();

  const [event, setEvent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let ignore = false;

    async function loadEvent() {
      try {
        setLoading(true);
        setError("");

        const response =
          await getEventById(id);

        console.log(
          "EVENT DETAILS RESPONSE:",
          response
        );

        if (ignore) return;

        const eventData =
          response?.data?.event ||
          response?.data
            ?.fetchedEvent ||
          response?.data ||
          null;

        setEvent(eventData);
      } catch (err) {
        if (ignore) return;

        setError(
          err?.message ||
            "Unable to load event."
        );
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadEvent();
    }

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-karni-saffron-dark" />

          <p className="mt-3 text-sm text-slate-500">
            Loading event...
          </p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() =>
            router.push(
              "/dashboard/content/events"
            )
          }
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600"
        >
          <ArrowLeft size={17} />
          Back to Events
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error ||
            "Event not found."}
        </div>
      </div>
    );
  }

  const title =
    event?.title?.eng ||
    "Untitled Event";

  const hindiTitle =
    event?.title?.hin || "";

  const category =
  typeof event?.category === "string"
    ? event.category
    : event?.category?.name?.eng || "--";

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/dashboard/content/events"
              )
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {title}
            </h1>

            {hindiTitle && (
              <p className="mt-1 text-base text-slate-500">
                {hindiTitle}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            router.push(
              `/dashboard/content/events/${id}/edit`
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-karni-saffron-dark px-5 py-3 text-sm font-semibold text-white"
        >
          <Pencil size={17} />
          Edit Event
        </button>
      </div>

      {/* BANNER */}

      {event?.bannerImageUrl?.eng && (
        <MediaPreview
          url={
            event.bannerImageUrl.eng
          }
          title={title}
        />
      )}

      {/* INFO */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          icon={Tag}
          label="Category"
          value={category}
        />

       <InfoCard
  icon={CalendarDays}
  label="Event Type"
  value={event?.eventType || "EVENT"}
/>

        <InfoCard
          icon={Clock}
          label="Time"
          value={
            event?.timeDisplay?.eng ||
            "--"
          }
        />

        <InfoCard
          icon={Star}
          label="Exclusive"
          value={
            event?.isExclusive
              ? "Yes"
              : "No"
          }
        />
      </div>

      {/* BASIC DETAILS */}

      <Section title="Event Details">
        <Detail
          label="English Subtitle"
          value={
            event?.subTitle?.eng
          }
        />

        <Detail
          label="Hindi Subtitle"
          value={
            event?.subTitle?.hin
          }
        />

        <Detail
          label="Slug"
          value={event?.slug}
        />

        <Detail
          label="Start Date"
          value={formatDateTime(
            event?.startDate
          )}
        />

        <Detail
          label="End Date"
          value={formatDateTime(
            event?.endDate
          )}
        />
      </Section>

      {/* DESCRIPTION */}

      <Section title="Description">
        <LanguageBlock
          label="English"
          value={
            event?.description?.eng
          }
        />

        <LanguageBlock
          label="Hindi"
          value={
            event?.description?.hin
          }
        />
      </Section>

      {/* CONTENT */}

      <Section title="Event Content">
        <div>
          <LanguageHeading>
            English
          </LanguageHeading>

          <div
            className="prose max-w-none rounded-xl border border-slate-100 bg-slate-50 p-5"
            dangerouslySetInnerHTML={{
              __html:
                event?.content?.eng ||
                "",
            }}
          />
        </div>

        <div>
          <LanguageHeading>
            Hindi
          </LanguageHeading>

          <div
            className="prose max-w-none rounded-xl border border-slate-100 bg-slate-50 p-5"
            dangerouslySetInnerHTML={{
              __html:
                event?.content?.hin ||
                "",
            }}
          />
        </div>
      </Section>

      {/* VENUE */}

      <Section title="Venue">
        <div className="grid gap-5 md:grid-cols-2">
          <Detail
            label="Venue"
            value={
              event?.venue?.name
                ?.eng
            }
          />

          <Detail
            label="Venue (Hindi)"
            value={
              event?.venue?.name
                ?.hin
            }
          />

          <Detail
            label="Address"
            value={
              event?.venue
                ?.address?.eng
            }
          />

          <Detail
            label="Address (Hindi)"
            value={
              event?.venue
                ?.address?.hin
            }
          />

          <Detail
            label="City"
            value={
              event?.venue?.city
                ?.eng
            }
          />

          <Detail
            label="District"
            value={
              event?.venue
                ?.district?.eng
            }
          />

          <Detail
            label="State"
            value={
              event?.venue?.state
                ?.eng
            }
          />

         <Detail
  label="Coordinates"
  value={
    event?.venue?.mapCoordinates?.lat != null &&
    event?.venue?.mapCoordinates?.lng != null
      ? `${event.venue.mapCoordinates.lat}, ${event.venue.mapCoordinates.lng}`
      : "--"
  }
/>
        </div>

        {event?.venue?.mapUrl && (
          <a
            href={
              event.venue.mapUrl
            }
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-karni-saffron-dark"
          >
            <MapPin size={17} />

            Open Map

            <ExternalLink
              size={14}
            />
          </a>
        )}
      </Section>

      {/* GALLERY */}

      {Array.isArray(
        event?.mediaUrls
      ) &&
        event.mediaUrls.length >
          0 && (
          <Section title="Media Gallery">
            <div className="grid gap-5 md:grid-cols-2">
              {event.mediaUrls.map(
                (
                  media,
                  index
                ) => (
                  <div
                    key={index}
                    className="space-y-3"
                  >
                    {media?.eng && (
                      <MediaPreview
                        url={
                          media.eng
                        }
                        title={`Media ${
                          index + 1
                        }`}
                        compact
                      />
                    )}

                    {media?.hin &&
                      media.hin !==
                        media.eng && (
                        <MediaPreview
                          url={
                            media.hin
                          }
                          title={`Hindi Media ${
                            index +
                            1
                          }`}
                          compact
                        />
                      )}
                  </div>
                )
              )}
            </div>
          </Section>
        )}
    </div>
  );
}

function MediaPreview({
  url,
  title,
  compact = false,
}) {
  const isVideo =
    /\.(mp4|webm|mov)(\?.*)?$/i.test(
      url
    );

  if (isVideo) {
    return (
      <video
        src={url}
        controls
        className={`w-full rounded-2xl bg-black object-cover ${
          compact
            ? "h-64"
            : "max-h-[500px]"
        }`}
      />
    );
  }

  return (
    <img
      src={url}
      alt={title}
      className={`w-full rounded-2xl object-cover ${
        compact
          ? "h-64"
          : "max-h-[500px]"
      }`}
    />
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-karni-saffron-dark">
        <Icon size={18} />
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function Section({
  title,
  children,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="font-bold text-slate-900">
          {title}
        </h2>
      </div>

      <div className="space-y-6 p-6">
        {children}
      </div>
    </section>
  );
}

function Detail({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-medium text-slate-700">
        {value || "--"}
      </p>
    </div>
  );
}

function LanguageHeading({
  children,
}) {
  return (
    <p className="mb-2 text-sm font-semibold text-slate-700">
      {children}
    </p>
  );
}

function LanguageBlock({
  label,
  value,
}) {
  return (
    <div>
      <LanguageHeading>
        {label}
      </LanguageHeading>

      <p className="whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
        {value || "--"}
      </p>
    </div>
  );
}

function formatDateTime(
  value
) {
  if (!value) return "--";

  const date = new Date(
    Number(value)
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "--";
  }

  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}