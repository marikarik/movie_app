import React from 'react'
import './App.css'
import MovieList from './MovieList/MovieList'
import Search from './Search/Search'
import { Tabs } from 'antd'

const GenresContext = React.createContext()
const GenresProvider = GenresContext.Provider
export const GenresConsumer = GenresContext.Consumer

const apiKey = '524d2d552a1f0dc2db06b92cd4581006'

export default class App extends React.Component {
  state = {
    isLoading: false,
    dataMovie: [],
    genres: [],
    error: false,
    querySearch: 'хлеб',
    queryPage: 1,
    totalResults: 0,
    tab: 'search',
    sessionId: null,
    ratedMovies: [],
    queryPageRated: 1,
    totalResultsRated: 0,
    ratedError: false,
    hasRatedMovie: false,
    userRatings: {},
  }

  search = (event) => {
    let queryWord = event.target.value
    this.setState({ querySearch: queryWord, queryPage: 1 }, () => {
      this.getMovieList(this.state.querySearch, this.state.queryPage)
    })
  }

  changePage = (page) => {
    this.setState({ queryPage: page }, () => {
      this.getMovieList(this.state.querySearch, page)
    })
  }

  changePageRated = (page) => {
    this.setState({ queryPageRated: page }, () => {
      this.getRateMovie(page)
    })
  }
  componentDidMount() {
    this.getMovieList(this.state.querySearch, this.state.queryPage)
    this.getGenres()
    this.createGuestSession()
  }

  async getGenres() {
    const genresData = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
    )
    if (genresData.ok) {
      const genresList = await genresData.json()
      this.setState({ genres: genresList.genres })
    }
  }
  async getMovieList(querySearch, queryPage) {
    try {
      this.setState({
        isLoading: true,
      })
      const movieList = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${querySearch}&page=${queryPage}`
      )
      if (movieList.ok) {
        const movieListJson = await movieList.json()
        this.setState({
          dataMovie: movieListJson.results,
          isLoading: false,
          totalResults: movieListJson.total_results,
        })
      } else {
        throw new Error(movieList.status)
      }
    } catch (error) {
      this.setState({
        isLoading: false,
        error: true,
      })
      console.error(`Error: ${error.message}`)
    }
  }

  async createGuestSession() {
    const guestSessionResponse = await fetch(
      `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${apiKey}`
    )
    if (guestSessionResponse.ok) {
      const guestSession = await guestSessionResponse.json()
      this.setState({ sessionId: guestSession.guest_session_id })
    }
  }

  handleRateMovie = (movieId, rate) => {
    const { sessionId } = this.state
    if (!sessionId) return

    this.setState(
      (prevState) => ({
        hasRatedMovie: true,
        userRatings: {
          ...prevState.userRatings,
          [movieId]: rate,
        },
      })
    )

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: rate }),
    }

    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${sessionId}&api_key=${apiKey}`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) throw new Error('Упс')
      })
      .catch((err) => console.error(err.message))
  }

  getRateMovie = (queryPageRated = this.state.queryPageRated) => {
    const { sessionId } = this.state
    if (!sessionId) return

    fetch(
      `https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies?api_key=${apiKey}&page=${queryPageRated}`
    )
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) throw new Error('Not found')
          throw new Error(response.statusText)
        }
        return response.json()
      })
      .then((list) => {
        this.setState({
          ratedMovies: list.results,
          totalResultsRated: list.total_results,
          ratedError: false,
          ratedLoaded: true,
        })
      })
      .catch((error) => {
        this.setState({ ratedError: true, ratedLoaded: true })
      })
  }

  handleTabChange = (keyTab) => {
    this.setState({ tab: keyTab }, () => {
      if (this.state.tab === 'rated') {
        this.getRateMovie(this.state.queryPageRated)
      }
    })
  }

  render() {
    const searchTab = (
      <>
        <Search state={this.state} search={this.search} getMovieList={this.getMovieList} />
        <MovieList
          dataMovie={this.state.dataMovie}
          isLoading={this.state.isLoading}
          error={this.state.error}
          changePage={this.changePage}
          queryPage={this.state.queryPage}
          totalResults={this.state.totalResults}
          handleRateMovie={this.handleRateMovie}
          tabKey={this.state.tab}
          userRatings={this.state.userRatings}
        />
      </>
    )
    const ratedTab = (
      <>
        <MovieList
          dataMovie={this.state.ratedMovies}
          changePage={this.changePageRated}
          queryPage={this.state.queryPageRated}
          totalResults={this.state.totalResultsRated}
          handleRateMovie={this.handleRateMovie}
          tabKey={this.state.tab}
          error={this.state.ratedError}
          hasRatedMovie={this.state.hasRatedMovie}
          userRatings={this.state.userRatings}
        />
      </>
    )
    const tabs = [
      {
        key: 'search',
        label: 'Search',
        children: searchTab,
      },
      {
        key: 'rated',
        label: 'Rated',
        children: ratedTab,
      },
    ]
    return (
      <GenresProvider value={this.state.genres}>
        <Tabs
          className="myTabs"
          defaultActiveKey="search"
          items={tabs}
          centered
          onChange={this.handleTabChange}
        />
      </GenresProvider>
    )
  }
}
