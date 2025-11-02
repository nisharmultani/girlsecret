# Fix "Unnamed Record" in Airtable

## Problem 1: Wishlists Table Shows "Unnamed Record" for Users/Products

When you look at the Wishlists table, the UserId and ProductId columns show "unnamed record" instead of the actual user/product names.

### Solution for Products Table:
1. Open your **Products** table in Airtable
2. Look at the first column (usually "Name")
3. Click the dropdown arrow on the "Name" column header
4. Select **"Customize field type"**
5. In the field settings, check the box that says **"Use this field as the primary field"**
6. Save

Now the Wishlists table will show product names instead of "unnamed record"!

### Solution for Users Table:
1. Open your **Users** table in Airtable
2. Look for the "Email" column (or "FirstName")
3. Click the dropdown arrow on the column header
4. Select **"Customize field type"**
5. Check **"Use this field as the primary field"**
6. Save

Now the Wishlists table will show user emails/names instead of "unnamed record"!

---

## Problem 2: Users/Products Tables Show "Unnamed Record" in Wishlist Column

When you look at the Users or Products tables, you see a "Wishlist" column (auto-created by Airtable) that shows "unnamed record".

This happens because the **Wishlists table** doesn't have a primary field set.

### Solution: Create a Primary Field in Wishlists Table

**Option 1: Formula Field (RECOMMENDED) 🌟**

1. Go to your **Wishlists** table
2. Click the **+** button to add a new column
3. Name: **"Wishlist Entry"**
4. Type: **Formula**
5. Enter this formula:
   ```
   "Wishlist: " & {ProductId} & " (Added: " & DATETIME_FORMAT({AddedAt}, 'MMM D, YYYY') & ")"
   ```
6. Click the dropdown on "Wishlist Entry" column
7. Select **"Customize field type"**
8. Check: **"Use this field as the primary field"**
9. Save

Now Users and Products tables will show:
```
"Wishlist: Silk Lace Bra (Added: Dec 15, 2024)"
```

**Option 2: Use AddedAt (Quick Fix)**

1. Go to **Wishlists** table
2. Click dropdown on **"AddedAt"** column
3. Select **"Customize field type"**
4. Check: **"Use this field as the primary field"**
5. Save

Now it shows the date/time.

**Option 3: Autonumber Field (Simple)**

1. Add new field in **Wishlists** table
2. Name: **"ID"**
3. Type: **Autonumber**
4. Make it the primary field

Shows numbers: 1, 2, 3...

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
