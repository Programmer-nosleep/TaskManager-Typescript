import React, { useEffect, useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

type ProfilePhotoSelectorProps = {
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function ProfilePhotoSelector({
  image,
  setImage,
  children,
  ...props
}: ProfilePhotoSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewURL, setPreviewURL] = useState<string>("");

  useEffect(() => {
    if (image) {
      const preview = URL.createObjectURL(image);
      setPreviewURL(preview);
      return () => URL.revokeObjectURL(preview); // cleanup
    } else {
      setPreviewURL("");
    }
  }, [image]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
        {...props}
      />

      {!image ? (
        <div
          className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer"
          onClick={onChooseFile}
          title="Upload Photo"
        >
          <LuUser className="text-4xl text-primary" />
          <button
            type="button"
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 cursor-pointer"
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          {previewURL && (
            <img
              src={previewURL}
              alt="Selected profile photo preview"
              className="w-20 h-20 rounded-full object-cover"
            />
          )}
          <button
            type="button"
            onClick={handleRemoveImage}
            title="Remove Photo"
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer"
          >
            <LuTrash />
          </button>
        </div>
      )}

      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}
