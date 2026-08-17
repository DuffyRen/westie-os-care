import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  ArrowRight,
  Bell,
  Bone,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Droplets,
  Download,
  HeartPulse,
  Home,
  Info,
  Leaf,
  Minus,
  MoreHorizontal,
  PawPrint,
  PencilLine,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  ThermometerSun,
  TrendingUp,
  Utensils,
  Weight,
  Wind,
  X,
} from 'lucide-react';
import './styles.css';

const navItems = [
  { id: 'today', label: '今日', icon: Home },
  { id: 'food', label: '饮食', icon: Utensils },
  { id: 'exercise', label: '运动', icon: Activity },
  { id: 'health', label: '健康', icon: HeartPulse },
  { id: 'grooming', label: '美容', icon: Sparkles },
  { id: 'handbook', label: '手册', icon: BookOpen },
];

const initialLog = {
  food: 102,
  exercise: 22,
  water: 'normal',
  stool: 'good',
  skin: 'normal',
  mood: 'bright',
  brushed: false,
};

const initialPlan = {
  food: 102,
  exercise: 30,
  brush: 1,
};

const feedings = [
  { time: '08:05', label: '早餐', amount: 34, done: true },
  { time: '12:30', label: '午餐', amount: 34, done: true },
  { time: '18:30', label: '晚餐', amount: 17, done: true },
  { time: '21:30', label: '睡前餐', amount: 17, done: false },
];

const guideCards = [
  {
    tag: '饮食',
    title: '从四餐过渡到三餐，先守住全天总量',
    body: '调整餐次时，先不要同时改变总克数。连续观察食欲、便便和体重趋势，再小步调整。',
    time: '3 分钟',
    accent: 'mint',
    icon: Utensils,
  },
  {
    tag: '运动',
    title: '幼犬的运动，质量比里程更重要',
    body: '短时嗅闻、探索和正向训练可以拆成多次完成；避免强迫跑步、连续爬楼和过度跳跃。',
    time: '4 分钟',
    accent: 'blue',
    icon: Wind,
  },
  {
    tag: '美容',
    title: '白毛不等于每天洗：建立轻护理节奏',
    body: '日常先梳毛、擦嘴和检查足间。出现持续发红、异味或抓挠时，记录后联系兽医。',
    time: '5 分钟',
    accent: 'gold',
    icon: Sparkles,
  },
  {
    tag: '健康',
    title: '西高地的皮肤观察，应该记什么',
    body: '把瘙痒频率、位置、红斑、气味、耳道和近期饮食变化记在一起，比单张照片更有价值。',
    time: '6 分钟',
    accent: 'coral',
    icon: Stethoscope,
  },
];

const trend = [
  { day: '08/08', weight: 2.34, food: 98, exercise: 18 },
  { day: '08/09', weight: 2.38, food: 102, exercise: 25 },
  { day: '08/10', weight: 2.41, food: 102, exercise: 28 },
  { day: '08/11', weight: 2.44, food: 100, exercise: 16 },
  { day: '08/12', weight: 2.47, food: 102, exercise: 24 },
  { day: '08/13', weight: 2.49, food: 102, exercise: 30 },
  { day: '08/14', weight: 2.5, food: 102, exercise: 22 },
];

function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

function getAge(birth = '2026-04-20') {
  const start = new Date(`${birth}T00:00:00`);
  const now = new Date();
  const days = Math.max(0, Math.floor((now - start) / 86400000));
  const months = Math.floor(days / 30.44);
  return { days, months, label: `${months}个月 · ${days}天` };
}

