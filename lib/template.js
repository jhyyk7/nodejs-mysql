module.exports = {//
    HTML: function (title, list, option, body) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            <p><a href="/author">author</a><p>
            ${list}   
            ${option}
            ${body}
        </body>
        </html>
        `;
    },
    LIST:function (filelist) {
        var line = `<ul>`;
        for (var i = 0; i <filelist.length; i++) {
            line = line + `<li><a href="/?id=${filelist[i].id}">${filelist[i].title}</a></li>`;
            }
            line = line + `</ul>`;
            return line;
    
    },


    Author:function (author_name, selected){
        var option = `<p><select name = "author">`;
        
        for ( var i =0; i<(author_name.length) ; i++){
            var tag = ``;
          if(author_name[i].id === selected) {
             tag = `selected`;
          }
             option = option + `<option value="${i+1}"${tag}>${author_name[i].name}</option>`;
             
            }
            option = option + `</select></p>`;

            return option;

    },

    author_List:function(author_information) {
            var line = `
           
                <table>
             <tr>
                <th>Name</th>
                <th>Profile</th>
                <th>Update</th>
                <th>Delete</th>                      
             </tr>
            `

          
           var number = new Array();
           for ( var a = 0 ; a <author_information.length ; a++){
            for (var i = 0 ; i < author_information.length ; i++){
                number[i] = `<tr><td>${author_information[i].name}</td><td>${author_information[i].profile}</td>
                            <td><a href="/author_update?id=${author_information[i].id}">Update</a></td>
                            <td><form action = "/author_delete_process" method = "post">
                            <input type = "hidden" name = "id" value = "${author_information[i].id}">
                            <input type = "submit" value = "delete">
                            </form></td></tr>`;                        
            }
            line = line + number[a];
           }
           line = line + `
           <style>
           table, th, td {
              border: 1px solid black;
           }
           </style></table>`
        return line;
    }
}
