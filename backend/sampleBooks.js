const mongoose = require('mongoose');
const { Book } = require('./models/index.js');
require('dotenv').config();

const sampleBooks = [
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "9780743273565",
        category: "Classic Fiction",
        description: "A masterpiece of American literature, this novel explores the Jazz Age, the American Dream, and the tragic story of Jay Gatsby's love for Daisy Buchanan.",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&crop=center",
        quantity: 8,
        availableQuantity: 8,
        publicationYear: 1925,
        publisher: "Scribner",
        language: "English",
        pages: 180,
        location: "Main Library - Classics Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    },
    {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "9780446310789",
        category: "Classic Fiction",
        description: "A powerful story about racial injustice and moral growth in the American South, told through the eyes of young Scout Finch.",
        imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=center",
        quantity: 6,
        availableQuantity: 6,
        publicationYear: 1960,
        publisher: "Grand Central Publishing",
        language: "English",
        pages: 281,
        location: "Main Library - Classics Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    },
    {
        title: "1984",
        author: "George Orwell",
        isbn: "9780451524935",
        category: "Dystopian Fiction",
        description: "A chilling dystopian novel about totalitarianism, surveillance society, and the manipulation of truth in a futuristic world.",
        imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop&crop=center",
        quantity: 5,
        availableQuantity: 5,
        publicationYear: 1949,
        publisher: "Signet Classic",
        language: "English",
        pages: 328,
        location: "Main Library - Science Fiction Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    },
    {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        isbn: "9780141439518",
        category: "Romance",
        description: "A classic romance novel about love, marriage, and social class in 19th century England, featuring the spirited Elizabeth Bennet.",
        imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=400&fit=crop&crop=center",
        quantity: 4,
        availableQuantity: 4,
        publicationYear: 1900,
        publisher: "Penguin Classics",
                          language: "English",
                  pages: 480,
                  location: "Main Library - Romance Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    },
    {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        isbn: "9780547928244",
        category: "Fantasy",
        description: "An adventure story about a hobbit's journey to help reclaim a dwarf kingdom, filled with dragons, elves, and magical creatures.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center",
        quantity: 7,
        availableQuantity: 7,
        publicationYear: 1937,
        publisher: "Houghton Mifflin Harcourt",
        language: "English",
        pages: 366,
        location: "Main Library - Fantasy Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    },
    {
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        isbn: "9780547928213",
        category: "Fantasy",
        description: "An epic fantasy trilogy about the quest to destroy a powerful ring and save Middle-earth from the dark lord Sauron.",
        imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=400&fit=crop&crop=center",
        quantity: 6,
        availableQuantity: 6,
        publicationYear: 1954,
        publisher: "Houghton Mifflin Harcourt",
        language: "English",
        pages: 1216,
        location: "Main Library - Fantasy Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    },
    {
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        isbn: "9780747532699",
        category: "Fantasy",
        description: "The first book in the Harry Potter series, following young wizard Harry as he discovers his magical heritage and attends Hogwarts School.",
        imageUrl: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=300&h=400&fit=crop&crop=center",
        quantity: 10,
        availableQuantity: 10,
        publicationYear: 1997,
        publisher: "Bloomsbury",
        language: "English",
        pages: 223,
        location: "Main Library - Young Adult Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    },
    {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        isbn: "9780316769488",
        category: "Coming of Age",
        description: "A classic coming-of-age novel about teenage alienation and loss of innocence in post-World War II America.",
        imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&h=400&fit=crop&crop=center",
        quantity: 5,
        availableQuantity: 5,
        publicationYear: 1951,
        publisher: "Little, Brown and Company",
        language: "English",
        pages: 277,
        location: "Main Library - Young Adult Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    },
    {
        title: "The Alchemist",
        author: "Paulo Coelho",
        isbn: "9780062315007",
        category: "Philosophical Fiction",
        description: "A magical story about following your dreams and listening to your heart, following a young shepherd's journey to find treasure.",
        imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=400&fit=crop&crop=center",
        quantity: 8,
        availableQuantity: 8,
        publicationYear: 1988,
        publisher: "HarperOne",
        language: "English",
        pages: 208,
        location: "Main Library - Philosophy Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    },
    {
        title: "The Kite Runner",
        author: "Khaled Hosseini",
        isbn: "9781594631931",
        category: "Contemporary Fiction",
        description: "A powerful story of friendship, betrayal, and redemption set against the backdrop of Afghanistan's turbulent history.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&crop=center",
        quantity: 6,
        availableQuantity: 6,
        publicationYear: 2003,
        publisher: "Riverhead Books",
        language: "English",
        pages: 371,
        location: "Main Library - Contemporary Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    },
    {
        title: "The Book Thief",
        author: "Markus Zusak",
        isbn: "9780375842207",
        category: "Historical Fiction",
        description: "A unique story narrated by Death about a young girl who steals books during Nazi Germany, finding solace in literature.",
        imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=center",
        quantity: 5,
        availableQuantity: 5,
        publicationYear: 2005,
        publisher: "Alfred A. Knopf",
        language: "English",
        pages: 552,
        location: "Main Library - Historical Fiction Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    },
    {
        title: "The Fault in Our Stars",
        author: "John Green",
        isbn: "9780142424179",
        category: "Young Adult",
        description: "A heart-wrenching love story about two teenagers who meet at a cancer support group and fall in love.",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&crop=center",
        quantity: 9,
        availableQuantity: 9,
        publicationYear: 2012,
        publisher: "Dutton Books",
        language: "English",
        pages: 313,
        location: "Main Library - Young Adult Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    },
    {
        title: "Gone Girl",
        author: "Gillian Flynn",
        isbn: "9780307588364",
        category: "Thriller",
        description: "A psychological thriller about a woman who disappears on her fifth wedding anniversary, leading to a complex investigation.",
        imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop&crop=center",
        quantity: 7,
        availableQuantity: 7,
        publicationYear: 2012,
        publisher: "Crown Publishing",
        language: "English",
        pages: 415,
        location: "Main Library - Thriller Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    },
    {
        title: "The Hunger Games",
        author: "Suzanne Collins",
        isbn: "9780439023481",
        category: "Young Adult",
        description: "A dystopian novel about a televised battle to the death between teenagers in a post-apocalyptic North America.",
        imageUrl: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=300&h=400&fit=crop&crop=center",
        quantity: 12,
        availableQuantity: 12,
        publicationYear: 2008,
        publisher: "Scholastic Press",
        language: "English",
        pages: 374,
        location: "Main Library - Young Adult Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    },
    {
        title: "The Da Vinci Code",
        author: "Dan Brown",
        isbn: "9780307474278",
        category: "Mystery",
        description: "A fast-paced thriller about a murder in the Louvre Museum and a religious mystery that could shake the foundations of Christianity.",
        imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=400&fit=crop&crop=center",
        quantity: 8,
        availableQuantity: 8,
        publicationYear: 2003,
        publisher: "Doubleday",
        language: "English",
        pages: 689,
        location: "Main Library - Mystery Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    },
    {
        title: "The Help",
        author: "Kathryn Stockett",
        isbn: "9780399155345",
        category: "Historical Fiction",
        description: "A powerful story about African American maids working in white households in Jackson, Mississippi during the early 1960s.",
        imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&h=400&fit=crop&crop=center",
        quantity: 6,
        availableQuantity: 6,
        publicationYear: 2009,
        publisher: "Amy Einhorn Books",
        language: "English",
        pages: 464,
        location: "Main Library - Historical Fiction Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    },
    {
        title: "The Girl with the Dragon Tattoo",
        author: "Stieg Larsson",
        isbn: "9780307454546",
        category: "Crime Fiction",
        description: "A gripping crime novel about a journalist and a computer hacker investigating a 40-year-old disappearance.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center",
        quantity: 5,
        availableQuantity: 5,
        publicationYear: 2005,
        publisher: "Vintage Crime",
        language: "English",
        pages: 465,
        location: "Main Library - Crime Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    },
    {
        title: "The Lovely Bones",
        author: "Alice Sebold",
        isbn: "9780316168816",
        category: "Contemporary Fiction",
        description: "A unique story narrated from heaven by a young girl who watches her family deal with her murder and its aftermath.",
        imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=center",
        quantity: 4,
        availableQuantity: 4,
        publicationYear: 2002,
        publisher: "Little, Brown and Company",
        language: "English",
        pages: 328,
        location: "Main Library - Contemporary Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    },
    {
        title: "Life of Pi",
        author: "Yann Martel",
        isbn: "9780156027328",
        category: "Adventure Fiction",
        description: "A philosophical adventure novel about an Indian boy who survives a shipwreck and is stranded in the Pacific Ocean with a Bengal tiger.",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&crop=center",
        quantity: 7,
        availableQuantity: 7,
        publicationYear: 2001,
        publisher: "Harcourt",
        language: "English",
        pages: 326,
        location: "Main Library - Adventure Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    },
    {
        title: "The Curious Incident of the Dog in the Night-Time",
        author: "Mark Haddon",
        isbn: "9781400032716",
        category: "Contemporary Fiction",
        description: "A unique novel narrated by a 15-year-old boy with autism who investigates the death of a neighbor's dog.",
        imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop&crop=center",
        quantity: 6,
        availableQuantity: 6,
        publicationYear: 2003,
        publisher: "Vintage",
        language: "English",
        pages: 226,
        location: "Main Library - Contemporary Section",
        status: "available",
        schoolName: "KLPD",
        addedBy: "507f1f77bcf86cd799439011"
    }
];

const addSampleBooks = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('Connected to MongoDB');
        
        // Check if books already exist
        const existingBooks = await Book.countDocuments({ schoolName: "KLPD" });
        
        if (existingBooks > 0) {
            console.log(`Books already exist (${existingBooks} found). Skipping sample data.`);
            return;
        }
        
        // Add sample books
        const result = await Book.insertMany(sampleBooks);
        console.log(`Successfully added ${result.length} sample books`);
        
        // Show the books that were added
        console.log('\n📚 Books added to library:');
        result.forEach(book => {
            console.log(`✅ ${book.title} by ${book.author} (${book.category})`);
        });
        
        console.log('\n🎉 Your library is now stocked with 20 famous novels for KLPD school!');
        
    } catch (error) {
        console.error('Error adding sample books:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run the function if this file is executed directly
if (require.main === module) {
    addSampleBooks();
}

module.exports = { addSampleBooks, sampleBooks };
