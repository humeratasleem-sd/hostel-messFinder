# Database Overview: Hostel Mess Finder

This document outlines the database technology used in the Hostel Mess Finder project, detailing how it was implemented and its direct benefits to the platform.

## 1. What Database We Used
We utilized **MongoDB**, a popular NoSQL (Not Only SQL) database. To interact with MongoDB from our Node.js/Express backend, we used **Mongoose**, which is an Object Data Modeling (ODM) library for MongoDB and Node.js.

- **MongoDB Service**: Handled via MongoDB Atlas (Cloud) or Local MongoDB depending on the `.env` configuration.
- **Data Model Paradigm**: Document-oriented. Data is stored in flexible, JSON-like format (BSON) rather than traditional rows and columns.

## 2. How We Used It

### Core Collections (Tables)
We broke the infrastructure into two primary collections that are connected via Object References (`ObjectId`).

#### A. Users Collection (`models/User.js`)
This collection handles all application users: Students, Mess Owners, and Admins.
- **Fields include:** Name, Email, Phone, Password (hashed via bcrypt), Role (`student`, `owner`, `admin`), College, and `joinedMessId`/`messOwnedId`.
- **Functionality:** Handles authentication tokens (JWT). Instead of separate tables for students and owners, everyone shares a single schema and logic dictates their permissions based on their `role` field.

#### B. Messes Collection (`models/Mess.js`)
This robust collection defines individual hostel mess services.
- **Fields include:** Mess Name, Location, Monthly Price, Food Type (Veg/Non-Veg), Description, Contact details, Facilities, and overall Review analytics (Hygiene Rating, Food Quality, total reviews).
- **Relational Linkage:** 
  - `ownerId`: References a document in the `Users` collection indicating who owns it.
  - `joinedStudents`: An array of User `ObjectIds` representing the students currently subscribed to the mess.
- **Geospatial Capabilities:** We utilized a `$near` geospatial index (2dsphere) on coordinates to fetch nearby messes efficiently.

### Using Mongoose ORM
Instead of writing native queries, we used Mongoose schemas to:
1. Validate data heavily before it ever touches the DB (e.g. throwing an error if a user's phone number isn't 10 digits).
2. Automate tasks in `pre-save` hooks (such as automatically hashing a user's password before the data commits to the DB).
3. Populate relational data seamlessly. Example:
```javascript
// Automatically fetches User details belonging to a mess owner seamlessly.
Mess.find().populate('ownerId', 'name email phone'); 
```

## 3. How It Helped Our Project

- **JSON-to-JSON Workflow:** Since our MERN stack (MongoDB, Express, React/HTML+Vanilla JS, Node) inherently uses JSON, storing the data as JSON makes the data flow naturally without painful transformations. The object outputted natively feeds our frontend without friction.
- **High Scalability & Flexibility:** Adding new fields (e.g. adding 'Evening Snacks' to a mess schedule) doesn't require complex migrations. NoSQL databases allow on-the-fly adaptations to our models.
- **Geospatial Features:** MongoDB native support for `2dsphere` indexes allowed us to effortlessly compute and find messes within a "5 KM radius" which is a core feature for the "Nearby Messes" query.
- **Relational Simplicity:** Despite being NoSQL, utilizing `mongoose.populate()` gave us all the perks of SQL JOIN operations, providing Mess data along with Owner Contact details in a single query.
- **Agile Development:** Mongoose validation removed the need to write enormous amounts of backend structural verification code, vastly speeding up development.
