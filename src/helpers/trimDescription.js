export function trimDescription (descr, maxLength) {
    if(descr.length < maxLength) {
        return descr
    } 
    let maxLengthSearch = maxLength + 10
    for(let i = maxLength; i < maxLengthSearch; i++){
        if(descr[i] === ' '){
           return `${descr.slice(0, i)} ...`
        }
    }
    for(let i = maxLength; i >= 0; i--){
        if(descr[i] === ' '){
           return `${descr.slice(0, i)} ...`
        }
    }
}