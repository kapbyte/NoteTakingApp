# Note taking application

This is a basic note taking application, which uses nodejs fs module to perform CRUD operations.

### Installing
1. Make sure you have NodeJS installed on your machine
2. Clone the repo

```
https://github.com/ke1echi/NoteApp.git
```

### Usage

| HTTP METHOD             | POST        | GET       | PUT         | DELETE  |
| ------------------------| ------------| --------- | ----------- | ------  |
| OPERATION               | CREATE      | READ      | UPDATE      | DELETE  |
| http://localhost:3000   | /create     | /read     | /update     | /delete |

**http://localhost:3000/create**
```
{
  "name"    : "JavaScript",
  "content" : "JavaScript often abbreviated as JS, is a programming language that conforms to the ECMAScript specification.",
  "folder"  : "programming"
}
```
```
/create => creates ./folder/name.txt if folder is provided else ./default/name.txt
```
![Recordit GIF](http://g.recordit.co/WORni8bQKa.gif)

**http://localhost:3000/read**
```
{
  "name"    : "JavaScript",
  "folder"  : "programming"
}
```

```
/read => reads content of ./folder/name.txt if it exists else returns an error message
```
![Recordit GIF](http://g.recordit.co/PLFn33dbd0.gif)