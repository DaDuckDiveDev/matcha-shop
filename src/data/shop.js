// The facts about the shop, in one place. Fill in `address`, `mapsUrl` and
// `phone` when the lease is signed; the site shows them wherever they belong.
export const SHOP = {
  opening: new Date(2027, 2, 20),       // Saturday 20 March 2027, the spring equinox
  softFrom: new Date(2027, 2, 11),
  softTo: new Date(2027, 2, 17),
  address: '',                           // e.g. 'Gospodar Jevremova 12, 11000 Beograd'
  mapsUrl: '',                           // the Google Maps link for that address
  phone: '',
  email: 'hello@machiko.rs',
  instagram: 'machiko.beograd',
  hours: '08:00–20:00'
};

export const isOpen = (now = new Date()) => now >= SHOP.opening;
