import { PrismaClient, CourseType } from '@prisma/client';

const prisma = new PrismaClient();

const collegeNames = [
  'Summit Institute of Technology',
  'Crestwood University',
  'Riverside Business School',
  'Sunrise College of Engineering',
  'Nexus Institute of Design',
  'Apex College of Computing',
  'Verve School of Arts',
  'Beacon Institute of Management',
  'Nova Institute of Science',
  'Orchid Institute of Engineering',
  'Horizon School of Business',
  'Pearl Valley College',
  'Lakeside Institute of Innovation',
  'Silver Oak Institute',
  'Maple Grove University',
  'Cobalt School of Technology',
  'Urban Heights College',
  'Summit Springs Institute',
  'Platinum Ridge University',
  'Ivycrest School of Management',
  'Aurora College of Engineering',
  'Starlight Institute of Media',
  'Zenith School of Architecture',
  'Granite Valley Institute',
  'Emerald City College',
  'Pinnacle Institute of Analytics',
  'Marina Bay School of Health',
  'Copperfield School of Science',
  'Silicon Lane University',
  'Skyline Institute of Arts',
  'Regal College of Finance',
  'Nimbus Institute of Design',
  'Oakfield Institute of Management',
  'Titanium School of Technology',
  'Willow Creek College',
  'Vantage Point Institute',
  'Arbor College of Computing',
  'Phoenix School of Business',
  'Crescent Academy of Sciences',
  'Radiant Institute of Media',
  'Serene Heights College',
  'Luminous Institute of Engineering',
  'Banyan School of Law',
  'Cypress Institute of Education',
  'Falcon College of Arts',
  'Emerald Ridge University',
  'Northstar Institute of Technology',
  'Sunset School of Hospitality',
  'Pioneer Institute of Analytics',
  'Catalyst Institute of Finance',
  'Harborview College',
  'Vivid Academy of Architecture',
  'Quartz College of Innovation',
  'Atlas Institute of Data Science',
  'Prairie School of Management',
  'Echo Institute of Design',
  'Arcadia College of Health',
  'Astra Institute of Business',
  'Metro Valley College',
  'Crown Institute of Media',
  'Nimbus School of Science'
];

const feeRanges = [260000, 280000, 300000, 320000, 340000, 360000, 380000, 400000, 420000, 460000, 500000, 540000, 580000];
const locations = ['Bengaluru', 'Pune', 'Mumbai', 'Chennai', 'Hyderabad', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Lucknow', 'Coimbatore'];

const colleges = collegeNames.map((name, index) => ({
  name,
  location: locations[index % locations.length],
  fees: feeRanges[index % feeRanges.length],
  rating: [4.8, 4.5, 4.3, 4.0, 3.8][index % 5]
}));

const courseTemplates = [
  { title: 'Computer Science & Engineering', type: CourseType.UG, duration: '4 years', fees: 200000 },
  { title: 'Data Science and Analytics', type: CourseType.PG, duration: '2 years', fees: 280000 },
  { title: 'Business Administration', type: CourseType.UG, duration: '3 years', fees: 220000 },
  { title: 'Design & Innovation', type: CourseType.DIPLOMA, duration: '1 year', fees: 150000 },
  { title: 'Cyber Security', type: CourseType.CERTIFICATION, duration: '6 months', fees: 90000 }
];

const reviewTemplates = [
  { title: 'Great campus and faculty', comment: 'The programs are well structured and placement support is strong.', rating: 5 },
  { title: 'Strong labs and industry exposure', comment: 'The mentorship and guest sessions helped me build confidence.', rating: 4 },
  { title: 'Modern infrastructure', comment: 'The college maintains a good balance between academics and practical learning.', rating: 4 },
  { title: 'Excellent student support', comment: 'Counseling and career services are very responsive.', rating: 5 },
  { title: 'Well-connected campus', comment: 'The city location is excellent for internships and networking.', rating: 4 }
];

const users = [
  { name: 'Priya Sharma', email: 'priya@example.com' },
  { name: 'Arjun Patel', email: 'arjun@example.com' },
  { name: 'Sneha Rao', email: 'sneha@example.com' }
];

async function main() {
  await prisma.user.createMany({
    data: users.map((user) => ({ ...user, hashedPassword: null })),
    skipDuplicates: true
  });

  for (const college of colleges) {
    const slug = college.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const createdCollege = await prisma.college.create({
      data: {
        name: college.name,
        slug,
        location: college.location,
        description: `A modern institution in ${college.location} focused on career-ready programs in technology, management, and creative fields.`,
        imageUrl: `https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80`,
        rating: college.rating,
        fees: college.fees,
        established: 1995,
        courses: {
          create: courseTemplates.map((course) => ({
            ...course,
            title: course.title,
            fees: course.fees
          }))
        },
        reviews: {
          create: reviewTemplates.map((review, index) => ({
            ...review,
            rating: review.rating,
            user: {
              connect: { email: users[index % users.length].email }
            }
          }))
        }
      }
    });

    if (Math.random() > 0.6) {
      const savedUser = users[Math.floor(Math.random() * users.length)];
      await prisma.savedCollege.create({
        data: {
          user: { connect: { email: savedUser.email } },
          college: { connect: { id: createdCollege.id } }
        }
      });
    }
  }
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
