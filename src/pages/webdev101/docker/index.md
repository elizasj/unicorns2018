---
date: '2018-03-21T00:00:00Z'
tags: ['tooling', 'DNS', 'containers', 'webdev101']
title: 'Docker (pt1)'
category: 'webdev101'
---

Containers are not a new idea in the programing world, but when I first encountered <a href="https://www.google.fr/search?q=docker&ie=utf-8&oe=utf-8&client=firefox-b-ab&gfe_rd=cr&dcr=0&ei=pYytWvXgFvGZX6LjsbgN" target="_blank">Docker</a>, which essentially _containerizes all the things_, I have to admit I was pretty overwhelemed. It's a universe unto itself, and there’s definitely a bit of a learning curve when it comes to getting your bearings with this tool/set of tools (because there's Docker, and then all the different parts of Docker and how they all work together...)

## Some vocabulary

- - images
- - containers
- - volumes
- - servers
- - ports

## Some Context

My first steps using <a href="https://www.docker.com" target="_blank">Docker</a> had me feeling like I was writing something similar to the <a href=“https://en.wikipedia.org/wiki/Pseudocode” target="_blank">pseudo code</a> I sometimes use to hash out ideas. Wich is kind of cool because that means it felt familiar, inviting, unintimidating even. But pseudo code can also kind of feel abstract if you're not sure what's happening under the hood. I quickly realised that I needed a refresher in all things networking to really be able to use Docker to it’s full potential. This is especially true if you’re using Docker on a Mac.

