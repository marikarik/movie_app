import './movieCard.css'
import { trimDescription } from '../helpers/trimDescription'
import { dateFormatting } from '../helpers/dateFormatting'
import { Tag, Rate } from 'antd'
import images from './images.png'
import { GenresConsumer } from '../App.jsx'

export default function MovieCard({
  movieId,
  movieTitle,
  movieDescription,
  posterPath,
  releaseDate,
  voteAverage,
  genreIds,
  handleRateMovie,
  userRating,
}) {
  const rating = voteAverage.toFixed(1)
  const limitGenres = genreIds.slice(0, 3)
  const baseUrlImg = `http://image.tmdb.org/t/p/w300${posterPath}`
  return (
    <li className="movie-card">
      <div className='conteiner'>
        <img className="movie-card_poster" src={posterPath ? baseUrlImg : images} />
      </div>
      <div className="movie-card_description">
        <div className="movie-card_header">
          <h2 className="movie-card_title">{trimDescription(movieTitle, 20, 5)}</h2>
        </div>
        <div
          className={`movie-card_rating 
                ${
                  Number(rating) < 3
                    ? 'rating_very-low'
                    : Number(rating) >= 3 && Number(rating) < 5
                      ? 'rating_low'
                      : Number(rating) >= 5 && Number(rating) < 7
                        ? 'rating_average'
                        : 'rating_hight'
                }`}
        >
          {rating}
        </div>
        <p className="movie-card_release-date">
          {releaseDate ? dateFormatting(releaseDate) : 'Unknown'}
        </p>
        <GenresConsumer>
          {(genres) => (
            <ul className="movie-card_genres ">
              {limitGenres.map((genre) => {
                const genreItem = genres.find((item) => item.id === genre)
                const genreName = genreItem.name
                return (
                  <li key={genre}>
                    <Tag>{genreName}</Tag>
                  </li>
                )
              })}
            </ul>
          )}
        </GenresConsumer>
        <p className="movie-card_summary">{trimDescription(movieDescription, 170)}</p>
        <Rate
          className="movie-card_rate"
          allowHalf
          value={userRating ?? 0}
          count={10}
          style={{ fontSize: 15 }}
          onChange={(value) => handleRateMovie(movieId, value)}
        />
      </div>
    </li>
  )
}
