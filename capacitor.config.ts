import React, { useState, useRef, useEffect } from 'react';
import {
  Home, Bell, Heart, User, BarChart3, Users, MessageCircle,
  ChevronLeft, ChevronRight, Settings, Search, Send, Award,
  AlertTriangle, MapPin, Sparkles, Calendar, BookOpen,
  Phone as PhoneIcon, Check, ArrowDown, Shield, Eye, EyeOff,
  GraduationCap, Lock, Mail, MoreHorizontal, LogOut, X
} from 'lucide-react';
import { T, fHead, fBody } from './theme.js';

/* ─── tiny helpers ─── */
const s = (base, extra = {}) => ({ ...base, ...extra });
const solid = (bg) => ({ background: bg });
const row = (extra = {}) => ({ display:'flex', alignItems:'center', ...extra });
const col = (extra = {}) => ({ display:'flex', flexDirection:'column', ...extra });

/* ─── SAFE AREA ─── */
const SAFE = {
  paddingTop: 'env(safe-area-inset-top, 44px)',
  paddingBottom: 'env(safe-area-inset-bottom, 20px)',
};

/* ─── SCREEN WRAPPER ─── */
const Screen = ({ children, style = {} }) => (
  <div style={{
    position:'fixed', inset:0,
    background: T.bg,
    fontFamily: fBody,
    color: T.cream,
    display:'flex', flexDirection:'column',
    overflowY:'auto',
    WebkitOverflowScrolling:'touch',
    ...style,
  }}>
    {children}
  </div>
);

/* ─── STATUS BAR spacer ─── */
const StatusBar = ({ bg = T.bg }) => (
  <div style={{ height:'env(safe-area-inset-top, 44px)', background: bg, flexShrink:0 }} />
);

/* ─── BOTTOM TAB BAR ─── */
const TabBar = ({ tabs, active, onChange }) => (
  <div style={{
    position:'fixed', bottom:0, left:0, right:0,
    background: T.bgSoft,
    borderTop: `1px solid ${T.line}`,
    display:'flex',
    paddingBottom:'env(safe-area-inset-bottom, 8px)',
    zIndex:100,
  }}>
    {tabs.map(t => (
      <button key={t.id} onClick={() => onChange(t.id)} style={{
        flex:1, background:'transparent', border:'none',
        padding:'10px 4px 6px',
        display:'flex', flexDirection:'column', alignItems:'center', gap:3,
        color: active===t.id ? T.gold : T.textMute,
      }}>
        <t.icon size={22} strokeWidth={active===t.id ? 2.4 : 1.8} />
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:0.3 }}>{t.label}</span>
      </button>
    ))}
  </div>
);

/* ─── REUSABLE BITS ─── */
const BackBtn = ({ onClick }) => (
  <button onClick={onClick} style={{
    background:'transparent', border:'none', color:T.cream,
    display:'flex', alignItems:'center', gap:4, fontSize:16, padding:'4px 0',
  }}>
    <ChevronLeft size={20} strokeWidth={2.2} /> Back
  </button>
);

const Pill = ({ children, active, onClick, variant='default' }) => {
  const v = {
    default: { bg: active ? T.gold : 'transparent', color: active ? T.card : T.cream, border: active ? T.gold : T.line2 },
    gold:    { bg: T.gold, color: T.card, border: T.gold },
    red:     { bg: T.red,  color: T.white, border: T.red  },
    outline: { bg: 'transparent', color: T.gold, border: T.gold },
    ghost:   { bg: 'transparent', color: T.creamDim, border: T.line2 },
  }[variant] || {};
  return (
    <button onClick={onClick} style={{
      padding:'6px 14px', borderRadius:999, fontSize:12, fontWeight:600,
      background: v.bg, color: v.color, border:`1px solid ${v.border}`,
      whiteSpace:'nowrap', flexShrink:0,
    }}>{children}</button>
  );
};

const BigBtn = ({ children, onClick, variant='red', disabled=false, style:st={} }) => {
  const colors = {
    red:     { bg: disabled ? T.line2 : T.red,  color: T.white },
    gold:    { bg: T.gold, color: T.card },
    outline: { bg: 'transparent', color: T.gold, border:`1px solid ${T.gold}` },
    ghost:   { bg: 'transparent', color: T.cream, border:`1px solid ${T.line2}` },
  }[variant];
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      width:'100%', padding:'15px', borderRadius:14,
      background: colors.bg, color: colors.color,
      border: colors.border || 'none',
      fontSize:15, fontWeight:700,
      opacity: disabled ? 0.5 : 1,
      ...st,
    }}>{children}</button>
  );
};

const Input = ({ icon: Icon, value, onChange, placeholder, type='text', right }) => (
  <div style={{ position:'relative', marginBottom:12 }}>
    {Icon && <Icon size={18} color={T.textDim} style={{ position:'absolute', left:14, top:15 }} />}
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{
        width:'100%', padding: Icon ? '14px 44px' : '14px 16px',
        paddingRight: right ? 44 : undefined,
        background: T.card, border:`1px solid ${T.line2}`,
        borderRadius:12, color: T.cream, fontSize:14, outline:'none',
        boxSizing:'border-box',
      }}
    />
    {right && <div style={{ position:'absolute', right:14, top:13 }}>{right}</div>}
  </div>
);

const Card = ({ children, style:st={}, onClick }) => (
  <div onClick={onClick} style={{
    background: T.card, border:`1px solid ${T.line2}`,
    borderRadius:18, padding:16, ...st,
    cursor: onClick ? 'pointer' : undefined,
  }}>{children}</div>
);

const Avatar = ({ initials, size=42, gold=true }) => (
  <div style={{
    width:size, height:size, borderRadius:'50%',
    background: gold ? `linear-gradient(135deg,${T.gold},${T.goldDeep})` : T.card,
    color: gold ? T.card : T.creamDim,
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize: size*0.28, fontWeight:800, flexShrink:0,
  }}>{initials}</div>
);

/* ─── CUG CREST ─── */
const Crest = ({ size=64 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
    <defs>
      <linearGradient id="cg" x1="0" y1="0" x2="60" y2="60">
        <stop offset="0%" stopColor={T.goldBright}/>
        <stop offset="100%" stopColor={T.goldDeep}/>
      </linearGradient>
    </defs>
    <path d="M30 4 L52 12 L52 32 C52 44 42 52 30 56 C18 52 8 44 8 32 L8 12 Z"
      fill={T.red} stroke="url(#cg)" strokeWidth="2"/>
    <rect x="27.5" y="14" width="5" height="22" fill="url(#cg)"/>
    <rect x="21"   y="22" width="18" height="5"  fill="url(#cg)"/>
    <rect x="16"   y="38" width="28" height="11" rx="1" fill={T.white} stroke="url(#cg)" strokeWidth="1"/>
    <rect x="29.5" y="38" width="1"  height="11" fill={T.red}/>
  </svg>
);

/* ════════════════════════════════════════════
   AUTH SCREENS
════════════════════════════════════════════ */

/* ─── WELCOME ─── */
const Welcome = ({ go }) => (
  <Screen>
    <StatusBar />
    {/* Background glow */}
    <div style={{
      position:'absolute', top:0, left:0, right:0, height:'55%',
      background:`radial-gradient(ellipse at 50% 0%, ${T.red}55 0%, transparent 65%)`,
      pointerEvents:'none',
    }}/>
    <div style={{
      flex:1, display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'space-between',
      padding:'40px 28px',
      paddingBottom:'env(safe-area-inset-bottom, 32px)',
      position:'relative',
    }}>
      {/* Logo */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16, marginTop:20 }}>
        <Crest size={90}/>
        <p style={{ fontSize:11, fontWeight:700, color:T.gold, letterSpacing:2.5, textAlign:'center' }}>
          CENTRAL UNIVERSITY GHANA
        </p>
        <h1 style={{
          fontFamily:fHead, fontSize:42, fontWeight:400, lineHeight:1.05,
          letterSpacing:-1.5, textAlign:'center', color:T.cream, margin:0,
        }}>
          Welcome to<br/>
          <em style={{ color:T.gold, fontStyle:'italic', fontWeight:500 }}>CUG Wellbeing</em>
        </h1>
        <p style={{ fontSize:15, color:T.creamDim, textAlign:'center', lineHeight:1.6, maxWidth:300 }}>
          A daily check-in, campus updates, and people who care — all in one place.
        </p>
      </div>

      {/* Buttons */}
      <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:10 }}>
        <BigBtn onClick={() => go('signup')} variant="red">Create account</BigBtn>
        <BigBtn onClick={() => go('login')}  variant="outline">I already have an account</BigBtn>
        <p style={{ textAlign:'center', fontSize:11, color:T.textMute, marginTop:4 }}>
          By continuing you agree to CUG's{' '}
          <span style={{ textDecoration:'underline' }}>terms</span> and{' '}
          <span style={{ textDecoration:'underline' }}>privacy policy</span>
        </p>
      </div>
    </div>
  </Screen>
);

