"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  Plus,
  MapPin,
  Languages,
  FileText,
} from "lucide-react";

import {
  createEvent,
  getCategories,
} from "@/services/events";

import RichTextEditor from "@/components/dashboard/events/RichTextEditor";

import CreateCategoryModal from "@/components/dashboard/events/CreateCategoryModal";

const initialForm = {
  titleEng: "",
  titleHin: "",

  subTitleEng: "",
  subTitleHin: "",

  slug: "",

  category: "",
   eventType: "EVENT", // default

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

export default function CreateEventPage() {
  const router = useRouter();

  const [form, setForm] =
    useState(initialForm);

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(true);

  const [
    categoryModal,
    setCategoryModal,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // Media URLs will be connected
  // with /upload API in next step.
 const [bannerFiles, setBannerFiles] =
  useState({
    eng: null,
    hin: null,
  });

const [bannerPreviews, setBannerPreviews] =
  useState({
    eng: "",
    hin: "",
  });


const [mediaFiles, setMediaFiles] =
  useState([]);

  const uploadFile = async (file) => {
  if (!file) {
    return "";
  }

  // STEP 1:
  // Backend se signed upload URL lo

  const generateResponse =
    await fetch(
      IMAGE_UPLOAD_API,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          fileName: file.name,
          contentType:
            file.type,
        }),
      }
    );

  const generateData =
    await generateResponse.json();

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
  // Actual file S3 par upload

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

  if (!uploadResponse.ok) {
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

const validateMediaFile = (
  file
) => {
  if (!file) {
    return "Please select a file.";
  }

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

  // Images: 5 MB
  if (
    file.type.startsWith(
      "image/"
    ) &&
    file.size >
      5 * 1024 * 1024
  ) {
    return "Image size cannot exceed 5 MB.";
  }

  // Videos: currently keeping 50 MB
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
};

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

  setBannerFiles(
    (prev) => ({
      ...prev,
      [language]: file,
    })
  );

  setBannerPreviews(
    (prev) => {
      if (prev[language]) {
        URL.revokeObjectURL(
          prev[language]
        );
      }

      return {
        ...prev,
        [language]:
          URL.createObjectURL(
            file
          ),
      };
    }
  );

  setError("");
};
const addMediaRow = () => {
  setMediaFiles(
    (prev) => [
      ...prev,
      {
        id: Date.now(),
        eng: null,
        hin: null,
      },
    ]
  );
};

const handleMediaChange = (
  id,
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
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [language]:
                file,
            }
          : item
      )
  );

  setError("");
};

const removeMediaRow = (
  id
) => {
  setMediaFiles(
    (prev) =>
      prev.filter(
        (item) =>
          item.id !== id
      )
  );
};
  // =========================
  // LOAD CATEGORIES
  // =========================
  const IMAGE_UPLOAD_API =
  "https://6zq9472qqb.execute-api.ap-south-1.amazonaws.com/upload";

