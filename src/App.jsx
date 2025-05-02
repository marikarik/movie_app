import React from "react"
import './App.css'
import MovieList from './MovieList/MovieList'
import Search from "./Search/Search"


export default class App extends React.Component {

  state = {
    isLoading: false,
    dataMovie: [], 
    error: false,
    isOnline: navigator.onLine,
    querySearch: '',
    queryPage: 1,
    totalResults: 0
  }

  search = (event) => {
    console.log(this.state.querySearch);
    let queryWord = event.target.value
    this.setState({ querySearch: queryWord },
      () => {
        this.getMovieList(this.state.querySearch, this.state.queryPage)
      }
    )
    
  }

  changePage = (page) => {
    this.setState({ queryPage: page },
      () => {
        this.getMovieList(this.state.querySearch, page)
      }
    )
  }

  // componentDidMount() { 
  //   this.getMovieList();
  // }
  async getMovieList (querySearch, queryPage) {
    try {
        this.setState({
          isLoading: true
        }, () => console.log(this.state))
        const movieList = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=524d2d552a1f0dc2db06b92cd4581006&query=${querySearch}&page=${queryPage}`)
        if(movieList.ok) {
          const movieListJson = await movieList.json()
          this.setState({
          dataMovie: movieListJson.results,
          isLoading: false,
          totalResults: movieListJson.total_results
          }, 
        () => console.log(this.state)
      )
    }
       else {
        throw new Error(movieList.status)
      }
    }
    catch(error) {
      this.setState({
        isLoading: false,
        error: true
        })
      console.log(`Error: ${error.message}`);
    }
  }

  render () {
    return (
      <>
      <Search
        state={this.state}
        search={this.search}
        getMovieList={this.getMovieList}
      />
      <MovieList 
        dataMovie={this.state.dataMovie}
        isLoading={this.state.isLoading}
        error={this.state.error}
        isOnline={this.state.isOnline}
        changePage={this.changePage}
        queryPage={this.state.queryPage}
        totalResults={this.state.totalResults}
      />
      </>

    )
  }
}


