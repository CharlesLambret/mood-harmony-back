import { InMemoryGenreRepository } from "../in-memory-genre.repository";

const genreRepository = new InMemoryGenreRepository();

async function createMockGenres() {
    const genre1 = await genreRepository.create({
        name: 'Pop',
        iconUrl: 'icon1.png'
    });
    const genre2 = await genreRepository.create({
        name: 'Rock',
        iconUrl: 'icon2.png'
    });
    const genre3 = await genreRepository.create({
        name: 'Jazz',
        iconUrl: 'icon3.png'
    });
    const genre4 = await genreRepository.create({
        name: 'Classical',
        iconUrl: 'icon4.png'
    });
    const genre5 = await genreRepository.create({
        name: 'Hip-Hop',
        iconUrl: 'icon5.png'
    });

    return { genre1, genre2, genre3, genre4, genre5, genreRepository };
}

export { createMockGenres };
