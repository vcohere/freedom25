$(document).ready(function() {
  var getPage = function(id) {
    for (var i = 0; i < data.length; i++) {
      if (data[i]._id == id)
        return data[i].elements;
    }
  };

  var pages = new Vue({
    el: '#pages',
    data: {
      pageId: null,
      pages: data,
      elements: []
    },
    methods: {
      pageSelect: function(id) {
        this.pageId = id;
        this.elements = getPage(id);
        console.log(this.elements);
      },
      test: function(d, e, f) {
        console.log(d);
        console.log(e);
        console.log(f);
      },
      validate: function() {
        $.ajax({
           url : '/updatePage',
           type : 'GET',
           data: {_id: this.pageId, elements: this.elements},
           success: function() {
             console.log('done');
           }
        });
      }
    }
  })
})
