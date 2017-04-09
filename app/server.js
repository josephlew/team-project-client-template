import {readDocument, writeDocument, addDocument} from './database';

/**
* Emulates how a REST call is *asynchronous* -- it calls your function back
* some time in the future with data.
*/
function emulateServerReturn(data, cb) {
  setTimeout(() => {
    cb(data);
  }, 4);
}

export function getUserData(user, cb) {
  var userData = readDocument('users', user);
  emulateServerReturn(userData, cb);
}

/**
* Given a feed item ID, returns a FeedItem object with references resolved.
* Internal to the server, since it's synchronous.
*/
function getFeedItemSync(feedItemId) {
  var feedItem = readDocument('feedItems', feedItemId);
  // Resolve 'like' counter.
  feedItem.likeCounter =
  feedItem.likeCounter.map((id) => readDocument('users', id));
  // Assuming a StatusUpdate. If we had other types of
  // FeedItems in the DB, we would
  // need to check the type and have logic for each type.
  feedItem.contents.author =
  readDocument('users', feedItem.contents.author);
  // Resolve comment author.
  feedItem.comments.forEach((comment) => {
    comment.author = readDocument('users', comment.author);
    comment.likeCounter = comment.likeCounter.map((id) => readDocument('users', id));
  });
  return feedItem;
}


function storeListing(title,description,categories,preferred_payments,post_time,last_updated,price,type,pictures, cb){

  var newItem = {
    "owner": this.props.user,
    "title": title,
    "description": description,
    "categories":categories,
    "preferred_payments":preferred_payments,
    "timestamp": post_time,
    "last_updated": last_updated,
    "active": 1,
    "price": price,
    "type": type,
    "pictures":pictures,
    "rating": null
  };
  newItem = addDocument('item_listings', newItem)
  emulateServerReturn(newItem, cb);
}

export function getItemListings(items, cb){
  if(items.constructor !== Array){
    items = [items]
  }
  var itemDataList = [];
  for (var i = 0; i < items.length; i++){
    var itemData = readDocument("item_listings", items[i]);
    var userData = readDocument("users", itemData.owner);
    itemData.owner = userData
    itemDataList.push(itemData)
  }
  emulateServerReturn(itemDataList, cb);

}