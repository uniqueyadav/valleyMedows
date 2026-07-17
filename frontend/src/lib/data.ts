export type Room = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  images: string[];
  capacity: number;
  price_per_night: number;
  sort_order: number;
};

export type GalleryImage = {
  id: string;
  image_url: string;
  caption: string;
  sort_order: number;
};

export const SITE = {
  name: "Valley Medows",
  tagline: "Guest House & Homestay in the heart of Srinagar",
  phone: "+91 94192 02363",
  phoneRaw: "+919419202363",
  phoneAlt: "+91 84920 40407",
  phoneAltRaw: "+918492040407",
  email: "valleymedowskmr@gmail.com",
  address: "Alochi Bagh Rd, near S.D.P school, Elachi Bagh, Srinagar, Jammu and Kashmir 190009",
  landmark: "Near S.D.P School, Elachi Bagh",
  mapsQuery: "Valley Medows Guest House, Alochi Bagh Rd, Elachi Bagh, Srinagar, Jammu and Kashmir 190009",
};

import img1295Url from "@/assets/gallery/IMG_1295.avif";
import img1298Url from "@/assets/gallery/IMG_1298.avif";
import img1300Url from "@/assets/gallery/IMG_1300.avif";
import img1302Url from "@/assets/gallery/IMG_1302.avif";
import img1305Url from "@/assets/gallery/IMG_1305.avif";
import img1307Url from "@/assets/gallery/IMG_1307.avif";
import img1309Url from "@/assets/gallery/IMG_1309.avif";
import img1310Url from "@/assets/gallery/IMG_1310.avif";
import img1320Url from "@/assets/gallery/IMG_1320.avif";
import img1323Url from "@/assets/gallery/IMG_1323.avif";
import img1324Url from "@/assets/gallery/IMG_1324.avif";
import img1326Url from "@/assets/gallery/IMG_1326.avif";
import img1328Url from "@/assets/gallery/IMG_1328.avif";
import img1332Url from "@/assets/gallery/IMG_1332.avif";
import img1330Url from "@/assets/gallery/IMG_1330.avif";
import deluxeAc1Url from "@/assets/rooms/deluxe-ac-1.jpeg";
import deluxeAc2Url from "@/assets/rooms/deluxe-ac-2.jpeg";
import deluxeAc3Url from "@/assets/rooms/deluxe-ac-3.jpeg";

const img1295 = { url: img1295Url };
const img1298 = { url: img1298Url };
const img1300 = { url: img1300Url };
const img1302 = { url: img1302Url };
const img1305 = { url: img1305Url };
const img1307 = { url: img1307Url };
const img1309 = { url: img1309Url };
const img1310 = { url: img1310Url };
const img1320 = { url: img1320Url };
const img1323 = { url: img1323Url };
const img1324 = { url: img1324Url };
const img1326 = { url: img1326Url };
const img1328 = { url: img1328Url };
const img1332 = { url: img1332Url };
const img1330 = { url: img1330Url };
const deluxeAc1 = { url: deluxeAc1Url };
const deluxeAc2 = { url: deluxeAc2Url };
const deluxeAc3 = { url: deluxeAc3Url };

export const ROOMS: Room[] = [
  {
    id: "1",
    name: "Standard Room (Non A/C)",
    description: "7 rooms available. Comfortable wood-finished rooms with complimentary breakfast, fresh linen, and warm Kashmiri hospitality.",
    images: [img1307.url, img1305.url, img1309.url, img1323.url, img1320.url],
    image_url: img1307.url,
    capacity: 2,
    price_per_night: 1500,
    sort_order: 1,
  },
  {
    id: "2",
    name: "Deluxe Room (Non A/C)",
    description: "3 rooms available. Spacious deluxe rooms with elegant interiors, complimentary breakfast and serene garden views.",
    images: [img1324.url, img1326.url, img1328.url, img1310.url, img1300.url],
    image_url: img1324.url,
    capacity: 3,
    price_per_night: 1800,
    sort_order: 2,
  },
  {
    id: "3",
    name: "Deluxe Room (A/C)",
    description: "3 rooms available. Premium air-conditioned deluxe rooms with modern amenities and complimentary breakfast.",
    images: [deluxeAc1.url, deluxeAc2.url, deluxeAc3.url, img1310.url, img1328.url],
    image_url: deluxeAc1.url,
    capacity: 3,
    price_per_night: 2300,
    sort_order: 3,
  },
  {
    id: "4",
    name: "Family Suite (Non A/C)",
    description: "2 suites available. Roomy family suites perfect for groups, with comfortable bedding and complimentary breakfast.",
    images: [img1302.url, img1332.url, img1330.url, img1326.url, img1324.url],
    image_url: img1302.url,
    capacity: 4,
    price_per_night: 2300,
    sort_order: 4,
  },
];

export const GALLERY: GalleryImage[] = [
  { id: "1", image_url: img1295.url, caption: "Valley Medows exterior & garden", sort_order: 1 },
  { id: "2", image_url: img1298.url, caption: "Entrance driveway", sort_order: 2 },
  { id: "3", image_url: img1302.url, caption: "Family suite", sort_order: 3 },
  { id: "4", image_url: img1307.url, caption: "Deluxe room", sort_order: 4 },
  { id: "5", image_url: img1310.url, caption: "Premium deluxe room", sort_order: 5 },
  { id: "6", image_url: img1300.url, caption: "Guest corridor", sort_order: 6 },
  { id: "7", image_url: img1305.url, caption: "Hallway", sort_order: 7 },
  { id: "8", image_url: img1323.url, caption: "Room passage", sort_order: 8 },
  { id: "9", image_url: img1320.url, caption: "Stairway with garden view", sort_order: 9 },
  { id: "10", image_url: img1309.url, caption: "Ensuite bathroom", sort_order: 10 },
  { id: "11", image_url: img1324.url, caption: "Balcony room", sort_order: 11 },
  { id: "12", image_url: img1326.url, caption: "Lounge area", sort_order: 12 },
  { id: "13", image_url: img1328.url, caption: "In-room TV & workspace", sort_order: 13 },
  { id: "14", image_url: img1332.url, caption: "Dining room", sort_order: 14 },
  { id: "15", image_url: img1330.url, caption: "Kitchen & dining area", sort_order: 15 },
];

export async function fetchRooms(): Promise<Room[]> {
  return ROOMS;
}

export async function fetchGallery(): Promise<GalleryImage[]> {
  return GALLERY;
}
