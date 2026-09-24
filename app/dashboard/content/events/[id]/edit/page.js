"use client";

import {
  use,
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

import { useRouter } from "next/navigation";

import RichTextEditor from "@/components/dashboard/events/RichTextEditor";

import {
  getEventById,
  getCategories,
  updateEvent,
} from "@/services/events";

const IMAGE_UPLOAD_API =
  "https://6zq9472qqb.execute-api.ap-south-1.amazonaws.com/upload";

const S3_BASE_URL =
  "https://karni-sena.s3.ap-south-1.amazonaws.com";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

const initialForm = {
  titleEng: "",
  titleHin: "",

  subTitleEng: "",
  subTitleHin: "",

  slug: "",
  category: "",

  eventType: "EVENT",

  descriptionEng: "",
  descriptionHin: "",

  contentEng: "",
  contentHin: "",

  startDate: "",
  endDate: "",

  timeDisplayEng: "",
  timeDisplayHin: "",

  venueNameEng: "",
  venueNameHin: "",

  addressEng: "",
  addressHin: "",

  cityEng: "",
  cityHin: "",

  districtEng: "",
  districtHin: "",

  stateEng: "",
  stateHin: "",

  latitude: "",
  longitude: "",

  mapUrl: "",

  isExclusive: false,
};

export default function EditEventPage({
  params,
}) {
  const { id } = use(params);

  const router = useRouter();

  const [form, setForm] =
    useState(initialForm);

  const [categories, setCategories] =
    useState([]);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ============================
  // BANNER STATE
  // ============================

  /*
    existingBannerUrls:
    backend se existing S3 URLs

    bannerFiles:
    admin ne edit ke time koi
    new file select ki hai ya nahi
  */

  const [
    existingBannerUrls,
    setExistingBannerUrls,
  ] = useState({
    eng: "",
    hin: "",
  });

  const [
    bannerFiles,
    setBannerFiles,
  ] = useState({
    eng: null,
    hin: null,
  });

  const [
    bannerPreviews,
    setBannerPreviews,
  ] = useState({
    eng: "",
    hin: "",
  });

  // ============================
  // GALLERY STATE
  // ============================

  /*
    Har media item:

    {
      id: "...",

      existingEng: "...",
      existingHin: "...",

      eng: File | null,
      hin: File | null,

      engPreview: "...",
      hinPreview: "..."
    }
  */

  const [
    mediaFiles,
    setMediaFiles,
  ] = useState([]);

  // ============================
  // LOAD EVENT + CATEGORIES
  // ============================

  useEffect(() => {
    let ignore = false;

    const loadData =
      async () => {
        try {
          setPageLoading(true);
          setError("");

          const [
            eventResponse,
            categoryResponse,
          ] =
            await Promise.all([
              getEventById(id),

              getCategories({
                page: 0,
                limit: 100,
              }),
            ]);

          if (ignore) return;

          console.log(
            "EDIT EVENT RESPONSE:",
            eventResponse
          );

          console.log(
            "CATEGORY RESPONSE:",
            categoryResponse
          );

          // Actual response:
          // { success, message, data: {...event} }

          const event =
            eventResponse?.data;

          if (!event) {
            throw new Error(
              "Event not found."
            );
          }

          // ============================
          // CATEGORY NORMALIZATION
          // ============================

          const categoryData =
            categoryResponse?.data
              ?.fetchedCategories ||
            categoryResponse?.data
              ?.categories ||
            categoryResponse?.data ||
            [];

          let categoryList =
            [];

          if (
            Array.isArray(
              categoryData
            )
          ) {
            categoryList =
              categoryData;
          } else if (
            categoryData &&
            typeof categoryData ===
              "object"
          ) {
            categoryList = [
              categoryData,
            ];
          }

          setCategories(
            categoryList
          );

          // ============================
          // FORM
          // ============================

          setForm({
            titleEng:
              event?.title?.eng ||
              "",

            titleHin:
              event?.title?.hin ||
              "",

            subTitleEng:
              event?.subTitle
                ?.eng || "",

            subTitleHin:
              event?.subTitle
                ?.hin || "",

            slug:
              event?.slug || "",

            // Actual API returns
            // category as ID
            category:
              typeof event?.category ===
              "string"
                ? event.category
                : event?.category
                    ?._id || "",

            // Old event compatibility
            eventType:
              event?.eventType ||
              "EVENT",

            descriptionEng:
              event?.description
                ?.eng || "",

            descriptionHin:
              event?.description
                ?.hin || "",

            // Existing HTML goes
            // directly into Tiptap
            contentEng:
              event?.content?.eng ||
              "",

            contentHin:
              event?.content?.hin ||
              "",

            startDate:
              formatDateTimeForInput(
                event?.startDate
              ),

            endDate:
              formatDateTimeForInput(
                event?.endDate
              ),

            timeDisplayEng:
              event?.timeDisplay
                ?.eng || "",

            timeDisplayHin:
              event?.timeDisplay
                ?.hin || "",

            venueNameEng:
              event?.venue?.name
                ?.eng || "",

            venueNameHin:
              event?.venue?.name
                ?.hin || "",

            addressEng:
              event?.venue?.address
                ?.eng || "",

            addressHin:
              event?.venue?.address
                ?.hin || "",

            cityEng:
              event?.venue?.city
                ?.eng || "",

            cityHin:
              event?.venue?.city
                ?.hin || "",

            districtEng:
              event?.venue
                ?.district?.eng ||
              "",

            districtHin:
              event?.venue
                ?.district?.hin ||
              "",

            stateEng:
              event?.venue?.state
                ?.eng || "",

            stateHin:
              event?.venue?.state
                ?.hin || "",

            latitude:
              event?.venue
                ?.mapCoordinates
                ?.lat ?? "",

            longitude:
              event?.venue
                ?.mapCoordinates
                ?.lng ?? "",

            mapUrl:
              event?.venue
                ?.mapUrl || "",

            isExclusive:
              Boolean(
                event?.isExclusive
              ),
          });

          // ============================
          // EXISTING BANNERS
          // ============================

          setExistingBannerUrls({
            eng:
              event
                ?.bannerImageUrl
                ?.eng || "",

            hin:
              event
                ?.bannerImageUrl
                ?.hin || "",
          });

          // ============================
          // EXISTING MEDIA
          // ============================

          const existingMedia =
            Array.isArray(
              event?.mediaUrls
            )
              ? event.mediaUrls
              : [];

          setMediaFiles(
            existingMedia.map(
              (
                media,
                index
              ) => ({
                id:
                  media?._id ||
                  `existing-${index}`,

                existingEng:
                  media?.eng || "",

                existingHin:
                  media?.hin || "",

                eng: null,
                hin: null,

                engPreview: "",
                hinPreview: "",
              })
            )
          );
        } catch (err) {
          console.error(
            "EDIT EVENT LOAD ERROR:",
            err
          );

          if (ignore) return;

          setError(
            err?.message ||
              "Unable to load event."
          );
        } finally {
          if (!ignore) {
            setPageLoading(
              false
            );
          }
        }
      };

    if (id) {
      loadData();
    }

    return () => {
      ignore = true;
    };
  }, [id]);

  // ============================
  // UPDATE FIELD
  // ============================

  const updateField = (
    name,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================
  // BANNER CHANGE
  // ============================

  const handleBannerChange = (
    language,
    file
  ) => {
    if (!file) return;

    const validationError =
      validateMediaFile(file);

    if (validationError) {
      setError(
        validationError
      );
      return;
    }

    if (
      bannerPreviews[
        language
      ]
    ) {
      URL.revokeObjectURL(
        bannerPreviews[
          language
        ]
      );
    }

    const preview =
      URL.createObjectURL(
        file
      );

    setBannerFiles(
      (prev) => ({
        ...prev,
        [language]: file,
      })
    );

    setBannerPreviews(
      (prev) => ({
        ...prev,
        [language]:
          preview,
      })
    );

    setError("");
  };

  // ============================
  // REMOVE/RESET NEW BANNER
  // ============================

  const resetBanner = (
    language
  ) => {
    if (
      bannerPreviews[
        language
      ]
    ) {
      URL.revokeObjectURL(
        bannerPreviews[
          language
        ]
      );
    }

    setBannerFiles(
      (prev) => ({
        ...prev,
        [language]: null,
      })
    );

    setBannerPreviews(
      (prev) => ({
        ...prev,
        [language]: "",
      })
    );
  };

  // ============================
  // ADD MEDIA ROW
  // ============================

  const addMediaRow =
    () => {
      setMediaFiles(
        (prev) => [
          ...prev,
          {
            id: `new-${Date.now()}`,

            existingEng: "",
            existingHin: "",

            eng: null,
            hin: null,

            engPreview: "",
            hinPreview: "",
          },
        ]
      );
    };

  // ============================
  // MEDIA CHANGE
  // ============================

  const handleMediaChange = (
    mediaId,
    language,
    file
  ) => {
    if (!file) return;

    const validationError =
      validateMediaFile(file);

    if (validationError) {
      setError(
        validationError
      );
      return;
    }

    setMediaFiles(
      (prev) =>
        prev.map((item) => {
          if (
            item.id !==
            mediaId
          ) {
            return item;
          }

          const previewKey =
            language ===
            "eng"
              ? "engPreview"
              : "hinPreview";

          if (
            item[
              previewKey
            ]
          ) {
            URL.revokeObjectURL(
              item[
                previewKey
              ]
            );
          }

          return {
            ...item,

            [language]:
              file,

            [previewKey]:
              URL.createObjectURL(
                file
              ),
          };
        })
    );

    setError("");
  };

  // ============================
  // RESET NEW MEDIA FILE
  // ============================

  const resetMediaFile = (
    mediaId,
    language
  ) => {
    setMediaFiles(
      (prev) =>
        prev.map((item) => {
          if (
            item.id !==
            mediaId
          ) {
            return item;
          }

          const previewKey =
            language ===
            "eng"
              ? "engPreview"
              : "hinPreview";

          if (
            item[
              previewKey
            ]
          ) {
            URL.revokeObjectURL(
              item[
                previewKey
              ]
            );
          }

          return {
            ...item,

            [language]:
              null,

            [previewKey]:
              "",
          };
        })
    );
  };

  // ============================
  // REMOVE COMPLETE MEDIA ROW
  // ============================

  const removeMediaRow = (
    mediaId
  ) => {
    setMediaFiles(
      (prev) => {
        const item =
          prev.find(
            (media) =>
              media.id ===
              mediaId
          );

        if (
          item?.engPreview
        ) {
          URL.revokeObjectURL(
            item.engPreview
          );
        }

        if (
          item?.hinPreview
        ) {
          URL.revokeObjectURL(
            item.hinPreview
          );
        }

        return prev.filter(
          (media) =>
            media.id !==
            mediaId
        );
      }
    );
  };

  // ============================
  // UPLOAD FILE
  // Same flow as your profile
  // ============================

  const uploadFile =
    async (file) => {
      if (!file) {
        return "";
      }

      // STEP 1:
      // Generate signed URL

      const generateResponse =
        await fetch(
          IMAGE_UPLOAD_API,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              {
                fileName:
                  file.name,

                contentType:
                  file.type,
              }
            ),
          }
        );

      const generateData =
        await parseApiResponse(
          generateResponse
        );

      if (
        !generateResponse.ok ||
        !generateData?.success
      ) {
        throw new Error(
          generateData?.message ||
            "Unable to prepare file upload."
        );
      }

      const uploadUrl =
        generateData?.data
          ?.uploadUrl;

      const filePath =
        generateData?.data
          ?.filePath;

      if (
        !uploadUrl ||
        !filePath
      ) {
        throw new Error(
          "Invalid upload response."
        );
      }

      // STEP 2:
      // Upload actual file

      const uploadResponse =
        await fetch(
          uploadUrl,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                file.type,
            },

            body: file,
          }
        );

      if (
        !uploadResponse.ok
      ) {
        throw new Error(
          `Unable to upload ${file.name}`
        );
      }

      // STEP 3:
      // Final S3 URL

      return `${S3_BASE_URL}/${filePath.replace(
        /^\/+/,
        ""
      )}`;
    };

  // ============================
  // SUBMIT
  // ============================

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setError("");
      setSuccess("");

      // ============================
      // VALIDATION
      // ============================

      if (
        !form.titleEng.trim()
      ) {
        setError(
          "English title is required."
        );
        return;
      }

      if (
        !form.titleHin.trim()
      ) {
        setError(
          "Hindi title is required."
        );
        return;
      }

      if (!form.category) {
        setError(
          "Please select a category."
        );
        return;
      }

      if (!form.startDate) {
        setError(
          "Start date is required."
        );
        return;
      }

      if (!form.endDate) {
        setError(
          "End date is required."
        );
        return;
      }

      const startDate =
        new Date(
          form.startDate
        ).getTime();

      const endDate =
        new Date(
          form.endDate
        ).getTime();

      if (
        endDate <
        startDate
      ) {
        setError(
          "End date cannot be before start date."
        );

        return;
      }

      try {
        setLoading(true);

        // ============================
        // BANNERS
        // ============================

        /*
          New file selected:
          upload new file.

          New file NOT selected:
          preserve existing URL.
        */

        const [
          bannerEngUrl,
          bannerHinUrl,
        ] =
          await Promise.all([
            bannerFiles.eng
              ? uploadFile(
                  bannerFiles.eng
                )
              : Promise.resolve(
                  existingBannerUrls.eng
                ),

            bannerFiles.hin
              ? uploadFile(
                  bannerFiles.hin
                )
              : Promise.resolve(
                  existingBannerUrls.hin
                ),
          ]);

        const bannerImageUrl =
          {
            eng:
              bannerEngUrl ||
              "",

            hin:
              bannerHinUrl ||
              "",
          };

        // ============================
        // MEDIA
        // ============================

        const uploadedMedia =
          await Promise.all(
            mediaFiles.map(
              async (
                item
              ) => {
                const [
                  engUrl,
                  hinUrl,
                ] =
                  await Promise.all(
                    [
                      item.eng
                        ? uploadFile(
                            item.eng
                          )
                        : Promise.resolve(
                            item.existingEng ||
                              ""
                          ),

                      item.hin
                        ? uploadFile(
                            item.hin
                          )
                        : Promise.resolve(
                            item.existingHin ||
                              ""
                          ),
                    ]
                  );

                return {
                  eng:
                    engUrl ||
                    "",

                  hin:
                    hinUrl ||
                    "",
                };
              }
            )
          );

        const finalMediaUrls =
          uploadedMedia.filter(
            (item) =>
              item.eng ||
              item.hin
          );

        // ============================
        // VENUE
        // ============================

        const venue = {
          name: {
            eng:
              form.venueNameEng.trim(),

            hin:
              form.venueNameHin.trim(),
          },

          address: {
            eng:
              form.addressEng.trim(),

            hin:
              form.addressHin.trim(),
          },

          city: {
            eng:
              form.cityEng.trim(),

            hin:
              form.cityHin.trim(),
          },

          district: {
            eng:
              form.districtEng.trim(),

            hin:
              form.districtHin.trim(),
          },

          state: {
            eng:
              form.stateEng.trim(),

            hin:
              form.stateHin.trim(),
          },
        };

        // Coordinates optional

        if (
          form.latitude !==
            "" &&
          form.longitude !==
            ""
        ) {
          venue.mapCoordinates =
            {
              lat: Number(
                form.latitude
              ),

              lng: Number(
                form.longitude
              ),
            };
        }

        // Map URL optional

        if (
          form.mapUrl.trim()
        ) {
          venue.mapUrl =
            form.mapUrl.trim();
        }

        // ============================
        // FINAL PAYLOAD
        // ============================

        const payload = {
          title: {
            eng:
              form.titleEng.trim(),

            hin:
              form.titleHin.trim(),
          },

          subTitle: {
            eng:
              form.subTitleEng.trim(),

            hin:
              form.subTitleHin.trim(),
          },

          slug:
            form.slug.trim() ||
            generateSlug(
              form.titleEng
            ),

          category:
            form.category,

          eventType:
            form.eventType,

          description: {
            eng:
              form.descriptionEng.trim(),

            hin:
              form.descriptionHin.trim(),
          },

          // HTML
          content: {
            eng:
              form.contentEng,

            hin:
              form.contentHin,
          },

          bannerImageUrl,

          mediaUrls:
            finalMediaUrls,

          startDate,

          endDate,

          timeDisplay: {
            eng:
              form.timeDisplayEng.trim(),

            hin:
              form.timeDisplayHin.trim(),
          },

          venue,

          isExclusive:
            form.isExclusive,
        };

        console.log(
          "UPDATE EVENT PAYLOAD:",
          payload
        );

        const response =
          await updateEvent(
            id,
            payload
          );

        console.log(
          "UPDATE EVENT RESPONSE:",
          response
        );

        setSuccess(
          response?.message ||
            "Event updated successfully."
        );

        setTimeout(() => {
          router.push(
            `/dashboard/content/events/${id}`
          );
        }, 800);
      } catch (err) {
        console.error(
          "UPDATE EVENT ERROR:",
          err
        );

        setError(
          err?.message ||
            "Unable to update event."
        );
      } finally {
        setLoading(false);
      }
    };

  // ============================
  // LOADING
  // ============================

  if (pageLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-karni-saffron-dark" />

          <p className="mt-3 text-sm font-medium text-slate-500">
            Loading event...
          </p>
        </div>
      </div>
    );
  }

  // ============================
  // UI
  // ============================

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              router.back()
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowLeft
              size={18}
            />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Edit Event
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update event
              information and
              media.
            </p>
          </div>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-6"
      >
        {/* ===================== */}
        {/* BASIC INFO */}
        {/* ===================== */}

        <Section
          title="Basic Information"
          description="Update the basic details of the event."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <FormInput
              label="English Title"
              value={
                form.titleEng
              }
              required
              onChange={(e) =>
                updateField(
                  "titleEng",
                  e.target.value
                )
              }
            />

            <FormInput
              label="Hindi Title"
              value={
                form.titleHin
              }
              required
              onChange={(e) =>
                updateField(
                  "titleHin",
                  e.target.value
                )
              }
            />

            <FormInput
              label="English Subtitle"
              value={
                form.subTitleEng
              }
              onChange={(e) =>
                updateField(
                  "subTitleEng",
                  e.target.value
                )
              }
            />

            <FormInput
              label="Hindi Subtitle"
              value={
                form.subTitleHin
              }
              onChange={(e) =>
                updateField(
                  "subTitleHin",
                  e.target.value
                )
              }
            />

            <FormInput
              label="Slug"
              value={form.slug}
              onChange={(e) =>
                updateField(
                  "slug",
                  generateSlug(
                    e.target.value
                  )
                )
              }
            />

            {/* CATEGORY */}

            <div>
              <FieldLabel
                required
              >
                Category
              </FieldLabel>

              <select
                value={
                  form.category
                }
                required
                onChange={(e) =>
                  updateField(
                    "category",
                    e.target
                      .value
                  )
                }
                className={
                  inputClass
                }
              >
                <option value="">
                  Select
                  Category
                </option>

                {categories.map(
                  (
                    category
                  ) => (
                    <option
                      key={
                        category._id
                      }
                      value={
                        category._id
                      }
                    >
                      {category
                        ?.name
                        ?.eng ||
                        category.slug ||
                        "Category"}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* EVENT TYPE */}

            <div>
              <FieldLabel
                required
              >
                Event Type
              </FieldLabel>

              <select
                value={
                  form.eventType
                }
                required
                onChange={(e) =>
                  updateField(
                    "eventType",
                    e.target
                      .value
                  )
                }
                className={
                  inputClass
                }
              >
                <option value="EVENT">
                  Event
                </option>

                <option value="CAMPAIGN">
                  Campaign
                </option>
              </select>
            </div>
          </div>
        </Section>

        {/* ===================== */}
        {/* DESCRIPTION */}
        {/* ===================== */}

        <Section
          title="Description"
          description="Short event description in both languages."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <FormTextarea
              label="English Description"
              value={
                form.descriptionEng
              }
              onChange={(e) =>
                updateField(
                  "descriptionEng",
                  e.target.value
                )
              }
            />

            <FormTextarea
              label="Hindi Description"
              value={
                form.descriptionHin
              }
              onChange={(e) =>
                updateField(
                  "descriptionHin",
                  e.target.value
                )
              }
            />
          </div>
        </Section>

        {/* ===================== */}
        {/* CONTENT */}
        {/* ===================== */}

        <Section
          title="Event Content"
          description="Rich text content is stored as HTML."
        >
          <div className="space-y-6">
            <div>
              <FieldLabel>
                English Content
              </FieldLabel>

              <RichTextEditor
                value={
                  form.contentEng
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "contentEng",
                    value
                  )
                }
              />
            </div>

            <div>
              <FieldLabel>
                Hindi Content
              </FieldLabel>

              <RichTextEditor
                value={
                  form.contentHin
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "contentHin",
                    value
                  )
                }
              />
            </div>
          </div>
        </Section>

        {/* ===================== */}
        {/* DATE & TIME */}
        {/* ===================== */}

        <Section
          title="Date & Time"
          description="Update event schedule."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <FormInput
              label="Start Date"
              type="datetime-local"
              required
              value={
                form.startDate
              }
              onChange={(e) =>
                updateField(
                  "startDate",
                  e.target.value
                )
              }
            />

            <FormInput
              label="End Date"
              type="datetime-local"
              required
              value={
                form.endDate
              }
              onChange={(e) =>
                updateField(
                  "endDate",
                  e.target.value
                )
              }
            />

            <FormInput
              label="Time Display (English)"
              value={
                form.timeDisplayEng
              }
              placeholder="10:00 AM - 05:00 PM"
              onChange={(e) =>
                updateField(
                  "timeDisplayEng",
                  e.target.value
                )
              }
            />

            <FormInput
              label="Time Display (Hindi)"
              value={
                form.timeDisplayHin
              }
              onChange={(e) =>
                updateField(
                  "timeDisplayHin",
                  e.target.value
                )
              }
            />
          </div>
        </Section>

        {/* ===================== */}
        {/* VENUE */}
        {/* ===================== */}

        <Section
          title="Venue"
          description="Update venue and map information."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <FormInput
              label="Venue Name (English)"
              value={
                form.venueNameEng
              }
              onChange={(e) =>
                updateField(
                  "venueNameEng",
                  e.target.value
                )
              }
            />

            <FormInput
              label="Venue Name (Hindi)"
              value={
                form.venueNameHin
              }
              onChange={(e) =>
                updateField(
                  "venueNameHin",
                  e.target.value
                )
              }
            />

            <FormInput
              label="Address (English)"
              value={
                form.addressEng
              }
              onChange={(e) =>
                updateField(
                  "addressEng",
                  e.target.value
                )
              }
            />

            <FormInput
              label="Address (Hindi)"
              value={
                form.addressHin
              }
              onChange={(e) =>
                updateField(
                  "addressHin",
                  e.target.value
                )
              }
            />

            <FormInput
              label="City (English)"
              value={
                form.cityEng
              }
              onChange={(e) =>
                updateField(
                  "cityEng",
                  e.target.value
                )
              }
            />

            <FormInput
              label="City (Hindi)"
              value={
                form.cityHin
              }
              onChange={(e) =>
                updateField(
                  "cityHin",
                  e.target.value
                )
              }
            />

            <FormInput
              label="District (English)"
              value={
                form.districtEng
              }
              onChange={(e) =>
                updateField(
                  "districtEng",
                  e.target.value
                )
              }
            />

            <FormInput
              label="District (Hindi)"
              value={
                form.districtHin
              }
              onChange={(e) =>
                updateField(
                  "districtHin",
                  e.target.value
                )
              }
            />

            <FormInput
              label="State (English)"
              value={
                form.stateEng
              }
              onChange={(e) =>
                updateField(
                  "stateEng",
                  e.target.value
                )
              }
            />

            <FormInput
              label="State (Hindi)"
              value={
                form.stateHin
              }
              onChange={(e) =>
                updateField(
                  "stateHin",
                  e.target.value
                )
              }
            />

            <FormInput
              label="Latitude"
              type="number"
              step="any"
              value={
                form.latitude
              }
              onChange={(e) =>
                updateField(
                  "latitude",
                  e.target.value
                )
              }
            />

            <FormInput
              label="Longitude"
              type="number"
              step="any"
              value={
                form.longitude
              }
              onChange={(e) =>
                updateField(
                  "longitude",
                  e.target.value
                )
              }
            />

            <div className="md:col-span-2">
              <FormInput
                label="Google Map URL"
                value={
                  form.mapUrl
                }
                onChange={(e) =>
                  updateField(
                    "mapUrl",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </Section>

        {/* ===================== */}
        {/* BANNER */}
        {/* ===================== */}

        <Section
          title="Event Banner"
          description="Existing banner will remain unless you select a new file."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <EditMediaBox
              label="English Banner"
              existingUrl={
                existingBannerUrls.eng
              }
              newFile={
                bannerFiles.eng
              }
              preview={
                bannerPreviews.eng
              }
              onChange={(
                file
              ) =>
                handleBannerChange(
                  "eng",
                  file
                )
              }
              onReset={() =>
                resetBanner(
                  "eng"
                )
              }
            />

            <EditMediaBox
              label="Hindi Banner"
              existingUrl={
                existingBannerUrls.hin
              }
              newFile={
                bannerFiles.hin
              }
              preview={
                bannerPreviews.hin
              }
              onChange={(
                file
              ) =>
                handleBannerChange(
                  "hin",
                  file
                )
              }
              onReset={() =>
                resetBanner(
                  "hin"
                )
              }
            />
          </div>
        </Section>

        {/* ===================== */}
        {/* GALLERY */}
        {/* ===================== */}

        <Section
          title="Media Gallery"
          description="Keep, replace, remove or add event media."
        >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={
                addMediaRow
              }
              className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-karni-saffron-dark"
            >
              <Plus
                size={16}
              />

              Add Media
            </button>
          </div>

          {mediaFiles.length ===
          0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No media added.
            </div>
          ) : (
            <div className="space-y-5">
              {mediaFiles.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      item.id
                    }
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <p className="font-semibold text-slate-800">
                        Media{" "}
                        {index +
                          1}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          removeMediaRow(
                            item.id
                          )
                        }
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600"
                      >
                        <Trash2
                          size={
                            15
                          }
                        />

                        Remove
                      </button>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <EditMediaBox
                        label="English Media"
                        existingUrl={
                          item.existingEng
                        }
                        newFile={
                          item.eng
                        }
                        preview={
                          item.engPreview
                        }
                        onChange={(
                          file
                        ) =>
                          handleMediaChange(
                            item.id,
                            "eng",
                            file
                          )
                        }
                        onReset={() =>
                          resetMediaFile(
                            item.id,
                            "eng"
                          )
                        }
                      />

                      <EditMediaBox
                        label="Hindi Media"
                        existingUrl={
                          item.existingHin
                        }
                        newFile={
                          item.hin
                        }
                        preview={
                          item.hinPreview
                        }
                        onChange={(
                          file
                        ) =>
                          handleMediaChange(
                            item.id,
                            "hin",
                            file
                          )
                        }
                        onReset={() =>
                          resetMediaFile(
                            item.id,
                            "hin"
                          )
                        }
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </Section>

        {/* ===================== */}
        {/* EXCLUSIVE */}
        {/* ===================== */}

        <Section
          title="Settings"
          description="Additional event settings."
        >
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={
                form.isExclusive
              }
              onChange={(e) =>
                updateField(
                  "isExclusive",
                  e.target.checked
                )
              }
              className="h-5 w-5 accent-orange-500"
            />

            <div>
              <p className="font-semibold text-slate-800">
                Exclusive
                Event
              </p>

              <p className="text-sm text-slate-500">
                Mark this
                event as
                exclusive.
              </p>
            </div>
          </label>
        </Section>

        {/* ===================== */}
        {/* ACTIONS */}
        {/* ===================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={() =>
              router.back()
            }
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-karni-saffron-dark px-7 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Updating...
              </>
            ) : (
              <>
                <Save
                  size={18}
                />

                Update Event
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ==================================
// EDIT MEDIA BOX
// ==================================

function EditMediaBox({
  label,
  existingUrl,
  newFile,
  preview,
  onChange,
  onReset,
}) {
  /*
    Priority:

    1. New selected file preview
    2. Existing backend URL
  */

  const displayUrl =
    preview ||
    existingUrl ||
    "";

  const isVideo =
    newFile
      ? newFile.type.startsWith(
          "video/"
        )
      : isVideoUrl(
          displayUrl
        );

  return (
    <div>
      <FieldLabel>
        {label}
      </FieldLabel>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        {displayUrl ? (
          <div className="relative">
            {isVideo ? (
              <video
                src={
                  displayUrl
                }
                controls
                className="h-52 w-full bg-black object-cover"
              />
            ) : (
              <img
                src={
                  displayUrl
                }
                alt={label}
                className="h-52 w-full object-cover"
              />
            )}

            {newFile && (
              <span className="absolute left-3 top-3 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                New File
              </span>
            )}
          </div>
        ) : (
          <div className="flex h-52 items-center justify-center text-sm text-slate-400">
            No media
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 bg-white p-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-karni-saffron-dark">
            <Upload
              size={14}
            />

            {displayUrl
              ? "Replace"
              : "Choose File"}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
              className="hidden"
              onChange={(e) => {
                const file =
                  e.target
                    .files?.[0];

                if (file) {
                  onChange(
                    file
                  );
                }

                // Same file can
                // be selected again
                e.target.value =
                  "";
              }}
            />
          </label>

          {newFile && (
            <button
              type="button"
              onClick={
                onReset
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
            >
              Undo Replace
            </button>
          )}
        </div>
      </div>

      {newFile && (
        <p className="mt-2 truncate text-xs font-medium text-green-600">
          {newFile.name}
        </p>
      )}
    </div>
  );
}

// ==================================
// SECTION
// ==================================

function Section({
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="font-bold text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>

      <div className="space-y-5 p-6">
        {children}
      </div>
    </section>
  );
}

// ==================================
// LABEL
// ==================================

function FieldLabel({
  children,
  required = false,
}) {
  return (
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {children}

      {required && (
        <span className="ml-1 text-red-500">
          *
        </span>
      )}
    </label>
  );
}

// ==================================
// INPUT
// ==================================

function FormInput({
  label,
  required = false,
  ...props
}) {
  return (
    <div>
      <FieldLabel
        required={
          required
        }
      >
        {label}
      </FieldLabel>

      <input
        {...props}
        required={
          required
        }
        className={
          inputClass
        }
      />
    </div>
  );
}

// ==================================
// TEXTAREA
// ==================================

function FormTextarea({
  label,
  ...props
}) {
  return (
    <div>
      <FieldLabel>
        {label}
      </FieldLabel>

      <textarea
        {...props}
        rows={5}
        className={`${inputClass} resize-y`}
      />
    </div>
  );
}

// ==================================
// GENERATE SLUG
// ==================================

function generateSlug(
  value
) {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9\s-]/g,
      ""
    )
    .replace(
      /\s+/g,
      "-"
    )
    .replace(
      /-+/g,
      "-"
    );
}

// ==================================
// DATE -> DATETIME-LOCAL
// ==================================

function formatDateTimeForInput(
  value
) {
  if (!value) {
    return "";
  }

  const date = new Date(
    Number(value)
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  /*
    datetime-local expects:
    YYYY-MM-DDTHH:mm

    toISOString directly use
    karne par timezone shift ho
    sakta hai.

    Isliye local values bana
    rahe hain.
  */

  const pad = (number) =>
    String(number).padStart(
      2,
      "0"
    );

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(
    date.getDate()
  )}T${pad(
    date.getHours()
  )}:${pad(
    date.getMinutes()
  )}`;
}

// ==================================
// VALIDATE MEDIA
// ==================================

function validateMediaFile(
  file
) {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
  ];

  if (
    !allowedTypes.includes(
      file.type
    )
  ) {
    return "Only JPG, PNG, WEBP, MP4 and WEBM files are allowed.";
  }

  // Existing profile upload
  // uses 5MB for images.

  if (
    file.type.startsWith(
      "image/"
    ) &&
    file.size >
      5 * 1024 * 1024
  ) {
    return "Image size cannot exceed 5 MB.";
  }

  /*
    Change this if your backend
    has another video limit.
  */

  if (
    file.type.startsWith(
      "video/"
    ) &&
    file.size >
      50 * 1024 * 1024
  ) {
    return "Video size cannot exceed 50 MB.";
  }

  return "";
}

// ==================================
// VIDEO URL CHECK
// ==================================

function isVideoUrl(url) {
  if (!url) {
    return false;
  }

  return /\.(mp4|webm|mov)(\?.*)?$/i.test(
    url
  );
}

// ==================================
// API RESPONSE PARSER
// ==================================

async function parseApiResponse(
  response
) {
  const contentType =
    response.headers.get(
      "content-type"
    );

  if (
    contentType?.includes(
      "application/json"
    )
  ) {
    return await response.json();
  }

  const text =
    await response.text();

  return {
    message:
      text ||
      `Request failed with status ${response.status}`,
  };
}