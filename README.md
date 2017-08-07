## nodejs-personal-blog-website
My personal blog using Nodejs, Redis, and Senecajs Microservice toolkit, 

Over the last couple of evenings, I decided to brush up my beginning-to-be-rusty hands on [NodeJs](https://nodejs.org). To make it interesting, I played with using a microservices architecture and explored shared session management using [Redis](https://redis.io).  

I ended up building my personal blog as a small CMS.

Each service is an independently deployable app:

1. __Admin__: This is the backend where i create blogs. The Admin majorly utilizes the Blog Service - which sits as an independent app loaded in an iframe
2. __Blog Service__: This service creates and manages the blogs. It has an independent interface but shares session with all other services
3. __Email Service__: For sending emails (using [Sendgrid](https://sendgrid.com/)) and subscribing users
4. __Web__: The website

Services are mananged with [PM2](http://pm2.keymetrics.io/) and reverse proxied to with [Nginx](https://www.nginx.com/)
