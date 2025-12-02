# How to run locally

### Step 1: Check you have recent Node and NPM versions

`node -v`
`npm -v`

I'm using v22.15.0 and v10.9.2, but it should work with any recent version.

### Step 2: Run MongoDB locally

Set the URL to `mongodb://localhost:27017/duel`

### Step 3: Add the ten thousand json files to the /initial_data folder

I didn't want to leak your data in a public git repository, so you have to add it manually.

### Step 4: Import the data

`npm run import-data`

### Step 5: Install dependencies and run the server

- npm i
- npm start
- url: http://localhost:3000/

# Insights about the data

- Some JSON files were missing closing brackets

# Improvements

- Add HTTPS
- Add Prettier
- Sort out IDs

# Deliberate omissions

- Authentication
