const sampleProducts = [
    // (50–59 bạn đã có rồi, tiếp theo là 60–69)
    {
      codeCategory: "3",
      codeProduct: "60",
      nameProduct: "Project Hail Mary",
      priceProduct: "28.00",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/81cBHDkQDDL.jpg",
      userPartner: "Andy Weir"
    },
    {
      codeCategory: "7",
      codeProduct: "61",
      nameProduct: "Atomic Habits",
      priceProduct: "21.99",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg",
      userPartner: "James Clear"
    },
    {
      codeCategory: "4",
      codeProduct: "62",
      nameProduct: "The Alchemist",
      priceProduct: "19.99",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg",
      userPartner: "Paulo Coelho"
    },
    {
      codeCategory: "1",
      codeProduct: "63",
      nameProduct: "Educated",
      priceProduct: "24.00",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/81WojUxbbFL.jpg",
      userPartner: "Tara Westover"
    },
    {
      codeCategory: "2",
      codeProduct: "64",
      nameProduct: "Where the Crawdads Sing",
      priceProduct: "22.00",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/81O1oy0y9lL.jpg",
      userPartner: "Delia Owens"
    },
    {
      codeCategory: "5",
      codeProduct: "65",
      nameProduct: "The Subtle Art of Not Giving a F*ck",
      priceProduct: "18.99",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/71QKQ9mwV7L.jpg",
      userPartner: "Mark Manson"
    },
    {
      codeCategory: "8",
      codeProduct: "66",
      nameProduct: "Sapiens: A Brief History of Humankind",
      priceProduct: "27.00",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/713jIoMO3UL.jpg",
      userPartner: "Yuval Noah Harari"
    },
    {
      codeCategory: "6",
      codeProduct: "67",
      nameProduct: "The 5 AM Club",
      priceProduct: "20.00",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/81uwOCa2eQL.jpg",
      userPartner: "Robin Sharma"
    },
    {
      codeCategory: "2",
      codeProduct: "68",
      nameProduct: "Can't Hurt Me",
      priceProduct: "25.00",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/71I5FFu-6yL.jpg",
      userPartner: "David Goggins"
    },
    {
      codeCategory: "3",
      codeProduct: "69",
      nameProduct: "Rich Dad Poor Dad",
      priceProduct: "17.99",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/81bsw6fnUiL.jpg",
      userPartner: "Robert Kiyosaki"
    }
  ];
  
  const sampleBooks = [
    {
      author: "Andy Weir",
      isbn13: "9780593135204",
      publisher: "Ballantine Books",
      publicationDate: "2021-05-04",
      pages: 496,
      overview: "A lone astronaut must save humanity in this thrilling science-based adventure.",
      editorialReviews: [{ content: "A suspenseful, high-stakes space mission.", source: "The Verge" }],
      customerReviews: [{ rating: 5, content: "Unputdownable space drama!", author: "Alan Chen", date: "2024-02-10" }]
    },
    {
      author: "James Clear",
      isbn13: "9780735211292",
      publisher: "Avery",
      publicationDate: "2018-10-16",
      pages: 320,
      overview: "Tiny changes, remarkable results. A guide to building better habits.",
      editorialReviews: [{ content: "A masterpiece on habit formation.", source: "Inc." }],
      customerReviews: [{ rating: 5, content: "Game changer!", author: "Lana K.", date: "2024-01-20" }]
    },
    {
      author: "Paulo Coelho",
      isbn13: "9780061122415",
      publisher: "HarperOne",
      publicationDate: "1993-05-01",
      pages: 208,
      overview: "A shepherd's journey to find treasure teaches about destiny and dreams.",
      editorialReviews: [{ content: "Spiritual and inspiring.", source: "The New Yorker" }],
      customerReviews: [{ rating: 4, content: "Simple yet powerful.", author: "Mia Tran", date: "2023-12-05" }]
    },
    {
      author: "Tara Westover",
      isbn13: "9780399590504",
      publisher: "Random House",
      publicationDate: "2018-02-20",
      pages: 352,
      overview: "A memoir about a woman who leaves her survivalist family and earns a PhD.",
      editorialReviews: [{ content: "Stunning and unforgettable.", source: "The Times" }],
      customerReviews: [{ rating: 5, content: "A remarkable journey!", author: "Sara T.", date: "2024-03-01" }]
    },
    {
      author: "Delia Owens",
      isbn13: "9780735219090",
      publisher: "G.P. Putnam's Sons",
      publicationDate: "2018-08-14",
      pages: 384,
      overview: "A murder mystery in the marshlands of North Carolina.",
      editorialReviews: [{ content: "Poetic and suspenseful.", source: "The Atlantic" }],
      customerReviews: [{ rating: 5, content: "Masterpiece!", author: "Tom Nguyen", date: "2024-02-08" }]
    },
    {
      author: "Mark Manson",
      isbn13: "9780062457715",
      publisher: "Harper",
      publicationDate: "2016-09-13",
      pages: 224,
      overview: "A counterintuitive approach to living a better life.",
      editorialReviews: [{ content: "Brutally honest and funny.", source: "Forbes" }],
      customerReviews: [{ rating: 4, content: "Eye-opening perspective.", author: "Jin Soo", date: "2023-11-22" }]
    },
    {
      author: "Yuval Noah Harari",
      isbn13: "9780062316098",
      publisher: "Harper",
      publicationDate: "2015-02-10",
      pages: 464,
      overview: "A brief history of humankind from the Stone Age to the 21st century.",
      editorialReviews: [{ content: "Mind-blowing insights.", source: "BBC" }],
      customerReviews: [{ rating: 5, content: "Everyone should read it.", author: "Lê Minh", date: "2024-01-15" }]
    },
    {
      author: "Robin Sharma",
      isbn13: "9781443456623",
      publisher: "HarperCollins",
      publicationDate: "2018-12-04",
      pages: 336,
      overview: "A guide to seizing your mornings and transforming your life.",
      editorialReviews: [{ content: "Motivational and practical.", source: "Success Magazine" }],
      customerReviews: [{ rating: 4, content: "I wake up earlier now!", author: "Tuấn Anh", date: "2023-10-30" }]
    },
    {
      author: "David Goggins",
      isbn13: "9781544512280",
      publisher: "Lioncrest Publishing",
      publicationDate: "2018-11-15",
      pages: 364,
      overview: "From poverty to Navy SEAL: an extraordinary journey of toughness.",
      editorialReviews: [{ content: "Raw and inspiring.", source: "Joe Rogan" }],
      customerReviews: [{ rating: 5, content: "Pushes your mindset!", author: "Quân Trần", date: "2023-12-18" }]
    },
    {
      author: "Robert Kiyosaki",
      isbn13: "9781612680194",
      publisher: "Plata Publishing",
      publicationDate: "2011-06-14",
      pages: 336,
      overview: "Financial lessons from the rich and poor dads that changed lives.",
      editorialReviews: [{ content: "Personal finance classic.", source: "CNN Money" }],
      customerReviews: [{ rating: 5, content: "Must-read for beginners.", author: "Ngọc Linh", date: "2024-01-07" }]
    }
  ];
  
  module.exports = {
    sampleProducts,
    sampleBooks
  };
  