const TrackCard = require('./TrackCard');

module.exports = function(tracks){
    return tracks.map(track =>{
      return TrackCard(track)
    })    
}