import MovieCard from "../MovieCard/MovieCard";
import './movieList.css';
import { Spin, Alert, Pagination } from "antd";
import { FrownOutlined } from "@ant-design/icons"

export default function MovieList ({dataMovie, dateFormatting, isLoading, error, isOnline, changePage, queryPage, totalResults}) {
    console.log(dataMovie);
    if(error || !isOnline ){
       return (
        <>
            {!isOnline ? <Alert message="Error" description="No Internet Connection. Please check your network settings and try again" 
            type="error"/>: null}
            {error ? <Alert message="Error" description="An error occurred while loading data. Please try again later" 
            type="error"/>: null}
        </>

       ) 
    }
    if(isLoading) {
        return (
            <Spin  size="large"/>
        )
    }
    
    if(dataMovie.length && !error && isOnline){
        return (
            <>  
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
                <Pagination align="center"  current={queryPage} showSizeChanger={false}  pageSize={20} total={totalResults} onChange={changePage}/>
            </>
            )
    }

    if(dataMovie.length === 0) {
        return(
            <>
             <p>Sorry, no matches were found for your query <FrownOutlined /> </p>
            </>
        )
    }
}