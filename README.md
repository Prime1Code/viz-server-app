# viz-server-app

Visualize, monitor & track your Spring Boot microservices in a ReactJS network graph in real time. 

## Prerequisites
- [`viz-common`](https://github.com/Prime1Code/viz-common) library for receiving Spring Boot microservice data streams
- One or more Spring Boot microservices using the [`viz-common`](https://github.com/Prime1Code/viz-common) library

## How to use
- Start the Spring Boot server application `viz-server-app`
- When the server is up & running, open a browser of your choice and navigate to the ReactJS web page of your server (default should be `localhost:8100`)

## What you see
- `nodes`: all microservices receiving or sending network requests are displayed as a node in the network graph
- `links` or `edges`: all links or edges between `nodes` represent requests & responses
- `link color`: REST response codes (e.g. 200, 404, ...) are mapped to a color. Every response colors the link according to this mapping. The mapping can be customized

### Limitations
- Requests from browsers and other non Spring Boot microservices are displayed as `www` for now
