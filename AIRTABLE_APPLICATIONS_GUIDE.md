# Application Storage in Airtable - Guide

## Current Setup

### Where Applications Are Stored

**All applications currently go to the same Airtable table: `ContactMessages`**

This includes:
- Career applications (from `/careers` page)
- Ambassador applications (from `/ambassador-program` page)
- Influencer applications (from `/influencer-program` page)
- Regular contact form submissions (from `/contact` page)

### How to Identify Application Types

Applications are stored with different **Subject** fields:

| Application Type | Subject Field |
|-----------------|---------------|
| **Career Application** | `Career Application - [Position Name]` |
| **Ambassador Application** | `Brand Ambassador Application` |
| **Influencer Application** | `Influencer Program Application` |
| **Contact Form** | `[User's Subject]` |

### Current Database Schema

**Table: ContactMessages**

| Field Name | Type | Description |
|-----------|------|-------------|
| Name | Text | Applicant's full name |
| Email | Email | Applicant's email address |
| Subject | Text | Type of application/message |
| Message | Long Text | Full application details including all form fields |
| SubmittedAt | Date/Time | Submission timestamp |
| Status | Single Select | New, Read, Replied, Resolved |

### Example Records

#### Career Application
```
Name: John Smith
Email: john@example.com
Subject: Career Application - E-commerce Manager
Message: Position: E-commerce Manager
         Experience: 3-5
         Cover Letter: I am passionate about...
         Phone: 07123456789
         Resume: https://drive.google.com/...
SubmittedAt: 2024-11-16 10:30:00
Status: New
```

#### Ambassador Application
```
Name: Sarah Jones
Email: sarah@example.com
Subject: Brand Ambassador Application
Message: Why You: I love GirlSecret because...
         Experience: I have 5000 followers on Instagram...
         City: London
         University: King's College London
         Phone: 07987654321
SubmittedAt: 2024-11-16 11:15:00
Status: New
```

#### Influencer Application
```
Name: Emma Wilson
Email: emma@example.com
Subject: Influencer Program Application
Message: Position: Influencer Program Application
         Followers: 10k-50k
         Instagram: @emmawilson
         Niche: Fashion
         Why: I believe in your brand values...
SubmittedAt: 2024-11-16 12:00:00
Status: New
```

---

## ⚠️ Current Limitations

1. **No Dedicated Fields** - All application data is stored in the generic "Message" field
2. **Difficult to Filter** - Have to filter by subject text to find specific application types
3. **Hard to Analyze** - Can't easily sort by follower count, position, etc.
4. **No Type Field** - Would be better to have a "Type" field with options: Contact, Career, Ambassador, Influencer

---

## 🎯 Recommended Improvements

### Option 1: Add Type Field (Quick Fix)
Add a new field to ContactMessages table:

**New Field:**
- `Type` (Single Select): Contact, Career, Ambassador, Influencer

**Implementation:**
1. Add "Type" column in Airtable ContactMessages table
2. Update `/pages/api/contact.js` to accept `type` parameter
3. Update forms to send `type` in request body
4. Filter by Type instead of Subject

### Option 2: Separate Tables (Better Organization)

Create dedicated tables for each application type:

#### Table: CareerApplications
| Field | Type |
|-------|------|
| Name | Text |
| Email | Email |
| Phone | Phone |
| Position | Single Select (from available positions) |
| Experience | Single Select (0-1, 1-3, 3-5, 5-10, 10+) |
| ResumeLink | URL |
| CoverLetter | Long Text |
| SubmittedAt | Date/Time |
| Status | Single Select (New, Reviewing, Interview, Rejected, Hired) |

#### Table: AmbassadorApplications
| Field | Type |
|-------|------|
| Name | Text |
| Email | Email |
| Phone | Phone |
| City | Text |
| University | Text |
| WhyYou | Long Text |
| Experience | Long Text |
| SubmittedAt | Date/Time |
| Status | Single Select (New, Reviewing, Accepted, Rejected) |

