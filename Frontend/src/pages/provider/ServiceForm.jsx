import { useContext, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { createService, updateService } from "../../services/ServiceApi";
import { categories } from "../../data/categories";
import { FaImage } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
export default function ServiceForm({ open, onClose, service }) {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const isEdit = !!service;
  const [images, setImages] = useState([]);
  const [imgError, setImgError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      price: "",
      deliveryTime: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (isEdit && service) {
      reset({
        title: service.title,
        description: service.description,
        categoryId: service.categoryId,
        price: service.price,
        deliveryTime: service.deliveryTime,
      });

      setImages(service.images || []);
    } else {
      reset({
        title: "",
        description: "",
        categoryId: "",
        price: "",
        deliveryTime: "",
      });

      setImages([]);
    }

    setImgError("");
  }, [open, service, isEdit, reset]);


  const handleFilePick = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const remaining = 4 - images.length;

    if (remaining <= 0) {
      setImgError("Maximum 4 images allowed");
      return;
    }

    const allowedFiles = files.slice(0, remaining);

    setUploading(true);
    setImgError("");

    try {
      const uploadedUrls = [];

      for (const file of allowedFiles) {
        const formData = new FormData();

        formData.append("file", file);

        const token =
          JSON.parse(localStorage.getItem("user"))
            ?.token;

        const response = await fetch(
          "http://localhost:5242/api/Upload/image",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Image upload failed"
          );
        }

        uploadedUrls.push(data.url);
      }

      setImages((prev) => [...prev, ...uploadedUrls]);

      toast.success("Images uploaded successfully ✅");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }

    e.target.value = "";
  };

  const removeImage = (idx) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== idx)
    );
  };


  const { mutate: submit, isPending } = useMutation({
    mutationFn: async (formData) => {
      const payload = {
        title: formData.title,
        description: formData.description,
        categoryId: Number(formData.categoryId),
        price: Number(formData.price),
        deliveryTime: Number(
          formData.deliveryTime
        ),
        images,
      };
      return isEdit
        ? updateService(service.serviceId, payload)
        : createService(payload);
    },

    onSuccess: () => {
      toast.success(
        isEdit
          ? "Service updated successfully ✅"
          : "Service created successfully ✅"
      );

      queryClient.invalidateQueries({
        queryKey: ["providerServices", user?.id],
      });

      onClose();
    },

    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-indigo-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(99,102,241,0.18)] border border-indigo-100 w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-indigo-50 sticky top-0 bg-white z-10">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">
              Provider Panel
            </p>

            <h2 className="text-lg font-bold text-purple-500">
              {isEdit ? "Edit Service" : "New Service"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-purple-50 text-purple-400 hover:bg-purple-100 hover:text-purple-700 transition flex items-center justify-center cursor-pointer text-sm"
          >
            <RxCross2 />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(submit)}
          className="p-6 flex flex-col gap-5"
        >

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-purple-800 mb-1.5">
              Service Title
            </label>

            <input
              placeholder="e.g. React Frontend Development"
              className="w-full bg-purple-50 border border-purple-200 focus:border-purple-400 rounded-xl px-4 py-2.5 text-sm text-purple-900 placeholder:text-purple-300 outline-none transition"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 5,
                  message: "Min 5 characters",
                },
              })}
            />

            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-purple-800 mb-1.5">
              Description
            </label>

            <textarea
              rows={3}
              placeholder="Describe what you offer..."
              className="w-full bg-purple-50 border border-purple-200 focus:border-purple-400 rounded-xl px-4 py-2.5 text-sm text-purple-900 placeholder:text-purple-300 outline-none transition resize-none"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 20,
                  message: "Min 20 characters",
                },
              })}
            />

            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category + Price + Delivery */}
          <div className="grid grid-cols-3 gap-3">

            {/* CATEGORY */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-1.5">
                Category
              </label>

              <select
                className="w-full bg-purple-50 border border-purple-200 focus:border-purple-400 rounded-xl px-3 py-2.5 text-sm text-purple-900 outline-none transition"
                {...register("categoryId", {
                  required: "Required",
                })}
              >
                <option value="">
                  Select
                </option>

                {categories.map((c) => (
                  <option
                    key={c.id}
                    value={c.id}
                  >
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* PRICE */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-1.5">
                Price ($)
              </label>

              <input
                type="number"
                min={1}
                placeholder="50"
                className="w-full bg-purple-50 border border-purple-200 focus:border-purple-400 rounded-xl px-3 py-2.5 text-sm text-purple-900 placeholder:text-purple-300 outline-none transition"
                {...register("price", {
                  required: "Required",
                  min: {
                    value: 1,
                    message: "Min $1",
                  },
                })}
              />

              {errors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* DELIVERY */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-1.5">
                Delivery (days)
              </label>

              <input
                type="number"
                min={1}
                placeholder="3"
                className="w-full bg-purple-50 border border-purple-200 focus:border-purple-400 rounded-xl px-3 py-2.5 text-sm text-purple-900 placeholder:text-purple-300 outline-none transition"
                {...register("deliveryTime", {
                  required: "Required",
                  min: {
                    value: 1,
                    message: "Min 1 day",
                  },
                })}
              />

              {errors.deliveryTime && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.deliveryTime.message}
                </p>
              )}
            </div>

          </div>

          {/* Images */}
          <div>

            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-purple-800">
                Portfolio Images
              </label>

              <span className="text-xs text-purple-300">
                {images.length} / 4
              </span>
            </div>

            {/* Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-square"
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover rounded-xl border border-purple-100"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      <RxCross2 />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload */}
            {images.length < 4 && (
              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={uploading}
                className="w-full border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50 hover:bg-purple-100 rounded-xl py-6 flex flex-col items-center gap-2 transition cursor-pointer disabled:opacity-60"
              >
                <span className="text-2xl text-purple-500">
                  <FaImage />
                </span>

                <p className="text-sm font-medium text-purple-500">
                  {uploading
                    ? "Uploading..."
                    : "Click to upload images"}
                </p>

                <p className="text-xs text-purple-300">
                  PNG, JPG, WEBP — max 4 images
                </p>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFilePick}
            />

            {imgError && (
              <p className="text-red-500 text-xs mt-1">
                {imgError}
              </p>
            )}
          </div>

          {/* Notice */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <span className="text-amber-500 mt-0.5">
             <IoIosWarning />
            </span>

            <p className="text-xs text-amber-700 leading-relaxed">
              {isEdit
                ? "Editing resets the service to pending."
                : "New services need admin approval."}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-1">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold text-purple-400 hover:text-purple-700 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending || uploading}
              className="px-7 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
            >
              {isPending
                ? "Saving..."
                : isEdit
                ? "Update Service"
                : "Create Service"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}