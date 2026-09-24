/**
 * Return a 128x128 delivery URL for an original Cloudinary upload.
 * Keep local previews and non-Cloudinary images unchanged.
 * In my test, I uploaded a 3 MB profile picture, and we reduced it to 4.77 kb
 * which is 644x smaller than the uploaded picture. user's profile pic will
 * be loaded almost instantly now that they don't have to wait huge size of
 * profile pic to load on the navbar.
 */
export function getProfilePictureUrl(src: string | null | undefined): string | undefined {
  if (!src) {
    return undefined;
  }

  try {
    const url = new URL(src);

    if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com") {
      return src;
    }

    //Our upload helper returns versioned original URLs.
    //Only transform that format, leaving signed or already transformed URLs alone.
    url.pathname = url.pathname.replace(
      /^(\/[^/]+\/image\/upload\/)(v\d+\/.+)$/,
      "$1c_fill,g_auto,w_128,h_128/f_auto,q_auto/$2"
    );

    return url.toString();
  } catch {
    return src;
  }
}
