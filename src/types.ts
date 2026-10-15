export type Role = 'student' | 'admin';
export type Status = 'Submitted' | 'Under Verification' | 'Approved' | 'Rejected';
export interface Student { id:string; fullName:string; registerNumber:string; usn:string; branch:string; currentSemester:number; email:string; phone:string; role:'student'; }
export interface Subject { id:string; subjectName:string; subjectCode:string; branch:string; semester:number; examFee:number; status:'active'|'inactive'; }
export interface ApplicationSubject { subjectId:string; subjectName:string; subjectCode:string; semester:number; examFee:number; }
export interface Payment { transactionId:string; applicationId:string; studentId:string; amount:number; paymentMethod:string; provider:'MOCK'; status:'Successful'|'Failed'|'Pending'; paymentDate:string; }
export interface Application { id:string; applicationId:string; studentId:string; examCycle:string; studentSnapshot:Student; subjects:ApplicationSubject[]; examFee:number; processingFee:number; total:number; status:Status; paymentStatus:'Successful'|'Pending'|'Failed'; createdAt:string; rejectedAt?:string; rejectedBy?:string; rejectionReason?:string; }
