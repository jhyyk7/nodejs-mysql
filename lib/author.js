var db = require ('./db');
var template = require ('./template');
var topic = require ('./topic');
var qs = require ('querystring');
var url = require ('url');
exports.author_Home = function (request, response) {
    db.query('SELECT * FROM author', function (error, result) {
        if (error) throw error;
        db.query(`SELECT * FROM topic`, function (error2, results){
            if (error2) throw error2;
             var title = 'author_home';                                     
             var list = template.LIST(results);
             var author_list = template.author_List(result);
             var option = `<a href = "/author_create">create</a>`;
             var html = template.HTML(title, list, author_list, option);                       
             response.writeHead(200);
             response.end(html);
           });
        
    })
},
exports.author_Create=function(request, response){
    db.query('SELECT * FROM author', function (error, result) {
        if (error) throw error;
        db.query(`SELECT * FROM topic`, function (error2, results){
            if (error2) throw error2;
             var title = 'author_home';                                     
             var list = template.LIST(results);
             var author_list = template.author_List(result);
             var option = `
             <a href = "/author_create">create</a>
               <form action="/author_create_process" method="post">
                 <p><input type="text" name="name" placeholder="name"></p>
                 <p>
                   <textarea name="profile" placeholder="profile"></textarea>
                 </p>
                 
                 <p>
                   <input type="submit">
                 </p>
               </form>
             `;
             var html = template.HTML(title, list, author_list, option);                       
             response.writeHead(200);
             response.end(html);
           });
        
    })
},
exports.author_Create_process = function(request, response){
    var body = '';
        request.on('data', function(data){
            body = body + data;                      
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var name = post.name;
            var profile = post.profile;                                 
            db.query(`
                    INSERT INTO author (name, profile) 
                        VALUES(?, ?)`,
                    [name, profile], function (error, results){
                if(error) throw error;
                           
                response.writeHead(302, {Location: `/author`});
                response.end('success');
           });
        });   
},
exports.author_Update = function (request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query('SELECT * FROM author', function (error, result) {
        if (error) throw error;
        db.query(`SELECT * FROM topic`, function (error2, results){
            if (error2) throw error2;
            db.query(`SELECT * FROM author WHERE id = ?`, [queryData.id], function(error3, result3){
                if (error3) throw error3;
                    var title = 'author_update';   
                    var name = result3[0].name;
                    var profile = result3[0].profile;                                
                    var list = template.LIST(results);
                    var author_list = template.author_List(result);
                    var option = `
                    <a href = "/author_create">create</a>
                    <form action="/author_update_process" method="post">
                    <p><input type="hidden" name="id" value ="${queryData.id}"></p>
                        <p><input type="text" name="name" placeholder="name" value = "${name}"></p>
                        <p>
                        <textarea name="profile" placeholder="profile">${profile}</textarea>
                        </p>
                        
                        <p>
                        <input type="submit">
                        </p>
                    </form>
                    `;
                    var html = template.HTML(title, list, author_list, option);  
                             
                    response.writeHead(200);
                    response.end(html);
                });
             
           });
        
    });
    
},
exports.author_Update_process = function (request, response){
    var body = '';
        request.on('data', function(data){
                body = body + data;                      
            });
        request.on('end', function(){
                var post = qs.parse(body);
                var id = post.id;
                var name = post.name;
                var profile = post.profile;
                               
        db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,
                [name, profile, id], function(error, result){
                    if (error) throw error;                       
                    response.writeHead(302, {Location: `/author`});
                    response.end('success');
                    })                
        });   
},
exports.author_Delete_process = function (request, response){
    var body = '';
    request.on('data', function(data){
            body = body + data;                      
        });
    request.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      db.query(`DELETE FROM author WHERE id=?`,[id],function(error, result){
        if (error) throw error;       
        response.writeHead(302, {Location: `/author`});
        response.end('success');
      })
    });

}