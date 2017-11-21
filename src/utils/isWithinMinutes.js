import moment from 'moment';


export function isWithinMinutes(currentMessage = {}, diffMessage = {}, minutes = 5) {
  
    if (!diffMessage.createdAt) {
      return false
    }
  
    let currentCreatedAt = moment(currentMessage.createdAt);
    let diffCreatedAt = moment(diffMessage.createdAt);

    if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
      return false;
    }
    return currentCreatedAt.diff(diffCreatedAt, 'minutes') >= minutes;
    //return currentCreatedAt.isSame(diffCreatedAt, 'day');
  
  }