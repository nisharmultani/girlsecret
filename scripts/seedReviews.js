/**
 * Seed Reviews Script
 *
 * This script helps you add realistic reviews to products for dropshipping.
 * It creates a balanced distribution of reviews (mostly 5-star, some 4-star, few 3-star).
 *
 * Usage:
 * 1. Update your Airtable Products table with these fields:
 *    - SoldCount (Number)
 *    - AverageRating (Number with precision of 2 decimals)
 *    - ReviewCount (Number)
 *
 * 2. Manually add reviews to your Reviews table in Airtable with:
 *    - ProductId (Link to Products table)
 *    - Name (Text)
 *    - Email (Email)
 *    - Rating (Number 1-5)
 *    - Comment (Long text)
 *    - Created_At (Date)
 *    - Approved (Checkbox - check this!)
 *
 * 3. For each product, add 3-8 reviews with this distribution:
 *    - 60-70% should be 5-star
 *    - 20-30% should be 4-star
 *    - 0-10% should be 3-star
 *
 * Example review templates by category:
 */

// Sample review templates for lingerie products
const reviewTemplates = {
  5: [
    "Absolutely love this! The quality is amazing and it fits perfectly. Highly recommend!",
    "Beautiful piece! Fits true to size and the material is so soft and comfortable.",
    "Exceeded my expectations! The quality is outstanding and it looks even better in person.",
    "Perfect! Exactly as described and the fit is incredible. Will definitely order more.",
    "Amazing quality! The fabric feels luxurious and the design is stunning. Love it!",
    "Best purchase! Fits like a dream and makes me feel so confident. Worth every penny.",
    "Gorgeous! The attention to detail is impressive and it's so comfortable to wear.",
    "Obsessed with this! The quality is top-notch and it fits beautifully.",
  ],
  4: [
    "Really nice quality! Fits well but runs slightly small. Size up if between sizes.",
    "Love it! Only minor issue is the straps are a bit long for me but otherwise perfect.",
    "Great product! Good quality for the price. Delivery was fast too.",
    "Pretty good! The material is nice but the color is slightly different from the photos.",
    "Happy with this purchase! Fits well and looks great. Just wish it came in more colors.",
    "Nice quality! Comfortable to wear. The sizing chart was accurate.",
  ],
  3: [
    "It's okay. The quality is decent but not as luxurious as I expected from the photos.",
    "Average. Fits fine but the material is thinner than I thought it would be.",
    "Not bad. Does the job but I've seen better quality elsewhere for similar price.",
  ],
};

// Sample customer names (mix of common UK/international names)
const customerNames = [
  "Emma S.", "Sophie M.", "Olivia R.", "Ava L.", "Isabella K.",
  "Mia T.", "Charlotte W.", "Amelia B.", "Harper G.", "Evelyn D.",
  "Abigail H.", "Emily P.", "Elizabeth C.", "Sofia F.", "Avery N.",
  "Ella J.", "Scarlett V.", "Grace Y.", "Chloe A.", "Victoria Z.",
  "Madison Q.", "Luna X.", "Aria U.", "Layla I.", "Zoe O.",
];

// Function to generate random email (not real, just for display)
const generateEmail = (name) => {
  const username = name.toLowerCase().replace(/\s+/g, '').replace('.', '');
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  return `${username}${Math.floor(Math.random() * 999)}@${domains[Math.floor(Math.random() * domains.length)]}`;
};

// Function to generate random date in the past 90 days
const generateRandomDate = () => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 90); // 0-90 days ago
  const date = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString();
};

