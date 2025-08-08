import cloudinary from '~/lib/cloudinary';

export async function uploadImageFromFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadRes = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: 'image' }, (err: any, result: any) => {
        if (err || !result) reject(err);
        else resolve(result);
      })
      .end(buffer);
  });

  return {
    url: uploadRes.url,
    publicId: uploadRes.public_id,
  };
}

export async function uploadImageFromUrl(url: string) {
  const uploadRes = await cloudinary.uploader.upload(url, { resource_type: 'image' });
  return {
    url: uploadRes.url,
    publicId: uploadRes.public_id,
  };
}
