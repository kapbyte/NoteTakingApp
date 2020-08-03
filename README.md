# Note taking application

This is a basic note taking application, which uses nodejs fs module to perform CRUD operations.

### Installing
1. Make sure you have NodeJS installed on your machine
2. Clone the repo

```
https://github.com/ke1echi/NoteApp.git
```

| HTTP METHOD             | POST        | GET       | PUT         | DELETE  |
| ------------------------| ------------| --------- | ----------- | ------  |
| OPERATION               | CREATE      | READ      | UPDATE      | DELETE  |
| http://localhost:3000   | /create     | /read     | /update     | /delete |


### Usage

**http://localhost:3000/create**
```
{
  "name"    : "JavaScript",
  "content" : "JavaScript often abbreviated as JS, is a programming language that conforms to the ECMAScript specification.",
  "folder"  : "programming"
}
```
```
http://localhost:3000/create => Creates ./folder/name.txt if folder is provided else ./default/name.txt
```
![Recordit GIF](http://g.recordit.co/WORni8bQKa.gif)


```
http://localhost:3000/?name=JavaScript&folder=programming.
Reads content of ./folder/name.txt if it exists else returns an error message
```
![Recordit GIF](http://g.recordit.co/PLFn33dbd0.gif)


**http://localhost:3000/update**
```
{
  "name"    : "JavaScript",
  "content" : "JavaScript is a lightweight, interpreted programming language.",
  "folder"  : "programming"
}
```
```
http://localhost:3000/update => Updates ./folder/name.txt
```
![Recordit GIF](http://g.recordit.co/VmkoSTOGQR.gif)

**http://localhost:3000/delete**
```
{
  "name"    : "JavaScript",
  "folder"  : "programming"
}
```
```
http://localhost:3000/delete => Deletes ./folder/name.txt
```
![Recordit GIF](http://g.recordit.co/jGP0664aYB.gif)