import MovieCard from '../MovieCard/MovieCard'
import './movieList.css'
import { Spin, Alert, Pagination } from 'antd'
import { FrownOutlined } from '@ant-design/icons'
import { Offline, Online } from 'react-detect-offline'

export default function MovieList({
  dataMovie,
  dateFormatting,
  isLoading,
  error,
  changePage,
  queryPage,
  totalResults,
  handleRateMovie,
  tabKey,
  hasRatedMovie,
  userRatings,
}) {
  const isRatedTab = tabKey === 'rated'
  const isSearchTab = tabKey === 'search'
  const isEmptySearch = isSearchTab && dataMovie.length === 0 && !error
  const isSuccessLoad = dataMovie.length > 0 && !error

  const contentStyle = {
    padding: 50,
  }

  const content = <div style={contentStyle} />

  return (
    <div className="movie-list-container">
      {isLoading && <Spin tip="Loading">{content}</Spin>}

      <Online>
        {!isLoading && isRatedTab && (
          <>
            {!hasRatedMovie && <p>Your rated list is empty. Time to give some stars!</p>}

            {hasRatedMovie && error && (
              <Alert
                message="We couldn’t load your rated movies right now. Please check back later"
                type="warning"
              />
            )}
          </>
        )}

        {!isLoading && isSearchTab && error && (
          <Alert
            message="Error"
            description="An error occurred while loading data. Please try again later"
            type="error"
          />
        )}

        {!isLoading && isSuccessLoad && (
          <>
            <ul className="movie-list">
              {dataMovie.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movieId={movie.id}
                  voteAverage={movie.vote_average}
                  releaseDate={movie.release_date}
                  posterPath={movie.poster_path}
                  movieTitle={movie.original_title}
                  movieDescription={movie.overview}
                  genreIds={movie.genre_ids}
                  dateFormatting={dateFormatting}
                  handleRateMovie={handleRateMovie}
                  tabKey={tabKey}
                  userRating={userRatings[movie.id] ?? 0}
                />
              ))}
            </ul>
            <Pagination
              align="center"
              current={queryPage}
              showSizeChanger={false}
              pageSize={20}
              total={totalResults}
              onChange={changePage}
            />
          </>
        )}

        {!isLoading && isEmptySearch && (
          <p>
            Sorry, no matches were found for your query <FrownOutlined />
          </p>
        )}
      </Online>

      <Offline>
        <Alert
          style={{ marginTop: '20px' }}
          message="Informational Notes"
          type="info"
          description="No Internet Connection. Please check your network settings and try again"
          showIcon
        />
      </Offline>
    </div>
  )
}
