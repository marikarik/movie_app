import { Input } from 'antd'
import React from 'react'
import debounce from 'lodash.debounce'
export default class Search extends React.Component{

    handleSearch = (event) => {
        this.props.search(event)
    }

    debouncedSearch = debounce(this.handleSearch, 450)

    render() {
        return (
            <Input placeholder="Type to search..." onChange={this.debouncedSearch} />
        )
    }
    
}