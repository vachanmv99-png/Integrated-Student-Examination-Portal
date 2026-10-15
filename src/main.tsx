import React, { useEffect, useState } from 'react';
import { fetchStudents } from './studentData';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';
import type { Application, Payment, Subject } from './types';
import { repo } from './services/repository';
import { downloadDocument } from './services/pdf';
import { rupee, formatDate as date } from './utils/format';
import { Badge } from './components/ui/Badge';
import { Stats } from './components/ui/Stats';
import { useSession } from './features/auth/useSession';
import { PortalShell } from './layouts/PortalShell';
import { LoginPage } from './pages/auth/LoginPage';
import './styles.css';

/* Legacy implementation retained temporarily while the remaining feature pages are extracted.
function LegacyLogin({ login }: { login: (x: never) => void }) {
  const nav = useNavigate();
  const [email, setEmail] = useState('student@demo.edu');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = email.toLowerCase().includes('admin') ? 'admin' : 'student';
    login(r);
    nav('/' + r);
  };

  return (
    <main className="login">
      <section className="login-brand">
        <div className="crest">N</div>
        <p className="eyebrow">NORTHSTAR COLLEGE</p>
        <h1>
          Student Exam
          <br />
          Portal
        </h1>
        <p>
          One secure place to apply, pay, and track your Makeup Exam application.
        </p>
        <div className="login-note">
          ✦ Secure, paperless examination services
        </div>
      </section>

      <section className="login-box">
        <div>
          <p className="eyebrow blue">WELCOME BACK</p>
          <h2>Sign in to your portal</h2>
          <p className="muted">Use your college email to continue.</p>
        </div>

        <form onSubmit={submit}>
          <label>
            Email / Student ID
            <input
              aria-label="Email / Student ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </label>

          <label>
            Password
            <a href="#forgot">Forgot password?</a>
            <input
              aria-label="Password"
              type="password"
              defaultValue="password"
              required
            />
          </label>

          <button className="primary wide">
            Sign in <span>→</span>
          </button>
        </form>

        <div className="demo">
          <b>Demo access</b>
          <button onClick={() => setEmail('student@demo.edu')}>Student</button>
          <button onClick={() => setEmail('admin@demo.edu')}>Admin</button>
          <small>Use any password in demo mode.</small>
        </div>
      </section>
    </main>
  );
}

const legacyNavs = {
  student: [
    ['/student', 'Dashboard', '⌂'],
    ['/student/services', 'Exam Services', '◫'],
    ['/student/applications', 'My Applications', '▤'],
    ['/student/payments', 'Payments', '◈'],
    ['/student/profile', 'Profile', '◎'],
  ],
  admin: [
    ['/admin', 'Dashboard', '⌂'],
    ['/admin/applications', 'Applications', '▤'],
    ['/admin/subjects', 'Subjects', '◫'],
    ['/admin/payments', 'Payments', '◈'],
    ['#reports', 'Reports', '◉'],
    ['#settings', 'Settings', '⚙'],
  ],
};

function LegacyShell({
  role,
  out,
  children,
}: {
  role: Role;
  out: () => void;
  children: React.ReactNode;
}) {
  const p = repo.profile();

  return (
    <div className="shell">
      <aside>
        <div className="brand">
          <div className="crest mini">N</div>
          <span>
            Northstar<small>EXAMINATION CELL</small>
          </span>
        </div>

        <nav>
          {legacyNavs[role].map(([to, label, i]) =>
            to.startsWith('#') ? (
              <a key={to} className="soon" href={to}>
                <Icon>{i}</Icon>
                {label}
                <em>Soon</em>
              </a>
            ) : (
              <NavLink key={to} end={to === '/' + role} to={to}>
                <Icon>{i}</Icon>
                {label}
              </NavLink>
            )
          )}
        </nav>

        <div className="account">
          <div className="avatar">{role === 'student' ? p.fullName[0] : 'A'}</div>
          <div>
            <b>{role === 'student' ? p.fullName : 'Admin Office'}</b>
            <small>{role === 'student' ? p.usn : 'Administrator'}</small>
          </div>
          <button onClick={out} title="Logout">
            ↪
          </button>
        </div>
      </aside>

      <div className="content">
        <header>
          <div>
            <span className="dot"></span>MAKEUP EXAM • SEP 2026
          </div>
          <div className="header-icons">⌕　♧</div>
        </header>

        <main className="page">{children}</main>
      </div>
    </div>
  );
}

function LegacyStats({ items }: { items: [string, string, string][] }) {
  return (
    <div className="stats">
      {items.map(([n, l, i]) => (
        <article key={l}>
          <span className="stat-icon">{i}</span>
          <div>
            <b>{n}</b>
            <small>{l}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

*/

