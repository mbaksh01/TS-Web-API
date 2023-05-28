import movies from "../../data/movies.json";
import MovieRepository from "../repositories/movieRepository";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export default class MovieService {
  readonly moviesRepo: MovieRepository;
  currentMovies: Movie[] = [];

  constructor(moviesRepo: MovieRepository) {
    this.moviesRepo = moviesRepo;
    this.#init();
  }

  async addMovie(movie: Movie) {
    try {
      const response = await this.moviesRepo.add(movie);

      if (response) {
        this.currentMovies.push(response);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getMovies(): Promise<Movie[]> {
    try {
      return await this.moviesRepo.getAll();
    } catch (error) {
      console.error(error);
    }

    return [];
  }

  async getMovie(id: string): Promise<Movie | undefined> {
    try {
      return await this.moviesRepo.get(id);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async updateMovie(movie: Movie): Promise<boolean> {
    try {
      return await this.moviesRepo.update(movie);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteMovie(id: string): Promise<boolean> {
    try {
      return await this.moviesRepo.delete(id);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  deleteMovies(): Promise<boolean> {
    this.currentMovies = [];

    return this.moviesRepo.deleteAll();
  }

  #init() {
    for (let i = 0; i < movies.length; i++) {
      const element = movies[i];

      this.currentMovies.push({
        id: element.id,
        title: element.title,
        description: element.description,
        dateOfRelease: new Date(element.dateOfRelease),
      });
    }
  }
}
