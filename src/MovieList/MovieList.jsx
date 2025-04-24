import MovieCard from "../MovieCard/MovieCard";
import './movieList.css'

export default function MovieList ({dataMovie, dateFormatting}) {
    console.log(dataMovie);
    return (
        <ul className="movie-list">
            {dataMovie.map((movie) => {
                return (
                    <MovieCard
                    key={movie.id}
                    voteAverage={movie.vote_average}
                    releaseDate={movie.release_date}
                    posterPath={movie.poster_path}
                    movieTitle={movie.original_title}
                    movieDescription={movie.overview}
                    dateFormatting={dateFormatting}
                    />
                )
            })}
        </ul>
    )
}