export type RatingKey = 'waste' | 'timepass' | 'good' | 'masterpiece';

export const RATING_LABELS: Record<RatingKey, string> = {
  waste: 'Waste of Time',
  timepass: 'Time Pass',
  good: 'Good Watch',
  masterpiece: 'Masterpiece'
};

export const RATING_COLORS: Record<RatingKey, string> = {
  waste: '#ef4444',
  timepass: '#f97316',
  good: '#eab308',
  masterpiece: '#22c55e'
};

export interface CastMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface Review {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  rating: RatingKey;
  comment: string;
  date: string;
  isOwn?: boolean;
}

export interface ContentItem {
  id: string;
  title: string;
  release_date?:string
  _id?:string;
  year: number;
  genre: string[];
  type: 'Movie' | 'Series';
  runtime: string;
  director: string;
  poster: string;
  backdrop: string;
  description: string;
  platforms: string[];
  cast: CastMember[];
  reviews: Review[];
  ratingDistribution: Record<RatingKey, number>;
  aggregateRating: RatingKey;
}

export interface WatchlistEntry {
  id: string;
  contentId: string;
  status: 'watched' | 'watching' | 'watchlater';
  dateAdded: string;
  personalRating?: RatingKey;
  progress?: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  items: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FriendUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  avatarImage?: string;
  currentlyWatching: string;
  watchlist: { contentId: string; status: 'watched' | 'watching' | 'watchlater' }[];
  playlists: { id: string; name: string; items: string[] }[];
}