// Function to generate reviews for a product
const generateReviews = (productId, productName, count = 5) => {
  const reviews = [];
  const distribution = {
    5: Math.ceil(count * 0.65), // 65% 5-star
    4: Math.floor(count * 0.25), // 25% 4-star
    3: Math.floor(count * 0.10), // 10% 3-star
  };

  // Create 5-star reviews
  for (let i = 0; i < distribution[5]; i++) {
    const name = customerNames[Math.floor(Math.random() * customerNames.length)];
    reviews.push({
      ProductId: [productId], // Must be array for Airtable linked record
      Name: name,
      Email: generateEmail(name),
      Rating: 5,
      Comment: reviewTemplates[5][Math.floor(Math.random() * reviewTemplates[5].length)],
      Created_At: generateRandomDate(),
      Approved: true,
    });
  }

  // Create 4-star reviews
  for (let i = 0; i < distribution[4]; i++) {
    const name = customerNames[Math.floor(Math.random() * customerNames.length)];
    reviews.push({
      ProductId: [productId],
      Name: name,
      Email: generateEmail(name),
      Rating: 4,
      Comment: reviewTemplates[4][Math.floor(Math.random() * reviewTemplates[4].length)],
      Created_At: generateRandomDate(),
      Approved: true,
    });
  }

  // Create 3-star reviews
  for (let i = 0; i < distribution[3]; i++) {
    const name = customerNames[Math.floor(Math.random() * customerNames.length)];
    reviews.push({
      ProductId: [productId],
      Name: name,
      Email: generateEmail(name),
      Rating: 3,
      Comment: reviewTemplates[3][Math.floor(Math.random() * reviewTemplates[3].length)],
      Created_At: generateRandomDate(),
      Approved: true,
    });
  }

  // Sort by date (oldest first)
  reviews.sort((a, b) => new Date(a.Created_At) - new Date(b.Created_At));

  return reviews;
};

// Calculate average rating and update product stats
const calculateProductStats = (reviews, soldCount) => {
  const totalRating = reviews.reduce((sum, review) => sum + review.Rating, 0);
  const averageRating = (totalRating / reviews.length).toFixed(1);

  return {
    AverageRating: parseFloat(averageRating),
    ReviewCount: reviews.length,
    SoldCount: soldCount || Math.floor(Math.random() * 200) + 50, // Random 50-250 if not provided
  };
};

// Export for manual use
module.exports = {
  generateReviews,
  calculateProductStats,
  reviewTemplates,
  customerNames,
};

/**
 * MANUAL INSTRUCTIONS:
 *
 * 1. Add these fields to your Products table in Airtable:
 *    - SoldCount (Number field)
 *    - AverageRating (Number field with 2 decimal precision)
 *    - ReviewCount (Number field)
 *
 * 2. For each product you want to add reviews to:
 *    a. Copy the product's Airtable Record ID (starts with "rec...")
 *    b. Generate 5-8 reviews using the templates above
 *    c. Manually create review records in Airtable:
 *       - ProductId: Select the product (will create array link)
 *       - Name: Use names from customerNames array
 *       - Email: Generate using pattern: name123@domain.com
 *       - Rating: Mix of 5, 4, and 3 stars (65% 5-star, 25% 4-star, 10% 3-star)
 *       - Comment: Pick from reviewTemplates based on rating
 *       - Created_At: Random date in past 90 days
 *       - Approved: CHECK THIS BOX!
 *
 * 3. Update product stats:
 *    For a product with 5 reviews (3×5-star, 2×4-star):
 *    - AverageRating: (5+5+5+4+4)/5 = 4.6
 *    - ReviewCount: 5
 *    - SoldCount: Pick a realistic number (50-250 for new products)
 *
 * 4. Tips for realistic reviews:
 *    - Don't make all reviews 5-star (looks fake)
 *    - Space out Created_At dates over 30-90 days
 *    - Use variety of customer names
 *    - Mix short and detailed comments
 *    - 3-star reviews add authenticity but don't overdo it
 *
 * Example CSV for bulk import to Airtable:
 *
 * ProductId,Name,Email,Rating,Comment,Created_At,Approved
 * recXXXXX,Emma S.,emmas123@gmail.com,5,"Absolutely love this!",2024-10-15,true
 * recXXXXX,Sophie M.,sophiem456@yahoo.com,5,"Beautiful piece!",2024-10-20,true
 * recXXXXX,Olivia R.,oliviar789@outlook.com,4,"Really nice quality!",2024-10-25,true
 *
 * Note: Replace recXXXXX with your actual product Record ID
 */

console.log('\n📝 Review Seeding Guide');
console.log('=======================\n');
console.log('This script provides templates and guidelines for adding reviews.');
console.log('Follow the MANUAL INSTRUCTIONS above to add reviews to your Airtable.\n');

// Example usage
console.log('Example: Generate 5 reviews for a product');
console.log('==========================================\n');

const exampleReviews = generateReviews('recEXAMPLE123', 'Example Product', 5);
console.log(JSON.stringify(exampleReviews, null, 2));

const stats = calculateProductStats(exampleReviews, 150);
console.log('\nProduct Stats:');
console.log(JSON.stringify(stats, null, 2));