/* ─── SIGN UP ─── */
const SignUp = ({ go, setAuth }) => {
  const [step, setStep]     = useState(0);
  const [role, setRole]     = useState(null);
  const [name, setName]     = useState('');
  const [email, setEmail]   = useState('');
  const [id, setId]         = useState('');
  const [pass, setPass]     = useState('');
  const [show, setShow]     = useState(false);

  const submit = () => {
    setAuth({ name: name.split(' ')[0] || (role==='staff' ? 'Dr. Mensah' : 'Yaw'), role });
    go(role==='staff' ? 'staff-home' : 'student-home');
  };

  return (
    <Screen>
      <StatusBar/>
      <div style={{ padding:'12px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
        <BackBtn onClick={() => step===0 ? go('welcome') : setStep(0)}/>
        <div style={{ display:'flex', gap:6 }}>
          {[0,1].map(i => (
            <div key={i} style={{ width:28, height:3, borderRadius:2, background: i<=step ? T.gold : T.line }}/>
          ))}
        </div>
        <div style={{ width:60 }}/>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'8px 24px 120px' }}>
        {step===0 ? (
          <>
            <p style={{ fontSize:11, fontWeight:700, color:T.gold, letterSpacing:1.5, marginBottom:10 }}>STEP 1 OF 2</p>
            <h2 style={{ fontFamily:fHead, fontSize:30, fontWeight:400, margin:'0 0 6px' }}>
              I'm a <em style={{ color:T.gold }}>...</em>
            </h2>
            <p style={{ color:T.creamDim, fontSize:14, marginBottom:28, lineHeight:1.5 }}>
              Pick the role that matches you at CUG.
            </p>

            {[
              { r:'student', icon:'🎓', title:'Student', sub:'Daily check-ins, updates, support', bg: T.red },
              { r:'staff',   icon:'👤', title:'Lecturer / Staff', sub:'View student wellbeing, flag concerns', bg: T.gold },
            ].map(opt => (
              <Card key={opt.r} onClick={() => setRole(opt.r)} style={{
                display:'flex', alignItems:'center', gap:14, marginBottom:12,
                border:`1.5px solid ${role===opt.r ? T.gold : T.line2}`,
                background: role===opt.r ? T.cardHi : T.card,
              }}>
                <div style={{
                  width:48, height:48, borderRadius:12,
                  background: opt.bg, display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:22, flexShrink:0,
                }}>{opt.icon}</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:700, fontSize:16, margin:'0 0 3px' }}>{opt.title}</p>
                  <p style={{ fontSize:12, color:T.creamDim, margin:0 }}>{opt.sub}</p>
                </div>
                {role===opt.r && <Check size={20} color={T.gold}/>}
              </Card>
            ))}

            {/* Info note */}
            <div style={{
              marginTop:12, padding:14, borderRadius:12,
              background:`${T.gold}12`, border:`1px solid ${T.gold}40`,
              display:'flex', gap:10,
            }}>
              <div style={{
                width:22, height:22, borderRadius:'50%', background:T.gold,
                color:T.card, display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:12, fontWeight:800, flexShrink:0,
              }}>i</div>
              <p style={{ fontSize:12, color:T.creamDim, lineHeight:1.55, margin:0 }}>
                Only verified lecturers can see student motivation data. Staff accounts require Dean's Office approval.
              </p>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize:11, fontWeight:700, color:T.gold, letterSpacing:1.5, marginBottom:10 }}>STEP 2 OF 2</p>
            <h2 style={{ fontFamily:fHead, fontSize:30, fontWeight:400, margin:'0 0 6px' }}>
              Your <em style={{ color:T.gold }}>details</em>
            </h2>
            <p style={{ color:T.creamDim, fontSize:14, marginBottom:24, lineHeight:1.5 }}>
              We'll verify against the CUG directory.
            </p>
            <Input icon={User} value={name}  onChange={e=>setName(e.target.value)}  placeholder="Full name"/>
            <Input icon={Mail} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@cug.edu.gh"/>
            <Input icon={GraduationCap} value={id} onChange={e=>setId(e.target.value)}
              placeholder={role==='staff' ? 'Staff ID' : 'Student ID'}/>
            <Input icon={Lock} value={pass} onChange={e=>setPass(e.target.value)}
              placeholder="Password (min 8 characters)"
              type={show ? 'text' : 'password'}
              right={
                <button onClick={()=>setShow(!show)} style={{ background:'none', border:'none', color:T.textDim, padding:0 }}>
                  {show ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              }
            />
            {role==='staff' && (
              <div style={{ padding:12, background:`${T.warn}18`, border:`1px solid ${T.warn}44`, borderRadius:10, marginTop:4 }}>
                <p style={{ fontSize:12, color:T.warn, margin:0, fontWeight:600 }}>
                  ⚠ Staff accounts require approval before access is granted (1–2 business days).
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Fixed bottom button */}
      <div style={{
        position:'fixed', bottom:0, left:0, right:0,
        padding:'14px 24px', paddingBottom:'calc(env(safe-area-inset-bottom, 8px) + 14px)',
        background: T.bg, borderTop:`1px solid ${T.line}`,
      }}>
        {step===0 ? (
          <BigBtn onClick={() => setStep(1)} disabled={!role}>Continue →</BigBtn>
        ) : (
          <BigBtn onClick={submit}>Create account</BigBtn>
        )}
        <p style={{ textAlign:'center', fontSize:12, color:T.textDim, marginTop:10 }}>
          Have an account?{' '}
          <span onClick={() => go('login')} style={{ color:T.gold, fontWeight:700 }}>Sign in</span>
        </p>
      </div>
    </Screen>
  );
};

/* ─── LOGIN ─── */
const Login = ({ go, setAuth }) => {
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [show,  setShow]  = useState(false);

  const submit = () => {
    const isStaff = /staff|lecturer|dr\.|prof/i.test(email);
    setAuth({
      name: isStaff ? 'Dr. Mensah' : 'Yaw',
      role: isStaff ? 'staff' : 'student',
    });
    go(isStaff ? 'staff-home' : 'student-home');
  };

  return (
    <Screen>
      <StatusBar/>
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:280,
        background:`radial-gradient(ellipse at 50% 0%, ${T.red}44 0%, transparent 60%)`,
        pointerEvents:'none',
      }}/>

      <div style={{ padding:'12px 24px', flexShrink:0 }}>
        <BackBtn onClick={() => go('welcome')}/>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 24px 120px' }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
          <Crest size={60}/>
        </div>
        <h2 style={{ fontFamily:fHead, fontSize:34, fontWeight:400, textAlign:'center', margin:'0 0 8px' }}>
          Welcome <em style={{ color:T.gold }}>back</em>
        </h2>
        <p style={{ color:T.creamDim, textAlign:'center', fontSize:14, marginBottom:28 }}>
          Sign in to continue
        </p>

        <Input icon={Mail} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@cug.edu.gh"/>
        <Input icon={Lock} value={pass}  onChange={e=>setPass(e.target.value)}
          placeholder="Password" type={show ? 'text' : 'password'}
          right={
            <button onClick={()=>setShow(!show)} style={{ background:'none', border:'none', color:T.textDim, padding:0 }}>
              {show ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          }
        />
        <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:20 }}>
          <span style={{ color:T.gold, fontSize:13, fontWeight:600 }}>Forgot password?</span>
        </div>

        {/* Demo hint */}
        <div style={{
          padding:14, borderRadius:10,
          background:`${T.gold}10`, border:`1px dashed ${T.gold}55`,
          marginBottom:8,
        }}>
          <p style={{ fontSize:11, fontWeight:700, color:T.gold, margin:'0 0 5px', letterSpacing:0.5 }}>DEMO MODE</p>
          <p style={{ fontSize:12, color:T.creamDim, margin:0, lineHeight:1.55 }}>
            Any email with "staff", "dr." or "lecturer" signs you in as a lecturer. Anything else signs in as a student.
          </p>
        </div>
      </div>

      <div style={{
        position:'fixed', bottom:0, left:0, right:0,
        padding:'14px 24px', paddingBottom:'calc(env(safe-area-inset-bottom, 8px) + 14px)',
        background: T.bg, borderTop:`1px solid ${T.line}`,
      }}>
        <BigBtn onClick={submit}>Sign in</BigBtn>
        <p style={{ textAlign:'center', fontSize:12, color:T.textDim, marginTop:10 }}>
          New here?{' '}
          <span onClick={() => go('signup')} style={{ color:T.gold, fontWeight:700 }}>Create account</span>
        </p>
      </div>
    </Screen>
  );
};

