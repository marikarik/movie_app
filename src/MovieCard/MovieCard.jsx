import './movieCard.css'
import { trimDescription } from '../helpers/trimDescription'
import {  Tag, Rate } from 'antd';
import images from './images.png'

export default function MovieCard ({movieTitle, movieDescription, posterPath, releaseDate, voteAverage, dateFormatting}) {
    const baseUrlImg = `http://image.tmdb.org/t/p/w300${posterPath}`
    return (
      <li className="movie-card">
        <img className='movie-card_poster' src={posterPath ? baseUrlImg : images}/>
        <div className='movie-card_description'>
            <div className='movie-card_header'>
                <h2 className='movie-card_title'>{movieTitle}</h2>
                <div className='movie-card_rating'>{voteAverage.toFixed(1)}</div>
            </div>
            <p className='movie-card_release-date'>{releaseDate ? dateFormatting(releaseDate): 'Unknown'}</p>
            <span className='movie-card_genres'>
                <Tag> {'drama'}</Tag>
                <Tag> {'triller'}</Tag>
            </span>
            <p className='movie-card_summary'>{trimDescription(movieDescription, 170)}</p>
            <Rate allowHalf defaultValue={2.5} count={10} style={{fontSize: 15}}/>
        </div>
      </li>
    )
}

