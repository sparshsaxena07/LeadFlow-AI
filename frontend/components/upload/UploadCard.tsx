import React from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { UploadCloud, Loader2 } from "lucide-react";
import { apiClient } from "@/services/api/client";
import { API_ROUTES } from "@/constants";

interface UploadCardProps {
  onFileUploaded: (data: any, file: File) => void;
  isUploading: boolean;
  setIsUploading: (val: boolean) => void;
}

export function UploadCard({ onFileUploaded, isUploading, setIsUploading }: UploadCardProps) {
  const onDrop = async (acceptedFiles: File[]) => {
    if (isUploading) return;
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds the 10MB limit.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiClient.post(API_ROUTES.UPLOAD, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        toast.success("Upload successful!");
        onFileUploaded(response.data, file);
      } else {
        toast.error("Failed to parse CSV preview.");
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.errors?.[0]?.message || "Failed to process CSV upload. Backend may be offline.";
      toast.error(errMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    disabled: isUploading
  });

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col space-y-6 animate-in fade-in duration-200">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 bg-white shadow-sm ${
          isUploading ? "opacity-60 cursor-not-allowed" : ""
        } ${
          isDragActive
            ? "border-slate-800 bg-slate-50/60"
            : "border-slate-200 hover:border-slate-350"
        }`}
        aria-label="CSV file upload area"
      >
        <input {...getInputProps()} />
        <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-250 flex items-center justify-center text-slate-400 mb-4">
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
          ) : (
            <UploadCloud className="w-6 h-6 text-slate-400" />
          )}
        </div>
        <h3 className="text-sm font-semibold text-slate-850 mb-1">
          {isUploading
            ? "Uploading file..."
            : isDragActive
            ? "Drop the file here..."
            : "Upload your customer list"}
        </h3>
        <p className="text-slate-550 text-xs max-w-xs mb-4">
          Drag and drop your CSV spreadsheet here, or click to browse local files.
        </p>

        <button
          type="button"
          disabled={isUploading}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center space-x-1.5"
          aria-label="Browse local files"
        >
          {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>Browse Files</span>
        </button>

        <div className="mt-6 flex items-center justify-center space-x-6 text-[11px] text-slate-400 border-t border-slate-100 pt-4 w-full">
          <span>CSV format only (.csv)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
          <span>Max size 10MB</span>
        </div>
      </div>
    </div>
  );
}
