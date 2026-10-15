import 'dotenv/config';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const config = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (!config.apiKey || !config.projectId || !config.appId) {
  throw new Error('Firebase configuration missing. Check your .env file.');
}

const app = getApps().length ? getApps()[0] : initializeApp(config);
const db = getFirestore(app);

const names = [
  'Aarav Sharma', 'Priya Shetty', 'Rahul Patil', 'Ananya Rao',
  'Kiran Kumar', 'Sneha Reddy', 'Aditya Nayak', 'Pooja Hegde',
  'Rohan Gowda', 'Meera Nair', 'Arjun Bhat', 'Divya Kulkarni',
  'Vivek Joshi', 'Kavya Rao', 'Manoj Shetty', 'Aishwarya Pai',
  'Sanjay Kumar', 'Neha Sharma', 'Akash Patil', 'Shruti Nayak',
  'Pranav Hegde', 'Sahana Bhat', 'Nikhil Rao', 'Deepa Shetty',
  'Varun Kumar', 'Ishita Nair', 'Harish Gowda', 'Riya Kulkarni',
  'Darshan Pai', 'Swathi Joshi'
];

async function seedStudents() {
  for (let i = 0; i < 30; i++) {
    const usn = `4SU24CS${String(201 + i).padStart(3, '0')}`;
    const attendance = 75 + ((i * 7) % 26);
    const internalMarks = 25 + ((i * 3) % 21);
    const externalMarks = 25 + ((i * 5) % 51);
    const totalMarks = internalMarks + externalMarks;

    const student = {
      usn,
      fullName: names[i],
      branch: 'Computer Science and Engineering',
      semester: 5,
      attendance,
      internalMarks,
      externalMarks,
      totalMarks,
      result: totalMarks >= 40 ? 'Pass' : 'Fail',
      feeStatus: i % 7 === 0 ? 'Pending' : 'Paid',
      hallTicketStatus: i % 7 === 0 ? 'On Hold' : 'Generated',
      examType: 'Semester End',
    };

    await setDoc(doc(db, 'students', usn), student);
    console.log(`Added ${i + 1}/30: ${usn}`);
  }

  console.log('Finished processing all 30 student records.');
}

seedStudents().catch((error) => {
  console.error('Seeding failed:', error.code || error.message);
  process.exitCode = 1;
});