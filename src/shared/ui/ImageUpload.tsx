"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { TbPhotoPlus } from "react-icons/tb";

function randomUploadId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type ImageUploadProps = {
  image?: string | null;
  inputName?: string;
  label?: string;
  alt?: string;
  folderName?: string;
  initialName?: string | null;
  nameInputId?: string;
};

export default function ImageUpload({
  image,
  inputName = "imageUrl",
  label = "Imagen",
  alt = "Imagen subida",
  folderName,
  initialName,
  nameInputId = "name",
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [itemName, setItemName] = useState(initialName?.trim() ?? "");
  const [uploadId, setUploadId] = useState(() => randomUploadId());
  const currentImage = imageUrl || image || "";

  useEffect(() => {
    const nameInput = document.getElementById(nameInputId) as HTMLInputElement | null;

    if (!nameInput) {
      return;
    }

    const handleNameChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      setItemName(target.value);
    };

    nameInput.addEventListener("change", handleNameChange);

    return () => {
      nameInput.removeEventListener("change", handleNameChange);
    };
  }, [nameInputId]);

  const itemSlug = useMemo(() => slugify(itemName), [itemName]);

  const baseFolder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "veterinaria";

  const relativeFolderPath = useMemo(() => {
    const pathSegments = [folderName, itemSlug].filter(Boolean);

    return pathSegments.join("/");
  }, [folderName, itemSlug]);

  const folderPath = useMemo(() => {
    const pathSegments = [baseFolder, relativeFolderPath].filter(Boolean);

    return pathSegments.join("/");
  }, [baseFolder, relativeFolderPath]);

  const publicId = useMemo(() => {
    return relativeFolderPath ? `${relativeFolderPath}/${uploadId}` : uploadId;
  }, [relativeFolderPath, uploadId]);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "veterinary-app";

  if (!cloudName) {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-zinc-700">
          {label}
        </label>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Configura NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME para habilitar la subida de imagenes.
        </div>

        <input type="hidden" name={inputName} value={currentImage} />
      </div>
    );
  }

  return (
    <CldUploadWidget
      config={{ cloud: { cloudName } }}
      uploadPreset={uploadPreset}
      options={{
        maxFiles: 1,
        folder: baseFolder,
        publicId,
        resourceType: "image",
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        maxImageFileSize: 10000000,
      }}
      onSuccess={(result, { widget }) => {
        if (result.event !== "success") return;

        widget.close();

        const info = result.info;

        if (
          info &&
          typeof info === "object" &&
          "secure_url" in info &&
          typeof info.secure_url === "string"
        ) {
          setImageUrl(info.secure_url);
          setUploadId(randomUploadId());
        }
      }}
    >
      {({ open }) => (
        <>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-700">
              {label}
            </label>

            <button
              type="button"
              onClick={() => open()}
              className="relative flex min-h-65 w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition-all duration-300 hover:border-[#0F766E]/40 hover:bg-[#0F766E]/5"
            >
              {!currentImage && (
                <>
                  <TbPhotoPlus size={42} className="text-zinc-400" />

                  <span className="space-y-1 text-center">
                    <span className="block text-sm font-medium text-zinc-700">
                      Subir imagen
                    </span>

                    <span className="block text-xs text-zinc-500">
                      JPG, PNG o WEBP · max 10MB
                    </span>

                    <span className="block text-xs text-zinc-400">
                      Carpeta: {folderPath}
                    </span>
                  </span>
                </>
              )}

              {currentImage && (
                <span className="absolute inset-0 block h-full w-full">
                  <Image
                    src={currentImage}
                    alt={alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="rounded-2xl object-contain p-4"
                  />
                </span>
              )}
            </button>
          </div>

          <input type="hidden" name={inputName} value={currentImage} />
        </>
      )}
    </CldUploadWidget>
  );
}