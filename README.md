# ChatsPlaysGameboy

### Clone repository 
```
cd <path to where you want to store your repository>
git clone https://github.com/sunjaeyoon/ChatsPlaysGameboy.git 
```

### Push repository
```
git status
git add -A 
git commit -m "message to push"
git push origin master
```

### Pull repository
```
git stash 
git pull origin master
git stash apply
```

### [Docker](https://docker-curriculum.com/)
Build Docker (like compiling code -- builds an image)
```
cd <path to the root directory of this repo>
docker build -t chatplaysgameboy:1.0.0 .
```

Running Docker (running the image -- builds a container that will run the chat server)
```
docker run --name="chatPokemon" -d -p 8080:8080 chatplaysgameboy:1.0.0
```
> Note that 8080:8080 indicates that you want to take traffic from the container's 8080 port (the second value) and expose it to your local machine at port 8080 (the first value) -- you can change the first value to another port so long as it isn't already occupied

Looking into the docker container
```
docker ps 
```
If your docker container is running the server properly, you should see an entry below the first row that indicates the image `chatplaysgameboy:1.0.0` in use. 

example:
```
612c3125e077        chatplaysgameboy:1.0.0   "docker-entrypoint.s…"   13 hours ago        Up 13 hours         0.0.0.0:8080->8080/tcp   chatPokemon
```

Copy the container ID (its the first column) and replace `<container name>` with the container ID

```
docker exec -it <container name> /bin/bash
```

After running the above command, you will be inside the container terminal at the `WORKDIR` I specified `/usr/src/app`. Run `ls` to see all the files from your root directory (in the Dockerfile, I basically specify docker to copy the necessary node files like `server.js` into docker's linux system). The `CMD` argument at the end of the docker file does all the magic and runs the server.

example:
```
root@e4c3e7a7c5c4:/usr/src/app# ls
node_modules  package-lock.json  package.json  public  router.js  server.js
```

### Debugging Docker

If you just want to see the terminal, but don't want to actually start the server -- ie in case docker ps shows no entries, run

```
docker run -it --entrypoint /bin/bash chatplaysgameboy:1.0.0
```