$(document).ready(function() {
  var getPage = function(id) {
    for (var i = 0; i < data.length; i++) {
      if (data[i]._id == id)
        return data[i].blocks;
    }
  };

  var pages = new Vue({
    el: '#pages',
    data: {
      pages: data,
      blocks: []
    },
    methods: {
      pageSelect: function(id) {
        this.blocks = getPage(id);
        console.log(this.blocks);
      },
      test: function(d, e, f) {
        console.log(d);
        console.log(e);
        console.log(f);
      },
      validate: function() {
        $.ajax({
           url : '/updateBlock',
           type : 'GET',
           data: {blocks: this.blocks},
           success: function() {
             console.log('done');
           }
        });
      }
    }
  })
})
