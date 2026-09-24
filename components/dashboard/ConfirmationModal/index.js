"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";

export default function ConfirmationModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  loading = false,
  onConfirm,
  onClose,
}) {
  if (!open) {
    return null;
  }

  const isSuccess =
    type === "success";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* BACKDROP */}

      <button
        type="button"
        aria-label="Close modal"
        disabled={loading}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-[2px]"
      />

      {/* MODAL */}

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">
        {/* CLOSE */}

        <button
          type="button"
          disabled={loading}
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={18} />
        </button>

        {/* ICON */}

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            isSuccess
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {isSuccess ? (
            <CheckCircle2
              size={24}
            />
          ) : (
            <AlertTriangle
              size={24}
            />
          )}
        </div>

        {/* CONTENT */}

        <h2 className="mt-6 text-xl font-bold text-gray-900">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {description}
        </p>

        {/* ACTIONS */}

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`inline-flex min-w-[120px] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isSuccess
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading && (
              <Loader2
                size={16}
                className="animate-spin"
              />
            )}

            {loading
              ? "Please wait..."
              : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}