function App() {
  const [active, setActive] = useState('today');
  const [log, setLog] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('westie-log')) || initialLog;
    } catch {
      return initialLog;
    }
  });
  const [plan, setPlan] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('westie-plan')) || initialPlan;
    } catch {
      return initialPlan;
    }
  });
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const age = getAge();

  const scores = useMemo(() => {
    const foodGap = Math.abs(log.food - plan.food) / Math.max(plan.food, 1);
    const food = clamp(Math.round(100 - foodGap * 130));
    const exercise = clamp(Math.round((log.exercise / Math.max(plan.exercise, 1)) * 100));
    const health = [log.water === 'normal', log.stool === 'good', log.skin === 'normal', log.mood === 'bright']
      .filter(Boolean).length * 25;
    const grooming = log.brushed ? 100 : 55;
    const total = Math.round(food * 0.3 + exercise * 0.25 + health * 0.3 + grooming * 0.15);
    return { food, exercise, health, grooming, total };
  }, [log, plan]);

  const saveLog = (next) => {
    setLog(next);
    localStorage.setItem('westie-log', JSON.stringify(next));
    setCheckInOpen(false);
    showNotice('今日记录已更新');
  };

  const savePlan = (next) => {
    setPlan(next);
    localStorage.setItem('westie-plan', JSON.stringify(next));
    setPlanOpen(false);
    showNotice('对比计划已更新');
  };

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  };

  const navigate = (id) => {
    setActive(id);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exportArchive = () => {
    const archive = {
      exportedAt: new Date().toISOString(),
      pet: { breed: '西高地白梗', sex: '公犬', birthDate: '2026-04-20', latestWeightKg: 2.5 },
      plan,
      today: log,
      feedingCalibration: { gramsPerPortion: 17, dailyPlanGrams: plan.food },
      note: '健康记录仅供日常管理，不替代兽医诊断。',
    };
    const blob = new Blob([JSON.stringify(archive, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `westie-archive-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotice('档案已导出到本地');
  };

  return (
    <div className="app-shell">
      <Sidebar active={active} onNavigate={navigate} age={age} onExport={exportArchive} />

      <main className="main-view">
        <Topbar
          active={active}
          onCheckIn={() => setCheckInOpen(true)}
          onPlan={() => setPlanOpen(true)}
          onMenu={() => setMobileMenu(!mobileMenu)}
        />

        <div className="content-frame">
          {active === 'today' && (
            <Dashboard
              log={log}
              plan={plan}
              scores={scores}
              age={age}
              onCheckIn={() => setCheckInOpen(true)}
              onPlan={() => setPlanOpen(true)}
              onNavigate={navigate}
              showNotice={showNotice}
            />
          )}
          {active === 'food' && <FoodPage log={log} plan={plan} onCheckIn={() => setCheckInOpen(true)} onPlan={() => setPlanOpen(true)} />}
          {active === 'exercise' && <ExercisePage log={log} plan={plan} onCheckIn={() => setCheckInOpen(true)} />}
          {active === 'health' && <HealthPage log={log} onCheckIn={() => setCheckInOpen(true)} />}
          {active === 'grooming' && <GroomingPage log={log} setLog={saveLog} showNotice={showNotice} />}
          {active === 'handbook' && <HandbookPage />}
        </div>

        <MobileNav active={active} onNavigate={navigate} open={mobileMenu} />
      </main>

      {checkInOpen && <CheckInModal current={log} plan={plan} onClose={() => setCheckInOpen(false)} onSave={saveLog} />}
      {planOpen && <PlanModal current={plan} onClose={() => setPlanOpen(false)} onSave={savePlan} />}
      {notice && (
        <div className="toast" role="status">
          <span><Check size={15} strokeWidth={3} /></span>{notice}
        </div>
      )}
    </div>
  );
}

function Sidebar({ active, onNavigate, age, onExport }) {
  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => onNavigate('today')} aria-label="返回今日">
        <span className="brand-mark"><WestieMark /></span>
        <span className="brand-copy"><strong>WESTIE</strong><small>养成计划</small></span>
      </button>

      <nav className="side-nav" aria-label="主要导航">
        <span className="nav-kicker">成长空间</span>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-item ${active === id ? 'is-active' : ''}`} onClick={() => onNavigate(id)}>
            <Icon size={19} strokeWidth={active === id ? 2.4 : 1.8} />
            <span>{label}</span>
            {id === 'health' && <i className="nav-dot" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="local-first-note"><ShieldCheck size={15} /><span><strong>本地优先</strong>记录仅保存在这台设备</span></div>
        <div className="pet-mini-card">
          <div className="pet-avatar"><WestieFace /></div>
          <div><strong>你的小西</strong><span>公犬 · {age.label}</span></div>
          <button aria-label="更多资料"><MoreHorizontal size={18} /></button>
        </div>
        <button className="quiet-link"><CircleHelp size={18} />使用帮助</button>
        <button className="quiet-link" onClick={onExport}><Download size={18} />导出档案</button>
      </div>
    </aside>
  );
}

function Topbar({ active, onCheckIn, onPlan, onMenu }) {
  const item = navItems.find((i) => i.id === active);
  return (
    <header className="topbar">
      <div className="mobile-brand">
        <button className="mobile-brand-button" onClick={onMenu}><WestieMark /></button>
        <div><strong>WESTIE</strong><span>{item?.label}</span></div>
      </div>
      <div className="today-date">
        <span>2026 年 8 月 14 日</span>
        <i />
        <strong>星期五</strong>
      </div>
      <div className="top-actions">
        <button className="icon-button" aria-label="通知"><Bell size={19} /><i /></button>
        <button className="secondary-button" onClick={onPlan}><Target size={17} />对比计划</button>
        <button className="primary-button" onClick={onCheckIn}><Plus size={18} />记录今天</button>
      </div>
    </header>
  );
}

function Dashboard({ log, plan, scores, age, onCheckIn, onPlan, onNavigate, showNotice }) {
  const exerciseGap = Math.max(plan.exercise - log.exercise, 0);
  const foodGap = log.food - plan.food;
  return (
    <div className="page dashboard-page">
      <section className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" />今天的成长简报</div>
          <h1>状态不错，<br />再补一点<em>探索</em>。</h1>
          <p>饮食按计划完成，健康观察未见异常。今天还差 {exerciseGap} 分钟低强度活动，晚饭后安排一次短嗅闻就够了。</p>
          <div className="hero-actions">
            <button className="primary-button large" onClick={onCheckIn}>完成今日记录<ArrowRight size={18} /></button>
            <button className="text-button" onClick={() => onNavigate('handbook')}>查看本月手册<BookOpen size={17} /></button>
          </div>
        </div>
        <GrowthCompass scores={scores} age={age} />
      </section>

      <FamilyPulse showNotice={showNotice} />

      <section className="comparison-section">
        <div className="section-heading">
          <div><span className="eyebrow">今日对比</span><h2>计划值与实际记录</h2></div>
          <button className="text-button muted" onClick={onPlan}><PencilLine size={15} />调整计划值</button>
        </div>
        <div className="comparison-grid">
          <ComparisonCard
            icon={Utensils}
            color="mint"
            label="全天饮食"
            value={log.food}
            unit="g"
            target={plan.food}
            score={scores.food}
            status={foodGap === 0 ? '正合适' : Math.abs(foodGap) <= 8 ? '接近计划' : '需要关注'}
            note="按当前喂养计划对比"
          />
          <ComparisonCard
            icon={Activity}
            color="blue"
            label="轻度活动"
            value={log.exercise}
            unit="分钟"
            target={plan.exercise}
            score={scores.exercise}
            status={exerciseGap === 0 ? '已完成' : `还差 ${exerciseGap} 分钟`}
            note="拆成短时嗅闻更轻松"
          />
          <ComparisonCard
            icon={Weight}
            color="violet"
            label="最近体重"
            value="2.50"
            unit="kg"
            target="看趋势"
            score={82}
            status="平稳上升"
            note="单次体重不作健康判断"
          />
          <ComparisonCard
            icon={Sparkles}
            color="gold"
            label="日常护理"
            value={log.brushed ? 1 : 0}
            unit="项"
            target={plan.brush}
            score={scores.grooming}
            status={log.brushed ? '今日完成' : '待梳毛'}
            note="检查耳朵、足间和嘴边毛"
          />
        </div>
      </section>

      <section className="insight-grid">
        <div className="panel trend-panel">
          <div className="panel-heading">
            <div><span className="eyebrow">成长趋势</span><h3>体重正在稳定变化</h3></div>
            <div className="range-toggle"><button className="active">7 天</button><button>30 天</button></div>
          </div>
          <div className="trend-summary">
            <strong>2.50 <small>kg</small></strong>
            <span><TrendingUp size={15} />近 7 天 +0.16 kg</span>
          </div>
          <LineChart data={trend} />
          <div className="chart-legend"><span><i />体重记录</span><span className="baseline"><i />观察趋势，不设单点合格线</span></div>
        </div>

        <div className="panel priority-panel">
          <div className="panel-heading">
            <div><span className="eyebrow">优化方向</span><h3>今天只做这三件事</h3></div>
            <span className="priority-badge">AI 归纳</span>
          </div>
          <div className="priority-list">
            <PriorityItem number="01" icon={Wind} title={`补 ${exerciseGap} 分钟自由嗅闻`} body="晚餐后选择安静路线，不追求速度和距离。" tone="blue" action="安排" onAction={() => showNotice('已加入今晚 20:30 的计划')} />
            <PriorityItem number="02" icon={Sparkles} title="睡前梳毛 3 分钟" body="重点看耳后、腋下和四肢是否打结或发红。" tone="gold" action="标记" onAction={() => showNotice('已加入睡前护理')} />
            <PriorityItem number="03" icon={Droplets} title="继续观察饮水和便便" body="目前记录正常，不需要因为单日波动频繁换粮。" tone="mint" action="知道了" onAction={() => showNotice('已完成阅读')} />
          </div>
          <div className="safety-note"><ShieldCheck size={18} /><span><strong>健康边界</strong>持续呕吐、呼吸异常、虚弱、血便或明显疼痛，请直接联系兽医，不等待系统评分。</span></div>
        </div>
      </section>

      <section className="handbook-strip">
        <div><span className="eyebrow">每周精选</span><h2>把养护知识，变成今天能做的事</h2></div>
        <button className="text-button" onClick={() => onNavigate('handbook')}>打开养成手册<ArrowRight size={17} /></button>
        <div className="mini-guides">
          {guideCards.slice(0, 3).map((guide) => <MiniGuide key={guide.title} {...guide} />)}
        </div>
      </section>
    </div>
  );
}

function GrowthCompass({ scores, age }) {
  const ring = clamp(scores.total);
  return (
    <div className="compass-wrap" aria-label={`今日成长完成度 ${ring}%`}>
      <div className="orbit orbit-one"><span /></div>
      <div className="orbit orbit-two"><span /></div>
      <svg className="compass-svg" viewBox="0 0 260 260" aria-hidden="true">
        <circle cx="130" cy="130" r="108" className="compass-track" />
        <circle cx="130" cy="130" r="108" className="compass-progress" strokeDasharray={`${ring * 6.786} 678.6`} />
      </svg>
      <div className="compass-core">
        <span className="compass-label">今日成长值</span>
        <strong>{ring}<small>%</small></strong>
        <div className="compass-pet"><WestieFace /></div>
        <span className="compass-age">{age.months} 个月幼犬期</span>
      </div>
      <div className="compass-chip chip-food"><Utensils size={14} />饮食 {scores.food}</div>
      <div className="compass-chip chip-health"><HeartPulse size={14} />健康 {scores.health}</div>
      <div className="compass-chip chip-play"><Activity size={14} />运动 {scores.exercise}</div>
    </div>
  );
}

function FamilyPulse({ showNotice }) {
  return (
    <section className="family-pulse" aria-label="家庭照护同步">
      <div className="pulse-title"><span className="avatar-stack"><i>我</i><i>家</i></span><div><span className="eyebrow">家庭同步</span><strong>今天 2 位照护者已更新</strong></div></div>
      <div className="pulse-events">
        <span><Check size={14} /><b>08:05</b> 早餐 34 g <em>· 我</em></span>
        <span><Check size={14} /><b>12:30</b> 午餐 34 g <em>· 家人</em></span>
        <span className="pending"><Clock3 size={14} /><b>20:30</b> 自由嗅闻 <em>· 待完成</em></span>
      </div>
      <button onClick={() => showNotice('家庭动态已同步')}>同步状态<ArrowRight size={15} /></button>
    </section>
  );
}

function ComparisonCard({ icon: Icon, color, label, value, unit, target, score, status, note }) {
  return (
    <article className="comparison-card">
      <div className={`metric-icon ${color}`}><Icon size={20} /></div>
      <div className="metric-title"><span>{label}</span><Info size={14} /></div>
      <div className="metric-value"><strong>{value}</strong><span>{unit}</span></div>
      <div className="metric-target"><span>计划</span><strong>{target}{typeof target === 'number' ? unit : ''}</strong></div>
      <div className="metric-bar"><i style={{ width: `${clamp(score)}%` }} /></div>
      <div className="metric-foot"><strong>{status}</strong><span>{note}</span></div>
    </article>
  );
}

function LineChart({ data }) {
  const width = 660;
  const height = 190;
  const padX = 20;
  const padY = 24;
  const min = Math.min(...data.map((d) => d.weight)) - 0.03;
  const max = Math.max(...data.map((d) => d.weight)) + 0.03;
  const points = data.map((d, index) => {
    const x = padX + (index * (width - padX * 2)) / (data.length - 1);
    const y = padY + ((max - d.weight) * (height - padY * 2)) / (max - min);
    return { x, y, ...d };
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${path} L ${points[points.length - 1].x} ${height - 22} L ${points[0].x} ${height - 22} Z`;
  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="近七天体重趋势图">
        <defs>
          <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#13868d" stopOpacity=".24" />
            <stop offset="100%" stopColor="#13868d" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((line) => <line key={line} x1="20" x2="640" y1={28 + line * 42} y2={28 + line * 42} className="grid-line" />)}
        <path d={area} fill="url(#chartArea)" />
        <path d={path} className="trend-line" />
        {points.map((p, index) => (
          <g key={p.day}>
            <circle cx={p.x} cy={p.y} r={index === points.length - 1 ? 6 : 3.5} className={index === points.length - 1 ? 'point active' : 'point'} />
            <text x={p.x} y="185" textAnchor="middle" className="chart-label">{p.day.slice(3)}</text>
            {index === points.length - 1 && <text x={p.x - 8} y={p.y - 14} textAnchor="end" className="chart-value">{p.weight}</text>}
          </g>
        ))}
      </svg>
    </div>
  );
}

function PriorityItem({ number, icon: Icon, title, body, tone, action, onAction }) {
  return (
    <div className="priority-item">
      <span className="priority-number">{number}</span>
      <span className={`priority-icon ${tone}`}><Icon size={18} /></span>
      <div><strong>{title}</strong><p>{body}</p></div>
      <button onClick={onAction}>{action}</button>
    </div>
  );
}

function MiniGuide({ tag, title, accent, icon: Icon }) {
  return (
    <article className={`mini-guide ${accent}`}>
      <span className="guide-icon"><Icon size={18} /></span>
      <small>{tag}</small>
      <strong>{title}</strong>
      <ArrowRight size={17} />
    </article>
  );
}

function PageIntro({ eyebrow, title, body, action, onAction }) {
  return (
    <div className="page-intro">
      <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{body}</p></div>
      {action && <button className="primary-button large" onClick={onAction}><Plus size={18} />{action}</button>}
    </div>
  );
}

function FoodPage({ log, plan, onCheckIn, onPlan }) {
  const remaining = Math.max(plan.food - feedings.filter((f) => f.done).reduce((sum, f) => sum + f.amount, 0), 0);
  return (
    <div className="page module-page">
      <PageIntro eyebrow="饮食管理" title="把每一口，记得刚刚好" body="先对齐全天总量，再观察食欲、便便与体重趋势。克数计划应以当前粮袋标示、体况和兽医建议为准。" action="记录喂食" onAction={onCheckIn} />
      <div className="module-hero food-hero">
        <div className="module-stat"><span>今日完成</span><strong>{log.food}<small> / {plan.food} g</small></strong><div className="long-progress"><i style={{ width: `${clamp((log.food / plan.food) * 100)}%` }} /></div><p><Check size={15} />全天计划总量已记录</p></div>
        <div className="food-bowl"><BowlArt /><span>{remaining > 0 ? `还差 ${remaining} g` : '已达计划'}</span></div>
        <div className="module-side-note"><span className="metric-icon mint"><Bone size={19} /></span><div><small>喂食器校准</small><strong>1 份 ≈ 17 g</strong><p>每次更换粮型后，用厨房秤重新称 5 次取平均值。</p></div></div>
      </div>
      <div className="two-column">
        <section className="panel schedule-panel">
          <div className="panel-heading"><div><span className="eyebrow">今日时间线</span><h3>四餐计划</h3></div><button className="text-button muted"><PencilLine size={15} />编辑</button></div>
          <div className="feeding-list">
            {feedings.map((f, index) => <div className={`feeding-row ${f.done ? 'done' : ''}`} key={f.time}><span className="feed-status">{f.done ? <Check size={15} /> : <Clock3 size={15} />}</span><time>{f.time}</time><div><strong>{f.label}</strong><span>{f.done ? '已完成记录' : '等待喂食'}</span></div><b>{f.amount} g</b>{index < feedings.length - 1 && <i />}</div>)}
          </div>
        </section>
        <section className="panel observation-panel">
          <div className="panel-heading"><div><span className="eyebrow">观察闭环</span><h3>今天的反馈</h3></div><span className="status-chip good">整体正常</span></div>
          <div className="observation-grid">
            <Observation icon={Droplets} label="饮水" value="正常" />
            <Observation icon={Leaf} label="便便" value="成形" />
            <Observation icon={Bone} label="食欲" value="积极" />
            <Observation icon={Weight} label="体重" value="2.50 kg" />
          </div>
          <div className="coach-note"><Sparkles size={18} /><p><strong>本周建议</strong>当前全天总量完成稳定。不要因为一顿剩粮立刻换粮；先结合连续记录判断。</p></div>
          <button className="outline-button full" onClick={onPlan}>调整我的饮食计划</button>
        </section>
      </div>
    </div>
  );
}

function ExercisePage({ log, plan, onCheckIn }) {
  const percent = clamp(Math.round((log.exercise / plan.exercise) * 100));
  return (
    <div className="page module-page">
      <PageIntro eyebrow="运动与探索" title="短一点，开心一点" body="幼犬运动不追求刷里程。把自由嗅闻、轻游戏和正向训练拆成小段，让身体和大脑都有恢复时间。" action="记录活动" onAction={onCheckIn} />
      <div className="exercise-stage">
        <div className="activity-ring" style={{ '--percent': `${percent * 3.6}deg` }}><div><Activity size={25} /><strong>{log.exercise}</strong><span>/ {plan.exercise} 分钟</span></div></div>
        <div className="exercise-copy"><span className="status-chip mild">还差 {Math.max(plan.exercise - log.exercise, 0)} 分钟</span><h2>今晚去闻一闻风</h2><p>选择熟悉、安静的路线，让小西自己决定在哪停留。一次 8–10 分钟就能完成今天的计划。</p><button className="primary-button">安排 20:30 嗅闻<ArrowRight size={17} /></button></div>
        <div className="route-map"><span className="route-dot start"><PawPrint size={15} /></span><span className="route-line" /><span className="route-dot middle" /><span className="route-line second" /><span className="route-dot end"><Home size={14} /></span><i className="tree one">♧</i><i className="tree two">♧</i><p>自由嗅闻路线 · 约 650 m</p></div>
      </div>
      <div className="three-column">
        <ActivityCard icon={Wind} title="自由嗅闻" value="12 分钟" tag="今日已完成" tone="blue" />
        <ActivityCard icon={PawPrint} title="轻游戏" value="6 分钟" tag="室内拔河" tone="gold" />
        <ActivityCard icon={Target} title="正向训练" value="4 分钟" tag="名字回应" tone="mint" />
      </div>
      <div className="panel safe-movement"><div><span className="eyebrow">幼犬运动边界</span><h3>今天做什么，与先不做什么</h3></div><div className="do-dont"><div><strong><Check size={16} />推荐</strong><span>自由探索</span><span>低矮障碍</span><span>短时互动</span></div><div className="dont"><strong><X size={16} />暂避</strong><span>强迫长跑</span><span>重复跳高</span><span>连续爬楼</span></div></div></div>
    </div>
  );
}

function HealthPage({ log, onCheckIn }) {
  return (
    <div className="page module-page">
      <PageIntro eyebrow="健康管理" title="看见变化，而不是猜测" body="用连续记录帮助你更早发现异常，也帮助兽医看到完整背景。系统提示只做分流，不代替检查与诊断。" action="添加健康观察" onAction={onCheckIn} />
      <div className="health-overview">
        <div className="health-status-main"><span className="pulse-orb"><HeartPulse size={27} /></span><div><span className="eyebrow">今日观察</span><h2>未记录到明显异常</h2><p>饮水、便便、精神与皮肤观察均在你的“正常”范围。</p></div><span className="status-chip good"><Check size={14} />稳定</span></div>
        <div className="health-vitals"><Observation icon={Droplets} label="饮水" value="正常" /><Observation icon={Leaf} label="便便" value="成形" /><Observation icon={ThermometerSun} label="皮肤" value="无红斑" /><Observation icon={Activity} label="精神" value="活跃" /></div>
      </div>
      <div className="two-column health-columns">
        <section className="panel record-panel">
          <div className="panel-heading"><div><span className="eyebrow">健康档案</span><h3>已记录事项</h3></div><button className="text-button muted">查看全部<ArrowRight size={15} /></button></div>
          <div className="record-timeline">
            <RecordItem date="近期" title="三针基础疫苗" body="已记录；后续安排以疫苗本、产品标签和兽医意见为准。" icon={ShieldCheck} />
            <RecordItem date="近期" title="CDV / CPV 检测" body="抗原检测阴性；IgG 抗体已记录。结果不等于零感染风险。" icon={Stethoscope} />
            <RecordItem date="08 · 14" title="每日健康观察" body="饮水、便便、皮肤和精神均记录为正常。" icon={Check} />
          </div>
        </section>
        <section className="panel triage-panel">
          <div className="triage-top"><span className="metric-icon coral"><Bell size={18} /></span><div><span className="eyebrow">快速分流</span><h3>这些情况不要等评分</h3></div></div>
          <div className="red-flags"><span>呼吸困难</span><span>持续呕吐</span><span>明显虚弱</span><span>血便</span><span>抽搐或昏厥</span><span>疑似触电 / 中毒</span></div>
          <p>出现任一严重或快速恶化的症状，请立即联系急诊兽医。若怀疑咬到通电电线，先断电并避免接触裸线。</p>
          <button className="urgent-button"><Stethoscope size={17} />查看紧急处置清单</button>
        </section>
      </div>
      <RecurringCare />
    </div>
  );
}

function RecurringCare() {
  const items = [
    { day: '每周日', icon: Search, title: '耳朵与足间检查', meta: '下一次 · 8 月 16 日', tone: 'mint', status: '已安排' },
    { day: '每月', icon: Weight, title: '体重与体况复盘', meta: '下一次 · 9 月 1 日', tone: 'blue', status: '自动重复' },
    { day: '待补充', icon: ShieldCheck, title: '疫苗 / 驱虫安排', meta: '请按疫苗本与兽医日期设置', tone: 'gold', status: '需要日期' },
  ];
  return (
    <section className="panel recurring-care">
      <div className="panel-heading"><div><span className="eyebrow">周期护理</span><h3>接下来不会漏掉的事</h3></div><button className="text-button muted"><Plus size={15} />添加计划</button></div>
      <div className="recurring-grid">
        {items.map(({ day, icon: Icon, title, meta, tone, status }) => <article key={title}><span className={`metric-icon ${tone}`}><Icon size={18} /></span><div><small>{day}</small><strong>{title}</strong><p>{meta}</p></div><em>{status}</em></article>)}
      </div>
    </section>
  );
}

function GroomingPage({ log, setLog, showNotice }) {
  const toggleBrush = () => {
    setLog({ ...log, brushed: !log.brushed });
    showNotice(log.brushed ? '已取消今日梳毛' : '今日梳毛已完成');
  };
  return (
    <div className="page module-page">
      <PageIntro eyebrow="美容与清洁" title="白得有质感，靠的是节奏" body="西高地的日常护理不是频繁洗澡。把梳毛、嘴边清洁、耳朵与足间检查做成轻量习惯。" />
      <div className="grooming-hero">
        <div className="grooming-dog"><div className="grooming-halo" /><WestiePortrait /></div>
        <div className="grooming-copy"><span className="eyebrow">今天的护理</span><h2>{log.brushed ? '毛发已经蓬松就位' : '从 3 分钟梳毛开始'}</h2><p>沿毛发生长方向轻梳，重点摸一摸耳后、腋下和四肢。发现红、湿、臭或持续抓挠时先停用新产品并记录。</p><button className={log.brushed ? 'outline-button' : 'primary-button'} onClick={toggleBrush}>{log.brushed ? <><Check size={17} />今日已完成</> : <><Sparkles size={17} />标记完成</>}</button></div>
        <div className="grooming-progress"><span>本周护理</span><strong>{log.brushed ? '5' : '4'}<small> / 7 天</small></strong><div className="week-dots">{['一','二','三','四','五','六','日'].map((d, i) => <span className={i < (log.brushed ? 5 : 4) ? 'done' : ''} key={d}><i>{i < (log.brushed ? 5 : 4) ? <Check size={12} /> : ''}</i>{d}</span>)}</div></div>
      </div>
      <div className="grooming-grid">
        <CareCard icon={Sparkles} title="梳毛" cadence="每天 3–5 分钟" detail="轻柔分区，打结处不要硬拽。" status={log.brushed ? '已完成' : '今天待做'} />
        <CareCard icon={Droplets} title="嘴边清洁" cadence="进食饮水后" detail="擦干比反复使用清洁剂更重要。" status="今天 2 次" />
        <CareCard icon={Search} title="耳朵 / 足间" cadence="每周检查" detail="看红、湿、异味和分泌物。" status="周日待查" />
        <CareCard icon={Bone} title="口腔护理" cadence="逐步建立习惯" detail="使用犬用牙膏，从触碰训练开始。" status="训练中" />
      </div>
    </div>
  );
}

function HandbookPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  const categories = ['全部', '饮食', '运动', '健康', '美容'];
  const filtered = guideCards.filter((guide) => (category === '全部' || guide.tag === category) && `${guide.title}${guide.body}`.includes(query));
  return (
    <div className="page handbook-page">
      <PageIntro eyebrow="西高地养成手册" title="少一点焦虑，多一点有据可循" body="按成长阶段组织的养护参考。你看到的是操作建议、观察边界和需要专业判断的分界线。" />
      <div className="handbook-tools">
        <label className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索：换粮、梳毛、皮肤……" /></label>
        <div className="category-tabs">{categories.map((item) => <button className={category === item ? 'active' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
      </div>
      <div className="featured-guide">
        <div className="featured-index">W / 04</div>
        <div className="featured-copy"><span className="eyebrow">本月成长主题</span><h2>从“喂饱”到“会观察”</h2><p>饮食管理真正有价值的部分，不只是精确到克，而是把克数、体况、便便和食欲放在同一张图里。</p><button className="light-button">开始阅读<ArrowRight size={17} /></button></div>
        <div className="featured-orbit"><span>食欲</span><span>便便</span><span>体重</span><span>克数</span><div><Utensils size={28} /></div></div>
      </div>
      <div className="guide-grid">
        {filtered.length > 0 ? filtered.map((guide, index) => <GuideCard key={guide.title} {...guide} index={String(index + 1).padStart(2, '0')} />) : <div className="empty-state"><Search size={28} /><h3>暂时没有匹配内容</h3><p>换一个关键词，或切换到“全部”看看。</p></div>}
      </div>
      <div className="source-note"><Info size={17} /><p><strong>关于“标准”</strong>手册会区分产品喂养表、个人计划值、成长趋势和兽医判断。不同粮型、体况和健康史不能共用一个万能数字。</p></div>
    </div>
  );
}

function GuideCard({ tag, title, body, time, accent, icon: Icon, index }) {
  return (
    <article className="guide-card">
      <div className={`guide-cover ${accent}`}><span>{index}</span><Icon size={32} /><i /></div>
      <div className="guide-card-body"><div><span className="status-chip neutral">{tag}</span><small>{time}阅读</small></div><h3>{title}</h3><p>{body}</p><button>阅读手册<ArrowRight size={16} /></button></div>
    </article>
  );
}

function Observation({ icon: Icon, label, value }) {
  return <div className="observation"><span><Icon size={18} /></span><div><small>{label}</small><strong>{value}</strong></div><Check size={15} /></div>;
}

function ActivityCard({ icon: Icon, title, value, tag, tone }) {
  return <article className="activity-card"><span className={`metric-icon ${tone}`}><Icon size={19} /></span><small>{title}</small><strong>{value}</strong><p><Check size={14} />{tag}</p></article>;
}

function RecordItem({ date, title, body, icon: Icon }) {
  return <div className="record-item"><time>{date}</time><span><Icon size={16} /></span><div><strong>{title}</strong><p>{body}</p></div></div>;
}

function CareCard({ icon: Icon, title, cadence, detail, status }) {
  return <article className="care-card"><span className="care-icon"><Icon size={20} /></span><div className="care-head"><strong>{title}</strong><span>{status}</span></div><b>{cadence}</b><p>{detail}</p><button>查看方法<ArrowRight size={15} /></button></article>;
}

function CheckInModal({ current, plan, onClose, onSave }) {
  const [draft, setDraft] = useState(current);
  const [step, setStep] = useState(1);
  const set = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));
  const healthOptions = {
    water: [['normal', '正常'], ['more', '明显变多'], ['less', '明显变少']],
    stool: [['good', '成形'], ['soft', '偏软'], ['warning', '异常']],
    skin: [['normal', '无异常'], ['itch', '偶尔抓挠'], ['warning', '红 / 湿 / 臭']],
    mood: [['bright', '活跃'], ['quiet', '安静'], ['warning', '明显虚弱']],
  };
  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label="记录今天">
      <button className="modal-backdrop" onClick={onClose} aria-label="关闭" />
      <div className="modal-card">
        <div className="modal-header"><div><span className="eyebrow">每日记录 · {step}/2</span><h2>{step === 1 ? '今天做了多少？' : '今天状态怎么样？'}</h2></div><button className="close-button" onClick={onClose}><X size={20} /></button></div>
        <div className="step-track"><i style={{ width: step === 1 ? '50%' : '100%' }} /></div>
        {step === 1 ? (
          <div className="modal-body">
            <NumberField icon={Utensils} label="全天饮食" value={draft.food} unit="g" target={`计划 ${plan.food} g`} onChange={(v) => set('food', v)} />
            <NumberField icon={Activity} label="轻度活动" value={draft.exercise} unit="分钟" target={`计划 ${plan.exercise} 分钟`} onChange={(v) => set('exercise', v)} />
            <label className="check-row"><input type="checkbox" checked={draft.brushed} onChange={(e) => set('brushed', e.target.checked)} /><span><i><Sparkles size={18} /></i><b>今天已梳毛</b><small>包括耳后、腋下和四肢检查</small></span><em><Check size={15} /></em></label>
          </div>
        ) : (
          <div className="modal-body health-form">
            {Object.entries(healthOptions).map(([key, options]) => <div className="choice-field" key={key}><label>{({water:'饮水',stool:'便便',skin:'皮肤 / 耳朵',mood:'精神状态'})[key]}</label><div>{options.map(([value,label]) => <button className={draft[key] === value ? 'active' : ''} onClick={() => set(key, value)} key={value}>{draft[key] === value && <Check size={14} />}{label}</button>)}</div></div>)}
            {Object.values(draft).includes('warning') && <div className="form-warning"><Bell size={17} /><span><strong>记录里有需要关注的信号</strong>如果症状严重、快速恶化，或伴随呼吸异常、虚弱、持续呕吐，请直接联系兽医。</span></div>}
          </div>
        )}
        <div className="modal-footer"><button className="secondary-button" onClick={step === 1 ? onClose : () => setStep(1)}>{step === 1 ? '稍后再记' : '上一步'}</button><button className="primary-button large" onClick={step === 1 ? () => setStep(2) : () => onSave(draft)}>{step === 1 ? <>继续<ArrowRight size={17} /></> : <><Check size={17} />保存记录</>}</button></div>
      </div>
    </div>
  );
}

function PlanModal({ current, onClose, onSave }) {
  const [draft, setDraft] = useState(current);
  const set = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));
  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label="调整对比计划">
      <button className="modal-backdrop" onClick={onClose} aria-label="关闭" />
      <div className="modal-card compact-modal">
        <div className="modal-header"><div><span className="eyebrow">可编辑标准</span><h2>我的对比计划</h2><p>这些值用于日常反馈，不是通用医学标准。</p></div><button className="close-button" onClick={onClose}><X size={20} /></button></div>
        <div className="modal-body">
          <NumberField icon={Utensils} label="每日饮食计划" value={draft.food} unit="g" target="按粮袋与体况设置" onChange={(v) => set('food', v)} />
          <NumberField icon={Activity} label="每日轻度活动" value={draft.exercise} unit="分钟" target="可拆成多次完成" onChange={(v) => set('exercise', v)} />
          <div className="plan-disclaimer"><Info size={17} /><span>体重不提供单点“合格值”，系统只比较你自己的连续趋势。健康红旗信号也不会被总分抵消。</span></div>
        </div>
        <div className="modal-footer"><button className="secondary-button" onClick={onClose}>取消</button><button className="primary-button large" onClick={() => onSave(draft)}><Check size={17} />保存计划</button></div>
      </div>
    </div>
  );
}

function NumberField({ icon: Icon, label, value, unit, target, onChange }) {
  return (
    <div className="number-field">
      <span className="metric-icon mint"><Icon size={19} /></span>
      <div><strong>{label}</strong><small>{target}</small></div>
      <div className="stepper"><button onClick={() => onChange(Math.max(0, Number(value) - 1))}><Minus size={16} /></button><label><input type="number" value={value} min="0" onChange={(e) => onChange(Number(e.target.value))} /><span>{unit}</span></label><button onClick={() => onChange(Number(value) + 1)}><Plus size={16} /></button></div>
    </div>
  );
}

function MobileNav({ active, onNavigate, open }) {
  const visible = navItems.slice(0, 5);
  return (
    <>
      <nav className="mobile-nav">{visible.map(({ id, label, icon: Icon }) => <button key={id} className={active === id ? 'active' : ''} onClick={() => onNavigate(id)}><Icon size={19} /><span>{label}</span></button>)}</nav>
      {open && <div className="mobile-menu-pop"><button onClick={() => onNavigate('handbook')}><BookOpen size={19} />手册</button><button><Settings size={19} />设置</button></div>}
    </>
  );
}

function WestieMark() {
  return (
    <svg viewBox="0 0 52 52" aria-hidden="true"><path d="M12.5 22.5 9 9l11.7 7.5c1.7-.7 3.5-1 5.3-1s3.7.3 5.3 1L43 9l-3.5 13.5c2.2 2.7 3.5 6.1 3.5 9.7C43 41 35.4 47 26 47S9 41 9 32.2c0-3.6 1.3-7 3.5-9.7Z" fill="currentColor"/><path d="M18.5 29.5h.1M33.5 29.5h.1" stroke="white" strokeWidth="3.4" strokeLinecap="round"/><path d="M23 36.5c2 1.8 4 1.8 6 0" fill="none" stroke="white" strokeWidth="2.3" strokeLinecap="round"/><path d="m23.5 33 2.5 2 2.5-2" fill="none" stroke="white" strokeWidth="2.3" strokeLinejoin="round"/></svg>
  );
}

function WestieFace() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true"><path d="M23 50 18 14l29 22c4-2 8-3 13-3s10 1 14 3l28-22-5 36c5 8 8 18 7 28-1 21-20 33-44 33S17 99 16 78c-1-10 2-20 7-28Z" fill="#fff"/><path d="M31 56c-4 7-5 19-3 27 3 11 15 17 32 17s29-6 32-17c2-8 1-20-3-27-5-9-15-15-29-15S36 47 31 56Z" fill="#f3f5f2"/><circle cx="43" cy="67" r="4.5" fill="#162c2a"/><circle cx="77" cy="67" r="4.5" fill="#162c2a"/><path d="M54 79c3-3 9-3 12 0l-6 6-6-6Z" fill="#162c2a"/><path d="M49 89c7 5 15 5 22 0" fill="none" stroke="#162c2a" strokeWidth="3" strokeLinecap="round"/><path d="m30 46 9-17 6 18M90 46l-9-17-6 18" fill="#dfe7e3"/></svg>
  );
}

function WestiePortrait() {
  return <svg viewBox="0 0 280 270" aria-hidden="true"><path d="M64 115 51 31l64 48c9-3 17-5 26-5 10 0 20 2 28 6l63-49-14 85c13 15 19 35 17 56-4 48-44 76-94 76s-90-28-94-76c-2-21 5-42 17-57Z" fill="#fff"/><path d="M78 135c-11 18-12 47-5 67 9 26 34 39 68 39 35 0 61-14 69-40 6-20 4-48-7-66-12-21-35-34-63-34-29 0-50 13-62 34Z" fill="#f1f5f2"/><circle cx="101" cy="156" r="9" fill="#17312e"/><circle cx="179" cy="156" r="9" fill="#17312e"/><path d="M126 184c7-7 21-7 28 0l-14 13-14-13Z" fill="#17312e"/><path d="M113 207c17 13 37 13 54 0" fill="none" stroke="#17312e" strokeWidth="7" strokeLinecap="round"/><path d="m82 109 19-42 16 42M199 109l-20-42-15 43" fill="#dce7e4"/></svg>;
}

function BowlArt() {
  return <svg viewBox="0 0 220 150" aria-hidden="true"><ellipse cx="110" cy="73" rx="76" ry="26" fill="#17352d"/><ellipse cx="110" cy="68" rx="65" ry="19" fill="#d6a85c"/><circle cx="84" cy="65" r="7" fill="#8a6130"/><circle cx="105" cy="58" r="8" fill="#9c6c35"/><circle cx="130" cy="66" r="8" fill="#81592f"/><circle cx="151" cy="59" r="6" fill="#a4733e"/><path d="M34 73h152l-12 48c-2 8-9 13-17 13H63c-8 0-15-5-17-13L34 73Z" fill="#1e4840"/><path d="M82 103c9-10 17-10 26 0 9-10 17-10 26 0" fill="none" stroke="#d8eee9" strokeWidth="6" strokeLinecap="round"/></svg>;
}

createRoot(document.getElementById('root')).render(<App />);
