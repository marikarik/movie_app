import React from "react"
import './App.css'
import MovieList from './MovieList/MovieList'
import { format } from 'date-fns'


export default class App extends React.Component {

  state = {
    dataMovie: [] 
  }

  componentDidMount() { 
    this.getMovieList();
  }
  async getMovieList () {
    let query = 'return'
    const movieList = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=524d2d552a1f0dc2db06b92cd4581006&query=${query}`)
    const movieListJson = await movieList.json()
    this.setState({
      dataMovie: movieListJson.results
    }

    )
    
  }

  dateFormatting(date) {
    return format(new Date(date), 'MMMM dd, yyyy')
  }

  render () {
    return (
      <>
      <MovieList 
        dataMovie={this.state.dataMovie}
        dateFormatting={this.dateFormatting}/>
      </>

    )
  }
}


