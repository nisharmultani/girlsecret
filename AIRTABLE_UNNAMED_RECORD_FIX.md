# Fix "Unnamed Record" in Airtable Wishlists

## The Problem
When you look at the Wishlists table, the UserId and ProductId columns show "unnamed record" instead of the actual user/product names.

## The Solution

### For Products Table:
1. Open your **Products** table in Airtable
2. Look at the first column (usually "Name")
3. Click the dropdown arrow on the "Name" column header
4. Select **"Customize field type"**
5. In the field settings, check the box that says **"Use this field as the primary field"**
6. Save

Now the Wishlists table will show product names instead of "unnamed record"!

### For Users Table:
1. Open your **Users** table in Airtable
2. Look for the "Email" column (or "FirstName")
3. Click the dropdown arrow on the column header
4. Select **"Customize field type"**
5. Check **"Use this field as the primary field"**
6. Save

Now the Wishlists table will show user emails/names instead of "unnamed record"!

### Alternative: Formula Field for Better Display
You can also create a formula field in the Users table:

1. Add a new field called "Display Name"
2. Type: Formula
3. Formula: `{FirstName} & " " & {LastName} & " (" & {Email} & ")"`
4. Make this the primary field

This will show "John Doe (john@example.com)" in the wishlist!

---

## Quick Check
After setting primary fields:
- Go to Wishlists table
- The UserId column should show user emails or names
- The ProductId column should show product names
- No more "unnamed record"! ✅
