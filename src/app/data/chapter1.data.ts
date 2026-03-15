export interface BengaliCharacter {
  letter: string;
  name: string;
  example?: string;
  imageUrl?: string;
  relatedWord?: { bengali: string, english: string, pronunciation: string };
}

export const CHAPTER_1_DATA: BengaliCharacter[] = [
  { letter: 'অ', name: 'aw', imageUrl: 'https://loremflickr.com/400/300/snake', relatedWord: { bengali: 'অজগর', english: 'Python (snake)', pronunciation: 'aw-jaw-gor' } },
  { letter: 'আ', name: 'aa', imageUrl: 'https://loremflickr.com/400/300/mango', relatedWord: { bengali: 'আম', english: 'Mango', pronunciation: 'aam' } },
  { letter: 'ই', name: 'hrashwa i', imageUrl: 'https://loremflickr.com/400/300/mouse', relatedWord: { bengali: 'ইঁদুর', english: 'Mouse', pronunciation: 'in-dur' } },
  { letter: 'ঈ', name: 'dirgha i', imageUrl: 'https://loremflickr.com/400/300/eagle', relatedWord: { bengali: 'ঈগল', english: 'Eagle', pronunciation: 'ee-gol' } },
  { letter: 'উ', name: 'hrashwa u', imageUrl: 'https://loremflickr.com/400/300/camel', relatedWord: { bengali: 'উট', english: 'Camel', pronunciation: 'oot' } },
  { letter: 'ঊ', name: 'dirgha u', imageUrl: 'https://loremflickr.com/400/300/sunrise', relatedWord: { bengali: 'ঊষা', english: 'Dawn', pronunciation: 'oo-sha' } },
  { letter: 'ঋ', name: 'ri', imageUrl: 'https://loremflickr.com/400/300/meditation', relatedWord: { bengali: 'ঋষি', english: 'Sage', pronunciation: 'ri-shi' } },
  { letter: 'এ', name: 'e', imageUrl: 'https://loremflickr.com/400/300/music,instrument', relatedWord: { bengali: 'একতারা', english: 'Ektara (Instrument)', pronunciation: 'ek-ta-ra' } },
  { letter: 'ঐ', name: 'oi', imageUrl: 'https://loremflickr.com/400/300/elephant', relatedWord: { bengali: 'ঐরাবত', english: 'Elephant', pronunciation: 'oi-ra-bot' } },
  { letter: 'ও', name: 'o', imageUrl: 'https://loremflickr.com/400/300/scale,weight', relatedWord: { bengali: 'ওজন', english: 'Weight', pronunciation: 'o-jon' } },
  { letter: 'ঔ', name: 'ou', imageUrl: 'https://loremflickr.com/400/300/medicine,pharmacy', relatedWord: { bengali: 'ঔষধ', english: 'Medicine', pronunciation: 'ou-shodh' } }
];