Docker plays most friendly with Linux systems because it was conceived for linux systems first and foremost, and requires a virtual machine (vm) to run on a Mac (which carries with it a tinge of irony, considering one of the main arguments for Docker being so great is that it's so much lighter and faster than a vm... but annnyways...)

When you install <a href="https://docs.docker.com/docker-for-mac/" target="_blank">docker-for-mac</a> on your system, just keep in mind that any `ports` you expose in your `Dockerfile` will have to be mapped to ports outside the vm in order to render anything into the browser. Hold on to that thought, because we’ll come back to it in a minute.

### Images

`Images` are snapshots of programs. For example, if you have a development environment all set up, and you want to turn it into an image, you’d create a Dockerfile just outside your project directory and fill it with everything your project needs to run.

Here is an example of an image I created for a locally hosted <a href="https://www.gatsbyjs.org" target="_blank">Gatsbyjs</a> project:

```JSON
//Dockerfile
#build
FROM node:9
WORKDIR /var/www/html
COPY entrypoint.sh /entrypoint.sh
RUN npm install --global gatsby-cli
EXPOSE 8888
ENV CHOKIDAR_USEPOLLING=true CHOKIDAR_INTERVAL=1
#run
CMD /entrypoint.sh
```

- - **FROM** indicates what image of Node I'm relying on to run my project (an image I pulled from <a href="https://hub.docker.com/" target="_blank">docker-hub</a>.)
- - **WORKDIR** here I specify where on the server to point the locally hosted project files when the container is running
- - **COPY** grabs a file (in this case a bash file, `entrypoint.sh`, and copies it's contents to a new file (in this case a file of the same name)
- - **RUN** does what you'd expect, aka run a command as if in the terminal
- - **EXPOSE** exposes the port of your choice so that it can be found by the browser (or, if need be, another container)
- - **ENV** is where you can define any environement variables needed
- - **CMD** runs the final comand to get everything going. (In this case the final comand reaches into the `entrypoint.sh` and boots up the Gatsbyjs project)

```Bash
//entrypoint.sh
#! /bin/bash
yarn
gatsby develop --host 0.0.0.0 --port 8888
```

#### N.B. - This image is for a development workflow, so I created a bash file to be able to run yarn dynamically when I start up my docker container. This is so that Gatsby doesn’t run until all the files are on the file system (...via the bind mount, which I'll explain in a second. But just keep in mind that when the image is production ready, this step wouldn't be needed.)

### Containers:

A `container` is an instance of an `image` that you can modify/config to your personal needs. You generally have one service per container - a simple example would be your web service, your backoffice cms, and your database. Each has their own container and if you stop a container, you kill your instance and any data you were using within it is wiped out.

Above I showed you how to create an `image` based on local project files. In my `Dockerfile`, I had to specify an entry point in a bash file, which runs the commands to boot up the project from the local folder. Since it’s a working development environment, I want to be able to modify my files and see the changes rendered in the browser.

### Bind Mounts vs Volumes

Enter `volumes` & `bind mounts`, which are specifically designed to allow your changes to be taken into account by the container (or say, if you needed some data to persist through any future containers you might start/stop, but more on this later.)

Essentially we have three options here:

There are **volumes**, which can be assigned to a mount point in the container, and are either randomly named, **anonymous volumes**, which are automatically created by Docker when requested by the Dockerfile instructions, or else **Named volumes**, which you create manually and assign yourself.

Then there there are **bind mounts**, which link together a directory on your host (for example my local Gatsby project) to a directory in a container (the instance of the image I created of my local Gatsby project).

I chose to use a bind mount in order to be able to continue working on my project from outside the container, in my code editor and have those changes be taken into account in the container (and thus render out into the browser in real time, because of Gatsby's built in HMR.)

**NOTE:** a quick word on **"mount"**, which can be a bit of a 'fuzzy' term for some of us _ ahem _ ... so what does it mean?

Mounting something refers to taking some data and making it appear in a directory (which we'll call a _mount point_). But we're not actually copying any data here, **there are no files being moved around**. Instead, our files kind of exist in <a href="https://www.youtube.com/watch?v=OMlYpH1lOYg" target="_blank">two places at once</a>. (Yes I did just make that reference. #2000s).

From the pov of the kernel, the files are the same. Mounting basically means telling the computer, "Hey, see that data there, those bits? Make sense of those and mirror them at the point they're at there, over here at this other point."

## Piecing it all together:

#### 1. Build your docker image

```javascript
docker build -t gatsbylocal .
```

- - `-t` is a tag flag that your giving to your image, which is helpful when you’re in the terminal figuring out what’s happening
- - the `.` means build from the current directory. Your location in the terminal when you run this command is important.

#### 2. Run your docker container and use a volume to siphon in the files from your locally stored project, to the server

```javascript
docker run -d --name gatsbystory -p 8888:8888  -v $(pwd)/gatsby:/var/www/html  gatsbylocal
```

- - `-d` is a tag that gets things running in the background so you can still work in your terminal
- - We're `--name`-ing the container **gatsbystory**
- - The `-p` tag maps the `port` defined on the right to the one on the left, which kind of feels backwards, right? But **HOST_PORT:CONTAINER_PORT**. In this case they're both the same but IRL you can change the port on the left to whatever you want. The command basically makes whatever is running on **port 8888** (the port that u exposed in your initial Docker image, remember) accessible by **localhost:8888** in the browser. On a linux machine you wouldn’t need to explicitly tell docker where to look. This is entirely because of how Docker works from within a vm on a Mac.
- - `-v` attaches our `bind mount` to the local project folder (in this case, **gatsby**) and sends any changes made to that folder to the destination path on the server being run in your docker instance.

When you run this command, you'll have a working instance, and thanks to the mount you set up, any changes you make while developing will be taken into account directly in the browser. Great!

**↳** If you're getting hit with any errors, feel free to compare and contrast with the <a href="https://github.com/elizasj/gatsby-story-cockpit-docker" target="_blank">original project</a> files.

## Next Steps...

But if each service goes into a seperate container... how do you make containers work together? How would I hook up my Gatsbyjs project to a backoffice cms, (which requires a database,) and how would I funnel the data into my Gatsby project?

Thankfully, Docker provides a handy tool in the way of docker-compose, to help us link together any containers we want - which I explain in <a href="https://www.unicornsfartpixels.com/quicktips/2018-03-15docker-compose/" target="_blank">Docker (pt2)</a> 👈.
