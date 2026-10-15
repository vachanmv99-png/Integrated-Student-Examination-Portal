import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
initializeApp(); const db = getFirestore();
export const submitMakeupApplication = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in required.');
  const { subjectIds, paymentMethod = 'MOCK' } = request.data;
  if (!Array.isArray(subjectIds) || !subjectIds.length) throw new HttpsError('invalid-argument', 'Select at least one subject.');
  const studentRef = db.collection('students').doc(request.auth.uid); const student = await studentRef.get();
  if (!student.exists) throw new HttpsError('not-found', 'Student profile not found.');
  const profile = student.data(); const cycle = 'MAKEUP-2026-SEP';
  const subjectDocs = await Promise.all(subjectIds.map(id => db.collection('subjects').doc(id).get()));
  if (subjectDocs.some(s => !s.exists || s.data().status !== 'active' || s.data().branch !== profile.branch)) throw new HttpsError('failed-precondition', 'One or more subjects are not eligible.');
  const duplicate = await db.collection('applications').where('studentId','==',request.auth.uid).where('examCycle','==',cycle).get();
  const used = new Set(duplicate.docs.flatMap(d => d.data().subjects.map(s => s.subjectId))); if (subjectIds.some(id => used.has(id))) throw new HttpsError('already-exists', 'You have already applied for a selected subject in this cycle.');
  const subjects = subjectDocs.map(d => ({ subjectId:d.id, subjectName:d.data().subjectName, subjectCode:d.data().subjectCode, semester:d.data().semester, examFee:d.data().examFee })); const examFee = subjects.reduce((total, s) => total + s.examFee, 0); const processingFee = 20; const counter = db.collection('counters').doc('makeup-2026');
  await db.runTransaction(async tx => { const c = await tx.get(counter); const n = (c.data()?.value || 0) + 1; const applicationId = `MKE-2026-${String(n).padStart(6,'0')}`; const app = db.collection('applications').doc(); const pay = db.collection('payments').doc(); tx.set(counter,{value:n}); tx.set(app,{applicationId,studentId:request.auth.uid,examCycle:cycle,studentSnapshot:{fullName:profile.fullName,registerNumber:profile.registerNumber,usn:profile.usn,branch:profile.branch,currentSemester:profile.currentSemester,email:profile.email},subjects,examFee,processingFee,total:examFee+processingFee,status:'Submitted',paymentStatus:'Successful',createdAt:FieldValue.serverTimestamp()}); tx.set(pay,{transactionId:`TXN${Date.now()}${n}`,applicationId,studentId:request.auth.uid,amount:examFee+processingFee,paymentMethod,provider:'MOCK',status:'Successful',paymentDate:FieldValue.serverTimestamp(),createdAt:FieldValue.serverTimestamp()}); });
  return { ok:true };
});
