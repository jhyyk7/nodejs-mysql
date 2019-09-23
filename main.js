var http = require('http');
var url = require('url');
var fs = require ('fs');
var qs = require ('querystring');
var path = require ('path');
var sanitizeHtml = require('sanitize-html');
var template = require ('./lib/template.js')
var mysql = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'examples'
});
db.connect();

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var path_name = url.parse(_url, true).pathname;
   
        if(path_name == '/'){
          // var sanitizedTitle = sanitizeHtml(title);
          // var option = 
          //     `<a href="/update?id=${sanitizedTitle}">update</a>   
          //     <form action = "delete_process" method = "post">
          //       <input type = "hidden" name = "id" value = "${sanitizedTitle}">
          //       <input type = "submit" value = "delete">
          //     </form> `;
            if(_url == '/'){
            
                
                db.query(`SELECT * FROM topic`, function (error, results){
                  if(error) {
                    console.log(err);
                  }

                  var title = 'welcome';
                  
                  
                  var description = 'WEB is..'
                
                  var option = `<a href="/create">create</a>`;
                  var list = template.LIST(results);
                  var html = template.HTML(title, list, option, `<h2>${title}</h2>${description}` );                   
                    
                  response.writeHead(200);
                  response.end(html);
                  
                  
                });
                
                            
            }
            else {        
              db.query(`SELECT * FROM topic`, function (error, results){
                if (error) throw error;
                
                db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (error2, results2){
                  if (error2) throw error2;
                  
                  
                    var title = results2[0].title;
                    
                    
                    var description = results2[0].description;
                  
                    var option = 
                      `<a href="/update?id=${queryData.id}">update</a>   
                      <form action = "delete_process" method = "post">
                        <input type = "hidden" name = "id" value = "${queryData.id}">
                        <input type = "submit" value = "delete">
                      </form> `;
                    var list = template.LIST(results);
                    var html = template.HTML(title, list, option,  `<h2>${title}</h2>${description}`);                   
                    console.log(results);
                    // console.log(results);
                    response.writeHead(200);
                    response.end(html);
                
                  
                });
                

                
                
              });    
            // fs.readdir('./data',function(err, filelist) {
            //   var filteredId = path.parse(queryData.id).base;
            //     fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {                 
            //       var sanitizedDescription = sanitizeHtml(description);                  
            //         var list = template.LIST(filelist);
            //         var html = template.HTML(sanitizedTitle, list, sanitizedDescription, option);                   
            //         response.writeHead(200);
            //         response.end(html);
            //    });
            // });
            }
        }
        else if (path_name =='/create') {
            // fs.readdir('./data', function(error, filelist){
            //     var option = `
            //         <form action="/create_process" method="post">
            //           <p><input type="text" name="title" placeholder="title"></p>
            //           <p>
            //             <textarea name="description" placeholder="description"></textarea>
            //           </p>
            //           <p>
            //             <input type="submit">
            //           </p>
            //         </form>
            //       `;
            //     var title = 'WEB - create';
            //     var list = template.LIST(filelist);
            //     var html = template.HTML(title, list, option,'');
                
            //     response.writeHead(200);
            //     response.end(html);
            //   });
            db.query(`SELECT * FROM topic`, function (error, results){
              if(error) {
                console.log(err);
              }
              //db.query(`INSERT INTO `topic`VALUES(?, ?, ?, ?, ?)`,[id],function (error2, results2){
               // db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (error2, results2){
                var title = 'WEB-create';
                var option = `
                        <form action="/create_process" method="post">
                          <p><input type="text" name="title" placeholder="title"></p>
                          <p>
                            <textarea name="description" placeholder="description"></textarea>
                          </p>
                          <p>
                            <input type="submit">
                          </p>
                        </form>
                      `;
              
               
              
                
                var list = template.LIST(results);
                var html = template.HTML(title, list, option, '');                   
                console.log(results);
                response.writeHead(200);
                response.end(html);
            
              });
       
        }
        else if (path_name =='/create_process') { //TODO: 띄어쓰기 적용시키기.
                var body = '';
                request.on('data', function(data){
                        body = body + data;                      
                    });
                request.on('end', function(){
                        var post = qs.parse(body);
                        var title = post.title;
                        var description = post.description;                       
                        db.query(`
                              INSERT INTO topic (title, description, created, author_id) 
                                  VALUES(?, ?, now(), 1)`,
                             [title, description], function (error, results){
                          if(error) {
                            throw error;
                          }
                          console.log(results);
                          response.writeHead(302, {Location: `/?id=${results.insertId}`});
                          response.end('success');
                    });

                });                
        }
        else if (path_name =='/update'){
            // fs.readdir('./data', function(error, filelist){
            //   var filteredId = path.parse(queryData.id).base;
            //   fs.readFile(`data/${filteredId}`, 'utf8', function (err, description){  
            //     var option = `
            //       <form action="/update_process" method="post">
            //         <p><input type="hidden" name="id" value ="${title}"></p>
            //         <p><input type="text" name="title" placeholder="title" value= ${title}></p>
            //         <p>
            //           <textarea name="description" placeholder="description">${description}</textarea>
            //         </p>
            //         <p>
            //           <input type="submit">
            //         </p>
            //       </form>
            //     `;
            //     var title = queryData.id;  
            //     var list = template.LIST(filelist);
            //     var html = template.HTML(title, list, option, '' );
                
            //     response.writeHead(200);
            //     response.end(html);
            //   });
            // });
            db.query(`SELECT * FROM topic`, function (error, results){
              if(error) throw error;
              db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (error2, results2){
                if (error2) throw error2;
              //db.query(`INSERT INTO `topic`VALUES(?, ?, ?, ?, ?)`,[id],function (error2, results2){
               // db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (error2, results2){
                var title = results2[0].title;
                var description = results2[0].description;
                var option = `
                  <form action="/update_process" method="post">
                    <p><input type="hidden" name="id" value ="${queryData.id}"></p>
                    <p><input type="text" name="title" placeholder="title" value= ${title}></p>
                    <p>
                      <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
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

        }
        else if (path_name =='/update_process') {
          var body = '';
          request.on('data', function(data){
                  body = body + data;                      
              });
          request.on('end', function(){
                  var post = qs.parse(body);
                  var title = post.title;
                  var description = post.description;
                  var id = post.id;
                  
            db.query(`UPDATE topic SET title=?, description=? WHERE id=?`,
                    [title, description, id], function(error, result){
                        if (error) throw error;
                        console.log(result);
                        response.writeHead(302, {Location: `/?id=${id}`});
                        response.end('success');
                      })
                  //UPDATE topic SET title=`psot.title`,description=`post.description` WHERE id=`quertyData.id`
            //  fs.rename(`./data/${id}`,`./data/${title}`,function(){
            //   fs.writeFile(`./data/${title}`,`${description}`,'utf8', function(){
            //     response.writeHead(302, {Location: `/?id=${title}`});
            //     response.end('success');
            //     });                  
            //   });
          });     
          
        }
        else if (path_name == '/delete_process'){ 
          var body = '';
          request.on('data', function(data){
                  body = body + data;                      
              });
          request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            db.query(`DELETE FROM topic WHERE id=?`,[id],function(error, result){
              if (error) throw error;

              console.log(result);
              response.writeHead(302, {Location: `/`});
              response.end('success');

            })
            
            
           
          });
        }    
        else   {            
                response.writeHead(404);
                response.end('Not found');    
        }
            
});
app.listen(3000);