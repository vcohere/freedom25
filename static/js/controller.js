$(document).ready(function() {
  var app = new Vue({
    el: '#container',
    data: {
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
