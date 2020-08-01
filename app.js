const http = require('http');
const { parse } = require('querystring');
const fs = require('fs');

const server = http.createServer((req, res) => {
	if (req.method === 'POST' && req.url == '/create') {
		collectPostData(req, result => {
      //user must enter a name to create a file else return "enter a flie name"
      //Implement folder to save .txt file or save .txt file to ./default
      // check if folder exist, if true check if file exist if true, then you cant create again, else create folder or file
      // if no folder name create file in ./default
      const { name, content } = result;
			
			try {
        if (!name.length || !content.length) {
					res.end(`File name or note content cannot be empty.`);
        }
				else if (fs.existsSync(`./notes/${name}.txt`)) {
					res.end(`File already exist, try using another name.`);
				} 
				else {
					// Create new file to ./notes 
					fs.writeFile(`./notes/${name}.txt`, content, (err) => {
						if (err) {
							res.end(err);
						}
						else {
							res.end(`Successfully created ${name}.txt file.`);
						}
					});
				}
			} 
			catch (err) {
				console.error(err);
			}
		});
	} 
	else if (req.method === 'POST' && req.url == '/update') {
		collectPostData(req, result => {
			const { name, content } = result;

			// Update file
			try {
        if (!name.length || !content.length) {
					res.end(`File name or note content cannot be empty.`);
        }
				else if (fs.existsSync(`./notes/${name}.txt`)) {
					fs.writeFile(`./notes/${name}.txt`, content, (err) => {
						if (err) {
							res.end(err);
						}
						else {
							res.end(`Updated ${name}.txt file successfully.`);
						}
					});
				} 
				else {
					res.end(`The file you're trying to update ${name}.txt does not exist. Create the file and try again!`);
				}
			} 
			catch (err) {
				console.error(err);
			}
		})
	}
	else if (req.method === 'POST' && req.url == '/delete') {
		collectPostData(req, result => {
      const { name } = result;
      if (!name.length) {
        res.end(`File name cannot be empty.`);
      }

			// Delete file
			fs.unlink(`./notes/${name}.txt`, function (err) {
				if (err) {
					res.end(`File you want to delete does not exist.`);
				}
				else {
					res.end(`Deleted ${name}.txt file successfully.`);
				}
			});
		})
	}
	else {
		res.end(`Ooops! Kindly check doc on how to use our endpoints`);
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