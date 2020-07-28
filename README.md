## Aragon Path Finder 🛤
Multiple Transaction Path Visualization & Transaction Sending tool for Aragon 
<br> 

## Project Description
Currently, the Aragon connect API uses the BFS (breadth-first search) to find the shortest path automatically and forwards the transactions along that path. But for more sophisticated users the different paths like longest, shortest, etc might matter. This tool displays all the possible paths for a particular transaction. So the user can view all the possible paths and easily determine which path is longest, shortest, etc as per the requirement. This tool will also be useful for users to make sure that their transaction is indeed forwarded via the shortest path.

The application supports choosing one path from multiple available paths. Also, one can send the transaction through the chosen path using metamask. 
<br>

## Demo (Video)
[![youtube_video](https://img.youtube.com/vi/522-Q7si35w/0.jpg)](https://youtu.be/522-Q7si35w) 
<br> 

## Steps to run the project
1. Clone the repository
2. Go inside the cloned project (tx-path-finder) 
3. Install the dependency using command `npm install`
3. Run command `npm run start`, to start the application

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
