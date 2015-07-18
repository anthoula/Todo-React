var items = []

var notifyComponents = function() {
  $(ListStore).trigger('storeHasChanged')
}

var findItemById = function( id ) {
  return items.filter(function(item) {
    return item.id === id
  })[0]
};

var URL_ROOT = "https://listalous.herokuapp.com/lists/ANTHOULA/";

ListStore = {

  getItems: function() {
    return items
  },

  loadItems: function() {
    var loadRequest = $.ajax({
      type : "GET",
      url  : URL_ROOT
    });

    loadRequest.done( function( dataFromServer ) {
      items = dataFromServer.items;
      notifyComponents();
    });
  },

  addItem: function( itemDescription ) {
    var creationRequest = $.ajax({
      type : 'POST',
      url  : URL_ROOT + "/items",
      data : { description: itemDescription, completed: false }
    });

    creationRequest.done( function( itemDataFromServer ) {
      items.push(itemDataFromServer);
      notifyComponents();
    });
  },

  toggleCompleteness: function( itemId ) {
    var item                  = findItemById( itemId ),
        currentCompletedValue = item.completed;

    var updateRequest = $.ajax({
      type : 'PUT',
      url  : URL_ROOT + "/items/" + itemId,
      data : { completed: !currentCompletedValue }
    });

    updateRequest.done( function( itemData ) {
      item.completed = itemData.completed;
      notifyComponents();
    });
  },

  deleteItem: function( itemId ){
    var item          = findItemById( itemId ),
        deleteRequest = $.ajax({
          type : 'DELETE',
          url  : URL_ROOT + "/items/" + itemId
        });

    deleteRequest.done( function( itemDataFromServer ) {
      var indexOfItem = items.indexOf(item);
      items.splice( indexOfItem, 1 );
      notifyComponents();
    });
  }
}