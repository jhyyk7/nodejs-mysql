var db = require ('./db');
var template = require ('./template');
var url = require ('url');
var qs = require ('querystring');

exports.Home = function(request, response){
db.query(`SELECT * FROM topic`, function (error, results){
    if (error) throw error;
     var title = 'welcome';          
     var description = 'WEB is..'   
     var option = `<a href="/create">create</a>`;
     var list = template.LIST(results);
     var html = template.HTML(title, list, option, `<h2>${title}</h2>${description}` );                       
     response.writeHead(200);
     response.end(html);          
   });
}
exports.query=function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function (error, results){
        if (error) throw error;        
        db.query(`SELECT * FROM topic LEFT OUTER JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function (error2, results2){
          if (error2) throw error2;                    
            var title = results2[0].title;
            var name = results2[0].name;
            var profile = results2[0].profile;            
            var description = results2[0].description;          
            var option = 
              `<a href="/update?id=${queryData.id}">update</a>   
              <form action = "delete_process" method = "post">
                <input type = "hidden" name = "id" value = "${queryData.id}">
                <input type = "submit" value = "delete">
              </form> `;
            var list = template.LIST(results);
            var html = template.HTML(title, list, option,  `<h2>${title}</h2>${description}<p>by ${name}</p><p>${name}'s job is ${profile}`);                               
            response.writeHead(200);
            response.end(html);                  
        });  
      });          
}
exports.create = function (request, response){
    db.query(`SELECT * FROM topic`, function (error, results){
        if (error) throw error;
        db.query(`SELECT * FROM author`, function (error2, results2){
          if (error2) throw error2;                  
            var title = 'WEB-create';
            var option = `
                <a href = "/create">create</a>
                  <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                      <textarea name="description" placeholder="description"></textarea>
                    </p>
                    ${template.Author(results2)}
                    <p>
                      <input type="submit">
                    </p>
                  </form>
                `;
          var list = template.LIST(results);
          var html = template.HTML(title, list, option, ``);                            
          response.writeHead(200);
          response.end(html);      
        });
      });
}
exports.create_process = function (request, response){
    var body = '';
        request.on('data', function(data){
            body = body + data;                      
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var author = post.author;
            var title = post.title;
            var description = post.description;                       
            db.query(`
                    INSERT INTO topic (title, description, created, author_id) 
                        VALUES(?, ?, now(), ?)`,
                    [title, description, author], function (error, results){
                if(error) {
                throw error;
                }                    
                response.writeHead(302, {Location: `/?id=${results.insertId}`});
                response.end('success');
           });
        });   
}
exports.update = function (request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function (error, results){
        if(error) throw error;
        db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (error2, results2){
          if (error2) throw error2;
          db.query(`SELECT * FROM author`, function (error3, results3){
            if (error3) throw error3;            
              var title = results2[0].title;
              var description = results2[0].description;
              var author = results2[0].author_id;
              var option = `
                <form action="/update_process" method="post">
                  <p><input type="hidden" name="id" value ="${queryData.id}"></p>
                  <p><input type="text" name="title" placeholder="title" value= ${title}></p>
                  <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                  </p>
                  ${template.Author(results3, author)}
                  <p>
                    <input type="submit">
                  </p>
                </form>
              `;            
              var list = template.LIST(results);
              var html = template.HTML(title, list, option, '');                                 
              response.writeHead(200);
              response.end(html);
          });          
        });      
    });
}
exports.update_process = function (request, response){
    var body = '';
        request.on('data', function(data){
                body = body + data;                      
            });
        request.on('end', function(){
                var post = qs.parse(body);
                var title = post.title;
                var description = post.description;
                var id = post.id;
                var author = post.author;                  
        db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
                [title, description, author, id], function(error, result){
                    if (error) throw error;                       
                    response.writeHead(302, {Location: `/?id=${id}`});
                    response.end('success');
                    })                
        });   
}
exports.delete_process = function (request,response){
    var body = '';
    request.on('data', function(data){
            body = body + data;                      
        });
    request.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      db.query(`DELETE FROM topic WHERE id=?`,[id],function(error, result){
        if (error) throw error;       
        response.writeHead(302, {Location: `/`});
        response.end('success');
      })
    });
}