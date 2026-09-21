"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { Eye, Loader2, RotateCcw, UserCheck, UserX } from "lucide-react";

import {
  getActiveMembers,
  getMembershipRequests,
  getPendingPaymentMembers,
  getRevokedMembers,
} from "@/services/members";

const tabs = [
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

const LIMIT = 10;

export default function MembersPage() {
  const [activeTab, setActiveTab] = useState("active");

  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [page, setPage] = useState(0);

  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadMembers = async () => {
      try {
        const params = {
          page,
          limit: LIMIT,
        };

        let response;

        switch (activeTab) {
          case "requests":
            response = await getMembershipRequests(params);
            break;

          case "payment":
            response = await getPendingPaymentMembers(params);
            break;

          case "revoked":
            response = await getRevokedMembers(params);
            break;

          case "active":
          default:
            response = await getActiveMembers(params);
            break;
        }

        if (ignore) return;

        const fetchedMembers = response?.data?.fetchedMembers || [];

        setMembers(fetchedMembers);

        setHasMore(Boolean(response?.data?.hasMore));

        setError("");
      } catch (err) {
        if (ignore) return;

        console.error("Members fetch error:", err);

        setMembers([]);

        setHasMore(false);

        setError(err?.message || "Unable to fetch members.");
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadMembers();

    return () => {
      ignore = true;
    };
  }, [activeTab, page]);

  const handleTabChange = (tab) => {
    if (tab === activeTab) {
      return;
    }

    setLoading(true);
    setError("");

    setPage(0);

    setActiveTab(tab);
  };

  const handlePreviousPage = () => {
    if (page === 0) {
      return;
    }

    setLoading(true);
    setError("");

    setPage((currentPage) => currentPage - 1);
  };

  const handleNextPage = () => {
    if (!hasMore) {
      return;
    }

    setLoading(true);
    setError("");

    setPage((currentPage) => currentPage + 1);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="w-full">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Members</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage membership requests, active members, approved applications and
          revoked memberships.
        </p>
      </div>

      <div className="mb-6 overflow-x-auto">
        <div className="flex min-w-max gap-2 rounded-xl border border-gray-200 bg-white p-1.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
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

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <Loader2 size={30} className="animate-spin text-karni-saffron" />

            <p className="mt-3 text-sm text-gray-500">Loading members...</p>
          </div>
        ) : error ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center p-10 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <UserX size={22} className="text-red-500" />
            </div>

            <h3 className="font-semibold text-gray-800">
              Unable to load members
            </h3>

            <p className="mt-2 max-w-sm text-sm text-red-500">{error}</p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-5 rounded-lg bg-karni-saffron-dark px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-karni-saffron"
            >
              Try Again
            </button>
          </div>
        ) : members.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center p-10 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
              <UserCheck size={25} className="text-karni-saffron" />
            </div>

            <h3 className="font-semibold text-gray-800">No members found</h3>

            <p className="mt-2 text-sm text-gray-500">
              There are currently no members available in this section.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              {/* TABLE HEADER */}

              <thead className="border-b border-gray-200 bg-gray-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4">Member</th>

                  <th className="px-6 py-4">Contact</th>

                  <th className="px-6 py-4">Member Type</th>

                  <th className="px-6 py-4">Status</th>

                  <th className="px-6 py-4">Joined / Applied</th>

                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              {/* TABLE BODY */}

              <tbody>
                {members.map((member) => {
                  const user = member?.userId;

                  return (
                    <tr
                      key={member?._id || user?._id}
                      className="border-b border-gray-100 transition last:border-0 hover:bg-gray-50/70"
                    >
                      {/* MEMBER */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <MemberAvatar user={user} />

                          <div className="min-w-0">
                            <p className="max-w-[200px] truncate font-semibold text-gray-800">
                              {user?.fullName || member?.name || "--"}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {member?.level || "--"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CONTACT */}

                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-700">
                          {user?.phone || "--"}
                        </p>

                        <p className="mt-1 max-w-[220px] truncate text-xs text-gray-400">
                          {user?.email || "--"}
                        </p>
                      </td>

                      {/* MEMBER TYPE */}

                      <td className="px-6 py-4">
                        <p className="text-sm capitalize text-gray-600">
                          {formatText(member?.memberType)}
                        </p>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">
                        <StatusBadge tab={activeTab} member={member} />
                      </td>

                      {/* CREATED DATE */}

                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {formatDate(member?.createdAt || user?.createdAt)}
                        </p>
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-4">
                        <MemberActions tab={activeTab} member={member} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && members.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Page{" "}
                <span className="font-semibold text-gray-800">{page + 1}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Previous */}

              <button
                type="button"
                disabled={page === 0}
                onClick={handlePreviousPage}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {/* Current Page */}

              <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-karni-saffron-dark px-3 text-sm font-semibold text-white">
                {page + 1}
              </div>

              {/* Next */}

              <button
                type="button"
                disabled={!hasMore}
                onClick={handleNextPage}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MemberAvatar({ user }) {
  if (user?.profilePhotoUrl) {
    return (
      <Image
        src={user.profilePhotoUrl}
        alt={user?.fullName || "Member"}
        width={44}
        height={44}
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 font-semibold text-karni-saffron-dark">
      {user?.fullName?.charAt(0)?.toUpperCase() || "M"}
    </div>
  );
}

function StatusBadge({ tab, member }) {
  let text = member?.currentStatus || "Unknown";

  let classes = "bg-gray-100 text-gray-600";

  switch (tab) {
    case "active":
      text = "Active";

      classes = "bg-green-50 text-green-700";

      break;

    case "requests":
      text = "Pending Approval";

      classes = "bg-amber-50 text-amber-700";

      break;

    case "payment":
      text = "Pending Payment";

      classes = "bg-blue-50 text-blue-700";

      break;

    case "revoked":
      text = "Revoked";

      classes = "bg-red-50 text-red-700";

      break;

    default:
      break;
  }

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {text}
    </span>
  );
}

function MemberActions({ tab, member }) {
  const membershipId = member?._id;

  const userId = member?.userId?._id;

  const handlePreview = () => {
    console.log("Preview member:", {
      membershipId,
      userId,
    });

    /*
     *
     *
     * router.push(
     *   `/dashboard/members/${userId}`
     * )
     */
  };

  const handleApprove = () => {
    console.log("Approve user:", userId);
  };

  const handleReject = () => {
    console.log("Reject user:", userId);
  };

  const handleRevoke = () => {
    console.log("Revoke membership:", membershipId);
  };

  const handleRestore = () => {
    console.log("Restore membership:", membershipId);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Preview */}

      <button
        type="button"
        title="Preview member"
        onClick={handlePreview}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-karni-saffron hover:bg-orange-50 hover:text-karni-saffron-dark"
      >
        <Eye size={17} />
      </button>

      {/* =========================
          MEMBERSHIP REQUEST
      ========================== */}

      {tab === "requests" && (
        <>
          <button
            type="button"
            title="Approve application"
            onClick={handleApprove}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-700 transition hover:bg-green-100"
          >
            <UserCheck size={17} />
          </button>

          <button
            type="button"
            title="Reject application"
            onClick={handleReject}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-700 transition hover:bg-red-100"
          >
            <UserX size={17} />
          </button>
        </>
      )}

      {/* =========================
          PENDING PAYMENT
      ========================== */}

      {tab === "payment" && (
        <button
          type="button"
          title="Reject application"
          onClick={handleReject}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-700 transition hover:bg-red-100"
        >
          <UserX size={17} />
        </button>
      )}

      {/* =========================
          ACTIVE MEMBER
      ========================== */}

      {tab === "active" && (
        <button
          type="button"
          title="Revoke membership"
          onClick={handleRevoke}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-700 transition hover:bg-red-100"
        >
          <UserX size={17} />
        </button>
      )}

      {/* =========================
          REVOKED MEMBER
      ========================== */}

      {tab === "revoked" && (
        <button
          type="button"
          title="Restore membership"
          onClick={handleRestore}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-700 transition hover:bg-green-100"
        >
          <RotateCcw size={17} />
        </button>
      )}
    </div>
  );
}

function formatText(value) {
  if (!value) {
    return "--";
  }

  return value.replaceAll("_", " ").toLowerCase();
}

function formatDate(timestamp) {
  if (!timestamp) {
    return "--";
  }

  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(timestamp));
  } catch {
    return "--";
  }
}
