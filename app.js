const http = require('http');
const { parse } = require('querystring');
const fs = require('fs');
const url = require('url');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url == '/create') {
    collectPostData(req, result => {
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
          fs.unlink(`./${folder}/${name}.txt`, function (err) {
            if (err) res.end(err);
            res.end(`Deleted ${name}.txt file successfully.`);
          });
        }
		  });
    }
    
    // read api
    else if (req.method === 'GET') {
      var queryData = url.parse(req.url, true).query;
      const { name, folder } = queryData;
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
    }
    else {
      res.end(`Ooops! Something went wrong.`);
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