function StudentDashboard() {
 const p = repo.profile();
const apps = repo.applications();
const payments = repo.payments();

const [students, setStudents] = useState<any[]>([]);
const [dataError, setDataError] = useState('');

useEffect(() => {
  fetchStudents()
    .then((data) => setStudents(data))
    .catch((error) => setDataError(error.message));
}, []);

  return (
    <>
      <div className="hero">
        <div>
          <p className="eyebrow">STUDENT DASHBOARD</p>
          <h1>
            Welcome back, {p.fullName.split(' ')[0]} <span>✦</span>
          </h1>
          <p>Here’s a quick look at your examination services.</p>
        </div>
        <NavLink className="primary" to="/student/makeup-exam">
          Apply for Makeup Exam <span>→</span>
        </NavLink>
      </div>

      <Stats
        items={[
          [
            String(apps.filter((x) => x.status === 'Under Verification').length),
            'Active applications',
            '◷',
          ],
          [
            String(apps.filter((x) => x.status === 'Submitted').length),
            'Pending applications',
            '◴',
          ],
          [
            String(apps.filter((x) => x.status === 'Approved').length),
            'Completed applications',
            '✓',
          ],
          [
            rupee(payments.reduce((n, x) => n + x.amount, 0)),
            'Total payments',
            '₹',
          ],
        ]}
      />

      <section className="section-head">
  <div>
    <p className="eyebrow">STUDENT DATASET</p>
    <h2>Registered Students</h2>
    <p className="muted">
      Total student records: {students.length}
    </p>
  </div>
</section>

<div className="table-wrap">
  <table>
    <thead>
      <tr>
        <th>USN</th>
        <th>Student Name</th>
        <th>Branch</th>
        <th>Semester</th>
        <th>Attendance</th>
        <th>Total Marks</th>
        <th>Result</th>
      </tr>
    </thead>
    <tbody>
      {students.map((student) => (
        <tr key={student.usn || student.id}>
          <td>{student.usn}</td>
          <td>{student.fullName}</td>
          <td>{student.branch}</td>
          <td>{student.semester}</td>
          <td>{student.attendance}%</td>
          <td>{student.totalMarks}</td>
          <td>{student.result}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      <section className="section-head">
        <div>
          <p className="eyebrow">EXAMINATION SERVICES</p>
          <h2>What would you like to do?</h2>
        </div>
      </section>

      <div className="services">
        {[
          [
            'Makeup Exam',
            'Apply for a missed examination',
            'Active',
            '/student/makeup-exam',
            '✦',
          ],
          [
            'Regular Exam',
            'Semester examination services',
            'Coming soon',
            '#',
            '▦',
          ],
          ['Re-Exam', 'Reattempt an examination', 'Coming soon', '#', '↻'],
          [
            'Arrear Exam',
            'Clear previous semester papers',
            'Coming soon',
            '#',
            '◫',
          ],
        ].map(([a, b, c, to, i]) => (
          <article key={a} className={c === 'Active' ? 'active-card' : ''}>
            <span>{i}</span>
            <Badge>{c}</Badge>
            <h3>{a}</h3>
            <p>{b}</p>
            {to === '#' ? (
              <button disabled>Available soon</button>
            ) : (
              <NavLink to={to}>
                Explore service <b>→</b>
              </NavLink>
            )}
          </article>
        ))}
      </div>

      <section className="notice">
        <span>i</span>
        <div>
          <b>Need help with your application?</b>
          <p>Contact the Examination Cell during working hours.</p>
        </div>
        <a href="mailto:exam@northstar.edu">Contact support →</a>
      </section>
    </>
  );
}

function Profile() {
  const [p, setP] = useState(repo.profile()),
    [edit, setEdit] = useState(false);

  const save = () => {
    repo.updateProfile({ email: p.email, phone: p.phone });
    setEdit(false);
  };

  return (
    <>
      <div className="title">
        <div>
          <p className="eyebrow">ACCOUNT</p>
          <h1>My profile</h1>
          <p>Keep your contact information up to date.</p>
        </div>
        <button
          className="secondary"
          onClick={() => (edit ? save() : setEdit(true))}
        >
          {edit ? 'Save changes' : 'Edit profile'}
        </button>
      </div>

      <section className="profile-card">
        <div className="profile-top">
          <div className="avatar large">V</div>
          <div>
            <h2>{p.fullName}</h2>
            <p>
              {p.usn} · {p.branch}
            </p>
          </div>
          <Badge>Active</Badge>
        </div>

        <p className="info">
          ⓘ Your identity details are maintained by the college. Contact the
          Examination Cell if they need correction.
        </p>

        <div className="details">
          {[
            ['Full name', p.fullName],
            ['Register number / USN', p.usn],
            ['Branch', p.branch],
            ['Current semester', `Semester ${p.currentSemester}`],
          ].map(([l, v]) => (
            <label key={l}>
              {l}
              <input value={v} readOnly />
            </label>
          ))}
          <label>
            Email
            <input
              value={p.email}
              readOnly={!edit}
              onChange={(e) => setP({ ...p, email: e.target.value })}
            />
          </label>
          <label>
            Phone number
            <input
              value={p.phone}
              readOnly={!edit}
              onChange={(e) => setP({ ...p, phone: e.target.value })}
            />
          </label>
        </div>
      </section>
    </>
  );
}

function Makeup() {
  const nav = useNavigate(),
    [step, setStep] = useState(1),
    [chosen, setChosen] = useState<Subject[]>([]),
    [query, setQuery] = useState(''),
    [method, setMethod] = useState('UPI'),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [result, setResult] = useState<{ app: Application; payment: Payment } | null>(
      null
    );

  const p = repo.profile(),
    all = repo
      .subjects()
      .filter(
        (s) =>
          s.branch === p.branch &&
          s.status === 'active' &&
          (s.subjectName + s.subjectCode)
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    examFee = chosen.reduce((n, s) => n + s.examFee, 0),
    total = examFee + 20;

  const add = (s: Subject) => {
    if (chosen.some((x) => x.id === s.id))
      setError('This subject has already been added.');
    else setChosen([...chosen, s]);
  };

  const pay = () => {
    setBusy(true);
    setError('');
    setTimeout(() => {
      try {
        setResult(repo.submit(chosen, method));
        setStep(5);
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : 'Something went wrong. Please try again.'
        );
      } finally {
        setBusy(false);
      }
    }, 900);
  };

  const steps = [
    'Student Details',
    'Select Subjects',
    'Review',
    'Payment',
    'Confirmation',
  ];

  return (
    <>
      <div className="title">
        <div>
          <p className="eyebrow">EXAM SERVICES</p>
          <h1>Makeup Exam application</h1>
          <p>Apply for eligible subjects across your branch.</p>
        </div>
      </div>

      <div className="stepper">
        {steps.map((s, i) => (
          <div className={i + 1 <= step ? 'done' : ''} key={s}>
            <span>{i + 1 < step ? '✓' : i + 1}</span>
            <b>{s}</b>
          </div>
        ))}
      </div>

      {error && <p className="alert">⚠ {error}</p>}

      {step === 1 && (
        <section className="workflow">
          <h2>Confirm your details</h2>
          <p>
            Student details are fetched from your profile. To update them, visit{' '}
            <NavLink to="/student/profile">Profile</NavLink>.
          </p>
          <div className="readonly-grid">
            {[
              ['Full name', p.fullName],
              ['USN', p.usn],
              ['Branch', p.branch],
              ['Current semester', `Semester ${p.currentSemester}`],
            ].map(([x, y]) => (
              <div key={x}>
                <small>{x}</small>
                <b>{y}</b>
              </div>
            ))}
          </div>
          <button className="primary" onClick={() => setStep(2)}>
            Continue to subject selection →
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="workflow">
          <h2>Select subjects</h2>
          <p>
            All active subjects for <b>{p.branch}</b> are available, including
            previous and later semesters.
          </p>
          <label className="search">
            ⌕
            <input
              placeholder="Search subject by name or subject code"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="subject-list">
            {all.map((s) => (
              <div className="subject" key={s.id}>
                <div>
                  <b>{s.subjectName}</b>
                  <p>
                    <code>{s.subjectCode}</code> · Semester {s.semester}
                  </p>
                </div>
                <strong>{rupee(s.examFee)}</strong>
                <button
                  className="add"
                  onClick={() => add(s)}
                  disabled={chosen.some((x) => x.id === s.id)}
                >
                  {chosen.some((x) => x.id === s.id) ? 'Added' : '＋ Add'}
                </button>
              </div>
            ))}
            {!all.length && (
              <p className="empty">No subjects found matching your search.</p>
            )}
          </div>
          <Selected
            items={chosen}
            remove={(id) => setChosen(chosen.filter((x) => x.id !== id))}
          />
          <div className="flow-actions">
            <button className="ghost" onClick={() => setStep(1)}>
              ← Back
            </button>
            <button
              className="primary"
              disabled={!chosen.length}
              onClick={() => setStep(3)}
            >
              Review application →
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <Review
          p={p}
          subjects={chosen}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <section className="workflow">
          <h2>Secure payment</h2>
          <p>
            Your payment is handled by a secure provider. No card or UPI
            credentials are stored.
          </p>
          <div className="payment-box">
            <div>
              <b>Amount payable</b>
              <strong>{rupee(total)}</strong>
              <small>
                Exam fee {rupee(examFee)} + processing fee ₹20
              </small>
            </div>
            <label>
              Payment method
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option>UPI</option>
                <option>Debit / Credit Card</option>
                <option>Net Banking</option>
              </select>
            </label>
          </div>
          <p className="info">
            ⓘ Demo mode uses a MOCK payment provider. Select “Pay now” to
            simulate a successful payment.
          </p>
          <div className="flow-actions">
            <button className="ghost" onClick={() => setStep(3)}>
              ← Back
            </button>
            <button className="primary" onClick={pay} disabled={busy}>
              {busy ? 'Processing payment…' : 'Pay ' + rupee(total) + ' →'}
            </button>
          </div>
        </section>
      )}

      {step === 5 && result && (
        <Success
          result={result}
          view={() => nav('/student/applications/' + result.app.id)}
        />
      )}
    </>
  );
}

function Selected({
  items,
  remove,
}: {
  items: Subject[];
  remove: (id: string) => void;
}) {
  return (
    <div className="selected">
      <div className="table-title">
        <h3>
          Selected subjects <span>{items.length}</span>
        </h3>
        <b>{rupee(items.reduce((n, x) => n + x.examFee, 0))}</b>
      </div>
      {items.length ? (
        <table>
          <thead>
            <tr>
              <th>Subject name</th>
              <th>Subject code</th>
              <th>Semester</th>
              <th>Exam fee</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id}>
                <td>{s.subjectName}</td>
                <td>
                  <code>{s.subjectCode}</code>
                </td>
                <td>Semester {s.semester}</td>
                <td>{rupee(s.examFee)}</td>
                <td>
                  <button
                    className="text danger"
                    onClick={() => remove(s.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="empty">No subjects selected yet.</p>
      )}
    </div>
  );
}

function Review({
  p,
  subjects,
  onBack,
  onNext,
}: {
  p: ReturnType<typeof repo.profile>;
  subjects: Subject[];
  onBack: () => void;
  onNext: () => void;
}) {
  const fee = subjects.reduce((n, x) => n + x.examFee, 0);

  return (
    <section className="workflow review">
      <h2>Review your application</h2>
      <div className="review-block">
        <h3>Student details</h3>
        <p>
          {p.fullName}　·　{p.usn}
          <br />
          {p.branch}　·　Semester {p.currentSemester}
        </p>
      </div>

      <Selected items={subjects} remove={() => {}} />

      <div className="summary">
        <span>Exam fee</span>
        <b>{rupee(fee)}</b>
        <span>Processing fee</span>
        <b>₹20</b>
        <strong>Total payable</strong>
        <strong>{rupee(fee + 20)}</strong>
      </div>

      <div className="flow-actions">
        <button className="ghost" onClick={onBack}>
          ← Back & edit
        </button>
        <button className="primary" onClick={onNext}>
          Proceed to payment →
        </button>
      </div>
    </section>
  );
}

function Success({
  result,
  view,
}: {
  result: { app: Application; payment: Payment };
  view: () => void;
}) {
  const { app, payment } = result;

  return (
    <section className="success">
      <div className="success-mark">✓</div>
      <p className="eyebrow">PAYMENT SUCCESSFUL</p>
      <h1>Your application is submitted!</h1>
      <p>
        We have received your Makeup Exam application. You can track it anytime
        from My Applications.
      </p>

      <div className="receipt">
        <span>
          Application ID <b>{app.applicationId}</b>
        </span>
        <span>
          Transaction ID <b>{payment.transactionId}</b>
        </span>
        <span>
          Amount paid <b>{rupee(payment.amount)}</b>
        </span>
        <span>
          Status <Badge>Submitted</Badge>
        </span>
      </div>

      <div className="doc-actions">
        <button
          className="secondary"
          onClick={() => downloadDocument('receipt', app, payment)}
        >
          ↓ Payment acknowledgement
        </button>
        <button
          className="secondary"
          onClick={() => downloadDocument('application', app, payment)}
        >
          ↓ Exam application
        </button>
        <button className="primary" onClick={view}>
          View application →
        </button>
      </div>
    </section>
  );
}

function Applications({ admin = false }: { admin?: boolean }) {
  const nav = useNavigate(),
    [q, setQ] = useState(''),
    [filter, setFilter] = useState('All'),
    apps = repo
      .applications()
      .filter(
        (a) =>
          (!admin || a.studentId === repo.profile().id) &&
          `${a.applicationId} ${a.studentSnapshot.fullName} ${a.studentSnapshot.usn}`
            .toLowerCase()
            .includes(q.toLowerCase()) &&
          (filter === 'All' || a.status === filter)
      );

  return (
    <>
      <div className="title">
        <div>
          <p className="eyebrow">{admin ? 'ADMINISTRATION' : 'MAKEUP EXAM'}</p>
          <h1>{admin ? 'Applications' : 'My applications'}</h1>
          <p>
            {admin
              ? 'Review submitted Makeup Exam applications.'
              : 'Track your submitted applications and their status.'}
          </p>
        </div>
        {!admin && (
          <NavLink className="primary" to="/student/makeup-exam">
            New application →
          </NavLink>
        )}
      </div>

      <div className="toolbar">
        <label className="search">
          ⌕
          <input
            placeholder={
              admin ? 'Search ID, USN or student' : 'Search application ID'
            }
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Submitted</option>
          <option>Under Verification</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Application ID</th>
              {admin && (
                <>
                  <th>Student</th>
                  <th>USN</th>
                </>
              )}
              <th>Subjects</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {apps.map((a) => (
              <tr key={a.id}>
                <td>
                  <b>{a.applicationId}</b>
                </td>
                {admin && (
                  <>
                    <td>{a.studentSnapshot.fullName}</td>
                    <td>{a.studentSnapshot.usn}</td>
                  </>
                )}
                <td>
                  {a.subjects.length} subject
                  {a.subjects.length > 1 ? 's' : ''}
                </td>
                <td>{rupee(a.total)}</td>
                <td>
                  <Badge>{a.paymentStatus}</Badge>
                </td>
                <td>
                  <Badge>{a.status}</Badge>
                </td>
                <td>{date(a.createdAt)}</td>
                <td>
                  <button
                    className="text"
                    onClick={() =>
                      nav(
                        (admin ? '/admin' : '/student') +
                          '/applications/' +
                          a.id
                      )
                    }
                  >
                    View →
                  </button>
                </td>
              </tr>
            ))}
            {!apps.length && (
              <tr>
                <td colSpan={admin ? 9 : 7}>
                  <p className="empty">No applications yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ApplicationDetail({ admin = false }: { admin?: boolean }) {
  const { id } = useParams(),
    nav = useNavigate(),
    app = repo.applications().find((a) => a.id === id),
    pay = repo.payments().find((x) => x.applicationId === app?.applicationId),
    [reason, setReason] = useState('');

  if (!app || !pay)
    return (
      <Navigate to={admin ? '/admin/applications' : '/student/applications'} />
    );

  const change = (status: Application['status']) => {
    if (status === 'Rejected' && !reason.trim()) return;
    repo.setStatus(app.id, status, reason);
    nav(admin ? '/admin/applications' : '/student/applications');
  };

  return (
    <>
      <button className="back" onClick={() => nav(-1)}>
        ← Back to applications
      </button>

      <div className="title detail-title">
        <div>
          <p className="eyebrow">MAKEUP EXAM APPLICATION</p>
          <h1>{app.applicationId}</h1>
          <p>Submitted {date(app.createdAt)}</p>
        </div>
        <Badge>{app.status}</Badge>
      </div>

      <div className="timeline">
        {[
          'Application Created',
          'Payment Successful',
          'Application Submitted',
          'Under Verification',
          'Approved',
        ].map((x, i) => (
          <div
            className={
              i < 3 ||
              (app.status === 'Under Verification' && i === 3) ||
              (app.status === 'Approved' && i === 4)
                ? 'complete'
                : ''
            }
            key={x}
          >
            <span>{i < 3 ? '✓' : i + 1}</span>
            {x}
          </div>
        ))}
      </div>

      <div className="two-col">
        <section className="panel">
          <h3>Student information</h3>
          <dl>
            <dt>Name</dt>
            <dd>{app.studentSnapshot.fullName}</dd>
            <dt>USN</dt>
            <dd>{app.studentSnapshot.usn}</dd>
            <dt>Branch</dt>
            <dd>{app.studentSnapshot.branch}</dd>
            <dt>Semester</dt>
            <dd>{app.studentSnapshot.currentSemester}</dd>
            <dt>Email</dt>
            <dd>{app.studentSnapshot.email}</dd>
          </dl>
        </section>

        <section className="panel">
          <h3>Payment details</h3>
          <dl>
            <dt>Transaction ID</dt>
            <dd>{pay.transactionId}</dd>
            <dt>Method</dt>
            <dd>{pay.paymentMethod} · MOCK</dd>
            <dt>Amount</dt>
            <dd>{rupee(pay.amount)}</dd>
            <dt>Status</dt>
            <dd>
              <Badge>{pay.status}</Badge>
            </dd>
            <dt>Date</dt>
            <dd>{date(pay.paymentDate)}</dd>
          </dl>
        </section>
      </div>

      <section className="panel">
        <h3>Selected subjects</h3>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Code</th>
              <th>Semester</th>
              <th>Fee</th>
            </tr>
          </thead>
          <tbody>
            {app.subjects.map((s) => (
              <tr key={s.subjectId}>
                <td>{s.subjectName}</td>
                <td>
                  <code>{s.subjectCode}</code>
                </td>
                <td>Semester {s.semester}</td>
                <td>{rupee(s.examFee)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="doc-actions">
        <button
          className="secondary"
          onClick={() => downloadDocument('application', app, pay)}
        >
          ↓ Download application
        </button>
        <button
          className="secondary"
          onClick={() => downloadDocument('receipt', app, pay)}
        >
          ↓ Payment acknowledgement
        </button>
      </div>

      {admin && app.status !== 'Approved' && app.status !== 'Rejected' && (
        <section className="admin-actions">
          <h3>Admin decision</h3>
          <div>
            <button className="primary" onClick={() => change('Approved')}>
              Approve application
            </button>
            <input
              placeholder="Rejection reason (required to reject)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <button className="danger-btn" onClick={() => change('Rejected')}>
              Reject application
            </button>
          </div>
        </section>
      )}
    </>
  );
}

function AdminDashboard() {
  const apps = repo.applications(),
    pays = repo.payments();

  return (
    <>
      <div className="title">
        <div>
          <p className="eyebrow">ADMINISTRATION</p>
          <h1>Examination overview</h1>
          <p>Makeup Exam cycle · September 2026</p>
        </div>
      </div>

      <Stats
        items={[
          [String(apps.length), 'Total applications', '▤'],
          [
            String(
              apps.filter(
                (a) =>
                  a.status === 'Submitted' ||
                  a.status === 'Under Verification'
              ).length
            ),
            'Pending verification',
            '◷',
          ],
          [
            String(apps.filter((a) => a.status === 'Approved').length),
            'Approved',
            '✓'],
          [
            String(apps.filter((a) => a.status === 'Rejected').length),
            'Rejected',
            '×',
          ],
          [
            rupee(pays.reduce((n, p) => n + p.amount, 0)),
            'Total collection',
            '₹',
          ],
        ]}
      />

      <section className="panel">
        <div className="table-title">
          <h3>Recent applications</h3>
          <NavLink to="/admin/applications">View all →</NavLink>
        </div>
        <Applications admin />
      </section>
    </>
  );
}

function Subjects() {
  const [all, setAll] = useState(repo.subjects()),
    [form, setForm] = useState<Subject | null>(null),
    [q, setQ] = useState('');

  const save = () => {
    if (!form) return;
    if (!form.subjectName || !form.subjectCode || form.examFee < 0) return;
    try {
      repo.saveSubject(form);
      setAll(repo.subjects());
      setForm(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Unable to save subject.');
    }
  };

  const visible = all.filter((s) =>
    (s.subjectName + s.subjectCode).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <div className="title">
        <div>
          <p className="eyebrow">CATALOGUE</p>
          <h1>Subjects</h1>
          <p>Manage subjects eligible for Makeup Exam.</p>
        </div>
        <button
          className="primary"
          onClick={() =>
            setForm({
              id: 's' + Date.now(),
              subjectName: '',
              subjectCode: '',
              branch: repo.profile().branch,
              semester: 1,
              examFee: 500,
              status: 'active',
            })
          }
        >
          ＋ Add subject
        </button>
      </div>

      {form && (
        <section className="panel subject-form">
          <h3>
            {all.some((x) => x.id === form.id) ? 'Edit subject' : 'Add subject'}
          </h3>
          {(
            ['subjectName', 'subjectCode', 'branch', 'semester', 'examFee'] as const
          ).map((k) => (
            <label key={k}>
              {k.replace(/([A-Z])/g, ' $1')}
              <input
                value={form[k]}
                type={k === 'semester' || k === 'examFee' ? 'number' : 'text'}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [k]:
                      k === 'semester' || k === 'examFee'
                        ? Number(e.target.value)
                        : e.target.value,
                  })
                }
              />
            </label>
          ))}
          <label>
            Status
            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as Subject['status'],
                })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <button className="primary" onClick={save}>
            Save subject
          </button>
          <button className="ghost" onClick={() => setForm(null)}>
            Cancel
          </button>
        </section>
      )}

      <div className="toolbar">
        <label className="search">
          ⌕
          <input
            placeholder="Search subjects"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Subject name</th>
              <th>Code</th>
              <th>Branch</th>
              <th>Semester</th>
              <th>Exam fee</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {visible.map((s) => (
              <tr key={s.id}>
                <td>{s.subjectName}</td>
                <td>
                  <code>{s.subjectCode}</code>
                </td>
                <td>{s.branch}</td>
                <td>{s.semester}</td>
                <td>{rupee(s.examFee)}</td>
                <td>
                  <Badge>{s.status}</Badge>
                </td>
                <td>
                  <button className="text" onClick={() => setForm(s)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Payments({ admin = false }: { admin?: boolean }) {
  const payments = repo.payments(),
    apps = repo.applications();

  return (
    <>
      <div className="title">
        <div>
          <p className="eyebrow">{admin ? 'ADMINISTRATION' : 'MAKEUP EXAM'}</p>
          <h1>{admin ? 'Payments' : 'Payment history'}</h1>
          <p>
            {admin
              ? 'All processed Makeup Exam transactions.'
              : 'Your payment receipts and transaction history.'}
          </p>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Application ID</th>
              {admin && <th>Student</th>}
              <th>Date</th>
              <th>Amount</th>
              <th>Payment method</th>
              <th>Status</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((x) => {
              const a = apps.find((z) => z.applicationId === x.applicationId);
              return (
                <tr key={x.transactionId}>
                  <td>
                    <b>{x.transactionId}</b>
                  </td>
                  <td>{x.applicationId}</td>
                  {admin && <td>{a?.studentSnapshot.fullName}</td>}
                  <td>{date(x.paymentDate)}</td>
                  <td>{rupee(x.amount)}</td>
                  <td>
                    {x.paymentMethod} <small>MOCK</small>
                  </td>
                  <td>
                    <Badge>{x.status}</Badge>
                  </td>
                  <td>
                    {a && (
                      <button
                        className="text"
                        onClick={() => downloadDocument('receipt', a, x)}
                      >
                        Download ↓
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {!payments.length && (
              <tr>
                <td colSpan={admin ? 8 : 7}>
                  <p className="empty">No payments yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function App() {
  const session = useSession();

  useEffect(() => {
    repo.init();
  }, []);

  if (!session.session) return <LoginPage onLogin={session.login} />;

  const r = session.session.role;

  return (
    <PortalShell role={r} onLogout={session.logout}>
      <Routes>
        {r === 'student' ? (
          <>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/services" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<Profile />} />
            <Route path="/student/makeup-exam" element={<Makeup />} />
            <Route path="/student/applications" element={<Applications />} />
            <Route
              path="/student/applications/:id"
              element={<ApplicationDetail />}
            />
            <Route path="/student/payments" element={<Payments />} />
            <Route path="*" element={<Navigate to="/student" />} />
          </>
        ) : (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/applications" element={<Applications admin />} />
            <Route
              path="/admin/applications/:id"
              element={<ApplicationDetail admin />}
            />
            <Route path="/admin/subjects" element={<Subjects />} />
            <Route path="/admin/payments" element={<Payments admin />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </>
        )}
      </Routes>
    </PortalShell>
  );
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
