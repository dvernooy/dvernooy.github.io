var idx = lunr(function () {
  this.field('title', {boost: 10})
  this.field('excerpt')
  this.field('categories')
  this.field('tags')
  this.ref('id')
});



  
  
    idx.add({
      title: "Ergware",
      excerpt: "Open source software for an open source ergometer Hey all, Dave Vernooy here. I’m assuming you stumbled across this site...",
      categories: [],
      tags: [],
      id: 0
    });
    
  

  
  
    idx.add({
      title: "Layout: Comments Enabled",
      excerpt: "This post should display comments.\n",
      categories: ["Layout","Uncategorized"],
      tags: ["comments","layout"],
      id: 1
    });
    
  


console.log( jQuery.type(idx) );

var store = [
  
    
    
    
      
      {
        "title": "Ergware",
        "url": "http://localhost:4000/projects/ergware/",
        "excerpt": "Open source software for an open source ergometer Hey all, Dave Vernooy here. I’m assuming you stumbled across this site...",
        "teaser":
          
            null
          
      },
    
  
    
    
    
      
      {
        "title": "Layout: Comments Enabled",
        "url": "http://localhost:4000/blog/comments",
        "excerpt": "This post should display comments.\n",
        "teaser":
          
            null
          
      }
    
  ]

$(document).ready(function() {
  $('input#search').on('keyup', function () {
    var resultdiv = $('#results');
    var query = $(this).val();
    var result = idx.search(query);
    resultdiv.empty();
    resultdiv.prepend('<p class="results__found">'+result.length+' Result(s) found</p>');
    for (var item in result) {
      var ref = result[item].ref;
      if(store[ref].teaser){
        var searchitem =
          '<div class="list__item">'+
            '<article class="archive__item" itemscope itemtype="http://schema.org/CreativeWork">'+
              '<h2 class="archive__item-title" itemprop="headline">'+
                '<a href="'+store[ref].url+'" rel="permalink">'+store[ref].title+'</a>'+
              '</h2>'+
              '<div class="archive__item-teaser">'+
                '<img src="'+store[ref].teaser+'" alt="">'+
              '</div>'+
              '<p class="archive__item-excerpt" itemprop="description">'+store[ref].excerpt+'</p>'+
            '</article>'+
          '</div>';
      }
      else{
    	  var searchitem =
          '<div class="list__item">'+
            '<article class="archive__item" itemscope itemtype="http://schema.org/CreativeWork">'+
              '<h2 class="archive__item-title" itemprop="headline">'+
                '<a href="'+store[ref].url+'" rel="permalink">'+store[ref].title+'</a>'+
              '</h2>'+
              '<p class="archive__item-excerpt" itemprop="description">'+store[ref].excerpt+'</p>'+
            '</article>'+
          '</div>';
      }
      resultdiv.append(searchitem);
    }
  });
});