const S3_BASE_URL =
  "https://karni-sena.s3.ap-south-1.amazonaws.com";

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setCategoriesLoading(
          true
        );

        const response =
          await getCategories({
            page: 0,
            limit: 100,
          });

        console.log(
          "CATEGORY RESPONSE:",
          response
        );

        if (ignore) return;

        const result =
          response?.data
            ?.fetchedCategories ||
          response?.data
            ?.categories ||
          response?.data ||
          [];

        const list =
          Array.isArray(result)
            ? result
            : result &&
                typeof result ===
                  "object"
              ? [result]
              : [];

        setCategories(list);
      } catch (err) {
        if (!ignore) {
          setError(
            err?.message ||
              "Unable to load categories."
          );
        }
      } finally {
        if (!ignore) {
          setCategoriesLoading(
            false
          );
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================

  const updateField = (
    key,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTitleChange = (
    value
  ) => {
    setForm((prev) => ({
      ...prev,

      titleEng: value,

      slug:
        !prev.slug ||
        prev.slug ===
          generateSlug(
            prev.titleEng
          )
          ? generateSlug(value)
          : prev.slug,
    }));
  };

  // =========================
  // CATEGORY CREATED
  // =========================

  const handleCategoryCreated =
    async () => {
      try {
        const response =
          await getCategories({
            page: 0,
            limit: 100,
          });

        const result =
          response?.data
            ?.fetchedCategories ||
          response?.data
            ?.categories ||
          response?.data ||
          [];

        const list =
          Array.isArray(result)
            ? result
            : result &&
                typeof result ===
                  "object"
              ? [result]
              : [];

        setCategories(list);

        /*
         * Create category ka exact
         * response milne ke baad
         * newly created category ko
         * automatically select bhi
         * kar denge.
         */
      } catch (err) {
        setError(
          err?.message ||
            "Category created but list could not be refreshed."
        );
      }
    };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  // ==============================
  // VALIDATION
  // ==============================

  if (!form.titleEng.trim()) {
    setError("English title is required.");
    return;
  }

  if (!form.titleHin.trim()) {
    setError("Hindi title is required.");
    return;
  }

  if (!form.category) {
    setError("Please select a category.");
    return;
  }

  if (!form.startDate) {
    setError("Start date is required.");
    return;
  }

  if (!form.endDate) {
    setError("End date is required.");
    return;
  }

  const startDate = new Date(
    form.startDate
  ).getTime();

  const endDate = new Date(
    form.endDate
  ).getTime();

  if (endDate < startDate) {
    setError(
      "End date cannot be before start date."
    );
    return;
  }

  // ==============================
  // VENUE
  // ==============================

  const venue = {
    name: {
      eng: form.venueNameEng.trim(),
      hin: form.venueNameHin.trim(),
    },

    address: {
      eng: form.addressEng.trim(),
      hin: form.addressHin.trim(),
    },

    city: {
      eng: form.cityEng.trim(),
      hin: form.cityHin.trim(),
    },

    district: {
      eng: form.districtEng.trim(),
      hin: form.districtHin.trim(),
    },

    state: {
      eng: form.stateEng.trim(),
      hin: form.stateHin.trim(),
    },
  };

  // ==============================
  // OPTIONAL MAP COORDINATES
  // ==============================

  if (
    form.latitude !== "" &&
    form.longitude !== ""
  ) {
    venue.mapCoordinates = {
      lat: Number(form.latitude),
      lng: Number(form.longitude),
    };
  }

  // ==============================
  // OPTIONAL MAP URL
  // ==============================

  if (form.mapUrl.trim()) {
    venue.mapUrl =
      form.mapUrl.trim();
  }

  try {
    setLoading(true);

    // ==============================
    // 1. UPLOAD BANNERS
    // ==============================

    const [
      bannerEngUrl,
      bannerHinUrl,
    ] = await Promise.all([
      bannerFiles.eng
        ? uploadFile(
            bannerFiles.eng
          )
        : Promise.resolve(""),

      bannerFiles.hin
        ? uploadFile(
            bannerFiles.hin
          )
        : Promise.resolve(""),
    ]);

    const bannerImageUrl = {
      eng: bannerEngUrl,
      hin: bannerHinUrl,
    };

    console.log(
      "UPLOADED BANNERS:",
      bannerImageUrl
    );

    // ==============================
    // 2. UPLOAD MULTIPLE MEDIA
    // ==============================

    const uploadedMedia =
      await Promise.all(
        mediaFiles.map(
          async (item) => {
            const [
              engUrl,
              hinUrl,
            ] =
              await Promise.all([
                item.eng
                  ? uploadFile(
                      item.eng
                    )
                  : Promise.resolve(
                      ""
                    ),

                item.hin
                  ? uploadFile(
                      item.hin
                    )
                  : Promise.resolve(
                      ""
                    ),
              ]);

            return {
              eng: engUrl,
              hin: hinUrl,
            };
          }
        )
      );

    // Empty rows hata do
    const finalMediaUrls =
      uploadedMedia.filter(
        (item) =>
          item.eng ||
          item.hin
      );

    console.log(
      "UPLOADED MEDIA:",
      finalMediaUrls
    );

    // ==============================
    // 3. CREATE FINAL PAYLOAD
    // ==============================

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

      // Selected category ID
      category:
        form.category,

     eventType: form.eventType,

      description: {
        eng:
          form.descriptionEng.trim(),
        hin:
          form.descriptionHin.trim(),
      },

      // Tiptap generated HTML
      content: {
        eng:
          form.contentEng,
        hin:
          form.contentHin,
      },

      // Uploaded S3 URLs
      bannerImageUrl,

      // Multiple uploaded S3 URLs
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
      "CREATE EVENT PAYLOAD:",
      payload
    );

    // ==============================
    // 4. CREATE EVENT
    // ==============================

    const response =
      await createEvent(
        payload
      );

    console.log(
      "CREATE EVENT RESPONSE:",
      response
    );

    // ==============================
    // SUCCESS
    // ==============================

    setSuccess(
      response?.message ||
        "Event created successfully."
    );

    setTimeout(() => {
      router.push(
        "/dashboard/content/events"
      );
    }, 800);
  } catch (err) {
    console.error(
      "CREATE EVENT ERROR:",
      err
    );

    setError(
      err?.message ||
        "Unable to create event."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 pb-12"
      >
        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard/content/events"
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeft
                size={19}
              />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Create Event
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Add event information
                in English and Hindi.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-karni-saffron-dark px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Create Event"}
          </button>
        </div>

        {error && (
          <Message type="error">
            {error}
          </Message>
        )}

        {success && (
          <Message type="success">
            {success}
          </Message>
        )}

        {/* BASIC INFO */}

        <Section
          icon={Languages}
          title="Basic Information"
          description="English and Hindi event details."
        >
          <TwoColumns>
            <Input
              label="English Title"
              required
              value={
                form.titleEng
              }
              onChange={
                handleTitleChange
              }
              placeholder="National Heritage Summit"
            />

            <Input
              label="Hindi Title"
              required
              value={
                form.titleHin
              }
              onChange={(v) =>
                updateField(
                  "titleHin",
                  v
                )
              }
              placeholder="राष्ट्रीय विरासत शिखर सम्मेलन"
            />

            <Input
              label="English Subtitle"
              value={
                form.subTitleEng
              }
              onChange={(v) =>
                updateField(
                  "subTitleEng",
                  v
                )
              }
            />

            <Input
              label="Hindi Subtitle"
              value={
                form.subTitleHin
              }
              onChange={(v) =>
                updateField(
                  "subTitleHin",
                  v
                )
              }
            />
          </TwoColumns>

          <Input
            label="Slug"
            required
            value={form.slug}
            onChange={(v) =>
              updateField(
                "slug",
                generateSlug(v)
              )
            }
            placeholder="national-heritage-summit"
          />

          {/* CATEGORY */}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">
                Category
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <button
                type="button"
                onClick={() =>
                  setCategoryModal(
                    true
                  )
                }
                className="inline-flex items-center gap-1 text-sm font-semibold text-karni-saffron-dark"
              >
                <Plus size={15} />

                Create Category
              </button>
            </div>

            <select
              value={
                form.category
              }
              disabled={
                categoriesLoading
              }
              onChange={(e) =>
                updateField(
                  "category",
                  e.target.value
                )
              }
              className={inputClass}
            >
              <option value="">
                {categoriesLoading
                  ? "Loading categories..."
                  : "Select category"}
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={
                      category._id ||
                      category.id
                    }
                    value={
                      category._id ||
                      category.id
                    }
                  >
                    {category
                      ?.name?.eng ||
                      "Unnamed"}{" "}
                    {category
                      ?.name?.hin
                      ? `- ${category.name.hin}`
                      : ""}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
  <FieldLabel>
    Event Type
    <span className="ml-1 text-red-500">
      *
    </span>
  </FieldLabel>

  <select
    value={form.eventType}
    onChange={(e) =>
      updateField(
        "eventType",
        e.target.value
      )
    }
    className={inputClass}
    required
  >
    <option value="EVENT">
      Event
    </option>

    <option value="CAMPAIGN">
      Campaign
    </option>
  </select>
</div>
        </Section>

        {/* DESCRIPTION */}

        <Section
          icon={FileText}
          title="Description"
          description="Short event description displayed in event cards and summaries."
        >
          <TwoColumns>
            <Textarea
              label="English Description"
              value={
                form.descriptionEng
              }
              onChange={(v) =>
                updateField(
                  "descriptionEng",
                  v
                )
              }
            />

            <Textarea
              label="Hindi Description"
              value={
                form.descriptionHin
              }
              onChange={(v) =>
                updateField(
                  "descriptionHin",
                  v
                )
              }
            />
          </TwoColumns>
        </Section>

        {/* CONTENT */}

        <Section
          icon={FileText}
          title="Event Content"
          description="Format the complete event content using headings, lists, tables and text styles."
        >
          <div>
            <FieldLabel>
              English Content
            </FieldLabel>

            <RichTextEditor
              value={
                form.contentEng
              }
              onChange={(value) =>
                updateField(
                  "contentEng",
                  value
                )
              }
              placeholder="Write complete English event content..."
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
              onChange={(value) =>
                updateField(
                  "contentHin",
                  value
                )
              }
              placeholder="कार्यक्रम की पूरी सामग्री लिखें..."
            />
          </div>
        </Section>

        {/* MEDIA */}

       <Section
  title="Event Media"
  description="Upload event banner and gallery media."
>
  {/* BANNER */}

  <div>
    <h3 className="font-semibold text-slate-800">
      Banner
    </h3>

    <p className="mt-1 text-sm text-slate-500">
      Image or video can be
      uploaded.
    </p>
  </div>

  <div className="grid gap-5 md:grid-cols-2">
    <MediaUploadBox
      label="English Banner"
      file={bannerFiles.eng}
      preview={
        bannerPreviews.eng
      }
      onChange={(file) =>
        handleBannerChange(
          "eng",
          file
        )
      }
    />

    <MediaUploadBox
      label="Hindi Banner"
      file={bannerFiles.hin}
      preview={
        bannerPreviews.hin
      }
      onChange={(file) =>
        handleBannerChange(
          "hin",
          file
        )
      }
    />
  </div>

  {/* GALLERY */}

  <div className="border-t border-slate-100 pt-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-slate-800">
          Media Gallery
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Add multiple images
          or videos.
        </p>
      </div>

      <button
        type="button"
        onClick={addMediaRow}
        className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-karni-saffron-dark"
      >
        <Plus size={16} />

        Add Media
      </button>
    </div>
  </div>

  {mediaFiles.length ===
  0 ? (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
      No gallery media
      added.
    </div>
  ) : (
    <div className="space-y-5">
      {mediaFiles.map(
        (item, index) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-slate-800">
                Media{" "}
                {index + 1}
              </p>

              <button
                type="button"
                onClick={() =>
                  removeMediaRow(
                    item.id
                  )
                }
                className="text-sm font-semibold text-red-600"
              >
                Remove
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <MediaUploadBox
                label="English Media"
                file={item.eng}
                onChange={(
                  file
                ) =>
                  handleMediaChange(
                    item.id,
                    "eng",
                    file
                  )
                }
              />

              <MediaUploadBox
                label="Hindi Media"
                file={item.hin}
                onChange={(
                  file
                ) =>
                  handleMediaChange(
                    item.id,
                    "hin",
                    file
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

        {/* SCHEDULE */}

        <Section
          icon={CalendarDays}
          title="Schedule"
        >
          <TwoColumns>
            <Input
              type="datetime-local"
              label="Start Date & Time"
              required
              value={
                form.startDate
              }
              onChange={(v) =>
                updateField(
                  "startDate",
                  v
                )
              }
            />

            <Input
              type="datetime-local"
              label="End Date & Time"
              required
              value={
                form.endDate
              }
              onChange={(v) =>
                updateField(
                  "endDate",
                  v
                )
              }
            />

            <Input
              label="English Time Display"
              value={
                form.timeDisplayEng
              }
              onChange={(v) =>
                updateField(
                  "timeDisplayEng",
                  v
                )
              }
              placeholder="10:00 AM - 05:00 PM (IST)"
            />

            <Input
              label="Hindi Time Display"
              value={
                form.timeDisplayHin
              }
              onChange={(v) =>
                updateField(
                  "timeDisplayHin",
                  v
                )
              }
              placeholder="सुबह 10:00 - शाम 05:00"
            />
          </TwoColumns>
        </Section>

        {/* VENUE */}

        <Section
          icon={MapPin}
          title="Venue"
        >
          <TwoColumns>
            <Input
              label="Venue Name (English)"
              value={
                form.venueNameEng
              }
              onChange={(v) =>
                updateField(
                  "venueNameEng",
                  v
                )
              }
            />

            <Input
              label="Venue Name (Hindi)"
              value={
                form.venueNameHin
              }
              onChange={(v) =>
                updateField(
                  "venueNameHin",
                  v
                )
              }
            />

            <Input
              label="Address (English)"
              value={
                form.addressEng
              }
              onChange={(v) =>
                updateField(
                  "addressEng",
                  v
                )
              }
            />

            <Input
              label="Address (Hindi)"
              value={
                form.addressHin
              }
              onChange={(v) =>
                updateField(
                  "addressHin",
                  v
                )
              }
            />

            <Input
              label="City (English)"
              value={
                form.cityEng
              }
              onChange={(v) =>
                updateField(
                  "cityEng",
                  v
                )
              }
            />

            <Input
              label="City (Hindi)"
              value={
                form.cityHin
              }
              onChange={(v) =>
                updateField(
                  "cityHin",
                  v
                )
              }
            />

            <Input
              label="District (English)"
              value={
                form.districtEng
              }
              onChange={(v) =>
                updateField(
                  "districtEng",
                  v
                )
              }
            />

            <Input
              label="District (Hindi)"
              value={
                form.districtHin
              }
              onChange={(v) =>
                updateField(
                  "districtHin",
                  v
                )
              }
            />

            <Input
              label="State (English)"
              value={
                form.stateEng
              }
              onChange={(v) =>
                updateField(
                  "stateEng",
                  v
                )
              }
            />

            <Input
              label="State (Hindi)"
              value={
                form.stateHin
              }
              onChange={(v) =>
                updateField(
                  "stateHin",
                  v
                )
              }
            />
          </TwoColumns>

          <div className="border-t border-slate-100 pt-5">
            <h3 className="font-semibold text-slate-800">
              Map Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Optional
            </p>
          </div>

          <TwoColumns>
            <Input
              type="number"
              step="any"
              label="Latitude"
              value={
                form.latitude
              }
              onChange={(v) =>
                updateField(
                  "latitude",
                  v
                )
              }
              placeholder="28.4595"
            />

            <Input
              type="number"
              step="any"
              label="Longitude"
              value={
                form.longitude
              }
              onChange={(v) =>
                updateField(
                  "longitude",
                  v
                )
              }
              placeholder="77.0266"
            />
          </TwoColumns>

          <Input
            label="Google Map URL"
            value={form.mapUrl}
            onChange={(v) =>
              updateField(
                "mapUrl",
                v
              )
            }
            placeholder="https://maps.google.com/..."
          />
        </Section>

        {/* SETTINGS */}

        <Section
          title="Event Settings"
        >
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4">
            <div>
              <p className="font-semibold text-slate-800">
                Exclusive Event
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Mark this event as
                exclusive.
              </p>
            </div>

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
              className="h-5 w-5 accent-orange-600"
            />
          </label>
        </Section>

        {/* BOTTOM SUBMIT */}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/dashboard/content/events"
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-karni-saffron-dark px-7 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading
              ? "Creating Event..."
              : "Create Event"}
          </button>
        </div>
      </form>

      <CreateCategoryModal
        open={categoryModal}
        onClose={() =>
          setCategoryModal(false)
        }
        onCreated={
          handleCategoryCreated
        }
      />
    </>
  );
}

// ==============================
// UI COMPONENTS
// ==============================

function Section({
  title,
  description,
  icon: Icon,
  children,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-karni-saffron-dark">
            <Icon size={19} />
          </div>
        )}

        <div>
          <h2 className="font-bold text-slate-900">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-5 p-6">
        {children}
      </div>
    </section>
  );
}

function TwoColumns({
  children,
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {children}
    </div>
  );
}

function FieldLabel({
  children,
}) {
  return (
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {children}
    </label>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
  step,
}) {
  return (
    <label className="block">
      <FieldLabel>
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </FieldLabel>

      <input
        type={type}
        value={value}
        step={step}
        required={required}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className={inputClass}
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
}) {
  return (
    <label className="block">
      <FieldLabel>
        {label}
      </FieldLabel>

      <textarea
        rows={5}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className={`${inputClass} resize-y`}
      />
    </label>
  );
}

function Message({
  type,
  children,
}) {
  const success =
    type === "success";

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${
        success
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-karni-saffron focus:ring-2 focus:ring-orange-100";

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


function MediaUploadBox({
  label,
  file,
  preview,
  onChange,
}) {
  const isImage =
    file?.type?.startsWith(
      "image/"
    );

  const isVideo =
    file?.type?.startsWith(
      "video/"
    );

  return (
    <div>
      <FieldLabel>
        {label}
      </FieldLabel>

      <label className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 transition hover:border-orange-300 hover:bg-orange-50/30">
        {preview &&
        isImage ? (
          <img
            src={preview}
            alt={label}
            className="h-32 w-full rounded-lg object-cover"
          />
        ) : preview &&
          isVideo ? (
          <video
            src={preview}
            className="h-32 w-full rounded-lg object-cover"
            controls
          />
        ) : (
          <>
            <Plus
              size={25}
              className="text-karni-saffron-dark"
            />

            <p className="mt-2 text-sm font-semibold text-slate-700">
              Choose file
            </p>

            <p className="mt-1 text-xs text-slate-400">
              JPG, PNG, WEBP,
              MP4 or WEBM
            </p>
          </>
        )}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          className="hidden"
          onChange={(e) =>
            onChange(
              e.target
                .files?.[0]
            )
          }
        />
      </label>

      {file && (
        <p className="mt-2 truncate text-xs font-medium text-green-600">
          {file.name}
        </p>
      )}
    </div>
  );
}