#### Table: InfluencerApplications
| Field | Type |
|-------|------|
| Name | Text |
| Email | Email |
| InstagramHandle | Text |
| FollowerCount | Single Select (5k-10k, 10k-50k, 50k-100k, 100k+) |
| Niche | Single Select (Fashion, Lifestyle, Beauty, Fitness, Other) |
| WhyPartner | Long Text |
| SubmittedAt | Date/Time |
| Status | Single Select (New, Reviewing, Approved, Rejected) |
| CommissionRate | Percent (if approved) |
| ReferralCode | Text (if approved) |

---

## 🚀 How to Implement Separate Tables

### Step 1: Create Airtable Tables

1. Log into your Airtable account
2. Go to your GirlSecret base
3. Create three new tables:
   - `CareerApplications`
   - `AmbassadorApplications`
   - `InfluencerApplications`
4. Add the fields listed above

### Step 2: Update airtable.js

Add to `/lib/airtable.js`:

```javascript
const CAREER_APPLICATIONS_TABLE = 'CareerApplications';
const AMBASSADOR_APPLICATIONS_TABLE = 'AmbassadorApplications';
const INFLUENCER_APPLICATIONS_TABLE = 'InfluencerApplications';

export async function createCareerApplication(data) {
  const base = getBase();
  if (!base) return { success: false };

  const record = await base(CAREER_APPLICATIONS_TABLE).create({
    Name: data.name,
    Email: data.email,
    Phone: data.phone,
    Position: data.position,
    Experience: data.experience,
    ResumeLink: data.resume,
    CoverLetter: data.coverLetter,
    SubmittedAt: new Date().toISOString(),
    Status: 'New'
  });

  return { success: true, id: record.id };
}

export async function createAmbassadorApplication(data) {
  const base = getBase();
  if (!base) return { success: false };

  const record = await base(AMBASSADOR_APPLICATIONS_TABLE).create({
    Name: data.name,
    Email: data.email,
    Phone: data.phone,
    City: data.city,
    University: data.university || '',
    WhyYou: data.whyYou,
    Experience: data.experience,
    SubmittedAt: new Date().toISOString(),
    Status: 'New'
  });

  return { success: true, id: record.id };
}

export async function createInfluencerApplication(data) {
  const base = getBase();
  if (!base) return { success: false };

  const record = await base(INFLUENCER_APPLICATIONS_TABLE).create({
    Name: data.name,
    Email: data.email,
    InstagramHandle: data.instagram,
    FollowerCount: data.followers,
    Niche: data.niche,
    WhyPartner: data.message,
    SubmittedAt: new Date().toISOString(),
    Status: 'New'
  });

  return { success: true, id: record.id };
}
```

### Step 3: Update Forms

Update each form to use the appropriate function instead of the generic contact endpoint.

---

## 📊 Current Access

### How to View Applications in Airtable

1. Go to https://airtable.com
2. Open your GirlSecret base
3. Click on "ContactMessages" table
4. Use filters to view specific types:
   - Filter: `Subject` contains "Career Application"
   - Filter: `Subject` contains "Brand Ambassador"
   - Filter: `Subject` contains "Influencer Program"

### Export Applications

1. In Airtable, apply your filter
2. Click the "..." menu in top right
3. Select "Download CSV"
4. Open in Excel/Google Sheets

---

## 📝 Notes

- All applications are currently working and being stored
- The current setup is functional but not optimal for long-term use
- Consider implementing separate tables when you have time
- No data will be lost - it's all in ContactMessages table
- You can retroactively move data to new tables if needed

---

## 🔍 Quick Access Links

**Airtable Base:** Use your Airtable account to access

**Filter Shortcuts:**
- Careers: Filter by `Subject = "Career Application"`
- Ambassadors: Filter by `Subject = "Brand Ambassador Application"`
- Influencers: Filter by `Subject = "Influencer Program Application"`
- Regular Contact: Filter by `Subject` NOT containing the above

---

Last Updated: November 16, 2024
