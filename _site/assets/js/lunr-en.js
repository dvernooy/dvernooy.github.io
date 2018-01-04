var idx = lunr(function () {
  this.field('title', {boost: 10})
  this.field('excerpt')
  this.field('categories')
  this.field('tags')
  this.ref('id')
});



  
  
    idx.add({
      title: "Ergware",
      excerpt: "Our DIY ergometer … with its new “brain” Project overview Hey all, Dave Vernooy here with another project. I’m assuming...",
      categories: [],
      tags: [],
      id: 0
    });
    
  
    idx.add({
      title: "Heart Rate Monitor",
      excerpt: "MacGyver … eat your heart out Project overview Welcome to my heart rate monitor project. These things have been around...",
      categories: [],
      tags: [],
      id: 1
    });
    
  

  
  
    idx.add({
      title: "Pinewood Derby",
      excerpt: "Thumbs way up for the Pinewood Derby The master equation OK. If you are going for speed (uuh .. you...",
      categories: [],
      tags: [],
      id: 2
    });
    
  
    idx.add({
      title: "Berry Picking",
      excerpt: "Summer is here How long is the berry season, anyways? The date is Sunday, June 29th 2014. For some reason,...",
      categories: [],
      tags: [],
      id: 3
    });
    
  
    idx.add({
      title: "Christmas payback",
      excerpt: "Nah … no bike repairs needed after this race, right Ian? A really cool Christmas present After many years of...",
      categories: ["Layout","Uncategorized"],
      tags: ["comments","layout"],
      id: 4
    });
    
  


console.log( jQuery.type(idx) );

var store = [
  
    
    
    
      
      {
        "title": "Ergware",
        "url": "http://localhost:4000/projects/ergware/",
        "excerpt": "Our DIY ergometer … with its new “brain” Project overview Hey all, Dave Vernooy here with another project. I’m assuming...",
        "teaser":
          
            null
          
      },
    
      
      {
        "title": "Heart Rate Monitor",
        "url": "http://localhost:4000/projects/HRM/",
        "excerpt": "MacGyver … eat your heart out Project overview Welcome to my heart rate monitor project. These things have been around...",
        "teaser":
          
            null
          
      },
    
  
    
    
    
      
      {
        "title": "Pinewood Derby",
        "url": "http://localhost:4000/blog/derby",
        "excerpt": "Thumbs way up for the Pinewood Derby The master equation OK. If you are going for speed (uuh .. you...",
        "teaser":
          
            null
          
      },
    
      
      {
        "title": "Berry Picking",
        "url": "http://localhost:4000/blog/berry",
        "excerpt": "Summer is here How long is the berry season, anyways? The date is Sunday, June 29th 2014. For some reason,...",
        "teaser":
          
            null
          
      },
    
      
      {
        "title": "Christmas payback",
        "url": "http://localhost:4000/blog/truing",
        "excerpt": "Nah … no bike repairs needed after this race, right Ian? A really cool Christmas present After many years of...",
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
