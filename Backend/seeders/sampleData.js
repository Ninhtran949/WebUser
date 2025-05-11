const sampleProducts = [
    // (50–69 bạn đã có rồi, tiếp theo là 70–90)
    {
      codeCategory: "1",
      codeProduct: "70",
      nameProduct: "Becoming",
      priceProduct: "26.99",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/81h2gWPTYJL.jpg",
      userPartner: "Michelle Obama"
    },
    {
      codeCategory: "2",
      codeProduct: "71",
      nameProduct: "The Silent Patient",
      priceProduct: "23.50",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/81Y1loJEwJL.jpg",
      userPartner: "Alex Michaelides"
    },
    {
      codeCategory: "3",
      codeProduct: "72",
      nameProduct: "Dune",
      priceProduct: "22.99",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/81ym3QUd3KL.jpg",
      userPartner: "Frank Herbert"
    },
    {
      codeCategory: "4",
      codeProduct: "73",
      nameProduct: "The Four Agreements",
      priceProduct: "15.99",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/81hHy5XrdKL.jpg",
      userPartner: "Don Miguel Ruiz"
    },
    {
      codeCategory: "5",
      codeProduct: "74",
      nameProduct: "Thinking, Fast and Slow",
      priceProduct: "24.99",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/71wRGnJlHFL.jpg",
      userPartner: "Daniel Kahneman"
    },
    {
      codeCategory: "6",
      codeProduct: "75",
      nameProduct: "The Power of Now",
      priceProduct: "19.99",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/41jJUHIOUOL.jpg",
      userPartner: "Eckhart Tolle"
    },
    {
      codeCategory: "7",
      codeProduct: "76",
      nameProduct: "The 7 Habits of Highly Effective People",
      priceProduct: "21.50",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/71Qb9u1Cp-L.jpg",
      userPartner: "Stephen R. Covey"
    },
    {
      codeCategory: "8",
      codeProduct: "77",
      nameProduct: "A Brief History of Time",
      priceProduct: "20.99",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/A1xkFZX5k-L.jpg",
      userPartner: "Stephen Hawking"
    },
    {
      codeCategory: "1",
      codeProduct: "78",
      nameProduct: "Greenlights",
      priceProduct: "25.99",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/71EoFPTwJtL.jpg",
      userPartner: "Matthew McConaughey"
    },
    {
      codeCategory: "2",
      codeProduct: "79",
      nameProduct: "The Midnight Library",
      priceProduct: "22.50",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/81tCtHFtOgL.jpg",
      userPartner: "Matt Haig"
    },
    {
      codeCategory: "3",
      codeProduct: "80",
      nameProduct: "The Three-Body Problem",
      priceProduct: "26.00",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/91EDI7zrnHL.jpg",
      userPartner: "Cixin Liu"
    },
    {
      codeCategory: "4",
      codeProduct: "81",
      nameProduct: "Man's Search for Meaning",
      priceProduct: "18.99",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/71tdb1udWLL.jpg",
      userPartner: "Viktor E. Frankl"
    },
    {
      codeCategory: "5",
      codeProduct: "82",
      nameProduct: "Outliers",
      priceProduct: "19.99",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/71NujfP6XZL.jpg",
      userPartner: "Malcolm Gladwell"
    },
    {
      codeCategory: "6",
      codeProduct: "83",
      nameProduct: "The Untethered Soul",
      priceProduct: "17.99",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/71HG9-ixf6L.jpg",
      userPartner: "Michael A. Singer"
    },
    {
      codeCategory: "7",
      codeProduct: "84",
      nameProduct: "Good to Great",
      priceProduct: "23.99",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/71W7J5JH1GL.jpg",
      userPartner: "Jim Collins"
    },
    {
      codeCategory: "8",
      codeProduct: "85",
      nameProduct: "Cosmos",
      priceProduct: "21.99",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/91JYdpDxBBL.jpg",
      userPartner: "Carl Sagan"
    },
    {
      codeCategory: "1",
      codeProduct: "86",
      nameProduct: "Born a Crime",
      priceProduct: "24.50",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/81mXQd1I0CL.jpg",
      userPartner: "Trevor Noah"
    },
    {
      codeCategory: "2",
      codeProduct: "87",
      nameProduct: "The Vanishing Half",
      priceProduct: "25.99",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/81XQ1+piiiL.jpg",
      userPartner: "Brit Bennett"
    },
    {
      codeCategory: "3",
      codeProduct: "88",
      nameProduct: "Foundation",
      priceProduct: "19.99",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/81wFMY9OAQL.jpg",
      userPartner: "Isaac Asimov"
    },
    {
      codeCategory: "4",
      codeProduct: "89",
      nameProduct: "The Road Less Traveled",
      priceProduct: "18.50",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/71WivlLyekL.jpg",
      userPartner: "M. Scott Peck"
    },
    {
      codeCategory: "5",
      codeProduct: "90",
      nameProduct: "Freakonomics",
      priceProduct: "20.50",
      imgProduct: "https://images-na.ssl-images-amazon.com/images/I/81oLEV%2BjdFL.jpg",
      userPartner: "Steven D. Levitt"
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
    },
    {
      author: "Michelle Obama",
      isbn13: "9781524763138",
      publisher: "Crown",
      publicationDate: "2018-11-13",
      pages: 448,
      overview: "An intimate, powerful, and inspiring memoir by the former First Lady of the United States.",
      editorialReviews: [{ content: "Deeply personal and surprisingly candid.", source: "The New York Times" }],
      customerReviews: [{ rating: 5, content: "Inspiring and beautifully written!", author: "Sarah Johnson", date: "2024-01-05" }]
    },
    {
      author: "Alex Michaelides",
      isbn13: "9781250301697",
      publisher: "Celadon Books",
      publicationDate: "2019-02-05",
      pages: 336,
      overview: "A shocking psychological thriller of a woman's act of violence against her husband—and of the therapist obsessed with uncovering her motive.",
      editorialReviews: [{ content: "A mix of Hitchcockian suspense, Agatha Christie plotting, and Greek tragedy.", source: "Entertainment Weekly" }],
      customerReviews: [{ rating: 5, content: "Couldn't put it down!", author: "Michael Lee", date: "2023-12-20" }]
    },
    {
      author: "Frank Herbert",
      isbn13: "9780441172719",
      publisher: "Ace",
      publicationDate: "1990-09-01",
      pages: 896,
      overview: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.",
      editorialReviews: [{ content: "A landmark of science fiction.", source: "The Guardian" }],
      customerReviews: [{ rating: 5, content: "A masterpiece of world-building.", author: "Alex Tran", date: "2024-02-15" }]
    },
    {
      author: "Don Miguel Ruiz",
      isbn13: "9781878424310",
      publisher: "Amber-Allen Publishing",
      publicationDate: "1997-11-07",
      pages: 160,
      overview: "A practical guide to personal freedom based on ancient Toltec wisdom.",
      editorialReviews: [{ content: "Simple yet profound.", source: "Publishers Weekly" }],
      customerReviews: [{ rating: 4, content: "Life-changing perspective.", author: "Linda Pham", date: "2023-11-10" }]
    },
    {
      author: "Daniel Kahneman",
      isbn13: "9780374533557",
      publisher: "Farrar, Straus and Giroux",
      publicationDate: "2013-04-02",
      pages: 499,
      overview: "An exploration of the two systems that drive the way we think and make choices.",
      editorialReviews: [{ content: "Brilliant... It will change the way you think.", source: "The Wall Street Journal" }],
      customerReviews: [{ rating: 5, content: "Dense but fascinating.", author: "David Kim", date: "2024-01-30" }]
    },
    {
      author: "Eckhart Tolle",
      isbn13: "9781577314806",
      publisher: "New World Library",
      publicationDate: "2004-08-19",
      pages: 236,
      overview: "A guide to spiritual enlightenment focused on living fully in the present moment.",
      editorialReviews: [{ content: "One of the most influential spiritual books of our time.", source: "Oprah Winfrey" }],
      customerReviews: [{ rating: 5, content: "Transformative wisdom.", author: "Mai Nguyen", date: "2023-09-15" }]
    },
    {
      author: "Stephen R. Covey",
      isbn13: "9781982137274",
      publisher: "Simon & Schuster",
      publicationDate: "2020-05-19",
      pages: 464,
      overview: "A holistic, integrated approach to personal and interpersonal effectiveness.",
      editorialReviews: [{ content: "Powerful lessons in personal change.", source: "Forbes" }],
      customerReviews: [{ rating: 5, content: "Classic for a reason.", author: "John Tran", date: "2024-03-05" }]
    },
    {
      author: "Stephen Hawking",
      isbn13: "9780553380163",
      publisher: "Bantam",
      publicationDate: "1998-09-01",
      pages: 212,
      overview: "A landmark volume in science writing by one of the great minds of our time.",
      editorialReviews: [{ content: "Makes complex concepts accessible to the layperson.", source: "Scientific American" }],
      customerReviews: [{ rating: 4, content: "Mind-expanding.", author: "Huy Le", date: "2023-10-22" }]
    },
    {
      author: "Matthew McConaughey",
      isbn13: "9780593139134",
      publisher: "Crown",
      publicationDate: "2020-10-20",
      pages: 304,
      overview: "An unconventional memoir filled with raucous stories, outlaw wisdom, and lessons learned the hard way.",
      editorialReviews: [{ content: "Wildly entertaining.", source: "Washington Post" }],
      customerReviews: [{ rating: 4, content: "Surprisingly insightful.", author: "Jessica Tran", date: "2023-12-12" }]
    },
    {
      author: "Matt Haig",
      isbn13: "9780525559474",
      publisher: "Viking",
      publicationDate: "2020-09-29",
      pages: 304,
      overview: "Between life and death there is a library, and within that library, the shelves go on forever.",
      editorialReviews: [{ content: "A beautiful fable about regrets, second chances, and embracing life.", source: "The Guardian" }],
      customerReviews: [{ rating: 5, content: "Beautiful and thought-provoking.", author: "Linh Nguyen", date: "2024-02-01" }]
    },
    {
      author: "Cixin Liu",
      isbn13: "9780765382030",
      publisher: "Tor Books",
      publicationDate: "2014-11-11",
      pages: 400,
      overview: "A secret military project sends signals into space to establish contact with aliens, and the result is catastrophic when the aliens plan to invade Earth.",
      editorialReviews: [{ content: "Remarkable, revelatory and not to be missed.", source: "The Times" }],
      customerReviews: [{ rating: 5, content: "Mind-blowing sci-fi.", author: "Tuan Pham", date: "2023-11-30" }]
    },
    {
      author: "Viktor E. Frankl",
      isbn13: "9780807014271",
      publisher: "Beacon Press",
      publicationDate: "2006-06-01",
      pages: 184,
      overview: "A memoir based on his experiences in Nazi death camps, describing his psychotherapeutic method of finding meaning in all forms of existence.",
      editorialReviews: [{ content: "One of the great books of our time.", source: "Harold S. Kushner" }],
      customerReviews: [{ rating: 5, content: "Profound and moving.", author: "Minh Tran", date: "2024-01-18" }]
    },
    {
      author: "Malcolm Gladwell",
      isbn13: "9780316017930",
      publisher: "Little, Brown and Company",
      publicationDate: "2008-11-18",
      pages: 309,
      overview: "Why some people succeed far more than others - a look at the stories of outliers, the best and the brightest, the most famous and the most successful.",
      editorialReviews: [{ content: "Captivating and thought-provoking.", source: "The New York Times" }],
      customerReviews: [{ rating: 4, content: "Fascinating insights.", author: "Thanh Le", date: "2023-10-05" }]
    },
    {
      author: "Michael A. Singer",
      isbn13: "9781572245372",
      publisher: "New Harbinger Publications",
      publicationDate: "2007-10-03",
      pages: 200,
      overview: "What would it be like to free yourself from limitations and soar beyond your boundaries? This book shows you how.",
      editorialReviews: [{ content: "A profound journey to freedom and joy.", source: "Deepak Chopra" }],
      customerReviews: [{ rating: 5, content: "Life-changing wisdom.", author: "Hanh Nguyen", date: "2023-12-28" }]
    },
    {
      author: "Jim Collins",
      isbn13: "9780066620992",
      publisher: "Harper Business",
      publicationDate: "2001-10-16",
      pages: 320,
      overview: "The findings of the Good to Great study will surprise many readers and shed light on virtually every area of management strategy and practice.",
      editorialReviews: [{ content: "One of the most influential business books of our era.", source: "Forbes" }],
      customerReviews: [{ rating: 5, content: "Essential business reading.", author: "Duc Tran", date: "2024-02-20" }]
    },
    {
      author: "Carl Sagan",
      isbn13: "9780345539434",
      publisher: "Ballantine Books",
      publicationDate: "2013-12-10",
      pages: 432,
      overview: "Explores the remarkable achievements of human knowledge and the still greater mysteries that lie beyond.",
      editorialReviews: [{ content: "Magnificent... A stimulating and humbling reading experience.", source: "The Washington Post" }],
      customerReviews: [{ rating: 5, content: "Timeless and inspiring.", author: "Trung Nguyen", date: "2023-09-10" }]
    },
    {
      author: "Trevor Noah",
      isbn13: "9780399588198",
      publisher: "One World",
      publicationDate: "2019-02-12",
      pages: 304,
      overview: "The compelling, inspiring, and comically sublime story of one man's coming-of-age, set during the twilight of apartheid and the tumultuous days of freedom that followed.",
      editorialReviews: [{ content: "An extraordinary memoir.", source: "Kirkus Reviews" }],
      customerReviews: [{ rating: 5, content: "Powerful and funny.", author: "Lan Pham", date: "2024-01-25" }]
    },
    {
      author: "Brit Bennett",
      isbn13: "9780525536291",
      publisher: "Riverhead Books",
      publicationDate: "2020-06-02",
      pages: 352,
      overview: "The Vignes twin sisters will always be identical. But after growing up together in a small, southern black community and running away at age sixteen, one sister lives with her black daughter in the same southern town, while the other secretly passes for white.",
      editorialReviews: [{ content: "Stunning... An engrossing page-turner.", source: "Los Angeles Times" }],
      customerReviews: [{ rating: 5, content: "Beautifully written and thought-provoking.", author: "Mai Tran", date: "2023-11-15" }]
    },
    {
      author: "Isaac Asimov",
      isbn13: "9780553293357",
      publisher: "Spectra",
      publicationDate: "1991-10-01",
      pages: 256,
      overview: "The story of our future begins with the Foundation. Nominated as one of America's best-loved novels by PBS's The Great American Read.",
      editorialReviews: [{ content: "A true landmark of science fiction.", source: "The Guardian" }],
      customerReviews: [{ rating: 5, content: "Classic sci-fi at its best.", author: "Vinh Le", date: "2024-03-10" }]
    },
    {
      author: "M. Scott Peck",
      isbn13: "9780743243155",
      publisher: "Touchstone",
      publicationDate: "2003-02-04",
      pages: 320,
      overview: "A timeless classic that explores the nature of love, traditional values, and spiritual growth.",
      editorialReviews: [{ content: "Magnificent... A book that can show you how to live in the light of your own being.", source: "Sam Keen" }],
      customerReviews: [{ rating: 4, content: "Profound insights.", author: "Hoa Nguyen", date: "2023-10-18" }]
    },
    {
      author: "Steven D. Levitt",
      isbn13: "9780060731328",
      publisher: "William Morrow",
      publicationDate: "2009-08-25",
      pages: 336,
      overview: "A rogue economist explores the hidden side of everything, from cheating sumo wrestlers to the economics of drug dealing.",
      editorialReviews: [{ content: "Prepare to be dazzled.", source: "Malcolm Gladwell" }],
      customerReviews: [{ rating: 4, content: "Eye-opening and entertaining.", author: "Tien Pham", date: "2024-02-05" }]
    }
  ];
  
  module.exports = {
    sampleProducts,
    sampleBooks
  };