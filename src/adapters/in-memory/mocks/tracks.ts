import { InMemoryTrackRepository } from "../in-memory-track.repository";
import { createMockGenres } from "./genres";
const trackRepository = new InMemoryTrackRepository();

async function createMockTracks() {
  const { genre1, genre2, genre3, genre4, genre5 } = await createMockGenres();

  // Genre 1
  const track1 = await trackRepository.create({
    name: 'Track 1',
    length: 180,
    trackHref: 'href1',
    bpm: 120,
    speechiness: 10,
    energy: 0.8,
    genre: genre1
  });
  const track2 = await trackRepository.create({
    name: 'Track 2',
    length: 170,
    trackHref: 'href2',
    bpm: 122,
    speechiness: 12,
    energy: 0.75,
    genre: genre1
  });
  const track3 = await trackRepository.create({
    name: 'Track 3',
    length: 160,
    trackHref: 'href3',
    bpm: 118,
    speechiness: 9,
    energy: 0.82,
    genre: genre1
  });

  // Genre 2
  const track4 = await trackRepository.create({
    name: 'Track 4',
    length: 200,
    trackHref: 'href4',
    bpm: 130,
    speechiness: 15,
    energy: 0.7,
    genre: genre2
  });
  const track5 = await trackRepository.create({
    name: 'Track 5',
    length: 210,
    trackHref: 'href5',
    bpm: 128,
    speechiness: 14,
    energy: 0.72,
    genre: genre2
  });
  const track6 = await trackRepository.create({
    name: 'Track 6',
    length: 190,
    trackHref: 'href6',
    bpm: 132,
    speechiness: 16,
    energy: 0.68,
    genre: genre2
  });

  // Genre 3
  const track7 = await trackRepository.create({
    name: 'Track 7',
    length: 150,
    trackHref: 'href7',
    bpm: 110,
    speechiness: 8,
    energy: 0.6,
    genre: genre3
  });
  const track8 = await trackRepository.create({
    name: 'Track 8',
    length: 155,
    trackHref: 'href8',
    bpm: 112,
    speechiness: 7,
    energy: 0.62,
    genre: genre3
  });

  // Genre 4
  const track9 = await trackRepository.create({
    name: 'Track 9',
    length: 140,
    trackHref: 'href9',
    bpm: 100,
    speechiness: 5,
    energy: 0.5,
    genre: genre4
  });
  const track10 = await trackRepository.create({
    name: 'Track 10',
    length: 145,
    trackHref: 'href10',
    bpm: 102,
    speechiness: 6,
    energy: 0.52,
    genre: genre4
  });

  // Genre 5
  const track11 = await trackRepository.create({
    name: 'Track 11',
    length: 160,
    trackHref: 'href11',
    bpm: 140,
    speechiness: 20,
    energy: 0.9,
    genre: genre5
  });
  const track12 = await trackRepository.create({
    name: 'Track 12',
    length: 165,
    trackHref: 'href12',
    bpm: 142,
    speechiness: 19,
    energy: 0.92,
    genre: genre5
  });

  const tracks = [
    track1, track2, track3,
    track4, track5, track6,
    track7, track8,
    track9, track10,
    track11, track12
    ];

  return {
    track1, track2, track3, track4, track5, track6,
    track7, track8, track9, track10, track11, track12, tracks,
    trackRepository
  };
}

export { createMockTracks };