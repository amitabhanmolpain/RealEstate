# Properties Backend Setup Guide

## What's Created

### Backend Files

1. **Model** - `app/models/property_model.py`
   - Property document schema with all fields
   - Indexes for faster queries (city, type, date, featured)

2. **Controller** - `app/controllers/property_controller.py`
   - `get_all_properties()` - Paginated property listing with filters
   - `get_featured_properties()` - Get top featured properties
   - `get_property_by_id()` - Get single property details
   - `create_property()` - Create new property (admin)
   - `update_property()` - Update property (admin)
   - `delete_property()` - Delete property (admin)

3. **Routes** - `app/routes/property_routes.py`
   - `GET /properties` - List all properties (supports pagination & filters)
   - `POST /properties` - Create property (admin)
   - `GET /properties/<id>` - Get property details
   - `PUT /properties/<id>` - Update property (admin)
   - `DELETE /properties/<id>` - Delete property (admin)
   - `GET /properties/featured` - Get featured properties

4. **Seed Script** - `backend/seed.py`
   - Populates database with initial properties

### Frontend Files

1. **Service** - `src/services/propertyService.js`
   - `getProperties()` - Fetch paginated properties
   - `getFeaturedProperties()` - Fetch featured properties
   - `getPropertyById()` - Fetch single property
   - Create/Update/Delete methods for admin

## Setup Instructions

### Step 1: Seed the Database

Run this command once to populate MongoDB with properties:

```bash
cd backend
python seed.py
```

Expected output:
```
✓ Cleared existing properties
✓ Seeded database with 8 properties
Property Summary:
  Total: 8
  Featured: 3
  Verified: 7
```

### Step 2: Start Backend

```bash
cd backend
python run.py
```

### Step 3: Start Frontend

```bash
cd RealEstate
npm run dev
```

## API Endpoints

### Get Paginated Properties
```
GET /properties?page=1&city=Mumbai&type=Apartment&minPrice=2000000&maxPrice=50000000
```

Response:
```json
{
  "properties": [...],
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "total_items": 32,
    "items_per_page": 12
  }
}
```

### Get Featured Properties
```
GET /properties/featured?limit=6
```

### Get Single Property
```
GET /properties/{property_id}
```

### Create Property (Admin)
```
POST /properties
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "3 BHK Apartment",
  "description": "...",
  "location": "Mumbai",
  "city": "Mumbai",
  "property_type": "Apartment",
  "price": 5000000,
  "area": 1200,
  "bedrooms": 3,
  "bathrooms": 2,
  "image": "https://...",
  "amenities": ["Gym", "Pool"],
  "featured": false,
  "verified": true
}
```

## Frontend Integration

To use in your components:

```jsx
import { propertyService } from '../services/propertyService';

// Fetch properties
const data = await propertyService.getProperties(1, { city: 'Mumbai' });
console.log(data.properties); // Array of properties
console.log(data.pagination); // Pagination info

// Fetch featured
const featured = await propertyService.getFeaturedProperties(6);
```

## Pagination

- **Default:** 12 properties per page
- **Query Parameters:**
  - `page` - Page number (default: 1)
  - `city` - Filter by city
  - `type` - Filter by property type
  - `minPrice` - Minimum price filter
  - `maxPrice` - Maximum price filter

## Database Schema

Properties are indexed by:
- City
- Property Type
- Posted Date
- Featured status

This ensures fast queries for filtering and sorting.

## Next Steps

1. Update `Projects.jsx` to fetch from API instead of static data
2. Update `PropertyDetail.jsx` to fetch single property
3. Add pagination UI to properties listing
4. Add admin panel for create/update/delete
