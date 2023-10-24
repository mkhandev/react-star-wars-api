import React, { useEffect, useState, useCallback } from "react";
import ContentLoader, { Facebook } from 'react-content-loader';

import AddMovie from './components/AddMovie';
import Loader from "./components/PageLoader/Loader"
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const[error, setError] = useState(null);

  const fetchMovieHander = useCallback( async () => {
    try {

      setError(null);
      setIsloading(true);

      const response = await fetch("https://swapi.dev/api/films/");
      
      if(!response.ok){
        throw new Error("Something went wrong!");
      }

      const data = await response.json();

      const trasnformedMovies = data.results.map((movieData) =>{
        return {
          id: movieData.id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date
        };
      });

      setMovies(trasnformedMovies);

    } catch (error) {
      setError(error.message);

      console.log(error);
    }

    setIsloading(false);
  }, []);

  useEffect(() => {
    fetchMovieHander();
  }, [fetchMovieHander]);

  let content = <p>Found No Movies.</p>;

  if(movies.length > 0){
    content =  <MoviesList movies={movies} />;
  }

  if(error){
    content =  <p>{error}</p>;
  }

  if(isLoading){
    content =  <Loader />;
  }

  async function addMovieHandler(movie) {
    const response = await fetch("https://react-demo-app-28d05-default-rtdb.firebaseio.com/movies.json",{
      method: "POST",
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    console.log(response);
    console.log(data);
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovieHander}>Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
