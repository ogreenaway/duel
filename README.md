# How to run locally

### Step 1: Add the ten thousand json files to the /server/initial_data folder

I didn't want to leak your data in a public git repository, so you have to add it manually.

### Step 2: Check you have recent Node and NPM versions

`node -v`
`npm -v`

I'm using v22.15.0 and v10.9.2, but it should work with any recent version.

### Step 3: Run MongoDB locally

Set the URL to `mongodb://localhost:27017/duel`

### Step 4: Install dependencies and run the server

- npm i
- npm start
- url: http://localhost:3000/

# Insights about the data

# Improvements

- Add HTTPS
- Add Prettier

# Deliberate omissions

- Authentication
