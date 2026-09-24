"use client";

import {
  useEffect,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Languages,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

import {
  getMemberById,
} from "@/services/members";

export default function MemberPreview({
  memberId,
}) {
  const router = useRouter();

  const [member, setMember] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


const searchParams =
  useSearchParams();

const fromTab =
  searchParams.get("from") ||
  "active";

const fromPage =
  Number(
    searchParams.get("page")
  ) || 0;

  useEffect(() => {
    let cancelled = false;

    async function fetchMember() {
      try {
        const response =
          await getMemberById(
            memberId
          );

        if (cancelled) return;

        setMember(
          response?.data || null
        );

        setError("");
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Member API Error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load member."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMember();

    return () => {
      cancelled = true;
    };
  }, [memberId]);
   const handleBack = () => {
  router.push(
    `/dashboard/members?tab=${fromTab}&page=${fromPage}`
  );
};
  /* ============================
      LOADING
  ============================ */

  if (loading) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center">
        <Loader2
          size={34}
          className="animate-spin text-karni-saffron"
        />

        <p className="mt-3 text-sm text-gray-500">
          Loading member details...
        </p>
      </div>
    );
  }

  /* ============================
      ERROR
  ============================ */

  if (error) {
    return (
      <div>
        <BackButton
         onClick={handleBack}
        />

        <div className="rounded-2xl border border-red-200 bg-red-50 p-7">
          <h2 className="font-semibold text-red-700">
            Unable to load member
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div>
        <BackButton
          onClick={handleBack}
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">
            Member not found.
          </p>
        </div>
      </div>
    );
  }

  /* ============================
      DATA
  ============================ */

  const user =
    member?.userId || {};

  const address =
    user?.address || {};

  const membershipDetails =
    user?.membershipDetails || {};

  const idDocument =
    member?.idDocument || {};

  const applicationStatus =
    user?.applicationStatus;

  return (
    <div className="w-full">
      {/* ========================
          BACK
      ======================== */}

      <BackButton
        onClick={handleBack}
      />

      {/* ========================
          HEADING
      ======================== */}

      <div className="mb-6">
        <p className="text-sm font-semibold text-karni-saffron">
          Member Management
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            Member Details
          </h1>

          <StatusBadge
            status={
              member?.currentStatus
            }
          />
        </div>

        <p className="mt-2 text-sm text-gray-500">
          View personal,
          application and membership
          information.
        </p>
      </div>

      {/* ========================
          PROFILE CARD
      ======================== */}

      <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-1.5 bg-karni-saffron" />

        <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center">
          {/* IMAGE */}

          <div className="shrink-0">
            {user?.profilePhotoUrl ? (
              <Image
                src={
                  user.profilePhotoUrl
                }
                alt={
                  user?.fullName ||
                  "Member"
                }
                width={110}
                height={110}
                priority
                className="h-28 w-28 rounded-2xl border border-gray-200 object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-orange-50 text-karni-saffron-dark">
                <User size={40} />
              </div>
            )}
          </div>

          {/* BASIC */}

          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {valueOrDash(
                user?.fullName ||
                  member?.name
              )}
            </h2>

            <p className="mt-1 text-sm font-medium text-gray-500">
              {formatText(
                member?.memberType
              )}
              {" • "}
              {formatText(
                member?.level
              )}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
              <ProfileInfo
                icon={Phone}
                value={user?.phone}
              />

              <ProfileInfo
                icon={Mail}
                value={user?.email}
              />

              <ProfileInfo
                icon={MapPin}
                value={[
                  address?.city
                    ?.label,
                  address?.state
                    ?.label,
                ]
                  .filter(Boolean)
                  .join(", ")}
              />
            </div>
          </div>

          {/* APPLICATION STATUS */}

          <div className="w-full rounded-2xl border border-orange-100 bg-orange-50 p-5 lg:w-auto lg:min-w-[220px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Application Status
            </p>

            <div className="mt-2 flex items-center gap-2">
              <Clock3
                size={18}
                className="text-karni-saffron-dark"
              />

              <p className="font-semibold text-karni-saffron-dark">
                {applicationStatus
                  ?.label?.eng ||
                  formatText(
                    applicationStatus
                      ?.key
                  )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================
          INFORMATION GRID
      ======================== */}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* PERSONAL */}

        <SectionCard
          title="Personal Information"
          description="Basic personal details of the member."
          icon={User}
        >
          <InfoGrid>
            <InfoItem
              label="Full Name"
              value={user?.fullName}
            />

            <InfoItem
              label="Guardian Name"
              value={
                user?.guardianName
              }
            />

            <InfoItem
              label="Date of Birth"
              value={formatDate(
                user?.dob
              )}
              icon={CalendarDays}
            />

            <InfoItem
              label="Gender"
              value={
                user?.gender?.label
                  ?.eng
              }
            />

            <InfoItem
              label="Phone Number"
              value={user?.phone}
              icon={Phone}
            />

            <InfoItem
              label="Alternate Contact"
              value={
                user?.alternateContactNumber
              }
              icon={Phone}
            />

            <InfoItem
              label="Email Address"
              value={user?.email}
              icon={Mail}
            />

            <InfoItem
              label="Preferred Language"
              value={formatText(
                user?.preferredLanguage
              )}
              icon={Languages}
            />
          </InfoGrid>
        </SectionCard>

        {/* PROFESSIONAL */}

        <SectionCard
          title="Professional Information"
          description="Occupation and organization details."
          icon={BriefcaseBusiness}
        >
          <InfoGrid>
            <InfoItem
              label="Occupation"
              value={formatText(
                user?.occupation
              )}
            />

            <InfoItem
              label="Organization"
              value={
                user?.organization
              }
            />

            <InfoItem
              label="User Role"
              value={
                user?.role?.label
                  ?.eng
              }
            />

            <BooleanInfo
              label="Mobile Verified"
              value={
                user?.isMobileVerified
              }
            />

            <BooleanInfo
              label="User Verified"
              value={
                user?.isVerified
              }
            />

            <BooleanInfo
              label="Account Active"
              value={
                user?.isActive
              }
            />
          </InfoGrid>
        </SectionCard>

        {/* ADDRESS */}

        <SectionCard
          title="Address"
          description="Registered residential address."
          icon={MapPin}
        >
          <InfoGrid>
            <InfoItem
              label="Street"
              value={
                address?.street
                  ?.label
              }
            />

            <InfoItem
              label="City"
              value={
                address?.city?.label
              }
            />

            <InfoItem
              label="District"
              value={
                address?.district
                  ?.label
              }
            />

            <InfoItem
              label="State"
              value={
                address?.state?.label
              }
            />

            <InfoItem
              label="Country"
              value={formatText(
                address?.country?.key
              )}
            />

            <InfoItem
              label="Postal Code"
              value={
                address?.postalCode
              }
            />
          </InfoGrid>
        </SectionCard>

        {/* MEMBERSHIP */}

        <SectionCard
          title="Membership Information"
          description="Membership type, status and validity."
          icon={BadgeCheck}
        >
          <InfoGrid>
            <InfoItem
              label="Member Type"
              value={formatText(
                member?.memberType
              )}
            />

            <InfoItem
              label="Membership Level"
              value={formatText(
                member?.level
              )}
            />

            <InfoItem
              label="Current Status"
              value={formatText(
                member?.currentStatus
              )}
            />

            <InfoItem
              label="Category"
              value={
                membershipDetails
                  ?.membershipCategory
                  ?.eng
              }
            />

            <InfoItem
              label="Assigned Unit"
              value={
                membershipDetails
                  ?.assignedUnitName
                  ?.eng
              }
            />

            <InfoItem
              label="Joining Date"
              value={formatDate(
                membershipDetails
                  ?.joiningDate
              )}
            />

            <InfoItem
              label="Valid Until"
              value={formatDate(
                membershipDetails
                  ?.validUntil ||
                  member?.validity
              )}
            />

            <InfoItem
              label="Member Since"
              value={formatDate(
                member?.createdAt
              )}
            />
          </InfoGrid>
        </SectionCard>
      </div>

      {/* ========================
          ID DOCUMENT
      ======================== */}

      <div className="mt-6">
        <SectionCard
          title="Identity Document"
          description="Government identity document submitted by the member."
          icon={FileText}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid flex-1 gap-5 sm:grid-cols-2">
              <InfoItem
                label="Document Type"
                value={formatText(
                  idDocument
                    ?.docTypeKey
                )}
              />

              <InfoItem
                label="Document Number"
                value={
                  idDocument
                    ?.documentNumber
                }
              />
            </div>

            {idDocument?.documentFileUrl && (
              <a
                href={
                  idDocument.documentFileUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-karni-saffron-dark px-5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <FileText
                  size={17}
                />

                View Document

                <ExternalLink
                  size={15}
                />
              </a>
            )}
          </div>
        </SectionCard>
      </div>

      {/* ========================
          APPLICATION DETAILS
      ======================== */}

      <div className="mt-6">
        <SectionCard
          title="Application Information"
          description="Current application and approval information."
          icon={ShieldCheck}
        >
          <InfoGrid>
            <InfoItem
              label="Application Status"
              value={
                applicationStatus
                  ?.label?.eng ||
                formatText(
                  applicationStatus
                    ?.key
                )
              }
            />

            <InfoItem
              label="Application Date"
              value={formatDateTime(
                user?.createdAt
              )}
            />

            <InfoItem
              label="Approval Date"
              value={formatDateTime(
                user?.approvalDate
              )}
            />

            <InfoItem
              label="Approved By"
              value={
                user?.approvedBy
              }
            />

            <InfoItem
              label="Rejection Reason"
              value={
                user?.rejectionReason
                  ?.eng
              }
            />
          </InfoGrid>
        </SectionCard>
      </div>

      {/* ========================
          SYSTEM INFORMATION
      ======================== */}

      <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          System Information
        </p>

        <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
          <SystemId
            label="Member ID"
            value={member?._id}
          />

          <SystemId
            label="User ID"
            value={user?._id}
          />
        </div>
      </div>
    </div>
  );
}

/* ==================================================
   SMALL COMPONENTS
================================================== */

function BackButton({
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-karni-saffron-dark"
    >
      <ArrowLeft size={18} />
      Back to Members
    </button>
  );
}

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}) {
  return (
    <section className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-karni-saffron-dark">
          <Icon size={20} />
        </div>

        <div>
          <h2 className="font-bold text-gray-900">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-xs leading-5 text-gray-500">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}

function InfoGrid({
  children,
}) {
  return (
    <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {children}
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <div className="mt-1.5 flex items-center gap-2">
        {Icon && (
          <Icon
            size={15}
            className="shrink-0 text-gray-400"
          />
        )}

        <p className="break-words text-sm font-medium text-gray-800">
          {valueOrDash(value)}
        </p>
      </div>
    </div>
  );
}

function BooleanInfo({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <div className="mt-1.5 flex items-center gap-2">
        {value ? (
          <>
            <CheckCircle2
              size={16}
              className="text-green-600"
            />

            <span className="text-sm font-semibold text-green-700">
              Yes
            </span>
          </>
        ) : (
          <span className="text-sm font-medium text-gray-700">
            No
          </span>
        )}
      </div>
    </div>
  );
}

function ProfileInfo({
  icon: Icon,
  value,
}) {
  if (!value) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Icon
        size={16}
        className="shrink-0 text-gray-400"
      />

      <span>
        {value}
      </span>
    </div>
  );
}

function StatusBadge({
  status,
}) {
  const value =
    status?.toUpperCase();

  if (value === "ACTIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
        Active
      </span>
    );
  }

  if (value === "REVOKED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
        <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
        Revoked
      </span>
    );
  }

  return (
    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
      {formatText(status)}
    </span>
  );
}

function SystemId({
  label,
  value,
}) {
  return (
    <div>
      <span className="text-gray-500">
        {label}:{" "}
      </span>

      <span className="break-all font-mono text-xs text-gray-700">
        {valueOrDash(value)}
      </span>
    </div>
  );
}

/* ==================================================
   FORMATTERS
================================================== */

function valueOrDash(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "--";
  }

  return value;
}

function formatText(value) {
  if (!value) return "--";

  return String(value)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

function formatDate(value) {
  if (!value) return "--";

  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
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

function formatDateTime(value) {
  if (!value) return "--";

  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "--";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}