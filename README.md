# credit_mountain

- run `npm install` or `yarn install`
- create a file named `.env` in the root directory and add all the env variables as denoted in `.env.example` file
- before everything, configure `postgresql` to run in localhost
- open an integrated terminal and run `npm run dev` for starting the server. the server will be listening on [http://localhost:4000/v1](http://localhost:4000/v1)
- if you need to alter the database models, just run `npm run dev alter`
- you can compile the typescript and run it as javascript, just run `npm run build` and start the server using `npm start`. make sure, in the `.env` file, **NODE_ENV** variable is set to `development`
