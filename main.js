var http = require('http');
var url = require('url');
var topic = require ('./lib/topic');

var app = http.createServer(function(request,response){
    var _url = request.url;    
    var path_name = url.parse(_url, true).pathname;   
      if(path_name == '/'){         
        if(_url == '/'){
          topic.Home(request, response);               
        }else {                       
          topic.query(request, response);
        }
      }else if (path_name =='/create'){      
          topic.create(request, response);       
      }else if (path_name =='/create_process'){ //TODO: 띄어쓰기 적용시키기. 
          topic.create_process(request, response);         
      }else if (path_name =='/update'){
          topic.update(request, response);
      }else if (path_name =='/update_process'){           
          topic.update_process(request, response);
      }else if (path_name == '/delete_process'){         
          topic.delete_process(request, response);
      }else{            
          response.writeHead(404);
          response.end('Not found');    
      }            
});
app.listen(3000);