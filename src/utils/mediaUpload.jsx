import { createClient } from "@supabase/supabase-js";

const url = "https://nprdehrnljcraitludsj.supabase.co";
const key = "sb_publishable_evS5loVhp4Pupxh0xReWlQ_ca26u1JG";
  

const supabase = createClient(url, key);

export default async function mediaUpload(file) {
  if (!file) {
    throw new Error("Choose an image before uploading.");
  }

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("images")
    .upload(fileName, file, {
      upsert: false,
      cacheControl: "3600",
      contentType: file.type || undefined,
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(data.path);
  return publicUrlData.publicUrl;
}