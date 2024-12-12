####
This is an ecommerce api for Alziron Systems, a restaurant application that involves User[Three users: Admin, Restaurant, and User], to sign up or signin.
###
To run this application set up a text edior with NodeJS installed.
Run: npm install ,to download all necessary npm packages.
Set up the Mongo Db database either locally or Online then replace the connection string with yours.
On the terminal run the server by typing: node server , to get it running on port 9000.
Set up postman or any other, send a post request to localhost:9000/api/auth/signup. Make sure the body of the request contains username, phone, location, password, roles example given below:
localhost:9000/api/auth/signup
{
    "username": "Some name",
    "phone": 676838928,
    "location": "Bamil",
    "password": "SomeRandon!PAsswowrds"
    "roles": ["user", "user"],
}


