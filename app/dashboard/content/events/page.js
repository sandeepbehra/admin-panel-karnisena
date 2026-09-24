"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";
import {
  CalendarDays,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";

import {
  getEvents,
  deleteEvent,
} from "@/services/events";

const LIMIT = 10;

export default function EventsPage() {
  const router = useRouter();
  const searchParams =
    useSearchParams();

  const page =
    Number(
      searchParams.get("page")
    ) || 0;

    const [
  deleteModal,
  setDeleteModal,
] = useState({
  open: false,
  event: null,
});
  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [hasMore, setHasMore] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadEvents() {
      try {
        setLoading(true);
        console.log(
          "EVENTS API RESPONSE:"
        );

        const response =
          await getEvents({
            page,
            limit: LIMIT,
          });

        console.log(
          "EVENTS API RESPONSE:",
          response
        );

        if (ignore) return;

       const fetchedEvents =
  response?.data?.fetchedEvents;

let eventList = [];

if (Array.isArray(fetchedEvents)) {
  
  eventList = fetchedEvents;
} else if (
  fetchedEvents &&
  typeof fetchedEvents === "object"
) {
  // Current backend response: single event object
  eventList = [fetchedEvents];
}

setEvents(eventList);

setHasMore(
  Boolean(response?.data?.hasMore)
);

setError("");

        setHasMore(
          Boolean(
            response?.data?.hasMore
          )
        );

        setError("");
      } catch (err) {
        if (ignore) return;

        console.error(
          "Load events error:",
          err
        );

        setEvents([]);

        setHasMore(false);

        setError(
          err?.message ||
            "Unable to fetch events."
        );
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      ignore = true;
    };
  }, [page]);

  // ==============================
  // DELETE EVENT
  // ==============================

//   const handleDelete = async (
//     event
//   ) => {
//     const eventId =
//       event?._id || event?.id;

//     if (!eventId) {
//       setError(
//         "Event ID is missing."
//       );

//       return;
//     }

//     const eventName =
//       event?.title?.eng ||
//       event?.title ||
//       "this event";

//     const confirmed =
//       window.confirm(
//         `Are you sure you want to delete "${eventName}"?`
//       );

//     if (!confirmed) return;

//     try {
//       setDeletingId(eventId);

//       setError("");
//       setSuccess("");

//       const response =
//         await deleteEvent(eventId);

//       setSuccess(
//         response?.message ||
//           "Event deleted successfully."
//       );

//       setEvents((prev) =>
//         prev.filter(
//           (item) =>
//             (item?._id ||
//               item?.id) !==
//             eventId
//         )
//       );
//     } catch (err) {
//       setError(
//         err?.message ||
//           "Unable to delete event."
//       );
//     } finally {
//       setDeletingId(null);
//     }
//   };
const handleDelete = (
  event
) => {
  setDeleteModal({
    open: true,
    event,
  });
};

const confirmDelete =
  async () => {
    const event =
      deleteModal.event;

    const eventId =
      event?._id ||
      event?.id;

    if (!eventId) {
      setError(
        "Event ID is missing."
      );
      return;
    }

    try {
      setDeletingId(
        eventId
      );

      setError("");
      setSuccess("");

      const response =
        await deleteEvent(
          eventId
        );

      setEvents((prev) =>
        prev.filter(
          (item) =>
            (item?._id ||
              item?.id) !==
            eventId
        )
      );

      setSuccess(
        response?.message ||
          "Event deleted successfully."
      );

      setDeleteModal({
        open: false,
        event: null,
      });
    } catch (err) {
      setError(
        err?.message ||
          "Unable to delete event."
      );
    } finally {
      setDeletingId(null);
    }
  };
  // ==============================
  // PAGINATION
  // ==============================

  const goToPage = (
    nextPage
  ) => {
    router.push(
      `/dashboard/content/events?page=${nextPage}`
    );
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Events
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create and manage
            events, campaigns and
            event content.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            router.push(
              "/dashboard/content/events/create"
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-karni-saffron-dark px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={18} />

          Create Event
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* EVENTS CARD */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* CARD HEADER */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              All Events
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Page {page + 1}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-karni-saffron-dark">
            <CalendarDays
              size={21}
            />
          </div>
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-karni-saffron-dark" />

              <p className="mt-3 text-sm text-slate-500">
                Loading events...
              </p>
            </div>
          </div>
        ) : events.length ===
          0 ? (
          /* EMPTY */

          <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-karni-saffron-dark">
              <CalendarDays
                size={30}
              />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No events found
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              You have not created
              any events yet. Create
              your first event to
              get started.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard/content/events/create"
                )
              }
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-karni-saffron-dark px-5 py-3 text-sm font-semibold text-white"
            >
              <Plus size={17} />

              Create Event
            </button>
          </div>
        ) : (
          <>
            {/* TABLE */}

            <div className="overflow-x-auto">
              <table className="min-w-[1000px] w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <TableHeading>
                      EVENT
                    </TableHeading>

                    <TableHeading>
                      CATEGORY
                    </TableHeading>

                    <TableHeading>
                      DATE
                    </TableHeading>

                    <TableHeading>
                      LOCATION
                    </TableHeading>

                    <TableHeading>
                      TYPE
                    </TableHeading>

                    <TableHeading>
                      EXCLUSIVE
                    </TableHeading>

                    <TableHeading align="right">
                      ACTIONS
                    </TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {events.map(
                    (event) => {
                      const eventId =
                        event?._id ||
                        event?.id;

                      return (
                        <EventRow
                          key={
                            eventId
                          }
                          event={
                            event
                          }
                          deleting={
                            deletingId ===
                            eventId
                          }
                          onView={() =>
                            router.push(
                              `/dashboard/content/events/${eventId}`
                            )
                          }
                          onEdit={() =>
                            router.push(
                              `/dashboard/content/events/${eventId}/edit`
                            )
                          }
                          onDelete={() =>
                            handleDelete(
                              event
                            )
                          }
                        />
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}

            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
              <p className="text-sm text-slate-500">
                Page{" "}
                <span className="font-semibold text-slate-900">
                  {page + 1}
                </span>
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page === 0}
                  onClick={() =>
                    goToPage(
                      page - 1
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft
                    size={17}
                  />

                  Previous
                </button>

                <button
                  type="button"
                  disabled={!hasMore}
                  onClick={() =>
                    goToPage(
                      page + 1
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next

                  <ChevronRight
                    size={17}
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <ConfirmationModal
  open={deleteModal.open}
  title="Delete Event"
  description={`Are you sure you want to delete "${
    deleteModal.event
      ?.title?.eng ||
    "this event"
  }"? This action cannot be undone.`}
  confirmText="Delete"
  cancelText="Cancel"
  type="danger"
  loading={
    Boolean(deletingId)
  }
  onConfirm={
    confirmDelete
  }
  onClose={() => {
    if (deletingId) {
      return;
    }

    setDeleteModal({
      open: false,
      event: null,
    });
  }}
/>
    </div>
    
  );
}

// ==============================
// EVENT ROW
// ==============================

function EventRow({
  event,
  onView,
  onEdit,
  onDelete,
  deleting,
}) {
  const title =
    event?.title?.eng ||
    event?.title ||
    "Untitled Event";

  const subtitle =
    event?.subTitle?.eng ||
    "";

  const category =
    event?.category?.name
      ?.eng ||
    event?.category?.name ||
    event?.categoryName ||
    "--";

  const city =
    event?.venue?.city
      ?.eng ||
    event?.venue?.city ||
    "--";

  const eventType =
    event?.eventType ||
    "EVENT";

  return (
    <tr className="border-t border-slate-100 transition hover:bg-slate-50/60">
      {/* EVENT */}

      <td className="px-6 py-5">
        <div className="max-w-[260px]">
          <p className="font-semibold text-slate-900">
            {title}
          </p>

          {subtitle && (
            <p className="mt-1 truncate text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </td>

      {/* CATEGORY */}

      <td className="px-6 py-5">
        <span className="text-sm text-slate-600">
          {category}
        </span>
      </td>

      {/* DATE */}

      <td className="px-6 py-5">
        <div className="text-sm text-slate-600">
          {formatDate(
            event?.startDate
          )}
        </div>

        {event?.endDate && (
          <div className="mt-1 text-xs text-slate-400">
            to{" "}
            {formatDate(
              event.endDate
            )}
          </div>
        )}
      </td>

      {/* LOCATION */}

      <td className="px-6 py-5">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin
            size={15}
            className="shrink-0 text-slate-400"
          />

          {city}
        </div>
      </td>

      {/* TYPE */}

      <td className="px-6 py-5">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {formatText(
            eventType
          )}
        </span>
      </td>

      {/* EXCLUSIVE */}

      <td className="px-6 py-5">
        {event?.isExclusive ? (
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
            Exclusive
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            No
          </span>
        )}
      </td>

      {/* ACTIONS */}

      <td className="px-6 py-5">
        <div className="flex justify-end gap-2">
          <ActionButton
            title="View event"
            onClick={onView}
          >
            <Eye size={17} />
          </ActionButton>

          <ActionButton
            title="Edit event"
            onClick={onEdit}
          >
            <Pencil
              size={17}
            />
          </ActionButton>

          <ActionButton
            title="Delete event"
            danger
            disabled={deleting}
            onClick={onDelete}
          >
            <Trash2
              size={17}
            />
          </ActionButton>
        </div>
      </td>
    </tr>
  );
}

// ==============================
// SMALL COMPONENTS
// ==============================

function TableHeading({
  children,
  align = "left",
}) {
  return (
    <th
      className={`px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function ActionButton({
  children,
  title,
  onClick,
  danger = false,
  disabled = false,
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-50 ${
        danger
          ? "border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

// ==============================
// HELPERS
// ==============================

function formatDate(value) {
  if (!value) {
    return "--";
  }

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

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatText(value) {
  if (!value) return "--";

  return String(value)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    );
}