/* ════════════════════════════════════════════
   STUDENT SCREENS
════════════════════════════════════════════ */

const STUDENT_TABS = [
  { id:'student-home', label:'Home',    icon:Home },
  { id:'updates',      label:'Updates', icon:Bell },
  { id:'support',      label:'Support', icon:Heart },
  { id:'profile',      label:'Profile', icon:User },
];

/* ─── STUDENT HOME ─── */
const StudentHome = ({ go, name }) => (
  <Screen>
    <StatusBar/>
    <div style={{ flex:1, overflowY:'auto', padding:'12px 20px 90px' }}>

      {/* Greeting */}
      <div style={{ ...row({ justifyContent:'space-between' }), marginBottom:20 }}>
        <div>
          <p style={{ fontSize:12, color:T.textDim, letterSpacing:0.3 }}>Tuesday, 14 April</p>
          <h1 style={{ fontFamily:fHead, fontSize:26, fontWeight:400, margin:'2px 0 0', letterSpacing:-0.5 }}>
            Akwaaba, <em style={{ color:T.gold }}>{name}</em>
          </h1>
        </div>
        <button style={{
          width:40, height:40, borderRadius:'50%',
          background:T.card, border:`1px solid ${T.line2}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          position:'relative',
        }}>
          <Bell size={18} color={T.cream}/>
          <span style={{
            position:'absolute', top:8, right:8, width:8, height:8,
            borderRadius:'50%', background:T.gold,
          }}/>
        </button>
      </div>

      {/* Check-in CTA */}
      <button onClick={() => go('checkin')} style={{
        width:'100%', padding:'20px', borderRadius:22,
        background:`linear-gradient(135deg,${T.red},${T.redDeep})`,
        border:`1px solid ${T.gold}40`,
        textAlign:'left', position:'relative', overflow:'hidden',
        marginBottom:16, display:'block',
        boxShadow:`0 10px 28px -10px ${T.red}99`,
      }}>
        <div style={{
          position:'absolute', top:-30, right:-30, width:140, height:140,
          borderRadius:'50%', background:`radial-gradient(circle,${T.gold}30 0%,transparent 70%)`,
        }}/>
        <p style={{ fontSize:11, fontWeight:700, color:T.gold, letterSpacing:1.5, margin:'0 0 8px' }}>
          DAILY CHECK-IN
        </p>
        <h2 style={{ fontFamily:fHead, fontSize:24, fontWeight:500, color:T.white, margin:'0 0 8px', lineHeight:1.1 }}>
          Take 30 seconds<br/>for yourself
        </h2>
        <p style={{ color:'#ffffffcc', fontSize:13, margin:0 }}>
          ✨ Streak: <strong style={{ color:T.gold }}>4 days</strong> · Tap to start
        </p>
      </button>

      {/* Quick grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
        {[
          { icon:Bell,     label:'Updates',    sub:'4 new today',     c:T.gold, t:'updates'  },
          { icon:Heart,    label:'Get support',sub:'Counselling',     c:T.red,  t:'support'  },
          { icon:Calendar, label:'Timetable',  sub:'Algo · 10am',    c:T.gold, t:'timetable'},
          { icon:Sparkles, label:'Events',     sub:'3 this week',    c:T.red,  t:'events'   },
        ].map((c,i) => (
          <button key={i} onClick={() => go(c.t)} style={{
            padding:16, background:T.card, border:`1px solid ${T.line2}`,
            borderRadius:18, textAlign:'left',
          }}>
            <c.icon size={22} color={c.c} strokeWidth={1.8}/>
            <p style={{ fontSize:14, fontWeight:700, margin:'10px 0 2px' }}>{c.label}</p>
            <p style={{ fontSize:12, color:T.creamDim, margin:0 }}>{c.sub}</p>
          </button>
        ))}
      </div>

      {/* Week summary */}
      <h3 style={{ fontFamily:fHead, fontSize:18, fontWeight:500, margin:'0 0 10px', letterSpacing:-0.3 }}>
        Your week so far
      </h3>
      <Card>
        <div style={{ ...row({ justifyContent:'space-between' }), marginBottom:14 }}>
          <div>
            <p style={{ fontSize:11, color:T.creamDim, margin:0 }}>Avg motivation</p>
            <p style={{ fontFamily:fHead, fontSize:30, fontWeight:500, margin:'2px 0 0', color:T.gold }}>
              4.2<span style={{ fontSize:14, color:T.textMute }}>/5</span>
            </p>
          </div>
          <div style={{ textAlign:'right' }}>
            <p style={{ fontSize:11, color:T.creamDim, margin:0 }}>Check-ins</p>
            <p style={{ fontFamily:fHead, fontSize:30, fontWeight:500, margin:'2px 0 0' }}>
              4<span style={{ fontSize:14, color:T.textMute }}>/7</span>
            </p>
          </div>
        </div>
        <div style={{ display:'flex', gap:4, alignItems:'flex-end', height:44 }}>
          {[{d:'M',v:3,on:true},{d:'T',v:4,on:true},{d:'W',v:5,on:true},{d:'T',v:4,on:true},
            {d:'F',v:0,on:false},{d:'S',v:0,on:false},{d:'S',v:0,on:false}].map((b,i) => (
            <div key={i} style={{ flex:1, textAlign:'center' }}>
              <div style={{
                height: b.on ? b.v*8 : 3,
                background: b.on ? `linear-gradient(180deg,${T.gold},${T.goldDeep})` : T.line2,
                borderRadius:3, marginBottom:5, opacity: b.on ? 1 : 0.5,
              }}/>
              <span style={{ fontSize:10, color:T.textMute, fontWeight:700 }}>{b.d}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
    <TabBar tabs={STUDENT_TABS} active="student-home" onChange={go}/>
  </Screen>
);

/* ─── CHECK-IN ─── */
const CheckIn = ({ go }) => {
  const [step, setStep]   = useState(0);
  const [mood, setMood]   = useState(null);
  const [tags, setTags]   = useState([]);
  const [note, setNote]   = useState('');
  const moods = [
    {v:1,e:'😞',l:'Low'},{v:2,e:'😕',l:'Off'},{v:3,e:'😐',l:'OK'},
    {v:4,e:'🙂',l:'Good'},{v:5,e:'🤩',l:'Great'},
  ];
  const tagOpts = mood?.v<=2
    ? ['Tired','Anxious','Lonely','Overwhelmed','Sad','Stressed','Money worries','Sleep issues']
    : ['Energised','Productive','Connected','Calm','Confident','Made progress','Good sleep','Exercised'];
  const toggle = t => setTags(tags.includes(t) ? tags.filter(x=>x!==t) : [...tags,t]);

  return (
    <Screen>
      <StatusBar/>
      <div style={{ ...row({ justifyContent:'space-between', padding:'12px 20px', flexShrink:0 }) }}>
        <BackBtn onClick={() => step===0 ? go('student-home') : setStep(step-1)}/>
        <div style={{ display:'flex', gap:5 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width:22, height:3, borderRadius:2, background: i<=step ? T.gold : T.line }}/>
          ))}
        </div>
        <button onClick={() => go('student-home')} style={{ background:'none', border:'none', color:T.textDim, fontSize:13 }}>
          Skip
        </button>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'8px 20px 120px' }}>
        <p style={{ fontSize:11, fontWeight:700, color:T.gold, letterSpacing:1.5, margin:'0 0 10px' }}>
          STEP {step+1} OF 3
        </p>

        {step===0 && <>
          <h2 style={{ fontFamily:fHead, fontSize:30, fontWeight:400, margin:'0 0 6px', lineHeight:1.1 }}>
            How are you feeling <em style={{ color:T.gold }}>right now</em>?
          </h2>
          <p style={{ color:T.creamDim, fontSize:14, marginBottom:24 }}>
            Tap whichever feels closest — no wrong answer.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {moods.map(m => (
              <button key={m.v} onClick={() => setMood(m)} style={{
                padding:'16px 18px', borderRadius:18, textAlign:'left',
                background: mood?.v===m.v ? T.cardHi : T.card,
                border:`1.5px solid ${mood?.v===m.v ? T.gold : T.line2}`,
                display:'flex', alignItems:'center', gap:14,
              }}>
                <span style={{ fontSize:28 }}>{m.e}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:15, fontWeight:700, margin:0, color:T.cream }}>{m.l}</p>
                  <p style={{ fontSize:12, color:T.creamDim, margin:'2px 0 0' }}>{m.v}/5 motivation</p>
                </div>
                {mood?.v===m.v && <Check size={20} color={T.gold}/>}
              </button>
            ))}
          </div>
        </>}

        {step===1 && <>
          <h2 style={{ fontFamily:fHead, fontSize:30, fontWeight:400, margin:'0 0 6px', lineHeight:1.1 }}>
            What's <em style={{ color:T.gold }}>shaping</em> that?
          </h2>
          <p style={{ color:T.creamDim, fontSize:14, marginBottom:24 }}>
            Pick anything that fits. Multiple is fine.
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {tagOpts.map(t => (
              <Pill key={t} active={tags.includes(t)} onClick={() => toggle(t)}>{t}</Pill>
            ))}
          </div>
        </>}

        {step===2 && <>
          <h2 style={{ fontFamily:fHead, fontSize:30, fontWeight:400, margin:'0 0 6px', lineHeight:1.1 }}>
            Anything else <em style={{ color:T.gold }}>on your mind</em>?
          </h2>
          <p style={{ color:T.creamDim, fontSize:14, marginBottom:20 }}>
            Optional. Only you can see this unless you flag it.
          </p>
          <textarea
            value={note} onChange={e => setNote(e.target.value)}
            placeholder="A sentence or two..."
            style={{
              width:'100%', minHeight:130, background:T.card,
              border:`1px solid ${T.line2}`, borderRadius:16,
              padding:16, color:T.cream, fontSize:14, resize:'none', outline:'none',
              boxSizing:'border-box',
            }}
          />
          <div style={{
            marginTop:14, padding:14, borderRadius:14,
            background:`${T.gold}10`, border:`1px solid ${T.gold}35`,
            display:'flex', alignItems:'flex-start', gap:10,
          }}>
            <AlertTriangle size={17} color={T.gold} style={{ flexShrink:0, marginTop:2 }}/>
            <div>
              <p style={{ fontSize:13, fontWeight:700, margin:'0 0 3px' }}>Need to talk to someone?</p>
              <p style={{ fontSize:12, color:T.creamDim, margin:0, lineHeight:1.5 }}>
                Tap "Flag for support" and a counsellor will reach out within 24 hours.
              </p>
            </div>
          </div>
        </>}
      </div>

      <div style={{
        position:'fixed', bottom:0, left:0, right:0,
        padding:'14px 20px', paddingBottom:'calc(env(safe-area-inset-bottom,8px)+14px)',
        background:T.bg, borderTop:`1px solid ${T.line}`,
      }}>
        {step<2 ? (
          <BigBtn onClick={() => setStep(step+1)} disabled={step===0 && !mood}>Continue</BigBtn>
        ) : (
          <div style={{ display:'flex', gap:10 }}>
            <BigBtn onClick={() => go('checkin-done')} variant="outline" style={{ flex:1, fontSize:13 }}>
              Flag for support
            </BigBtn>
            <BigBtn onClick={() => go('checkin-done')} style={{ flex:1.3, fontSize:13 }}>
              Submit ✓
            </BigBtn>
          </div>
        )}
      </div>
    </Screen>
  );
};

/* ─── CHECK-IN DONE ─── */
const CheckInDone = ({ go, name }) => (
  <Screen>
    <div style={{
      position:'absolute', inset:0,
      background:`radial-gradient(circle at 50% 40%,${T.gold}25 0%,transparent 55%),radial-gradient(circle at 50% 65%,${T.red}30 0%,transparent 60%)`,
    }}/>
    <div style={{
      flex:1, display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', padding:'40px 28px',
      paddingBottom:'env(safe-area-inset-bottom,32px)',
      textAlign:'center', position:'relative',
    }}>
      <div style={{
        width:88, height:88, borderRadius:'50%',
        background:`linear-gradient(135deg,${T.gold},${T.goldDeep})`,
        display:'flex', alignItems:'center', justifyContent:'center',
        marginBottom:24,
        boxShadow:`0 16px 40px -10px ${T.gold}66`,
      }}>
        <Check size={44} color={T.card} strokeWidth={2.8}/>
      </div>
      <h1 style={{ fontFamily:fHead, fontSize:36, fontWeight:400, margin:'0 0 12px', letterSpacing:-1, lineHeight:1.05 }}>
        Medaase, <em style={{ color:T.gold }}>{name}</em>
      </h1>
      <p style={{ color:T.creamDim, fontSize:15, lineHeight:1.6, margin:'0 0 28px' }}>
        5-day streak unlocked!<br/>Small steps add up.
      </p>
      <Card style={{ width:'100%', textAlign:'left', marginBottom:24 }}>
        <div style={{ ...row({ gap:10, marginBottom:8 }) }}>
          <Award size={18} color={T.gold}/>
          <p style={{ fontWeight:700, margin:0, fontSize:13 }}>Suggested for you</p>
        </div>
        <p style={{ fontSize:13, color:T.creamDim, margin:0, lineHeight:1.55 }}>
          Counselling drop-in sessions run Mon–Fri, 10am–3pm at the Student Affairs Office, Mataheko Campus.
        </p>
      </Card>
      <BigBtn onClick={() => go('student-home')}>Back home</BigBtn>
    </div>
  </Screen>
);

/* ─── UPDATES ─── */
const Updates = ({ go }) => {
  const [filter, setFilter] = useState('All');
  const filters = ['All','Academic','Welfare','Events','Admin'];
  const items = [
    { cat:'Academic', time:'Today, 9:00am', title:'Exam timetable now available',
      body:'Final exam schedules for Semester 2 have been released. Check the CUG portal for your room and time.' },
    { cat:'Welfare',  time:'Today, 7:30am', title:'Counselling drop-in sessions this week',
      body:'Student support open Mon–Fri, 10am–3pm at the Student Affairs Office. No appointment needed.' },
    { cat:'Events',   time:'Yesterday',     title:'End-of-year gala — tickets open',
      body:'Celebrate the year with fellow students. Tickets are GHS 50 on the SRC website.' },
    { cat:'Admin',    time:'2 days ago',    title:'Library hours extended during exams',
      body:'The CUG library will be open until midnight from 28 Apr through 16 May.' },
    { cat:'Academic', time:'3 days ago',    title:'New past-papers archive live',
      body:'Five years of past papers for all programmes now searchable from your portal.' },
    { cat:'Welfare',  time:'4 days ago',    title:'Free wellness check at clinic',
      body:'Drop in at the campus clinic this week for a free blood pressure and BMI check.' },
  ];
  const shown = filter==='All' ? items : items.filter(i=>i.cat===filter);
  return (
    <Screen>
      <StatusBar/>
      <div style={{ padding:'12px 20px 8px', flexShrink:0 }}>
        <h1 style={{ fontFamily:fHead, fontSize:28, fontWeight:400, margin:'0 0 14px', letterSpacing:-0.8 }}>Updates</h1>
        <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:6 }}>
          {filters.map(f => <Pill key={f} active={filter===f} onClick={() => setFilter(f)}>{f}</Pill>)}
        </div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'8px 20px 90px' }}>
        {shown.map((it,i) => (
          <div key={i} style={{
            paddingBottom:18, marginBottom:18,
            borderBottom: i<shown.length-1 ? `1px solid ${T.line}` : 'none',
          }}>
            <div style={{ ...row({ justifyContent:'space-between', marginBottom:8 }) }}>
              <Pill variant="gold">{it.cat}</Pill>
              <span style={{ fontSize:11, color:T.creamDim }}>{it.time}</span>
            </div>
            <p style={{ fontSize:16, fontWeight:700, margin:'0 0 5px', letterSpacing:-0.2 }}>{it.title}</p>
            <p style={{ fontSize:13, color:T.creamDim, margin:0, lineHeight:1.55 }}>{it.body}</p>
          </div>
        ))}
      </div>
      <TabBar tabs={STUDENT_TABS} active="updates" onChange={go}/>
    </Screen>
  );
};

/* ─── SUPPORT ─── */
const Support = ({ go }) => (
  <Screen>
    <StatusBar/>
    <div style={{ padding:'12px 20px 8px', flexShrink:0 }}>
      <h1 style={{ fontFamily:fHead, fontSize:28, fontWeight:400, margin:'0 0 4px', letterSpacing:-0.8 }}>
        Get <em style={{ color:T.gold }}>support</em>
      </h1>
      <p style={{ color:T.creamDim, fontSize:13, margin:0 }}>Confidential. Free. Here for you.</p>
    </div>
    <div style={{ flex:1, overflowY:'auto', padding:'12px 20px 90px' }}>
      {/* Crisis */}
      <div style={{
        padding:18, borderRadius:18, marginBottom:14,
        background:`linear-gradient(135deg,${T.red},${T.redDeep})`,
        border:`1px solid ${T.gold}40`,
      }}>
        <div style={{ ...row({ gap:8, marginBottom:6 }) }}>
          <PhoneIcon size={15} color={T.gold}/>
          <p style={{ fontSize:11, fontWeight:700, color:T.gold, margin:0, letterSpacing:1 }}>NEED HELP NOW</p>
        </div>
        <p style={{ fontSize:16, fontWeight:700, color:T.white, margin:'0 0 4px' }}>24/7 crisis line</p>
        <p style={{ fontSize:13, color:'#ffffffcc', margin:'0 0 12px' }}>
          Free call. Trained counsellors. Anonymous if you want.
        </p>
        <button style={{
          padding:'10px 18px', background:T.gold, color:T.card, border:'none',
          borderRadius:12, fontSize:13, fontWeight:800,
        }}>Call now · 0800 678 678</button>
      </div>

      {[
        { icon:MessageCircle, title:'Chat with a counsellor', sub:'Reply within 1 hour, 8am–10pm', c:T.gold },
        { icon:Calendar,      title:'Book a drop-in slot',    sub:'Student Affairs Office · Mon–Fri', c:T.gold },
        { icon:Users,         title:'Peer support groups',    sub:'4 groups meeting this week', c:T.red },
        { icon:BookOpen,      title:'Self-help resources',    sub:'Articles, audio, exercises', c:T.red },
      ].map((opt,i) => (
        <Card key={i} style={{ display:'flex', alignItems:'center', gap:14, marginBottom:10 }}>
          <div style={{
            width:42, height:42, borderRadius:12,
            background:`${opt.c}22`, border:`1px solid ${opt.c}44`,
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          }}>
            <opt.icon size={20} color={opt.c} strokeWidth={1.8}/>
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:700, fontSize:14, margin:'0 0 2px' }}>{opt.title}</p>
            <p style={{ fontSize:12, color:T.creamDim, margin:0 }}>{opt.sub}</p>
          </div>
          <ChevronRight size={18} color={T.gold}/>
        </Card>
      ))}
    </div>
    <TabBar tabs={STUDENT_TABS} active="support" onChange={go}/>
  </Screen>
);

/* ─── PROFILE (student) ─── */
const StudentProfile = ({ go, name, onSignOut }) => (
  <Screen>
    <StatusBar/>
    <div style={{ padding:'12px 20px', ...row({ justifyContent:'space-between' }), flexShrink:0 }}>
      <h1 style={{ fontFamily:fHead, fontSize:26, fontWeight:400, margin:0 }}>Profile</h1>
      <button onClick={onSignOut} style={{
        background:`${T.red}22`, border:`1px solid ${T.red}55`,
        color:T.cream, borderRadius:10, padding:'6px 12px',
        fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:5,
      }}>
        <LogOut size={14}/> Sign out
      </button>
    </div>
    <div style={{ flex:1, overflowY:'auto', padding:'0 20px 90px' }}>
      {/* Avatar */}
      <div style={{ ...row({ gap:14, marginBottom:24 }) }}>
        <div style={{
          width:64, height:64, borderRadius:'50%',
          background:`linear-gradient(135deg,${T.gold},${T.goldDeep})`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:22, fontWeight:700, color:T.card,
          border:`2px solid ${T.gold}`,
        }}>
          {name[0]}O
        </div>
        <div>
          <p style={{ fontFamily:fHead, fontSize:22, fontWeight:500, margin:0 }}>{name} Owusu</p>
          <p style={{ fontSize:13, color:T.creamDim, margin:'3px 0 0' }}>Yr 2 · Computer Science · CUG</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:22 }}>
        {[{l:'Streak',v:'5',u:'days'},{l:'Avg',v:'4.2',u:'/5'},{l:'Check-ins',v:'23',u:'total'}].map((s,i) => (
          <Card key={i} style={{ textAlign:'center', padding:'14px 8px' }}>
            <p style={{ fontFamily:fHead, fontSize:24, fontWeight:500, margin:0, color:T.gold }}>{s.v}</p>
            <p style={{ fontSize:11, color:T.creamDim, margin:'2px 0 2px' }}>{s.u}</p>
            <p style={{ fontSize:10, color:T.textMute, margin:0, textTransform:'uppercase', letterSpacing:0.5, fontWeight:700 }}>{s.l}</p>
          </Card>
        ))}
      </div>

      {/* Month heatmap */}
      <h3 style={{ fontFamily:fHead, fontSize:17, fontWeight:500, margin:'0 0 10px' }}>My month</h3>
      <Card style={{ marginBottom:22 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(15,1fr)', gap:4 }}>
          {Array.from({length:30}).map((_,i) => {
            const v = Math.max(0,Math.min(5,Math.floor(Math.sin(i*1.7)*2.5+3)));
            const cols = [T.line2,'#6B1E26',T.redDeep,T.red,T.goldDeep,T.gold];
            return <div key={i} style={{ aspectRatio:1, borderRadius:3, background:cols[v], opacity:v===0?0.4:0.8+v*0.04 }}/>;
          })}
        </div>
        <div style={{ ...row({ justifyContent:'space-between', marginTop:10 }), fontSize:11, color:T.creamDim }}>
          <span>Less</span>
          <div style={{ display:'flex', gap:3 }}>
            {[T.line2,T.redDeep,T.red,T.goldDeep,T.gold].map((c,i) => (
              <div key={i} style={{ width:10, height:10, background:c, borderRadius:2 }}/>
            ))}
          </div>
          <span>More</span>
        </div>
      </Card>

      {[
        {l:'Notifications',  icon:Bell       },
        {l:'Privacy & data', icon:Settings   },
        {l:'Help & feedback',icon:MessageCircle},
      ].map((m,i) => (
        <button key={i} style={{
          width:'100%', padding:'14px 0', background:'transparent', border:'none',
          borderTop:`1px solid ${T.line}`,
          ...row({ gap:12 }), color:T.cream,
        }}>
          <m.icon size={18} color={T.textDim}/>
          <span style={{ flex:1, textAlign:'left', fontSize:14 }}>{m.l}</span>
          <ChevronRight size={16} color={T.textMute}/>
        </button>
      ))}
    </div>
    <TabBar tabs={STUDENT_TABS} active="profile" onChange={go}/>
  </Screen>
);

/* ─── TIMETABLE ─── */
const Timetable = ({ go }) => {
  const [day, setDay] = useState(1);
  const days = ['Mon','Tue','Wed','Thu','Fri'];
  const dates = [13,14,15,16,17];
  const sessions = [
    { time:'08:00', dur:'1h',  title:'Discrete Math',                room:'JQB Lecture Hall', tag:'Lecture' },
    { time:'10:00', dur:'2h',  title:'Algorithms & Data Structures', room:'NNB 201',           tag:'Lecture' },
    { time:'13:00', dur:'1h',  title:'Lunch break',                  room:'',                  tag:'Break'   },
    { time:'14:00', dur:'2h',  title:'Software Engineering Lab',     room:'Computer Lab 3',    tag:'Lab'     },
    { time:'17:00', dur:'1h',  title:'Study group: Algo',            room:'Library, Floor 2',  tag:'Study'   },
  ];
  return (
    <Screen>
      <StatusBar/>
      <div style={{ padding:'12px 20px 8px', flexShrink:0 }}>
        <div style={{ ...row({ justifyContent:'space-between', marginBottom:12 }) }}>
          <BackBtn onClick={() => go('student-home')}/>
        </div>
        <h1 style={{ fontFamily:fHead, fontSize:28, fontWeight:400, margin:'0 0 4px' }}>Timetable</h1>
        <p style={{ color:T.creamDim, fontSize:13, margin:'0 0 14px' }}>Week 12 · Apr 13–17</p>
        <div style={{ display:'flex', gap:6 }}>
          {days.map((d,i) => (
            <button key={d} onClick={() => setDay(i)} style={{
              flex:1, padding:'8px 4px', borderRadius:12,
              background: day===i ? T.gold : 'transparent',
              color: day===i ? T.card : T.cream,
              border:`1px solid ${day===i ? T.gold : T.line2}`,
            }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:0.5, opacity:0.7 }}>{d.toUpperCase()}</div>
              <div style={{ fontSize:17, fontWeight:800, marginTop:1 }}>{dates[i]}</div>
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'14px 20px 40px' }}>
        {sessions.map((s,i) => (
          <div key={i} style={{ ...row({ gap:12, marginBottom:10, alignItems:'flex-start' }) }}>
            <div style={{ width:46, textAlign:'right', paddingTop:12, flexShrink:0 }}>
              <p style={{ fontSize:13, fontWeight:700, margin:0 }}>{s.time}</p>
              <p style={{ fontSize:10, color:T.textMute, margin:'2px 0 0' }}>{s.dur}</p>
            </div>
            <Card style={{ flex:1, borderLeft:`3px solid ${T.gold}`, borderRadius:'0 14px 14px 0' }}>
              <Pill variant="gold">{s.tag}</Pill>
              <p style={{ fontSize:14, fontWeight:700, margin:'8px 0 4px' }}>{s.title}</p>
              {s.room && (
                <p style={{ fontSize:12, color:T.creamDim, margin:0, display:'flex', alignItems:'center', gap:4 }}>
                  <MapPin size={11}/>{s.room}
                </p>
              )}
            </Card>
          </div>
        ))}
      </div>
    </Screen>
  );
};

/* ─── EVENTS ─── */
const Events = ({ go }) => {
  const evts = [
    { date:'TUE 15 APR', time:'6:00pm', title:'End-of-year gala',                  loc:'Great Hall, CUG',     price:'GHS 50', spots:'23 spots left' },
    { date:'WED 16 APR', time:'5:30pm', title:'CS Society career night',            loc:'JQB Lecture Hall',    price:'Free',   spots:'Open'          },
    { date:'THU 17 APR', time:'2:00pm', title:'Wellness workshop: managing stress', loc:'Student Affairs',     price:'Free',   spots:'8 spots left'  },
    { date:'SAT 19 APR', time:'9:00am', title:'Campus run + breakfast',             loc:'CUG Sports Field',    price:'Free',   spots:'Open'          },
  ];
  return (
    <Screen>
      <StatusBar/>
      <div style={{ padding:'12px 20px 8px', flexShrink:0 }}>
        <BackBtn onClick={() => go('student-home')}/>
        <h1 style={{ fontFamily:fHead, fontSize:28, fontWeight:400, margin:'8px 0 4px' }}>Events</h1>
        <p style={{ color:T.creamDim, fontSize:13, margin:0 }}>This week on campus</p>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'12px 20px 40px' }}>
        {evts.map((e,i) => (
          <Card key={i} style={{ padding:0, overflow:'hidden', marginBottom:12 }}>
            <div style={{
              padding:'12px 16px', display:'flex', justifyContent:'space-between',
              background:`linear-gradient(135deg,${T.red},${T.redDeep})`,
              borderBottom:`1px solid ${T.gold}30`,
            }}>
              <span style={{ fontSize:11, fontWeight:800, color:T.gold, letterSpacing:1 }}>{e.date}</span>
              <span style={{ fontSize:11, fontWeight:700, color:T.white }}>{e.time}</span>
            </div>
            <div style={{ padding:'14px 16px' }}>
              <p style={{ fontSize:16, fontWeight:700, margin:'0 0 5px' }}>{e.title}</p>
              <p style={{ fontSize:13, color:T.creamDim, margin:'0 0 12px', display:'flex', alignItems:'center', gap:4 }}>
                <MapPin size={12}/>{e.loc}
              </p>
              <div style={{ ...row({ justifyContent:'space-between' }) }}>
                <div style={{ display:'flex', gap:6 }}>
                  <Pill variant="gold">{e.price}</Pill>
                  <Pill variant="ghost">{e.spots}</Pill>
                </div>
                <button style={{
                  padding:'8px 16px', background:T.red, color:T.white,
                  border:'none', borderRadius:10, fontSize:12, fontWeight:800,
                }}>RSVP</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Screen>
  );
};

/* ════════════════════════════════════════════
   STAFF SCREENS
════════════════════════════════════════════ */

const STAFF_TABS = [
  { id:'staff-home',     label:'Overview',  icon:BarChart3   },
  { id:'staff-students', label:'Students',  icon:Users       },
  { id:'staff-messages', label:'Messages',  icon:MessageCircle},
  { id:'staff-profile',  label:'Profile',   icon:User        },
];

/* ─── STAFF HOME ─── */
const StaffHome = ({ go, name }) => (
  <Screen>
    <StatusBar bg={T.red}/>
    <div style={{ flex:1, overflowY:'auto', paddingBottom:80 }}>
      {/* Red header */}
      <div style={{
        padding:'6px 20px 24px',
        background:`linear-gradient(180deg,${T.red},${T.redDeep})`,
        position:'relative', overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', inset:0,
          background:`repeating-linear-gradient(90deg,transparent,transparent 8px,${T.gold}10 8px,${T.gold}10 9px)`,
          pointerEvents:'none',
        }}/>
        <div style={{ ...row({ justifyContent:'space-between', marginBottom:14 }), position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Shield size={13} color={T.gold} strokeWidth={2.4}/>
            <p style={{ fontSize:11, fontWeight:700, color:T.gold, margin:0, letterSpacing:1 }}>LECTURER VIEW</p>
          </div>
          <p style={{ fontSize:12, fontWeight:700, color:T.white, margin:0 }}>Week 12 · Sem 2</p>
        </div>
        <h1 style={{ fontFamily:fHead, fontSize:28, fontWeight:500, color:T.white, margin:'0 0 4px', position:'relative' }}>
          Motivation <em style={{ color:T.gold }}>overview</em>
        </h1>
        <p style={{ fontSize:14, color:'#ffffffcc', margin:0, position:'relative' }}>
          CS Dept · 134 of 151 checked in today
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, padding:'0 16px', marginTop:-18, position:'relative', zIndex:2 }}>
        {[
          {v:'3.8',l:'Avg score',   c:T.cream  },
          {v:'12', l:'At-risk',     c:T.danger },
          {v:'89%',l:'Response',    c:T.gold   },
        ].map((s,i) => (
          <Card key={i} style={{ textAlign:'center', padding:'12px 8px', border:`1px solid ${T.gold}40` }}>
            <p style={{ fontFamily:fHead, fontSize:22, fontWeight:500, margin:0, color:s.c }}>{s.v}</p>
            <p style={{ fontSize:10, color:T.creamDim, margin:'2px 0 0' }}>{s.l}</p>
          </Card>
        ))}
      </div>

      <div style={{ padding:'20px 20px 0' }}>
        {/* Distribution chart */}
        <p style={{ fontWeight:700, fontSize:15, margin:'0 0 12px' }}>Motivation distribution today</p>
        <Card style={{ marginBottom:20 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6, textAlign:'center', marginBottom:4 }}>
            {[8,16,34,52,24].map((n,i) => (
              <span key={i} style={{ fontSize:12, color:T.creamDim, fontWeight:700 }}>{n}</span>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6, alignItems:'flex-end', height:90, marginBottom:8 }}>
            {[
              {v:8,c:T.redDeep},{v:16,c:T.red},{v:34,c:'#D4654A'},
              {v:52,c:T.goldDeep},{v:24,c:T.gold},
            ].map((b,i) => (
              <div key={i} style={{
                height:`${(b.v/52)*100}%`, background:b.c, borderRadius:4,
              }}/>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6, textAlign:'center' }}>
            {['😞','😕','😐','🙂','🤩'].map((e,i) => <span key={i} style={{ fontSize:20 }}>{e}</span>)}
          </div>
        </Card>

        {/* Flagged students */}
        <div style={{ ...row({ justifyContent:'space-between', marginBottom:12 }) }}>
          <p style={{ fontWeight:700, fontSize:15, margin:0 }}>Students needing attention</p>
          <Pill variant="gold">12 flagged</Pill>
        </div>

        {[
          {name:'Ama Kusi',      yr:'Yr 2 · CS',i:'AK',e:'😞',n:'3 days low',      c:T.danger},
          {name:'Kweku Mensah',  yr:'Yr 3 · CS',i:'KM',e:'😕',n:'Declining trend', c:T.warn  },
          {name:'Abena Boateng', yr:'Yr 1 · CS',i:'AB',e:'😞',n:'Missed 2 days',   c:T.danger},
          {name:'Kojo Asante',   yr:'Yr 2 · CS',i:'KA',e:'😕',n:'Flagged',         c:T.gold  },
        ].map((s,i,arr) => (
          <button key={i} onClick={() => go('staff-student-detail')} style={{
            width:'100%', padding:'14px 0', background:'transparent', border:'none',
            borderBottom: i<arr.length-1 ? `1px solid ${T.line}` : 'none',
            ...row({ gap:12 }), color:T.cream,
          }}>
            <Avatar initials={s.i}/>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:700, fontSize:14, margin:0 }}>{s.name}</p>
              <p style={{ fontSize:12, color:T.creamDim, margin:'2px 0 0' }}>{s.yr}</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:18 }}>{s.e}</div>
              <p style={{ fontSize:11, color:s.c, margin:'2px 0 0', fontWeight:700 }}>{s.n}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
    <TabBar tabs={STAFF_TABS} active="staff-home" onChange={go}/>
  </Screen>
);

/* ─── STAFF STUDENTS ─── */
const StaffStudents = ({ go }) => {
  const [filter, setFilter] = useState('All');
  const filters = ['All','At-risk','Flagged','Yr 1','Yr 2','Yr 3'];
  const students = [
    {name:'Ama Kusi',      yr:'Yr 2',i:'AK',avg:'2.1',status:'at-risk',  c:T.danger},
    {name:'Kweku Mensah',  yr:'Yr 3',i:'KM',avg:'2.4',status:'declining',c:T.warn  },
    {name:'Abena Boateng', yr:'Yr 1',i:'AB',avg:'2.0',status:'at-risk',  c:T.danger},
    {name:'Kojo Asante',   yr:'Yr 2',i:'KA',avg:'2.6',status:'flagged',  c:T.gold  },
    {name:'Akua Frimpong', yr:'Yr 1',i:'AF',avg:'3.4',status:'ok',       c:T.cream },
    {name:'Yaw Owusu',     yr:'Yr 2',i:'YO',avg:'4.2',status:'thriving', c:T.gold  },
    {name:'Esi Nyarko',    yr:'Yr 3',i:'EN',avg:'4.0',status:'ok',       c:T.cream },
    {name:'Kofi Addo',     yr:'Yr 2',i:'KO',avg:'3.8',status:'ok',       c:T.cream },
  ];
  return (
    <Screen>
      <StatusBar/>
      <div style={{ padding:'12px 20px 8px', flexShrink:0 }}>
        <h1 style={{ fontFamily:fHead, fontSize:28, fontWeight:400, margin:'0 0 12px' }}>Students</h1>
        <Card style={{ ...row({ gap:10 }), padding:'10px 14px', marginBottom:12 }}>
          <Search size={16} color={T.gold}/>
          <input placeholder="Search by name or ID..." style={{
            flex:1, background:'transparent', border:'none', outline:'none',
            color:T.cream, fontSize:13,
          }}/>
        </Card>
        <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:6 }}>
          {filters.map(f => <Pill key={f} active={filter===f} onClick={() => setFilter(f)}>{f}</Pill>)}
        </div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'8px 20px 90px' }}>
        {students.map((s,i,arr) => (
          <button key={i} onClick={() => go('staff-student-detail')} style={{
            width:'100%', padding:'12px 0', background:'transparent', border:'none',
            borderBottom: i<arr.length-1 ? `1px solid ${T.line}` : 'none',
            ...row({ gap:12 }), color:T.cream,
          }}>
            <Avatar initials={s.i} size={40}/>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:700, fontSize:14, margin:0 }}>{s.name}</p>
              <p style={{ fontSize:11, color:T.creamDim, margin:'2px 0 0' }}>{s.yr}</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ fontFamily:fHead, fontSize:18, fontWeight:500, margin:0, color:s.c }}>{s.avg}</p>
              <p style={{ fontSize:10, color:s.c, margin:'1px 0 0', textTransform:'uppercase', letterSpacing:0.5, fontWeight:700 }}>{s.status}</p>
            </div>
          </button>
        ))}
      </div>
      <TabBar tabs={STAFF_TABS} active="staff-students" onChange={go}/>
    </Screen>
  );
};

/* ─── STAFF STUDENT DETAIL ─── */
const StaffStudentDetail = ({ go }) => {
  const weekData = [3,4,3,2,2,1,2];
  const maxH = 70;
  return (
    <Screen>
      <StatusBar/>
      <div style={{ ...row({ justifyContent:'space-between', padding:'12px 20px' }), flexShrink:0 }}>
        <BackBtn onClick={() => go('staff-home')}/>
        <MoreHorizontal size={20} color={T.cream}/>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'0 20px 40px' }}>
        {/* Header */}
        <div style={{ ...row({ gap:14, marginBottom:6 }) }}>
          <Avatar initials="AK" size={58}/>
          <div>
            <p style={{ fontFamily:fHead, fontSize:22, fontWeight:500, margin:0 }}>Ama Kusi</p>
            <p style={{ fontSize:12, color:T.creamDim, margin:'3px 0 0' }}>Yr 2 · CS · CUG ID 20221334</p>
          </div>
        </div>
        {/* Alert */}
        <div style={{
          padding:'12px 14px', borderRadius:14, margin:'14px 0 18px',
          background:`linear-gradient(135deg,${T.red},${T.redDeep})`,
          border:`1px solid ${T.gold}40`,
          display:'flex', gap:10,
        }}>
          <AlertTriangle size={16} color={T.gold} style={{ flexShrink:0, marginTop:2 }}/>
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:T.white, margin:'0 0 3px' }}>3 days of low motivation</p>
            <p style={{ fontSize:12, color:'#ffffffcc', margin:0 }}>
              Tags: <em>Anxious · Stressed about exams · Sleep</em>
            </p>
          </div>
        </div>
        {/* Metrics */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:20 }}>
          {[{v:'2.1',l:'Week avg',c:T.danger},{v:'6/7',l:'Check-ins',c:T.gold},{v:'↓ 1.3',l:'Vs last wk',c:T.danger}].map((m,i) => (
            <Card key={i} style={{ textAlign:'center', padding:'12px 8px' }}>
              <p style={{ fontFamily:fHead, fontSize:20, fontWeight:500, margin:0, color:m.c }}>{m.v}</p>
              <p style={{ fontSize:10, color:T.creamDim, margin:'2px 0 0' }}>{m.l}</p>
            </Card>
          ))}
        </div>
        {/* Chart */}
        <p style={{ fontWeight:700, fontSize:14, margin:'0 0 10px' }}>This week</p>
        <Card style={{ marginBottom:18 }}>
          <div style={{ display:'flex', gap:4, alignItems:'flex-end', height:maxH, marginBottom:8 }}>
            {weekData.map((v,i) => (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <div style={{ width:'100%', height:(v/5)*maxH, background:T.gold, borderRadius:3 }}/>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            {['M','T','W','T','F','S','S'].map((d,i) => (
              <span key={i} style={{ flex:1, textAlign:'center', fontSize:10, color:T.textMute, fontWeight:700 }}>{d}</span>
            ))}
          </div>
        </Card>
        {/* Latest note */}
        <p style={{ fontWeight:700, fontSize:14, margin:'0 0 10px' }}>Latest note (shared)</p>
        <Card style={{ marginBottom:20 }}>
          <p style={{ fontSize:13, color:T.cream, fontStyle:'italic', margin:'0 0 8px', lineHeight:1.55 }}>
            "Exams are creeping up and I'm not sleeping well. Feeling out of my depth in algorithms."
          </p>
          <p style={{ fontSize:11, color:T.textMute, margin:0 }}>Today, 7:42am</p>
        </Card>
        {/* Actions */}
        <BigBtn onClick={() => go('staff-messages')} style={{ marginBottom:10 }}>
          💬  Message Ama
        </BigBtn>
        <div style={{ display:'flex', gap:10 }}>
          <BigBtn variant="outline" style={{ flex:1, fontSize:13 }}>Book session</BigBtn>
          <BigBtn variant="ghost"   style={{ flex:1, fontSize:13 }}>Refer to counsellor</BigBtn>
        </div>
      </div>
    </Screen>
  );
};

/* ─── STAFF MESSAGES ─── */
const StaffMessages = ({ go }) => {
  const threads = [
    {name:'Ama Kusi',        last:"Thanks for checking in. I'll come by tomorrow.", time:'12m', unread:2, i:'AK', urgent:true   },
    {name:'Kweku Mensah',    last:'Okay I can do Thursday at 2pm.',                 time:'1h',  unread:0, i:'KM'               },
    {name:'CS Yr 2 broadcast',last:'Reminder: midterm review session Friday.',      time:'3h',  unread:0, i:'B',  group:true   },
    {name:'Abena Boateng',   last:'I missed yesterday because I was unwell.',       time:'Yesterday', unread:1, i:'AB'         },
    {name:'Kojo Asante',     last:'Could we talk about my project?',                time:'Yesterday', unread:0, i:'KA'         },
    {name:'Esi Nyarko',      last:'All good, no concerns this week.',               time:'2d',  unread:0, i:'EN'               },
  ];
  return (
    <Screen>
      <StatusBar/>
      <div style={{ ...row({ justifyContent:'space-between', padding:'12px 20px 8px' }), flexShrink:0 }}>
        <h1 style={{ fontFamily:fHead, fontSize:28, fontWeight:400, margin:0 }}>Messages</h1>
        <button style={{
          width:36, height:36, borderRadius:'50%', background:T.gold,
          border:'none', display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <Send size={15} strokeWidth={2.4} color={T.card}/>
        </button>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'8px 20px 90px' }}>
        {threads.map((t,i) => (
          <button key={i} style={{
            width:'100%', padding:'14px 0', background:'transparent', border:'none',
            borderBottom:`1px solid ${T.line}`,
            ...row({ gap:12 }), color:T.cream,
          }}>
            <div style={{ position:'relative', flexShrink:0 }}>
              <Avatar initials={t.i} gold={!t.group} size={44}/>
              {t.urgent && (
                <div style={{
                  position:'absolute', bottom:0, right:0,
                  width:13, height:13, borderRadius:'50%',
                  background:T.danger, border:`2px solid ${T.bg}`,
                }}/>
              )}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ ...row({ justifyContent:'space-between', marginBottom:3 }) }}>
                <p style={{ fontWeight:700, fontSize:14, margin:0 }}>{t.name}</p>
                <span style={{ fontSize:11, color:T.creamDim }}>{t.time}</span>
              </div>
              <div style={{ ...row({ justifyContent:'space-between', gap:8 }) }}>
                <p style={{
                  fontSize:12, color: t.unread>0 ? T.cream : T.creamDim,
                  margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1,
                }}>{t.last}</p>
                {t.unread>0 && (
                  <span style={{
                    background:T.red, color:T.white, fontSize:10, fontWeight:800,
                    padding:'2px 7px', borderRadius:10, flexShrink:0,
                  }}>{t.unread}</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
      <TabBar tabs={STAFF_TABS} active="staff-messages" onChange={go}/>
    </Screen>
  );
};

/* ─── STAFF PROFILE ─── */
const StaffProfile = ({ go, name, onSignOut }) => (
  <Screen>
    <StatusBar/>
    <div style={{ ...row({ justifyContent:'space-between', padding:'12px 20px' }), flexShrink:0 }}>
      <h1 style={{ fontFamily:fHead, fontSize:26, fontWeight:400, margin:0 }}>Profile</h1>
      <button onClick={onSignOut} style={{
        background:`${T.red}22`, border:`1px solid ${T.red}55`,
        color:T.cream, borderRadius:10, padding:'6px 12px',
        fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:5,
      }}>
        <LogOut size={14}/> Sign out
      </button>
    </div>
    <div style={{ flex:1, overflowY:'auto', padding:'0 20px 90px' }}>
      <div style={{ ...row({ gap:14, marginBottom:10 }) }}>
        <Avatar initials="DM" size={60}/>
        <div style={{ flex:1 }}>
          <p style={{ fontFamily:fHead, fontSize:20, fontWeight:500, margin:0 }}>{name}</p>
          <p style={{ fontSize:12, color:T.creamDim, margin:'3px 0 6px' }}>Senior Lecturer · Computer Science</p>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:5,
            padding:'3px 10px', background:`${T.gold}22`,
            border:`1px solid ${T.gold}55`, borderRadius:999,
          }}>
            <Shield size={10} color={T.gold} strokeWidth={2.4}/>
            <span style={{ fontSize:10, color:T.gold, fontWeight:800, letterSpacing:0.5 }}>VERIFIED LECTURER</span>
          </div>
        </div>
      </div>
      <Card style={{ marginBottom:18 }}>
        <p style={{ fontSize:11, color:T.gold, fontWeight:700, margin:'0 0 6px', letterSpacing:0.5 }}>YOUR ACCESS</p>
        <p style={{ fontSize:13, color:T.creamDim, margin:0, lineHeight:1.55 }}>
          You can view motivation data and individual student check-ins for:{' '}
          <strong style={{ color:T.cream }}>Computer Science, Years 1–3</strong>. All access is logged and audited.
        </p>
      </Card>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:22 }}>
        {[{l:'Students',v:'151'},{l:'Flagged',v:'12'},{l:'Sessions',v:'34'}].map((s,i) => (
          <Card key={i} style={{ textAlign:'center', padding:'12px 8px' }}>
            <p style={{ fontFamily:fHead, fontSize:22, fontWeight:500, margin:0, color:T.gold }}>{s.v}</p>
            <p style={{ fontSize:10, color:T.creamDim, margin:'4px 0 0', textTransform:'uppercase', letterSpacing:0.5, fontWeight:700 }}>{s.l}</p>
          </Card>
        ))}
      </div>
      {[{l:'Notification preferences'},{l:'Access & audit log'},{l:'Help & feedback'}].map((m,i) => (
        <button key={i} style={{
          width:'100%', padding:'14px 0', background:'transparent', border:'none',
          borderTop:`1px solid ${T.line}`,
          ...row({ gap:12 }), color:T.cream,
        }}>
          <span style={{ flex:1, textAlign:'left', fontSize:14 }}>{m.l}</span>
          <ChevronRight size={16} color={T.textMute}/>
        </button>
      ))}
    </div>
    <TabBar tabs={STAFF_TABS} active="staff-profile" onChange={go}/>
  </Screen>
);

/* ─── ACCESS DENIED ─── */
const AccessDenied = ({ go }) => (
  <Screen>
    <div style={{
      flex:1, display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      padding:'40px 28px', textAlign:'center',
    }}>
      <div style={{
        width:80, height:80, borderRadius:'50%',
        background:`linear-gradient(135deg,${T.red},${T.redDeep})`,
        display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20,
      }}>
        <Shield size={40} color={T.gold} strokeWidth={1.8}/>
      </div>
      <h2 style={{ fontFamily:fHead, fontSize:28, fontWeight:500, margin:'0 0 10px' }}>Access restricted</h2>
      <p style={{ color:T.creamDim, fontSize:14, lineHeight:1.6, margin:'0 0 28px' }}>
        Only verified CUG lecturers and staff can view student motivation data.
      </p>
      <BigBtn onClick={() => go('student-home')}>Back home</BigBtn>
    </div>
  </Screen>
);

/* ════════════════════════════════════════════
   MAIN APP ROUTER
════════════════════════════════════════════ */
const STAFF_ROUTES = ['staff-home','staff-students','staff-student-detail','staff-messages','staff-profile'];

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [auth,   setAuth]   = useState(null); // { name, role }

  const go = (target) => {
    if (STAFF_ROUTES.includes(target) && auth?.role !== 'staff') {
      setScreen('access-denied');
      return;
    }
    setScreen(target);
  };

  const signOut = () => {
    setAuth(null);
    setScreen('welcome');
  };

  const name = auth?.name || 'Yaw';

  const screens = {
    welcome:              <Welcome  go={setScreen}/>,
    signup:               <SignUp   go={setScreen} setAuth={setAuth}/>,
    login:                <Login    go={setScreen} setAuth={setAuth}/>,
    'student-home':       <StudentHome go={go} name={name}/>,
    checkin:              <CheckIn     go={go}/>,
    'checkin-done':       <CheckInDone go={go} name={name}/>,
    updates:              <Updates     go={go}/>,
    support:              <Support     go={go}/>,
    profile:              <StudentProfile go={go} name={name} onSignOut={signOut}/>,
    timetable:            <Timetable   go={go}/>,
    events:               <Events      go={go}/>,
    'staff-home':         <StaffHome   go={go} name={name}/>,
    'staff-students':     <StaffStudents go={go}/>,
    'staff-student-detail':<StaffStudentDetail go={go}/>,
    'staff-messages':     <StaffMessages go={go}/>,
    'staff-profile':      <StaffProfile  go={go} name={name} onSignOut={signOut}/>,
    'access-denied':      <AccessDenied  go={go}/>,
  };

  return screens[screen] || screens['welcome'];
}
