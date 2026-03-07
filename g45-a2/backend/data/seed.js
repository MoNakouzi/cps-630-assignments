// Create test (seed) data to test if the collection is empty
const bulletins = [
    {
        title: "Free Breakfast Club",
        category: "Events",
        message:
            "Free coffee and donuts will be available in the Science Lounge from 9:00 AM to 11:00 AM.",
        author: "Science Department",
        date: "2026-02-14",
    },
    {
        title: "Lost Wallet Found",
        category: "Announcements",
        message:
            "A black leather wallet was found near the library entrance on Friday evening. Please contact the front desk with a description to claim it.",
        author: "Campus Security",
        date: "2026-01-30",
    },
    {
        title: "Study Group for CPS 630",
        category: "Academics",
        message:
            "A study group for CPS 630 will meet every Wednesday at 6:00 PM in Room ENG-201. Everyone is welcome. Please come to learn more about the course, and how to apply your knowledge.",
        author: "CS Course Union",
        date: "2026-02-13",
    },
    {
        title: "Gym Maintenance Notice",
        category: "Announcements",
        message:
            "The campus gym will be closed for maintenance this Saturday from 8:00 AM to 4:00 PM. We apologize for the inconvenience. We are trying our best to resolve this as soon as possible and we will get back to you urgently.",
        author: "Facilities Management",
        date: "2026-02-03",
    },
    {
        title: "Career Fair This Friday",
        category: "Events",
        message:
            "Meet recruiters from tech, finance, and healthcare companies at the Winter Career Fair. Bring your resume and dress business casual.",
        author: "Career and Co-op Center",
        date: "2026-02-14",
    },
    {
        title: "Job Fair",
        category: "Announcements",
        message: "I will finally get a job! Probably...",
        author: "CS Student",
        date: "2026-02-14",
    },

        {
        title: "Campus WiFi Upgrade",
        category: "Announcements",
        message:
            "IT Services will be upgrading the campus wireless network this weekend. Expect intermittent connectivity in academic buildings between 1:00 AM and 6:00 AM. After the upgrade, connection speeds should improve significantly for all users.",
        author: "IT Services",
        date: "2026-03-01",
    },
    {
        title: "Chess Club Meeting",
        category: "Events",
        message: "Chess club meets tonight at 7 PM in ENG-102.",
        author: "Student Clubs",
        date: "2026-03-02",
    },
    {
        title: "Parking Lot Closure",
        category: "Announcements",
        message:
            "Lot B will be temporarily closed due to snow removal operations. Vehicles remaining in the lot after midnight may be ticketed or towed at the owner's expense.",
        author: "Parking Authority",
        date: "2026-02-28",
    },
    {
        title: "Looking for Project Teammates",
        category: "Academics",
        message:
            "I'm looking for 2–3 teammates for the CPS 721 final project. Ideally someone comfortable with Node.js, MongoDB, and React. If you're interested please email me or message me on the course Discord server.",
        author: "Anonymous Student",
        date: "2026-03-03",
    },
    {
        title: "Free Pizza",
        category: "Events",
        message: "Free pizza in the student lounge while supplies last!",
        author: "Student Union",
        date: "2026-03-04",
    },
    {
        title: "Very Long Test Post",
        category: "Testing",
        message:
            "This is a deliberately very long bulletin message intended to test how the UI handles large blocks of text. In real-world applications, users may occasionally paste long announcements, event descriptions, or multi-paragraph updates into bulletin systems. Therefore it is important that the front-end properly handles text wrapping, overflow behavior, scrolling containers, and responsive layouts. If your application truncates messages, adds ellipsis, or dynamically expands content panels, this entry should help you verify that the behavior works as expected across different devices and screen sizes.",
        author: "QA Tester",
        date: "2026-03-05",
    },
    {
        title: "",
        category: "Testing",
        message: "Testing an empty title field.",
        author: "System Test",
        date: "2026-03-06",
    },
    {
        title: "Edge Case Characters !@#$%^&*()",
        category: "Testing",
        message:
            "This message contains special characters to test escaping and rendering: <script>alert('test')</script> & % $ # @ !",
        author: "Security Team",
        date: "2026-03-06",
    },
    {
        title: "Short",
        category: "Misc",
        message: "Ok.",
        author: "Bot",
        date: "2026-01-01",
    },
    {
        title: "Future Event",
        category: "Events",
        message:
            "Reminder: Registration for the Summer Hackathon opens next month. Teams of up to 4 people are allowed and prizes will be awarded to the top three teams.",
        author: "Hackathon Committee",
        date: "2026-06-15",
    },
];

module.exports = { bulletins };
