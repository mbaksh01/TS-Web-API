import { MongoClient } from "mongodb";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export default class MovieRepository {
  readonly client: MongoClient;

  constructor() {
    this.client = new MongoClient(
      process.env.MONGO_CONNECTION_STRING ?? "mongodb://0.0.0.0:27017"
    );
  }

  async add(entity: Movie): Promise<Movie | undefined> {
    try {
      const database = this.client.db("movies");
      const movies = database.collection<Movie>("movies");

      await movies.insertOne(entity);

      return entity;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async update(entity: Movie): Promise<boolean> {
    try {
      const database = this.client.db("movies");
      const movies = database.collection<Movie>("movies");

      var response = await movies.replaceOne({ id: entity.id }, entity);

      return response.modifiedCount === 1;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const database = this.client.db("movies");
      const movies = database.collection<Movie>("movies");

      var response = await movies.deleteOne({ id: id });

      return response.deletedCount === 1;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteAll(): Promise<boolean> {
    try {
      const database = this.client.db("movies");
      const movies = database.collection<Movie>("movies");

      await movies.deleteMany();

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async get(id: string): Promise<Movie | undefined> {
    try {
      const database = this.client.db("movies");
      const movies = database.collection<Movie>("movies");

      var response = await movies.findOne({ id: id });

      return response === null ? undefined : response;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getAll(): Promise<Movie[]> {
    try {
      const database = this.client.db("movies");
      const movies = database.collection<Movie>("movies");

      var response = movies.find();

      return response.toArray();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
