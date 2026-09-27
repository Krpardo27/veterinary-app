import ImageUpload, { type ImageUploadProps } from "@/shared/ui/ImageUpload";

export default function ProfessionalImageUpload(props: ImageUploadProps) {
  return <ImageUpload {...props} folderName={props.folderName ?? "professionals"} />;
}

