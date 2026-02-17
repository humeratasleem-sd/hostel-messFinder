# API Testing with cURL

## Sample API Requests

### 1. Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@college.edu",
    "phone": "9876543210",
    "college": "College Name",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64a5f3...",
    "name": "John Doe",
    "email": "john@college.edu",
    "college": "College Name"
  }
}
```

---

### 2. Login a User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@college.edu",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64a5f3...",
    "name": "John Doe",
    "email": "john@college.edu",
    "college": "College Name"
  }
}
```

---

### 3. Get Current User (Protected)

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "64a5f3...",
    "name": "John Doe",
    "email": "john@college.edu",
    "phone": "9876543210",
    "college": "College Name",
    "createdAt": "2024-01-28T10:30:00Z"
  }
}
```

---

### 4. Get All Messes

```bash
curl "http://localhost:5000/api/messes"
```

**With Filters:**
```bash
curl "http://localhost:5000/api/messes?search=hostel&foodType=Both&priceMin=2000&priceMax=3000&ratingMin=3"
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "64a5f3...",
      "name": "Golden Fork Mess",
      "location": "DU Campus",
      "monthlyPrice": 2500,
      "foodType": "Both",
      "hygieneRating": 4.2,
      "foodQualityRating": 4.0,
      "overallRating": 4.1,
      "totalReviews": 15
    }
  ]
}
```

---

### 5. Get Single Mess

```bash
curl http://localhost:5000/api/messes/64a5f3abc123def456
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64a5f3...",
    "name": "Golden Fork Mess",
    "location": "DU Campus",
    "monthlyPrice": 2500,
    "foodType": "Both",
    "description": "Best mess for North Indian food",
    "phoneNumber": "9876543210",
    "website": "https://example.com",
    "hygieneRating": 4.2,
    "foodQualityRating": 4.0,
    "overallRating": 4.1,
    "totalReviews": 15
  }
}
```

---

### 6. Get Reviews for a Mess

```bash
curl http://localhost:5000/api/reviews/mess/64a5f3abc123def456
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64a5f3...",
      "userId": {
        "_id": "64a5f3...",
        "name": "John Doe",
        "college": "College Name"
      },
      "messId": "64a5f3...",
      "rating": 4,
      "hygieneRating": 4,
      "foodQualityRating": 4,
      "review": "Great food and hygiene standards",
      "verifiedStudent": true,
      "createdAt": "2024-01-28T10:30:00Z"
    }
  ]
}
```

---

### 7. Create a Review (Protected)

```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "messId": "64a5f3abc123def456",
    "rating": 4,
    "hygieneRating": 4,
    "foodQualityRating": 4,
    "review": "Great food quality and clean environment. Highly recommended!"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64a5f3...",
    "userId": {
      "_id": "64a5f3...",
      "name": "John Doe",
      "college": "College Name"
    },
    "messId": "64a5f3...",
    "rating": 4,
    "hygieneRating": 4,
    "foodQualityRating": 4,
    "review": "Great food quality and clean environment. Highly recommended!",
    "verifiedStudent": true,
    "createdAt": "2024-01-28T10:30:00Z"
  }
}
```

---

### 8. Update a Review (Protected)

```bash
curl -X PUT http://localhost:5000/api/reviews/64a5f3abc123def456 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "rating": 5,
    "review": "Updated review text - even better now!"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64a5f3...",
    "rating": 5,
    "review": "Updated review text - even better now!",
    "updatedAt": "2024-01-28T11:00:00Z"
  }
}
```

---

### 9. Delete a Review (Protected)

```bash
curl -X DELETE http://localhost:5000/api/reviews/64a5f3abc123def456 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

### 10. Get User's Reviews (Protected)

```bash
curl http://localhost:5000/api/reviews/user/my-reviews \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64a5f3...",
      "messId": {
        "_id": "64a5f3...",
        "name": "Golden Fork Mess",
        "location": "DU Campus",
        "monthlyPrice": 2500
      },
      "rating": 4,
      "review": "Great experience",
      "createdAt": "2024-01-28T10:30:00Z"
    }
  ]
}
```

---

## Using Postman

### Setup Collection

1. **Import these requests:**

**Auth - Register**
- Method: POST
- URL: `http://localhost:5000/api/auth/register`
- Body (JSON):
```json
{
  "name": "John Doe",
  "email": "john@college.edu",
  "phone": "9876543210",
  "college": "College Name",
  "password": "password123"
}
```

**Auth - Login**
- Method: POST
- URL: `http://localhost:5000/api/auth/login`
- Body (JSON):
```json
{
  "email": "john@college.edu",
  "password": "password123"
}
```

**Messes - Get All**
- Method: GET
- URL: `http://localhost:5000/api/messes`

**Reviews - Create**
- Method: POST
- URL: `http://localhost:5000/api/reviews`
- Headers: `Authorization: Bearer <token>`
- Body (JSON):
```json
{
  "messId": "64a5f3abc123def456",
  "rating": 4,
  "hygieneRating": 4,
  "foodQualityRating": 4,
  "review": "Great mess with good food and hygiene"
}
```

---

## Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### Authentication Error
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Resource Not Found
```json
{
  "success": false,
  "message": "Mess not found"
}
```

### Duplicate Review
```json
{
  "success": false,
  "message": "You have already reviewed this mess. Edit your existing review instead."
}
```

---

## Testing Steps

1. **Register a new user**
   - Save the token

2. **Use token for subsequent requests**
   - Add to Authorization header

3. **Create sample mess** (if needed)
   - Data pre-seeded via seed.js

4. **Create a review**
   - Use mess ID from get messes request

5. **Update the review**
   - Change rating or text

6. **Delete the review**
   - Confirm deletion

---

**Save this file for quick API reference!**
