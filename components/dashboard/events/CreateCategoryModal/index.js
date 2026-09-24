"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { createCategory } from "@/services/events";

export default function CreateCategoryModal({
  open,
  onClose,
  onCreated,
}) {
  const [eng, setEng] =
    useState("");

  const [hin, setHin] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  if (!open) return null;

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (!eng.trim()) {
      setError(
        "English category name is required."
      );
      return;
    }

    if (!hin.trim()) {
      setError(
        "Hindi category name is required."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        name: {
          eng: eng.trim(),
          hin: hin.trim(),
        },

        slug: generateSlug(eng),

        isActive: true,
      };

      console.log(
        "CATEGORY PAYLOAD:",
        payload
      );

      const response =
        await createCategory(
          payload
        );

      console.log(
        "CREATE CATEGORY RESPONSE:",
        response
      );

      setEng("");
      setHin("");

      onCreated?.(response);

      onClose();
    } catch (err) {
      setError(
        err?.message ||
          "Unable to create category."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Create Category
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add English and Hindi
              category names.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Field
            label="English Name"
            required
          >
            <input
              value={eng}
              onChange={(e) =>
                setEng(
                  e.target.value
                )
              }
              placeholder="Events"
              className={inputClass}
            />
          </Field>

          <Field
            label="Hindi Name"
            required
          >
            <input
              value={hin}
              onChange={(e) =>
                setHin(
                  e.target.value
                )
              }
              placeholder="कार्यक्रम"
              className={inputClass}
            />
          </Field>

          {eng && (
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Generated Slug
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {generateSlug(eng)}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="rounded-xl bg-karni-saffron-dark px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-karni-saffron";

function generateSlug(
  value = ""
) {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9\s-]/g,
      ""
    )
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}