import { firebaseStorageUrl } from '../services/books.service';

/** Published articles from the admin panel's Website Blog (public, cached for a minute). */
export const BLOG_CATALOG_URL = firebaseStorageUrl('blog/catalog.json');
