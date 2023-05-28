import { v4 as uuidV4 } from "uuid";
import express, { Request, Response } from "express";
import MovieService from "../services/movieService";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export default class MovieController {
  notFoundErrorMessage = "Movie not found!";
  readonly movieService: MovieService;

  constructor(movieService: MovieService) {
    this.movieService = movieService;
  }

  routes = () => {
    const router = express.Router();

    router.get("/", this.getMovies);
    router.post("/", this.createMovie);
    router.delete("/", this.deleteMovies);
    router.get("/:id", this.getMovie);
    router.put("/:id", this.updateMovie);
    router.delete("/:id", this.deleteMovie);

    return router;
  };

  getMovies = async (req: Request, res: Response<MovieResponse[]>) => {
    res.json(await this.movieService.getMovies());
  };

  getMovie = async (
    req: Request<{ id: string }>,
    res: Response<string | MovieResponse>
  ) => {
    let id = req.params.id;
    let movie = await this.movieService.getMovie(id);

    if (movie) {
      res.json(movie);
      return;
    }

    res.status(404).send(this.notFoundErrorMessage);
  };

  createMovie = async (
    req: Request<{}, any, MovieRequest>,
    res: Response<MovieResponse | string>
  ) => {
    let movie: MovieResponse;

    movie = {
      id: uuidV4(),
      title: req.body.title,
      description: req.body.description,
      dateOfRelease: req.body.dateOfRelease,
    };

    await this.movieService.addMovie(movie);

    res.status(201).location(`${movie.id}`).json(movie);
  };

  updateMovie = async (
    req: Request<{ id: string }, any, MovieRequest>,
    res: Response<string>
  ) => {
    let response = await this.movieService.updateMovie({
      id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      dateOfRelease: req.body.dateOfRelease,
    });

    if (response) {
      res.status(204).send();
      return;
    }

    res.status(404).send(this.notFoundErrorMessage);
  };

  deleteMovie = async (req: Request<{ id: string }>, res: Response<string>) => {
    let response = await this.movieService.deleteMovie(req.params.id);

    if (response) {
      res.status(204).send();
      return;
    }

    res.status(404).send(this.notFoundErrorMessage);
  };

  deleteMovies = async (req: Request, res: Response<string>) => {
    let response = await this.movieService.deleteMovies();

    if (response) {
      res.status(204).send();
      return;
    }

    res.status(500).send("Failed to delete all movies.");
  };
}
