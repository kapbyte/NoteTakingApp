const http = require('http');
const { parse } = require('querystring');
const fs = require('fs');


const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url == '/create') {
    collectPostData(req, result => {
      console.log(result)
      const { name, content, folder } = result;
      
      try {
        if (!name.length || !content.length) {
          res.end(`File name or note content cannot be empty.`);
        }
        else if (!folder.length) {
          if (fs.existsSync(`./default/${name}.txt`)) {
            res.end(`./default/${name}.txt already exist, try using another file name.`);
          }
          else {
            // Create new file to ./default 
            fs.writeFile(`./default/${name}.txt`, content, (err) => {
              if (err) {
                res.end(err);
              }
              else {
                res.end(`Successfully created ./default/${name}.txt`);
              }
            });
          }
        }
        else if (fs.existsSync(`./${folder}`) && !fs.existsSync(`./${folder}/${name}.txt`)) {
          // Create new file to ./${folder} 
          fs.writeFile(`./${folder}/${name}.txt`, content, (err) => {
            if (err) {
              res.end(err);
            }
            else {
              res.end(`Successfully created ./${folder}/${name}.txt`);
            }
          });
        }
        else {
          // Check if file exist in the ./${folder}
          if (fs.existsSync(`./${folder}/${name}.txt`)) {
            res.end(`./${folder}/${name}.txt already exist, try using another file name.`);
          }
          else {
            fs.mkdir(`${folder}`, (err) => {
              if (err) {
                res.end(err);
              }
              else {
                // Create new file to ./${folder} 
                fs.writeFile(`./${folder}/${name}.txt`, content, (err) => {
                  if (err) {
                    res.end(err);
                  }
                  else {
                    res.end(`Successfully created ./${folder}/${name}.txt directory.`);
                  }
                });
              }
            });
          }
        }
      } catch (err) {
        console.error(err);
        res.end(`Ooops! Something went wrong.`);
      }
    });
  }

  // update file
  else if (req.method === 'PUT' && req.url == '/update') {
    collectPostData(req, result => {
      const { name, content, folder } = result;

      try {
        if (!name.length || !content.length || !folder.length) {
          res.end(`name, content, folder => All fields are required`);
        }
        else if (!fs.existsSync(`./${folder}`)) {
          res.end(`./${folder} does not exist.`);
        }
        else if (!fs.existsSync(`./${folder}/${name}.txt`)) {
          res.end(`./${folder}/${name}.txt does not exist.`);
        }
        else if (fs.existsSync(`./${folder}/${name}.txt`)) {
          fs.writeFile(`./${folder}/${name}.txt`, content, (err) => {
            if (err) {
              res.end(err);
            }
            else {
              res.end(`Updated ./${folder}/${name}.txt successfully.`);
            }
          });
        } 
        else {
          res.end(`./${folder}/${name}.txt does not exist.`);
        }
      } catch (err) {
        console.error(err);
        res.end(`Ooops! Something went wrong.`);
      }
    });
  }
    
  // delete api
  else if (req.method === 'DELETE' && req.url == '/delete') {
    collectPostData(req, result => {
      const { name, folder } = result;
      if (!name.length || !folder.length) {
        res.end(`Folder or file name cannot be empty.`);
      }
      else if (!fs.existsSync(`./${folder}`)) {
        res.end(`./${folder} does not exist.`);
      }
      else if (!fs.existsSync(`./${folder}/${name}.txt`)) {
        res.end(`./${folder}/${name}.txt does not exist.`);
      }
      else {
        fs.readdir(`./${folder}`, function(err, files) {
          if (err) {
            res.end(err);
          }
          else {
            if (files.length > 1) {
              fs.unlink(`./${folder}/${name}.txt`, function (err) {
                if (err) {
                  res.end(err);
                }
                else {
                  res.end(`Deleted ${name}.txt file successfully.`);
                }
              });
            }
            else {
              fs.unlink(`./${folder}/${name}.txt`, function (err) {
                if (err) {
                  res.end(err);
                }
                else {
                  fs.rmdir(`./${folder}`, (err) => {
                    if (err) res.end(err);
                    res.end(`Empty folder ./${folder} deleted successfully.`);
                  });
                }
              });
            }
          }
        });
      }
    });
  }

  // Undone
  else if (req.method === 'POST' && req.url == '/notes') {
    fs.readdir('./', function(err, items) {
      if (err) res.end(err);
      for (var i = 0; i < items.length; i++) {
        var stats = fs.statSync(`${items[i]}`);
        if (stats.isDirectory()) {
          fs.readdir(`${items[i]}`, (err, files) => {
            if (err) res.end(err);
            var result = "";
            files.forEach(file => {
              if (file.endsWith(`.txt`)) {
                console.log(`${file}\n`);
                result+=`${file}\n`
              }
            });
            console.log("result -> ", result);
          });
        }
      }
    });
  }
    
  // read api
  else if (req.method === 'POST' && req.url ==='/read') {
    collectPostData(req, result => {
      const { name, folder } = result;
      if (!folder.length || !name.length) {
        res.end(`Folder or file name cannot be empty.`);
      }
      else if (!fs.existsSync(`./${folder}`)) {
        res.end(`./${folder} does not exist.`);
      }
      else if (!fs.existsSync(`./${folder}/${name}.txt`)) {
        res.end(`./${folder}/${name}.txt does not exist.`);
      }
      else {
        fs.readFile(`./${folder}/${name}.txt`, `utf8`, function (err, data) {
          if (err) {
            res.end(err);
          }
          res.end(`${data}`);
        });
      }
    });
  }

  else {
    res.end(`<html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
    </head>
    <body>
      <form >
        <label for="name">Name:</label>
        <input type="text" id="name" name="name"><br><br>
        <label for="content">Content:</label>
        <input type="text" id="content" name="content"><br><br>
        <label for="folder">Folder:</label>
        <input type="text" id="folder" name="folder"><br><br>
        <input type="submit" value="Submit" name="submit">
        <input type="submit" value="Update" name="update">
        <input type="submit" value="Delete" name="delete">
        <input type="submit" value="Read Note" name="read">
      </form>
    
      <script>
        const form = document.querySelector('form');

        form['submit'].onclick = function (e){
          e.preventDefault();
          const name = form['name'].value;
          const content = form['content'].value;
          const folder = form['folder'].value;

          var urlencoded = new URLSearchParams();
          urlencoded.append("name", name);
          urlencoded.append("content", content);
          urlencoded.append("folder", folder);

          fetch("/create", {
            method: 'POST',
            headers: {
               "Content-Type": "application/x-www-form-urlencoded"
            },
            body  : urlencoded,
          }).then(res =>{
            res.text().then(result => alert(result))
          })
        }

        form['read'].onclick = function (e){
          e.preventDefault();
          const name = form['name'].value;
          const folder = form['folder'].value;

          var urlencoded = new URLSearchParams();
          urlencoded.append("name", name);
          urlencoded.append("content", content);
          urlencoded.append("folder", folder);

          fetch("/read", {
            method: 'POST',
            headers: {
               "Content-Type": "application/x-www-form-urlencoded"
            },
            body  : urlencoded,
          }).then(res =>{
            res.text().then(result => alert(result))
          })
        }

        form['update'].onclick = function (e){
          e.preventDefault();
          const name = form['name'].value;
          const content = form['content'].value;
          const folder = form['folder'].value;

          var urlencoded = new URLSearchParams();
          urlencoded.append("name", name);
          urlencoded.append("content", content);
          urlencoded.append("folder", folder);

          fetch("/update", {
            method: 'PUT',
            headers: {
               "Content-Type": "application/x-www-form-urlencoded"
            },
            body  : urlencoded,
          }).then(res =>{
            res.text().then(result => alert(result))
          })
        }

        form['delete'].onclick = function (e){
          e.preventDefault();
          const name = form['name'].value;
          const content = form['content'].value;
          const folder = form['folder'].value;

          var urlencoded = new URLSearchParams();
          urlencoded.append("name", name);
          urlencoded.append("content", content);
          urlencoded.append("folder", folder);

          fetch("/delete", {
            method: 'DELETE',
            headers: {
               "Content-Type": "application/x-www-form-urlencoded"
            },
            body  : urlencoded,
          }).then(res =>{
            res.text().then(result => alert(result))
          })
        }
      </script>
    </body>
    </html>`);
  }
});
  
function collectPostData(request, callback) {
  if (request.headers['content-type'] === 'application/x-www-form-urlencoded') {
    let body = '';
    request.on('data', chunk => {
      body += chunk.toString();
    });
    request.on('end', () => {
      callback(parse(body));
    });
  }
  else {
    callback(null);
  }
}

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(3000);