export const allContent: ContentItem[] = [
{
  id: 'content-001',
  title: 'Oppenheimer',
  year: 2023,
  genre: ['Biography', 'Drama', 'History'],
  type: 'Movie',
  runtime: '3h 0m',
  director: 'Christopher Nolan',
  poster: "https://img.rocket.new/generatedImages/rocket_gen_img_187cdfc6d-1781247778159.png",
  backdrop: "https://img.rocket.new/generatedImages/rocket_gen_img_187cdfc6d-1781247778159.png",
  description: 'The story of J. Robert Oppenheimer\'s role in the development of the atomic bomb during World War II. A haunting portrait of brilliance, moral compromise, and the weight of creation.',
  platforms: ['Prime Video', 'Peacock'],
  cast: [
  { id: 'cast-001-1', name: 'Cillian Murphy', role: 'J. Robert Oppenheimer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  { id: 'cast-001-2', name: 'Emily Blunt', role: 'Katherine Oppenheimer', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { id: 'cast-001-3', name: 'Matt Damon', role: 'Gen. Leslie Groves', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
  { id: 'cast-001-4', name: 'Robert Downey Jr.', role: 'Lewis Strauss', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' }],

  reviews: [
  { id: 'rev-001-1', userId: 'user-self', username: 'Arjun Rao', avatar: 'AR', rating: 'masterpiece', comment: 'Nolan at his absolute peak. The IMAX sequences are transcendent. Cillian Murphy deserved every award he got.', date: 'May 28, 2026', isOwn: true },
  { id: 'rev-001-2', userId: 'user-002', username: 'Priya Sharma', avatar: 'PS', rating: 'good', comment: 'Visually stunning but the 3 hour runtime is felt. The Trinity test scene alone is worth the watch.', date: 'Jun 02, 2026' },
  { id: 'rev-001-3', userId: 'user-003', username: 'Dev Mehta', avatar: 'DM', rating: 'timepass', comment: 'Too slow in the second act. The courtroom scenes drag on.', date: 'Jun 05, 2026' }],

  ratingDistribution: { waste: 4, timepass: 12, good: 31, masterpiece: 53 },
  aggregateRating: 'masterpiece'
},
{
  id: 'content-002',
  title: 'Mirzapur',
  year: 2018,
  genre: ['Crime', 'Drama', 'Thriller'],
  type: 'Series',
  runtime: '3 Seasons',
  director: 'Karan Anshuman',
  poster: "https://img.rocket.new/generatedImages/rocket_gen_img_11d1dae22-1772443050954.png",
  backdrop: "https://img.rocket.new/generatedImages/rocket_gen_img_11d1dae22-1772443050954.png",
  description: 'A gritty crime drama set in the heartland of India, following the power struggle between criminal dynasties across Mirzapur. Raw, violent, and compulsively watchable.',
  platforms: ['Prime Video'],
  cast: [
  { id: 'cast-002-1', name: 'Pankaj Tripathi', role: 'Kaleen Bhaiya', image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80' },
  { id: 'cast-002-2', name: 'Ali Fazal', role: 'Guddu Pandit', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80' },
  { id: 'cast-002-3', name: 'Divyenndu', role: 'Munna Bhaiya', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80' }],

  reviews: [
  { id: 'rev-002-1', userId: 'user-002', username: 'Priya Sharma', avatar: 'PS', rating: 'masterpiece', comment: 'Pankaj Tripathi is absolutely terrifying. Season 1 is flawless television.', date: 'Jun 01, 2026' }],

  ratingDistribution: { waste: 2, timepass: 8, good: 35, masterpiece: 55 },
  aggregateRating: 'masterpiece'
},
{
  id: 'content-003',
  title: 'Dune: Part Two',
  year: 2024,
  genre: ['Sci-Fi', 'Adventure', 'Drama'],
  type: 'Movie',
  runtime: '2h 46m',
  director: 'Denis Villeneuve',
  poster: "https://img.rocket.new/generatedImages/rocket_gen_img_16221970c-1766888767711.png",
  backdrop: "https://img.rocket.new/generatedImages/rocket_gen_img_16221970c-1766888767711.png",
  description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Epic sci-fi filmmaking at its grandest scale.',
  platforms: ['Max', 'Apple TV+'],
  cast: [
  { id: 'cast-003-1', name: 'Timothée Chalamet', role: 'Paul Atreides', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80' },
  { id: 'cast-003-2', name: 'Zendaya', role: 'Chani', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
  { id: 'cast-003-3', name: 'Austin Butler', role: 'Feyd-Rautha', image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&q=80' }],

  reviews: [
  { id: 'rev-003-1', userId: 'user-self', username: 'Arjun Rao', avatar: 'AR', rating: 'masterpiece', comment: 'Villeneuve is a generational filmmaker. The sandworm riding sequence is cinema history.', date: 'Jun 10, 2026', isOwn: true }],

  ratingDistribution: { waste: 3, timepass: 10, good: 38, masterpiece: 49 },
  aggregateRating: 'masterpiece'
},
{
  id: 'content-004',
  title: 'The Bear',
  year: 2022,
  genre: ['Drama', 'Comedy'],
  type: 'Series',
  runtime: '3 Seasons',
  director: 'Christopher Storer',
  poster: "https://img.rocket.new/generatedImages/rocket_gen_img_127ce6daf-1776172712063.png",
  backdrop: "https://img.rocket.new/generatedImages/rocket_gen_img_127ce6daf-1776172712063.png",
  description: 'A young chef returns to Chicago to run his family\'s sandwich shop after his brother\'s death, navigating grief, chaos, and the brutal world of professional kitchens.',
  platforms: ['Disney+ Hotstar'],
  cast: [
  { id: 'cast-004-1', name: 'Jeremy Allen White', role: 'Carmy Berzatto', image: 'https://images.unsplash.com/photo-1487309078313-fad80c3ec1e5?w=100&q=80' },
  { id: 'cast-004-2', name: 'Ayo Edebiri', role: 'Sydney Adamu', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80' }],

  reviews: [
  { id: 'rev-004-1', userId: 'user-003', username: 'Dev Mehta', avatar: 'DM', rating: 'masterpiece', comment: 'The "Review" episode of season 2 is the greatest 30 minutes of TV I have ever seen.', date: 'May 20, 2026' }],

  ratingDistribution: { waste: 1, timepass: 5, good: 28, masterpiece: 66 },
  aggregateRating: 'masterpiece'
},
{
  id: 'content-005',
  title: 'Killers of the Flower Moon',
  year: 2023,
  genre: ['Crime', 'Drama', 'History'],
  type: 'Movie',
  runtime: '3h 26m',
  director: 'Martin Scorsese',
  poster: "https://img.rocket.new/generatedImages/rocket_gen_img_1f5ad5f52-1777516198856.png",
  backdrop: "https://img.rocket.new/generatedImages/rocket_gen_img_1f5ad5f52-1777516198856.png",
  description: 'When oil is discovered in 1920s Oklahoma under Osage Nation land, the Osage people are murdered one by one. A devastating true crime epic from Scorsese.',
  platforms: ['Apple TV+'],
  cast: [
  { id: 'cast-005-1', name: 'Leonardo DiCaprio', role: 'Ernest Burkhart', image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&q=80' },
  { id: 'cast-005-2', name: 'Robert De Niro', role: 'William Hale', image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&q=80' }],

  reviews: [],
  ratingDistribution: { waste: 6, timepass: 18, good: 42, masterpiece: 34 },
  aggregateRating: 'good'
},
{
  id: 'content-006',
  title: 'Scam 1992',
  year: 2020,
  genre: ['Biography', 'Crime', 'Drama'],
  type: 'Series',
  runtime: '1 Season',
  director: 'Hansal Mehta',
  poster: "https://img.rocket.new/generatedImages/rocket_gen_img_1d1697a01-1763295611414.png",
  backdrop: "https://img.rocket.new/generatedImages/rocket_gen_img_1d1697a01-1763295611414.png",
  description: 'The story of Harshad Mehta, a stockbroker who single-handedly took the stock market to dizzying heights and caused a never-before-seen scam worth Rs. 5,000 crores.',
  platforms: ['SonyLIV'],
  cast: [
  { id: 'cast-006-1', name: 'Pratik Gandhi', role: 'Harshad Mehta', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' }],

  reviews: [
  { id: 'rev-006-1', userId: 'user-self', username: 'Arjun Rao', avatar: 'AR', rating: 'masterpiece', comment: 'Pratik Gandhi is phenomenal. Best Indian web series ever made, period.', date: 'Apr 15, 2026', isOwn: true }],

  ratingDistribution: { waste: 1, timepass: 4, good: 22, masterpiece: 73 },
  aggregateRating: 'masterpiece'
},
{
  id: 'content-007',
  title: 'Past Lives',
  year: 2023,
  genre: ['Drama', 'Romance'],
  type: 'Movie',
  runtime: '1h 46m',
  director: 'Celine Song',
  poster: "https://images.unsplash.com/photo-1713282505532-e8b241bc0b5a",
  backdrop: "https://images.unsplash.com/photo-1713282505532-e8b241bc0b5a",
  description: 'Two childhood sweethearts from Korea are separated when one emigrates to America. Twenty years later, they reunite in New York for one final week. A quiet, devastating masterpiece.',
  platforms: ['MUBI', 'Prime Video'],
  cast: [
  { id: 'cast-007-1', name: 'Greta Lee', role: 'Nora Moon', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' },
  { id: 'cast-007-2', name: 'Teo Yoo', role: 'Hae Sung', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' }],

  reviews: [],
  ratingDistribution: { waste: 8, timepass: 15, good: 40, masterpiece: 37 },
  aggregateRating: 'good'
},
{
  id: 'content-008',
  title: 'Succession',
  year: 2018,
  genre: ['Drama', 'Comedy'],
  type: 'Series',
  runtime: '4 Seasons',
  director: 'Jesse Armstrong',
  poster: "https://img.rocket.new/generatedImages/rocket_gen_img_1e8447b31-1778218745346.png",
  backdrop: "https://img.rocket.new/generatedImages/rocket_gen_img_1e8447b31-1778218745346.png",
  description: 'The Roy family controls one of the biggest media and entertainment conglomerates in the world. But the question of who will succeed their aging patriarch Logan Roy is tearing them apart.',
  platforms: ['Max', 'JioCinema'],
  cast: [
  { id: 'cast-008-1', name: 'Brian Cox', role: 'Logan Roy', image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&q=80' },
  { id: 'cast-008-2', name: 'Jeremy Strong', role: 'Kendall Roy', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' }],

  reviews: [
  { id: 'rev-008-1', userId: 'user-002', username: 'Priya Sharma', avatar: 'PS', rating: 'masterpiece', comment: 'The best TV show of the decade. "Boar on the Floor" is iconic.', date: 'Jun 08, 2026' }],

  ratingDistribution: { waste: 2, timepass: 6, good: 24, masterpiece: 68 },
  aggregateRating: 'masterpiece'
},
{
  id: 'content-009',
  title: 'Poor Things',
  year: 2023,
  genre: ['Comedy', 'Drama', 'Fantasy'],
  type: 'Movie',
  runtime: '2h 21m',
  director: 'Yorgos Lanthimos',
  poster: "https://img.rocket.new/generatedImages/rocket_gen_img_1e0a7cb36-1778958339261.png",
  backdrop: "https://img.rocket.new/generatedImages/rocket_gen_img_1e0a7cb36-1778958339261.png",
  description: 'The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by an unorthodox scientist. A surreal feminist odyssey.',
  platforms: ['Disney+ Hotstar'],
  cast: [
  { id: 'cast-009-1', name: 'Emma Stone', role: 'Bella Baxter', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80' },
  { id: 'cast-009-2', name: 'Mark Ruffalo', role: 'Duncan Wedderburn', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80' }],

  reviews: [],
  ratingDistribution: { waste: 12, timepass: 20, good: 38, masterpiece: 30 },
  aggregateRating: 'good'
},
{
  id: 'content-010',
  title: 'Panchayat',
  year: 2020,
  genre: ['Comedy', 'Drama'],
  type: 'Series',
  runtime: '3 Seasons',
  director: 'Deepak Kumar Mishra',
  poster: "https://img.rocket.new/generatedImages/rocket_gen_img_1c2b1f2a1-1781247776413.png",
  backdrop: "https://img.rocket.new/generatedImages/rocket_gen_img_1c2b1f2a1-1781247776413.png",
  description: 'An engineering graduate, unable to find a better job, reluctantly joins as secretary of a panchayat office in a remote village of Uttar Pradesh. Heartwarming slice-of-life storytelling.',
  platforms: ['Prime Video'],
  cast: [
  { id: 'cast-010-1', name: 'Jitendra Kumar', role: 'Abhishek Tripathi', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80' },
  { id: 'cast-010-2', name: 'Raghubir Yadav', role: 'Brij Bhushan Dubey', image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80' }],

  reviews: [
  { id: 'rev-010-1', userId: 'user-003', username: 'Dev Mehta', avatar: 'DM', rating: 'masterpiece', comment: 'The most wholesome show on Indian OTT. Season 3 made me cry.', date: 'May 30, 2026' }],

  ratingDistribution: { waste: 2, timepass: 8, good: 30, masterpiece: 60 },
  aggregateRating: 'masterpiece'
},
{
  id: 'content-011',
  title: 'Godzilla x Kong',
  year: 2024,
  genre: ['Action', 'Sci-Fi'],
  type: 'Movie',
  runtime: '1h 55m',
  director: 'Adam Wingard',
  poster: "https://img.rocket.new/generatedImages/rocket_gen_img_15e3fdd8c-1777635357770.png",
  backdrop: "https://img.rocket.new/generatedImages/rocket_gen_img_15e3fdd8c-1777635357770.png",
  description: 'The epic battle continues as Godzilla and Kong must unite against a colossal undiscovered threat hidden within our world, challenging their very existence.',
  platforms: ['Max'],
  cast: [
  { id: 'cast-011-1', name: 'Rebecca Hall', role: 'Dr. Ilene Andrews', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' }],

  reviews: [],
  ratingDistribution: { waste: 20, timepass: 42, good: 28, masterpiece: 10 },
  aggregateRating: 'timepass'
},
{
  id: 'content-012',
  title: 'Dark',
  year: 2017,
  genre: ['Sci-Fi', 'Thriller', 'Mystery'],
  type: 'Series',
  runtime: '3 Seasons',
  director: 'Baran bo Odar',
  poster: "https://img.rocket.new/generatedImages/rocket_gen_img_1ad1583b4-1773583586879.png",
  backdrop: "https://img.rocket.new/generatedImages/rocket_gen_img_1ad1583b4-1773583586879.png",
  description: 'A missing child sets off a chain of events that reveals the town of Winden\'s sinister secrets and complex time travel across four eras. The most intricate story ever told on television.',
  platforms: ['Netflix'],
  cast: [
  { id: 'cast-012-1', name: 'Louis Hofmann', role: 'Jonas Kahnwald', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80' }],

  reviews: [
  { id: 'rev-012-1', userId: 'user-self', username: 'Arjun Rao', avatar: 'AR', rating: 'masterpiece', comment: 'Nothing comes close. The family tree alone is a work of art. Required viewing for every sci-fi fan.', date: 'Mar 12, 2026', isOwn: true }],

  ratingDistribution: { waste: 1, timepass: 3, good: 18, masterpiece: 78 },
  aggregateRating: 'masterpiece'
},
{
  id: 'content-013',
  title: 'Saltburn',
  year: 2023,
  genre: ['Drama', 'Thriller'],
  type: 'Movie',
  runtime: '2h 11m',
  director: 'Emerald Fennell',
  poster: "https://img.rocket.new/generatedImages/rocket_gen_img_1e9bd1be8-1781086901995.png",
  backdrop: "https://img.rocket.new/generatedImages/rocket_gen_img_1e9bd1be8-1781086901995.png",
  description: 'A student at Oxford becomes enamored with a charming but enigmatic classmate who invites him to his family\'s sprawling estate for the summer. Nothing is what it seems.',
  platforms: ['Prime Video'],
  cast: [
  { id: 'cast-013-1', name: 'Barry Keoghan', role: 'Oliver Quick', image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&q=80' },
  { id: 'cast-013-2', name: 'Jacob Elordi', role: 'Felix Catton', image: 'https://images.unsplash.com/photo-1487309078313-fad80c3ec1e5?w=100&q=80' }],

  reviews: [],
  ratingDistribution: { waste: 15, timepass: 28, good: 35, masterpiece: 22 },
  aggregateRating: 'good'
},
{
  id: 'content-014',
  title: 'Heeramandi',
  year: 2024,
  genre: ['Drama', 'Romance', 'History'],
  type: 'Series',
  runtime: '1 Season',
  director: 'Sanjay Leela Bhansali',
  poster: "https://images.unsplash.com/photo-1587538018365-2a1f8b544c08",
  backdrop: "https://images.unsplash.com/photo-1587538018365-2a1f8b544c08",
  description: 'Set in pre-independence India, the story of courtesans in the Diamond Bazaar of Lahore who fight for freedom and dignity while navigating love, betrayal, and the independence movement.',
  platforms: ['Netflix'],
  cast: [
  { id: 'cast-014-1', name: 'Manisha Koirala', role: 'Mallikajaan', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' },
  { id: 'cast-014-2', name: 'Sonakshi Sinha', role: 'Fareedan', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' }],

  reviews: [],
  ratingDistribution: { waste: 8, timepass: 22, good: 45, masterpiece: 25 },
  aggregateRating: 'good'
},
{
  id: 'content-015',
  title: 'The Substance',
  year: 2024,
  genre: ['Horror', 'Sci-Fi', 'Drama'],
  type: 'Movie',
  runtime: '2h 21m',
  director: 'Coralie Fargeat',
  poster: "https://img.rocket.new/generatedImages/rocket_gen_img_11578e4a5-1781247777844.png",
  backdrop: "https://img.rocket.new/generatedImages/rocket_gen_img_11578e4a5-1781247777844.png",
  description: 'A celebrity uses a mysterious substance that can create a better, younger, and more perfect version of herself. The most visceral and unforgettable body horror film in years.',
  platforms: ['MUBI', 'Apple TV+'],
  cast: [
  { id: 'cast-015-1', name: 'Demi Moore', role: 'Elisabeth Sparkle', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80' },
  { id: 'cast-015-2', name: 'Margaret Qualley', role: 'Sue', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' }],

  reviews: [],
  ratingDistribution: { waste: 10, timepass: 18, good: 32, masterpiece: 40 },
  aggregateRating: 'masterpiece'
},
{
  id: 'content-016',
  title: 'Kota Factory',
  year: 2019,
  genre: ['Drama', 'Comedy'],
  type: 'Series',
  runtime: '3 Seasons',
  director: 'Raghav Subbu',
  poster: "https://img.rocket.new/generatedImages/rocket_gen_img_1f899eb56-1781247777091.png",
  backdrop: "https://img.rocket.new/generatedImages/rocket_gen_img_1f899eb56-1781247777091.png",
  description: 'Set in the coaching capital of India, this black-and-white series follows students preparing for IIT-JEE while navigating pressure, friendship, and the search for purpose.',
  platforms: ['Netflix'],
  cast: [
  { id: 'cast-016-1', name: 'Mayur More', role: 'Vaibhav Pandey', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80' },
  { id: 'cast-016-2', name: 'Jitendra Kumar', role: 'Jeetu Bhaiya', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80' }],

  reviews: [],
  ratingDistribution: { waste: 3, timepass: 10, good: 32, masterpiece: 55 },
  aggregateRating: 'masterpiece'
},
{
  id: 'content-017',
  title: 'Challengers',
  year: 2024,
  genre: ['Drama', 'Romance', 'Sport'],
  type: 'Movie',
  runtime: '2h 11m',
  director: 'Luca Guadagnino',
  poster: "https://img.rocket.new/generatedImages/rocket_gen_img_19291e050-1767618835425.png",
  backdrop: "https://img.rocket.new/generatedImages/rocket_gen_img_19291e050-1767618835425.png",
  description: 'Tashi, a former tennis prodigy turned coach, has taken her husband\'s career to its heights. But when he faces his former best friend at a challenger tournament, old tensions resurface.',
  platforms: ['Prime Video'],
  cast: [
  { id: 'cast-017-1', name: 'Zendaya', role: 'Tashi Duncan', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
  { id: 'cast-017-2', name: 'Josh O\'Connor', role: 'Patrick Zweig', image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&q=80' }],

  reviews: [],
  ratingDistribution: { waste: 5, timepass: 18, good: 44, masterpiece: 33 },
  aggregateRating: 'good'
},
{
  id: 'content-018',
  title: 'Paatal Lok',
  year: 2020,
  genre: ['Crime', 'Thriller', 'Drama'],
  type: 'Series',
  runtime: '2 Seasons',
  director: 'Avinash Arun',
  poster: "https://img.rocket.new/generatedImages/rocket_gen_img_1a3231858-1773838887903.png",
  backdrop: "https://img.rocket.new/generatedImages/rocket_gen_img_1a3231858-1773838887903.png",
  description: 'A seemingly routine case of a journalist\'s assassination attempt leads a Delhi cop into the underbelly of society across three worlds — heaven, earth, and hell.',
  platforms: ['Prime Video'],
  cast: [
  { id: 'cast-018-1', name: 'Jaideep Ahlawat', role: 'Hathiram Chaudhary', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' }],

  reviews: [],
  ratingDistribution: { waste: 3, timepass: 9, good: 36, masterpiece: 52 },
  aggregateRating: 'masterpiece'
}];


export const mockWatchlist: WatchlistEntry[] = [
{ id: 'wl-001', contentId: 'content-001', status: 'watched', dateAdded: 'Jun 10, 2026', personalRating: 'masterpiece' },
{ id: 'wl-002', contentId: 'content-003', status: 'watched', dateAdded: 'Jun 08, 2026', personalRating: 'masterpiece' },
{ id: 'wl-003', contentId: 'content-006', status: 'watched', dateAdded: 'Apr 15, 2026', personalRating: 'masterpiece' },
{ id: 'wl-004', contentId: 'content-012', status: 'watched', dateAdded: 'Mar 12, 2026', personalRating: 'masterpiece' },
{ id: 'wl-005', contentId: 'content-002', status: 'watching', dateAdded: 'Jun 05, 2026', progress: 65 },
{ id: 'wl-006', contentId: 'content-004', status: 'watching', dateAdded: 'Jun 01, 2026', progress: 80 },
{ id: 'wl-007', contentId: 'content-010', status: 'watching', dateAdded: 'May 28, 2026', progress: 40 },
{ id: 'wl-008', contentId: 'content-005', status: 'watchlater', dateAdded: 'Jun 11, 2026' },
{ id: 'wl-009', contentId: 'content-008', status: 'watchlater', dateAdded: 'Jun 09, 2026' },
{ id: 'wl-010', contentId: 'content-015', status: 'watchlater', dateAdded: 'Jun 07, 2026' },
{ id: 'wl-011', contentId: 'content-017', status: 'watchlater', dateAdded: 'Jun 06, 2026' },
{ id: 'wl-012', contentId: 'content-018', status: 'watchlater', dateAdded: 'Jun 04, 2026' }];


export const mockPlaylists: Playlist[] = [
{
  id: 'playlist-001',
  name: 'Nolan Universe',
  description: 'Every Christopher Nolan film, ranked and revisited.',
  items: ['content-001', 'content-003'],
  createdAt: 'Apr 01, 2026',
  updatedAt: 'Jun 10, 2026'
},
{
  id: 'playlist-002',
  name: 'Indian OTT Gems',
  description: 'The best of Indian web series — no Bollywood fluff.',
  items: ['content-002', 'content-006', 'content-010', 'content-016', 'content-018'],
  createdAt: 'Mar 15, 2026',
  updatedAt: 'Jun 05, 2026'
},
{
  id: 'playlist-003',
  name: 'Watch on a Rainy Night',
  description: 'Dark, moody films for when the weather matches your soul.',
  items: ['content-012', 'content-013', 'content-015'],
  createdAt: 'May 20, 2026',
  updatedAt: 'Jun 07, 2026'
},
{
  id: 'playlist-004',
  name: 'Weekend Binge',
  description: 'Series to demolish over a weekend.',
  items: ['content-004', 'content-008'],
  createdAt: 'Jun 01, 2026',
  updatedAt: 'Jun 08, 2026'
}];


export const mockFriends: FriendUser[] = [
{
  id: 'friend-001',
  name: 'Priya Sharma',
  username: 'priya_watches',
  avatar: 'PS',
  avatarImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
  currentlyWatching: 'content-008',
  watchlist: [
    { contentId: 'content-001', status: 'watched' },
    { contentId: 'content-002', status: 'watched' },
    { contentId: 'content-008', status: 'watching' },
    { contentId: 'content-005', status: 'watchlater' },
  ],
  playlists: [
    { id: 'pf-001', name: 'Crime Dramas', items: ['content-002', 'content-005', 'content-018'] },
    { id: 'pf-002', name: 'Must Watch Series', items: ['content-008', 'content-004'] },
  ]
},
{
  id: 'friend-002',
  name: 'Dev Mehta',
  username: 'dev_binge',
  avatar: 'DM',
  avatarImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
  currentlyWatching: 'content-004',
  watchlist: [
    { contentId: 'content-004', status: 'watching' },
    { contentId: 'content-010', status: 'watched' },
    { contentId: 'content-016', status: 'watchlater' },
  ],
  playlists: [
    { id: 'pf-003', name: 'Indian Originals', items: ['content-010', 'content-016', 'content-006'] },
  ]
},
{
  id: 'friend-003',
  name: 'Kavya Nair',
  username: 'kavya_cinephile',
  avatar: 'KN',
  avatarImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
  currentlyWatching: 'content-012',
  watchlist: [
    { contentId: 'content-012', status: 'watching' },
    { contentId: 'content-003', status: 'watched' },
    { contentId: 'content-015', status: 'watchlater' },
    { contentId: 'content-007', status: 'watchlater' },
  ],
  playlists: [
    { id: 'pf-004', name: 'Sci-Fi Essentials', items: ['content-012', 'content-003', 'content-011'] },
    { id: 'pf-005', name: 'Art House Cinema', items: ['content-007', 'content-009', 'content-015'] },
  ]
},
{
  id: 'friend-004',
  name: 'Rohan Verma',
  username: 'rohan_films',
  avatar: 'RV',
  avatarImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
  currentlyWatching: 'content-001',
  watchlist: [
    { contentId: 'content-001', status: 'watching' },
    { contentId: 'content-017', status: 'watched' },
    { contentId: 'content-013', status: 'watchlater' },
  ],
  playlists: [
    { id: 'pf-006', name: 'Award Winners', items: ['content-001', 'content-009', 'content-017'] },
  ]
},
{
  id: 'friend-005',
  name: 'Ananya Singh',
  username: 'ananya_reviews',
  avatar: 'AS',
  avatarImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
  currentlyWatching: 'content-006',
  watchlist: [
    { contentId: 'content-006', status: 'watching' },
    { contentId: 'content-014', status: 'watched' },
    { contentId: 'content-018', status: 'watchlater' },
  ],
  playlists: [
    { id: 'pf-007', name: 'Biopics & True Stories', items: ['content-006', 'content-005', 'content-001'] },
  ]
},
];


export const ALL_GENRES = ['All', 'Drama', 'Crime', 'Thriller', 'Sci-Fi', 'Comedy', 'Action', 'Romance', 'Horror', 'Biography', 'History', 'Mystery', 'Fantasy', 'Sport'];