/*
Should be a uuid string but is often null.

If it's a string, check it's unique. If it's not unique, don't add it to the database and log it.

If it isn't a string, create a uuid and add it to the database.
*/