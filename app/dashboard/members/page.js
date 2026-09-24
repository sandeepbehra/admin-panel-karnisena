"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  RotateCcw,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";

import {
  approveMemberApplication,
  getActiveMembers,
  getMembershipRequests,
  getPendingPaymentMembers,
  getRevokedMembers,
  rejectMemberApplication,
  restoreMembership,
  revokeMembership,
} from "@/services/members";

import ConfirmationModal from "@/components/dashboard/ConfirmationModal";

const LIMIT = 10;

const VALID_TABS = [
  "active",
  "requests",
  "payment",
  "revoked",
];

const TABS = [
  {
    key: "active",
    label: "All Members",
  },
  {
    key: "requests",
    label: "Membership Requests",
  },
  {
    key: "payment",
    label: "Approved",
  },
  {
    key: "revoked",
    label: "Revoked",
  },
];

export default function MembersPage() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  /* ========================================
     TAB + PAGE FROM URL
  ======================================== */

  const requestedTab =
    searchParams.get("tab");

  const activeTab =
    VALID_TABS.includes(
      requestedTab
    )
      ? requestedTab
      : "active";

  const requestedPage = Number(
    searchParams.get("page")
  );

  const page =
    Number.isInteger(
      requestedPage
    ) && requestedPage >= 0
      ? requestedPage
      : 0;

  /* ========================================
     STATES
  ======================================== */

  const [members, setMembers] =
    useState([]);

  const [hasMore, setHasMore] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  /*
    actionModal example:

    {
      type: "approve",
      memberId: "...",
      userId: "...",
      memberName: "Sachin Kumar"
    }
  */

  const [
    actionModal,
    setActionModal,
  ] = useState(null);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  /* ========================================
     FETCH MEMBERS
  ======================================== */

  useEffect(() => {
    let ignore = false;

    async function loadMembers() {
      try {
        const params = {
          page,
          limit: LIMIT,
        };

        let response;

        switch (activeTab) {
          case "requests":
            response =
              await getMembershipRequests(
                params
              );
            break;

          case "payment":
            response =
              await getPendingPaymentMembers(
                params
              );
            break;

          case "revoked":
            response =
              await getRevokedMembers(
                params
              );
            break;

          default:
            response =
              await getActiveMembers(
                params
              );
        }

        if (ignore) return;

        console.log(
          "Members API response:",
          response
        );

        const fetchedMembers =
          response?.data
            ?.fetchedMembers || [];

        setMembers(
          fetchedMembers
        );

        setHasMore(
          Boolean(
            response?.data?.hasMore
          )
        );

        setError("");
      } catch (err) {
        if (ignore) return;

        console.error(
          "Members API Error:",
          err
        );

        setMembers([]);
        setHasMore(false);

        setError(
          err?.message ||
            "Unable to fetch members."
        );
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadMembers();

    return () => {
      ignore = true;
    };
  }, [activeTab, page]);

  /* ========================================
     CHANGE TAB
  ======================================== */

  const handleTabChange = (
    tab
  ) => {
    if (
      tab === activeTab &&
      page === 0
    ) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    router.push(
      `/dashboard/members?tab=${tab}&page=0`
    );
  };

  /* ========================================
     PAGINATION
  ======================================== */

  const handlePrevious = () => {
    if (
      page <= 0 ||
      loading
    ) {
      return;
    }

    setLoading(true);
    setError("");

    router.push(
      `/dashboard/members?tab=${activeTab}&page=${page - 1}`
    );
  };

  const handleNext = () => {
    if (
      !hasMore ||
      loading
    ) {
      return;
    }

    setLoading(true);
    setError("");

    router.push(
      `/dashboard/members?tab=${activeTab}&page=${page + 1}`
    );
  };

  /* ========================================
     OPEN ACTION MODAL
  ======================================== */

  const handleOpenAction = (
    actionData
  ) => {
    console.log(
      "Opening action modal:",
      actionData
    );

    /*
      IMPORTANT:
      We save IDs directly.

      Don't try to find:
      actionModal.member.userId._id
      later.
    */

    setActionModal(
      actionData
    );

    setError("");
    setSuccessMessage("");
  };

  /* ========================================
     CONFIRM ACTION
  ======================================== */

  const handleConfirmAction =
    async () => {
      if (!actionModal) {
        return;
      }

      const {
        type,
        memberId,
        userId,
      } = actionModal;

      console.log(
        "===== ACTION START ====="
      );

      console.log(
        "Action:",
        type
      );

      console.log(
        "Member ID:",
        memberId
      );

      console.log(
        "User ID:",
        userId
      );

      try {
        setActionLoading(true);
        setError("");

        let response;

        switch (type) {
          /* ====================
             USER ID
          ==================== */

          case "approve":
            response =
              await approveMemberApplication(
                userId
              );
            break;

          case "reject":
            response =
              await rejectMemberApplication(
                userId
              );
            break;

          /* ====================
             MEMBER ID
          ==================== */

          case "revoke":
            response =
              await revokeMembership(
                memberId
              );
            break;

          case "restore":
            response =
              await restoreMembership(
                memberId
              );
            break;

          default:
            throw new Error(
              "Invalid member action."
            );
        }

        console.log(
          "Member action response:",
          response
        );

        /*
          Close modal
        */

        setActionModal(null);

        /*
          Member status/application status
          has changed.

          Therefore remove it from the
          CURRENT tab.
        */

        setMembers(
          (currentMembers) =>
            currentMembers.filter(
              (item) =>
                item?._id !==
                memberId
            )
        );

        setSuccessMessage(
          getActionSuccessMessage(
            type
          )
        );
      } catch (err) {
        console.error(
          "Member action error:",
          err
        );

        setError(
          err?.message ||
            "Unable to perform action."
        );
      } finally {
        setActionLoading(
          false
        );

        console.log(
          "===== ACTION END ====="
        );
      }
    };

  /* ========================================
     MODAL CONTENT
  ======================================== */

  const modalContent =
    actionModal
      ? getActionModalContent(
          actionModal.type,
          actionModal.memberName
        )
      : null;

  return (
    <div className="w-full">
      {/* ==================================
          PAGE HEADER
      ================================== */}

      <div className="mb-7">
        <p className="text-sm font-semibold text-karni-saffron">
          Member Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          Members
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage member
          applications,
          memberships and account
          statuses.
        </p>
      </div>

      {/* ==================================
          TABS
      ================================== */}

      <div className="mb-6 overflow-x-auto">
        <div className="flex min-w-max gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
          {TABS.map((tab) => {
            const isActive =
              activeTab ===
              tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() =>
                  handleTabChange(
                    tab.key
                  )
                }
                className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-karni-saffron-dark text-white shadow-sm"
                    : "text-gray-600 hover:bg-orange-50 hover:text-karni-saffron-dark"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================================
          SUCCESS
      ================================== */}

      {successMessage && (
        <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-sm font-medium text-green-700">
            {
              successMessage
            }
          </p>

          <button
            type="button"
            onClick={() =>
              setSuccessMessage(
                ""
              )
            }
            className="shrink-0 text-green-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* ==================================
          ERROR
      ================================== */}

      {error && (
        <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="shrink-0 text-red-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* ==================================
          TABLE CARD
      ================================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* TABLE HEADER */}

        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="font-bold text-gray-900">
              {getTabTitle(
                activeTab
              )}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Page {page + 1}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-karni-saffron-dark">
            <Users size={20} />
          </div>
        </div>

        {/* ================================
            LOADING
        ================================ */}

        {loading ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center">
            <Loader2
              size={30}
              className="animate-spin text-karni-saffron"
            />

            <p className="mt-3 text-sm text-gray-500">
              Loading members...
            </p>
          </div>
        ) : members.length ===
          0 ? (
          /* ================================
             EMPTY
          ================================ */

          <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <Users size={26} />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No members found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-gray-500">
              No members are
              available in this
              category.
            </p>
          </div>
        ) : (
          /* ================================
             TABLE
          ================================ */

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Member
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Contact
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Member Type
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {members.map(
                  (member) => {
                   

                    const user = getUser(member);

                    return (
                      <tr
                        key={
                          member?._id
                        }
                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50"
                      >
                        {/* MEMBER */}

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <MemberAvatar
                              user={
                                user
                              }
                            />

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-gray-900">
                                {user?.fullName ||
                                  member?.name ||
                                  "--"}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                {formatText(
                                  member?.level
                                )}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CONTACT */}

                        <td className="px-5 py-5">
                          <p className="text-sm font-medium text-gray-800">
                            {user?.phone ||
                              "--"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {user?.email ||
                              "--"}
                          </p>
                        </td>

                        {/* MEMBER TYPE */}

                        <td className="px-5 py-5 text-sm text-gray-700">
                          {formatText(
                            member?.memberType
                          )}
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-5">
                          <MemberStatus
                            activeTab={
                              activeTab
                            }
                            member={
                              member
                            }
                          />
                        </td>

                        {/* DATE */}

                        <td className="px-5 py-5 text-sm text-gray-600">
                          {formatDate(
                            member?.createdAt ||
                              user?.createdAt
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-5">
                          <MemberActions
                            tab={
                              activeTab
                            }
                            page={
                              page
                            }
                            member={
                              member
                            }
                            onAction={
                              handleOpenAction
                            }
                          />
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ==================================
            PAGINATION
        ================================== */}

        {!loading &&
          members.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
              <p className="text-sm text-gray-500">
                Page{" "}
                <span className="font-semibold text-gray-800">
                  {page + 1}
                </span>
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={
                    page === 0
                  }
                  onClick={
                    handlePrevious
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft
                    size={17}
                  />

                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    !hasMore
                  }
                  onClick={
                    handleNext
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next

                  <ChevronRight
                    size={17}
                  />
                </button>
              </div>
            </div>
          )}
      </div>

      {/* ==================================
          CONFIRMATION MODAL
      ================================== */}

      <ConfirmationModal
        open={Boolean(
          actionModal
        )}
        title={
          modalContent?.title
        }
        description={
          modalContent?.description
        }
        confirmText={
          modalContent?.confirmText
        }
        type={
          modalContent?.type
        }
        loading={
          actionLoading
        }
        onConfirm={
          handleConfirmAction
        }
        onClose={() => {
          if (
            !actionLoading
          ) {
            setActionModal(
              null
            );
          }
        }}
      />
    </div>
  );
}

/* ==========================================
   MEMBER ACTIONS
========================================== */

function MemberActions({
  tab,
  member,
  page,
  onAction,
}) {
  const router = useRouter();

const memberId =
  member?._id;

const user =
  getUser(member);

const userId =
  getUserId(member);

const memberName =
  user?.fullName ||
  member?.name ||
  "Member";

 

  const handlePreview = () => {
    if (!memberId) {
      return;
    }

    router.push(
      `/dashboard/members/${memberId}?from=${tab}&page=${page}`
    );
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {/* PREVIEW */}

      <ActionButton
        title="Preview member"
        onClick={handlePreview}
      >
        <Eye size={17} />
      </ActionButton>

      {/* =================================
          REQUESTS

          APPROVE = userId
          REJECT = userId
      ================================= */}

      {tab === "requests" && (
        <>
          <ActionButton
            title="Approve application"
            variant="success"
            onClick={() =>
              onAction({
                type: "approve",
                memberId,
                userId,
                memberName,
              })
            }
          >
            <UserCheck
              size={17}
            />
          </ActionButton>

          <ActionButton
            title="Reject application"
            variant="danger"
            onClick={() =>
              onAction({
                type: "reject",
                memberId,
                userId,
                memberName,
              })
            }
          >
            <UserX
              size={17}
            />
          </ActionButton>
        </>
      )}

      {/* =================================
          PENDING PAYMENT

          REJECT = userId
      ================================= */}

      {tab === "payment" && (
        <ActionButton
          title="Reject application"
          variant="danger"
          onClick={() =>
            onAction({
              type: "reject",
              memberId,
              userId,
              memberName,
            })
          }
        >
          <UserX size={17} />
        </ActionButton>
      )}

      {/* =================================
          ACTIVE

          REVOKE = memberId
      ================================= */}

      {tab === "active" && (
        <ActionButton
          title="Revoke membership"
          variant="danger"
          onClick={() =>
            onAction({
              type: "revoke",
              memberId,
              userId,
              memberName,
            })
          }
        >
          <UserX size={17} />
        </ActionButton>
      )}

      {/* =================================
          REVOKED

          RESTORE = memberId
      ================================= */}

      {tab === "revoked" && (
        <ActionButton
          title="Restore membership"
          variant="success"
          onClick={() =>
            onAction({
              type: "restore",
              memberId,
              userId,
              memberName,
            })
          }
        >
          <RotateCcw
            size={17}
          />
        </ActionButton>
      )}
    </div>
  );
}

/* ==========================================
   ACTION BUTTON
========================================== */

function ActionButton({
  children,
  title,
  onClick,
  variant = "default",
}) {
  const styles = {
    default:
      "border border-gray-200 text-gray-600 hover:border-karni-saffron hover:bg-orange-50 hover:text-karni-saffron-dark",

    success:
      "border border-green-100 bg-green-50 text-green-700 hover:bg-green-100",

    danger:
      "border border-red-100 bg-red-50 text-red-700 hover:bg-red-100",
  };

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

/* ==========================================
   AVATAR
========================================== */

function MemberAvatar({
  user,
}) {
  if (
    user?.profilePhotoUrl
  ) {
    return (
      <Image
        src={
          user.profilePhotoUrl
        }
        alt={
          user?.fullName ||
          "Member"
        }
        width={44}
        height={44}
        className="h-11 w-11 shrink-0 rounded-xl border border-gray-200  object-fill"
      />
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 font-bold text-karni-saffron-dark">
      {user?.fullName
        ?.charAt(0)
        ?.toUpperCase() ||
        "M"}
    </div>
  );
}

/* ==========================================
   MEMBER STATUS
========================================== */

function MemberStatus({
  activeTab,
  member,
}) {
  if (
    activeTab === "requests"
  ) {
    return (
      <StatusPill variant="warning">
        Pending Approval
      </StatusPill>
    );
  }

  if (
    activeTab === "payment"
  ) {
    return (
      <StatusPill variant="warning">
        Payment Pending
      </StatusPill>
    );
  }

  if (
    activeTab === "revoked"
  ) {
    return (
      <StatusPill variant="danger">
        Revoked
      </StatusPill>
    );
  }

  if (
    member?.currentStatus ===
    "ACTIVE"
  ) {
    return (
      <StatusPill variant="success">
        Active
      </StatusPill>
    );
  }

  return (
    <StatusPill>
      {formatText(
        member?.currentStatus
      )}
    </StatusPill>
  );
}

function StatusPill({
  children,
  variant = "default",
}) {
  const variants = {
    default:
      "bg-gray-100 text-gray-600",

    success:
      "bg-green-50 text-green-700",

    warning:
      "bg-orange-50 text-orange-700",

    danger:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

/* ==========================================
   TAB TITLE
========================================== */

function getTabTitle(tab) {
  switch (tab) {
    case "requests":
      return "Membership Requests";

    case "payment":
      return "Approved / Pending Payment";

    case "revoked":
      return "Revoked Members";

    default:
      return "Active Members";
  }
}

/* ==========================================
   MODAL CONTENT
========================================== */

function getActionModalContent(
  type,
  memberName
) {
  const name =
    memberName || "this member";

  switch (type) {
    case "approve":
      return {
        title:
          "Approve Application?",
        description:
          `Are you sure you want to approve ${name}'s membership application?`,
        confirmText:
          "Approve",
        type: "success",
      };

    case "reject":
      return {
        title:
          "Reject Application?",
        description:
          `Are you sure you want to reject ${name}'s membership application?`,
        confirmText:
          "Reject",
        type: "danger",
      };

    case "revoke":
      return {
        title:
          "Revoke Membership?",
        description:
          `Are you sure you want to revoke ${name}'s membership?`,
        confirmText:
          "Revoke",
        type: "danger",
      };

    case "restore":
      return {
        title:
          "Restore Membership?",
        description:
          `Are you sure you want to restore ${name}'s membership?`,
        confirmText:
          "Restore",
        type: "success",
      };

    default:
      return {};
  }
}

/* ==========================================
   SUCCESS MESSAGE
========================================== */

function getActionSuccessMessage(
  type
) {
  switch (type) {
    case "approve":
      return "Membership application approved successfully.";

    case "reject":
      return "Membership application rejected successfully.";

    case "revoke":
      return "Membership revoked successfully.";

    case "restore":
      return "Membership restored successfully.";

    default:
      return "Action completed successfully.";
  }
}

/* ==========================================
   FORMATTERS
========================================== */

function formatText(value) {
  if (!value) {
    return "--";
  }

  return String(value)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );
}

function formatDate(value) {
  if (!value) {
    return "--";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "--";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

// userId se complete user object nikalega
function getUser(member) {
  const userId = member?.userId;

  if (!userId) {
    return {};
  }

  // userId array hai
  if (Array.isArray(userId)) {
    return userId[0] || {};
  }

  // userId object hai
  if (typeof userId === "object") {
    return userId;
  }

  return {};
}

// Approve / Reject ke liye actual user ID nikalega
function getUserId(member) {
  const userId = member?.userId;

  if (!userId) {
    return null;
  }

  // userId array hai
  if (Array.isArray(userId)) {
    return (
      userId[0]?._id ||
      userId[0]?.id ||
      null
    );
  }

  // userId object hai
  if (typeof userId === "object") {
    return (
      userId._id ||
      userId.id ||
      null
    );
  }

  // userId already string ID hai
  if (typeof userId === "string") {
    return userId;
  }

  return null;
}