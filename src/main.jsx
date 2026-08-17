import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  ArrowRight,
  Bell,
  Bone,
  BookOpen,
  Check,
  CircleHelp,
  Clock3,
  Droplets,
  Download,
  HeartPulse,
  Home,
  Info,
  Leaf,
  Minus,
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
  weightKg: null,
  stool: 'good',
  skin: 'normal',
  mood: 'bright',
  brushed: false,
  medication: '',
  note: '',
  entries: ['food', 'exercise', 'water', 'health'],
};

const initialPlan = {
  food: 102,
  exercise: 30,
  brush: 1,
};

const initialProfile = {
  petName: '你的小西',
  breed: '西高地白梗',
  sex: '公犬',
  birthDate: '2026-04-20',
  microchip: '',
  notes: '',
  weights: [{ id: 'weight-known', date: '2026-08-14', kg: 2.5 }],
  vaccines: [{
    id: 'vaccine-known',
    name: '基础联苗（共 3 针）',
    date: '',
    status: '已完成',
    nextDate: '',
    note: '具体日期待按疫苗本补充',
  }],
  deworming: [],
};

const feedings = [
  { time: '08:05', label: '早餐', amount: 34, done: true },
  { time: '12:30', label: '午餐', amount: 34, done: true },
  { time: '18:30', label: '晚餐', amount: 17, done: true },
  { time: '21:30', label: '睡前餐', amount: 17, done: false },
];

const guideCards = [
  {
    articleId: 'feeding-transition',
    tag: '饮食',
    title: '从四餐过渡到三餐，先守住全天总量',
    body: '调整餐次时，先不要同时改变总克数。连续观察食欲、便便和体重趋势，再小步调整。',
    time: '3 分钟',
    accent: 'mint',
    icon: Utensils,
  },
  {
    articleId: 'movement-quality',
    tag: '运动',
    title: '幼犬的运动，质量比里程更重要',
    body: '短时嗅闻、探索和正向训练可以拆成多次完成；避免强迫跑步、连续爬楼和过度跳跃。',
    time: '4 分钟',
    accent: 'blue',
    icon: Wind,
  },
  {
    articleId: 'grooming-rhythm',
    tag: '美容',
    title: '白毛不等于每天洗：建立轻护理节奏',
    body: '日常先梳毛、擦嘴和检查足间。出现持续发红、异味或抓挠时，记录后联系兽医。',
    time: '5 分钟',
    accent: 'gold',
    icon: Sparkles,
  },
  {
    articleId: 'skin-observation',
    tag: '健康',
    title: '西高地的皮肤观察，应该记什么',
    body: '把瘙痒频率、位置、红斑、气味、耳道和近期饮食变化记在一起，比单张照片更有价值。',
    time: '6 分钟',
    accent: 'coral',
    icon: Stethoscope,
  },
];

const articleLibrary = {
  featured: {
    tag: '本月主题',
    time: '6 分钟',
    title: '从“喂饱”到“会观察”',
    intro: '真正有用的饮食管理，不是死守一个数字，而是把克数、食欲、便便、饮水和体重趋势放在一起看。',
    sections: [
      { title: '先固定一个基线', body: '先按当前粮袋、犬只月龄和体况确定全天计划量。换餐次时先保持全天总量不变，避免同时改粮、改克数、改餐次。' },
      { title: '记录连续变化', body: '单顿吃少、一次软便或一天体重波动，都不足以单独下结论。连续记录 3–7 天，更容易看清是否与换粮、零食、运动或压力有关。' },
      { title: '只改一个变量', body: '需要调整时，一次只改变一项，并保留观察窗口。若持续呕吐、明显虚弱、血便或快速恶化，应直接联系兽医。' },
    ],
    checklist: ['全天总克数', '每餐完成度', '饮水变化', '便便形态', '每周同条件称重'],
    source: [{ label: '皇家宠物食品：喂饲幼犬和幼犬营养', url: 'https://www.royalcanin.com.cn/dogs/puppy/feeding' }],
  },
  'feeding-transition': {
    tag: '饮食',
    time: '3 分钟',
    title: '从四餐过渡到三餐，先守住全天总量',
    intro: '餐次变化只是时间分配变化，不应顺手把全天总量也一起大幅调整。',
    sections: [
      { title: '第 1 步：确认粮型', body: '先核对包装上的完整产品名、适用月龄和喂养表。不同配方的能量密度不同，不能只拿“克数”横向比较。' },
      { title: '第 2 步：重分配，不加量', body: '把原有全天总量重新分给三餐，先连续观察食欲和便便。自动喂食器每次换粮后，应重新称量多次并取平均值。' },
      { title: '第 3 步：小步复盘', body: '结合体况、每周体重趋势和兽医建议再调整。不要因为一顿剩粮立刻换粮，也不要突然停掉一餐。' },
    ],
    checklist: ['包装与月龄匹配', '机器出粮量已校准', '全天总量暂时不变', '连续记录食欲与便便'],
    warning: '持续拒食、反复呕吐、血便或精神明显变差，不等待观察周期，及时联系兽医。',
    source: [{ label: '皇家宠物食品：喂饲幼犬和幼犬营养', url: 'https://www.royalcanin.com.cn/dogs/puppy/feeding' }],
  },
  'movement-quality': {
    tag: '运动',
    time: '4 分钟',
    title: '幼犬的运动，质量比里程更重要',
    intro: '自由嗅闻、轻游戏和短时训练可以同时满足身体活动与环境学习，不必追求连续跑动。',
    sections: [
      { title: '把活动拆短', body: '根据幼犬当下状态安排多次短活动。结束时仍愿意互动、回家后能正常休息，通常比追求固定里程更有意义。' },
      { title: '让幼犬有选择', body: '允许它停下嗅闻、拉开距离或暂时离开刺激。社交化不是强迫接触，而是帮助幼犬在安全距离内保持放松。' },
      { title: '坚持奖励式训练', body: '用食物、玩具和环境奖励想要的行为；避免电击项圈、刺钉项圈、勒颈和身体惩罚。' },
    ],
    checklist: ['安静路线自由嗅闻', '短时互动游戏', '名字回应训练', '主动休息与饮水'],
    source: [
      { label: 'AVSAB：幼犬社会化立场声明', url: 'https://avsab.org/resources/position-statements/' },
      { label: 'AVSAB：人道犬只训练立场', url: 'https://avsab.org/resources/position-statements/' },
    ],
  },
  'grooming-rhythm': {
    tag: '美容',
    time: '5 分钟',
    title: '白毛不等于每天洗：建立轻护理节奏',
    intro: '西高地的整洁感主要来自规律梳理、局部擦干和持续检查，而不是频繁使用清洁产品。',
    sections: [
      { title: '日常先梳再看', body: '从幼犬期开始，用短、轻、正向的方式梳毛。重点看耳后、腋下、腹部与四肢是否打结、发红或潮湿。' },
      { title: '局部脏，局部处理', body: '进食和饮水后擦净并保持嘴边毛干燥；外出后检查足间。洗澡使用犬用产品和温水，吹风采用温暖低档。' },
      { title: '异常先停新产品', body: '出现持续抓挠、异味、红斑、脱毛或反复耳部问题时，记录位置与时间，并联系兽医，不长期自行使用人药或激素。' },
    ],
    checklist: ['耳后与腋下无打结', '嘴边毛已擦干', '耳道无异味分泌物', '足间无红湿'],
    source: [{ label: 'WHWTCA：Grooming Your Westie', url: 'https://westieclubamerica.com/behavior-grooming.html' }],
  },
  'skin-observation': {
    tag: '健康',
    time: '6 分钟',
    title: '西高地的皮肤观察，应该记什么',
    intro: '一条好记录应回答“哪里、多久、多频繁、同时发生了什么”，而不只是留下一张照片。',
    sections: [
      { title: '记录位置与程度', body: '标明耳朵、嘴边、腹部、腋下、足间或尾根；记录红、湿、皮屑、脱毛、气味与抓挠频率。' },
      { title: '补齐前后背景', body: '同时记录近期换粮、零食、洗护产品、驱虫、外出环境与用药变化，便于兽医判断可能的相关因素。' },
      { title: '知道何时升级', body: '持续或快速扩大的红斑、渗出、明显疼痛、强烈异味、精神食欲变化或反复耳炎，需要兽医检查。' },
    ],
    checklist: ['清晰照片与具体位置', '抓挠频率', '近期饮食或产品变化', '精神与食欲', '是否持续或扩大'],
    warning: '系统只能帮助整理观察信息，不能据此诊断过敏、感染或寄生虫。',
    source: [{ label: 'WHWTCA：西高地日常美容与健康观察', url: 'https://westieclubamerica.com/behavior-grooming.html' }],
  },
  brushing: {
    tag: '护理方法', time: '2 分钟', title: '3 分钟日常梳毛', intro: '目标不是一次梳到完美，而是让幼犬接受触碰，并及时发现打结和皮肤变化。',
    sections: [
      { title: '准备', body: '选择防滑、稳定的位置，准备软针梳或适合当前毛质的梳子，以及少量奖励。' },
      { title: '顺序', body: '先从背部和身体侧面开始，再到耳后、腋下与四肢。沿毛发生长方向轻梳，遇到结先用手分开，不硬拽。' },
      { title: '结束', body: '幼犬仍放松时就结束并奖励。发现贴皮硬结、红痛或皮损时不要强行处理。' },
    ], checklist: ['防滑位置', '短时分区', '不硬拽毛结', '放松时结束'], source: [{ label: 'WHWTCA：Grooming Your Westie', url: 'https://westieclubamerica.com/behavior-grooming.html' }],
  },
  'mouth-cleaning': {
    tag: '护理方法', time: '2 分钟', title: '嘴边毛清洁与保持干燥', intro: '吃喝后及时擦净与保持干燥，比频繁叠加清洁剂更重要。',
    sections: [
      { title: '轻擦', body: '用柔软湿布擦掉食物残渣，再用干布轻压吸干；不要来回大力摩擦皮肤。' },
      { title: '检查', body: '分开毛发看皮肤是否发红、潮湿、有气味或反复舔舐。持续异常时停止新产品并咨询兽医。' },
    ], checklist: ['擦掉残渣', '轻压吸干', '观察皮肤', '清洁布单独使用'],
  },
  'ear-paw-check': {
    tag: '护理方法', time: '3 分钟', title: '耳朵与足间检查', intro: '检查的重点是发现变化，不是每天深度清洁。',
    sections: [
      { title: '耳朵', body: '只观察能看见的位置：是否发红、潮湿、有明显气味或异常分泌物。不要把棉签深入耳道。' },
      { title: '足间', body: '拨开脚趾毛，检查红湿、异物、破损和持续舔咬。外出后擦净并充分弄干。' },
    ], checklist: ['无红湿', '无强烈异味', '无异常分泌物', '无持续舔咬'], warning: '疼痛、头歪、频繁甩头、明显肿胀或跛行，应联系兽医。',
  },
  'dental-care': {
    tag: '护理方法', time: '3 分钟', title: '幼犬口腔护理入门', intro: '先建立允许触碰嘴边的习惯，再逐步进入犬用牙膏刷牙。',
    sections: [
      { title: '触碰训练', body: '短暂触碰嘴边、抬起唇部，立即奖励；幼犬抗拒时退回更简单一步。' },
      { title: '逐步刷牙', body: '使用犬用牙刷和犬用牙膏，从外侧牙面几秒钟开始，逐渐延长。不要使用人用牙膏。' },
    ], checklist: ['犬用牙膏', '短时正向练习', '从外侧牙面开始', '不强行掰嘴'],
  },
  emergency: {
    tag: '紧急清单', time: '立即查看', title: '出现严重症状时先做什么', intro: '这份清单用于帮助你更快行动，不用于在家诊断。',
    sections: [
      { title: '立即联系急诊兽医', body: '呼吸困难、抽搐或昏厥、明显虚弱、持续呕吐、血便、严重疼痛、疑似中毒或疑似触电，都不要等待系统评分。' },
      { title: '疑似触电', body: '先切断电源，不直接接触裸线；已经咬坏的电线和适配器不要缠胶带继续使用。即使表面暂时正常，也要向兽医说明是否可能通电。' },
      { title: '准备就医信息', body: '记录症状开始时间、变化速度、可能接触物、近期用药与疫苗情况；安全情况下拍照或带上产品包装。' },
    ], checklist: ['先确保人和犬安全', '联系急诊兽医', '记录时间与暴露物', '携带档案和包装'], warning: '若犬只呼吸异常、虚弱或意识改变，请立即出发就医。',
  },
  'health-records': {
    tag: '健康档案', time: '2 分钟', title: '当前健康记录摘要', intro: '系统保存的是已知记录与观察，不代表完成了新的医学检查。',
    sections: [
      { title: '基础疫苗', body: '已记录三针基础疫苗。后续是否补种或加强，应以疫苗本、当地要求、产品标签和兽医意见为准。' },
      { title: 'CDV / CPV 检测', body: '既有记录显示检测时抗原阴性、IgG 抗体已记录；这不等于未来没有感染风险。' },
      { title: '全球指南边界', body: 'WSAVA 2024 建议幼犬核心疫苗按间隔完成至至少 16 周龄；具体方案仍由当地兽医结合风险和产品决定。' },
    ], checklist: ['疫苗本照片', '接种日期与产品', '驱虫记录', '检查报告', '兽医联系方式'], source: [{ label: 'WSAVA：2024 犬猫疫苗指南', url: 'https://wsava.org/Global-Guidelines/Vaccination-Guidelines/' }],
  },
  help: {
    tag: '使用帮助', time: '2 分钟', title: '这套系统怎么用', intro: '长期档案与每日事项分开管理；今天发生什么就记录什么，不需要机械填满整张表。',
    sections: [
      { title: '1. 管理西高地档案', body: '从侧栏宠物卡片或健康页进入档案，补充基础资料、体重、疫苗和驱虫。数据只保存在当前浏览器。' },
      { title: '2. 按事项记录今天', body: '先选择饮食、饮水变化、活动、体重、健康观察或护理，再保存所选内容。没填写的项目不会被自动判为正常。' },
      { title: '3. 调整计划与阅读手册', body: '计划值用于日常对比；手册会标出可执行步骤与需要专业判断的边界。' },
    ], checklist: ['完成今日记录', '每周复盘趋势', '异常时直接联系兽医'],
  },
};

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

function normalizeLog(saved) {
  if (!saved) return initialLog;
  const entries = Array.isArray(saved.entries)
    ? saved.entries
    : ['food', 'exercise', 'water', 'health'];
  return { ...initialLog, ...saved, entries };
}

function normalizeProfile(saved) {
  if (!saved) return initialProfile;
  return {
    ...initialProfile,
    ...saved,
    weights: Array.isArray(saved.weights) ? saved.weights : initialProfile.weights,
    vaccines: Array.isArray(saved.vaccines) ? saved.vaccines : initialProfile.vaccines,
    deworming: Array.isArray(saved.deworming) ? saved.deworming : initialProfile.deworming,
  };
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatShortDate(date) {
  if (!date) return '日期待补充';
  const [, month, day] = date.split('-');
  return `${month} · ${day}`;
}

function latestWeight(profile) {
  const records = [...profile.weights].filter((item) => Number(item.kg) > 0).sort((a, b) => a.date.localeCompare(b.date));
  return records.at(-1) || null;
}

function App() {
  const [active, setActive] = useState('today');
  const [log, setLog] = useState(() => {
    try {
      return normalizeLog(JSON.parse(localStorage.getItem('westie-log')));
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
  const [profile, setProfile] = useState(() => {
    try {
      return normalizeProfile(JSON.parse(localStorage.getItem('westie-profile')));
    } catch {
      return initialProfile;
    }
  });
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkInType, setCheckInType] = useState('');
  const [planOpen, setPlanOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const age = getAge(profile.birthDate);

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

  const openCheckIn = (type = '') => {
    setCheckInType(type);
    setCheckInOpen(true);
  };

  const saveLog = (next, updatedTypes = []) => {
    const mergedEntries = [...new Set([...(next.entries || []), ...updatedTypes])];
    const savedLog = { ...next, entries: mergedEntries, lastUpdated: new Date().toISOString() };
    setLog(savedLog);
    localStorage.setItem('westie-log', JSON.stringify(savedLog));

    if (updatedTypes.includes('weight') && Number(next.weightKg) > 0) {
      const today = new Date().toISOString().slice(0, 10);
      const weights = profile.weights.filter((item) => item.date !== today);
      const nextProfile = { ...profile, weights: [...weights, { id: makeId('weight'), date: today, kg: Number(next.weightKg) }] };
      setProfile(nextProfile);
      localStorage.setItem('westie-profile', JSON.stringify(nextProfile));
    }

    setCheckInOpen(false);
    const names = { food: '饮食', water: '饮水', exercise: '活动', weight: '体重', health: '健康观察', care: '护理 / 用药' };
    showNotice(updatedTypes.length ? `已更新：${updatedTypes.map((type) => names[type]).join('、')}` : '今日记录已更新');
  };

  const savePlan = (next) => {
    setPlan(next);
    localStorage.setItem('westie-plan', JSON.stringify(next));
    setPlanOpen(false);
    showNotice('对比计划已更新');
  };

  const saveProfile = (next) => {
    const cleaned = {
      ...next,
      weights: next.weights.filter((item) => item.date && Number(item.kg) > 0).map((item) => ({ ...item, kg: Number(item.kg) })),
      vaccines: next.vaccines.filter((item) => String(item.name || '').trim()),
      deworming: next.deworming.filter((item) => String(item.name || '').trim()),
    };
    setProfile(cleaned);
    localStorage.setItem('westie-profile', JSON.stringify(cleaned));
    setProfileOpen(false);
    showNotice('西高地档案已保存');
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

  const openArticle = (articleId) => {
    const article = articleLibrary[articleId];
    if (article) setSelectedArticle(article);
  };

  const exportArchive = () => {
    const archive = {
      exportedAt: new Date().toISOString(),
      pet: profile,
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
      <Sidebar active={active} onNavigate={navigate} age={age} profile={profile} onExport={exportArchive} onHelp={() => openArticle('help')} onProfile={() => setProfileOpen(true)} />

      <main className="main-view">
        <Topbar
          active={active}
          onCheckIn={() => openCheckIn()}
          onPlan={() => setPlanOpen(true)}
          onMenu={() => setMobileMenu(!mobileMenu)}
          onNotify={() => showNotice('目前没有新的提醒')}
        />

        <div className="content-frame">
          {active === 'today' && (
            <Dashboard
              log={log}
              plan={plan}
              scores={scores}
              age={age}
              profile={profile}
              onCheckIn={() => openCheckIn()}
              onPlan={() => setPlanOpen(true)}
              onNavigate={navigate}
              showNotice={showNotice}
              onOpenArticle={openArticle}
            />
          )}
          {active === 'food' && <FoodPage log={log} plan={plan} profile={profile} onCheckIn={() => openCheckIn('food')} onPlan={() => setPlanOpen(true)} />}
          {active === 'exercise' && <ExercisePage log={log} plan={plan} onCheckIn={() => openCheckIn('exercise')} showNotice={showNotice} />}
          {active === 'health' && <HealthPage log={log} profile={profile} onCheckIn={() => openCheckIn('health')} onOpenArticle={openArticle} onEditProfile={() => setProfileOpen(true)} />}
          {active === 'grooming' && <GroomingPage log={log} setLog={(next) => saveLog(next, ['care'])} showNotice={showNotice} onOpenArticle={openArticle} />}
          {active === 'handbook' && <HandbookPage onOpenArticle={openArticle} />}
        </div>

        <MobileNav active={active} onNavigate={navigate} open={mobileMenu} onPlan={() => setPlanOpen(true)} />
      </main>

      {checkInOpen && <CheckInModal current={log} plan={plan} initialType={checkInType} onClose={() => setCheckInOpen(false)} onSave={saveLog} />}
      {planOpen && <PlanModal current={plan} onClose={() => setPlanOpen(false)} onSave={savePlan} />}
      {profileOpen && <ProfileModal current={profile} onClose={() => setProfileOpen(false)} onSave={saveProfile} />}
      {selectedArticle && <ArticleDrawer article={selectedArticle} onClose={() => setSelectedArticle(null)} onDone={() => { setSelectedArticle(null); showNotice('已完成阅读'); }} />}
      {notice && (
        <div className="toast" role="status">
          <span><Check size={15} strokeWidth={3} /></span>{notice}
        </div>
      )}
    </div>
  );
}

function Sidebar({ active, onNavigate, age, profile, onExport, onHelp, onProfile }) {
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
          <div><strong>{profile.petName || '你的小西'}</strong><span>{profile.sex || '性别待补充'} · {age.label}</span></div>
          <button aria-label="编辑宠物档案" onClick={onProfile}><PencilLine size={17} /></button>
        </div>
        <button className="quiet-link" onClick={onHelp}><CircleHelp size={18} />使用帮助</button>
        <button className="quiet-link" onClick={onExport}><Download size={18} />导出档案</button>
      </div>
    </aside>
  );
}

function Topbar({ active, onCheckIn, onPlan, onMenu, onNotify }) {
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
        <button className="icon-button" aria-label="通知" onClick={onNotify}><Bell size={19} /><i /></button>
        <button className="secondary-button" onClick={onPlan}><Target size={17} />对比计划</button>
        <button className="primary-button" onClick={onCheckIn}><Plus size={18} />记录今天</button>
      </div>
    </header>
  );
}

function Dashboard({ log, plan, scores, age, profile, onCheckIn, onPlan, onNavigate, showNotice, onOpenArticle }) {
  const exerciseGap = Math.max(plan.exercise - log.exercise, 0);
  const foodGap = log.food - plan.food;
  const entries = new Set(log.entries || []);
  const weights = [...profile.weights].filter((item) => Number(item.kg) > 0).sort((a, b) => a.date.localeCompare(b.date)).slice(-7);
  const currentWeight = weights.at(-1);
  const previousWeight = weights.length > 1 ? weights.at(-2) : null;
  const weightDelta = currentWeight && previousWeight ? Number(currentWeight.kg) - Number(previousWeight.kg) : null;
  const trendData = weights.map((item) => ({ day: item.date.slice(5).replace('-', '/'), weight: Number(item.kg) }));
  return (
    <div className="page dashboard-page">
      <section className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" />今天的成长简报</div>
          <h1>状态不错，<br />再补一点<em>探索</em>。</h1>
          <p>{entries.has('food') ? '饮食已有记录。' : '今天还没有饮食记录。'}{entries.has('health') || entries.has('water') ? '健康观察已更新。' : '健康状态不默认判断。'}今天还差 {exerciseGap} 分钟低强度活动，可按实际状态安排一次短嗅闻。</p>
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
            value={currentWeight ? Number(currentWeight.kg).toFixed(2) : '—'}
            unit="kg"
            target="看趋势"
            score={currentWeight ? 82 : 0}
            status={currentWeight ? `${formatShortDate(currentWeight.date)}记录` : '待补充'}
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
            <div><span className="eyebrow">成长趋势</span><h3>{weights.length > 1 ? '体重变化一眼看清' : '从第一条体重开始'}</h3></div>
            <div className="range-toggle"><button className="active">7 天</button><button onClick={() => showNotice('积累 30 天记录后会自动生成月趋势')}>30 天</button></div>
          </div>
          <div className="trend-summary">
            <strong>{currentWeight ? Number(currentWeight.kg).toFixed(2) : '—'} <small>kg</small></strong>
            <span><TrendingUp size={15} />{weightDelta === null ? `已记录 ${weights.length} 次` : `较上次 ${weightDelta >= 0 ? '+' : ''}${weightDelta.toFixed(2)} kg`}</span>
          </div>
          {trendData.length > 0 ? <LineChart data={trendData} /> : <div className="chart-empty"><Weight size={25} /><span>去“西高地档案”添加第一条体重</span></div>}
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
            <PriorityItem number="03" icon={Droplets} title={entries.has('health') || entries.has('water') ? '继续观察饮水和便便' : '有变化时再补健康记录'} body={entries.has('health') || entries.has('water') ? '连续变化比单次波动更有参考价值。' : '没有观察就保持空白，不把未填写当成正常。'} tone="mint" action="知道了" onAction={() => showNotice('已完成阅读')} />
          </div>
          <div className="safety-note"><ShieldCheck size={18} /><span><strong>健康边界</strong>持续呕吐、呼吸异常、虚弱、血便或明显疼痛，请直接联系兽医，不等待系统评分。</span></div>
        </div>
      </section>

      <section className="handbook-strip">
        <div><span className="eyebrow">每周精选</span><h2>把养护知识，变成今天能做的事</h2></div>
        <button className="text-button" onClick={() => onNavigate('handbook')}>打开养成手册<ArrowRight size={17} /></button>
        <div className="mini-guides">
          {guideCards.slice(0, 3).map((guide) => <MiniGuide key={guide.title} {...guide} onClick={() => onOpenArticle(guide.articleId)} />)}
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
    const x = data.length === 1 ? width / 2 : padX + (index * (width - padX * 2)) / (data.length - 1);
    const y = padY + ((max - d.weight) * (height - padY * 2)) / (max - min);
    return { x, y, ...d };
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = data.length > 1 ? `${path} L ${points[points.length - 1].x} ${height - 22} L ${points[0].x} ${height - 22} Z` : '';
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
        {area && <path d={area} fill="url(#chartArea)" />}
        {data.length > 1 && <path d={path} className="trend-line" />}
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

function MiniGuide({ tag, title, accent, icon: Icon, onClick }) {
  return (
    <button className={`mini-guide ${accent}`} onClick={onClick} aria-label={`阅读：${title}`}>
      <span className="guide-icon"><Icon size={18} /></span>
      <small>{tag}</small>
      <strong>{title}</strong>
      <ArrowRight size={17} />
    </button>
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

function FoodPage({ log, plan, profile, onCheckIn, onPlan }) {
  const remaining = Math.max(plan.food - feedings.filter((f) => f.done).reduce((sum, f) => sum + f.amount, 0), 0);
  const currentWeight = latestWeight(profile);
  const entries = new Set(log.entries || []);
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
          <div className="panel-heading"><div><span className="eyebrow">观察闭环</span><h3>今天的反馈</h3></div><span className="status-chip neutral">按实际记录</span></div>
          <div className="observation-grid">
            <Observation icon={Droplets} label="饮水变化" value={entries.has('water') ? ({ normal: '与平时相近', more: '明显变多', less: '明显变少' })[log.water] : '今天未记录'} recorded={entries.has('water')} />
            <Observation icon={Leaf} label="便便" value={entries.has('health') ? ({ good: '成形', soft: '偏软', warning: '异常' })[log.stool] : '今天未记录'} recorded={entries.has('health')} />
            <Observation icon={Bone} label="饮食总量" value={entries.has('food') ? `${log.food} g` : '今天未记录'} recorded={entries.has('food')} />
            <Observation icon={Weight} label="最近体重" value={currentWeight ? `${Number(currentWeight.kg).toFixed(2)} kg` : '待补充'} recorded={Boolean(currentWeight)} />
          </div>
          <div className="coach-note"><Sparkles size={18} /><p><strong>本周建议</strong>当前全天总量完成稳定。不要因为一顿剩粮立刻换粮；先结合连续记录判断。</p></div>
          <button className="outline-button full" onClick={onPlan}>调整我的饮食计划</button>
        </section>
      </div>
    </div>
  );
}

function ExercisePage({ log, plan, onCheckIn, showNotice }) {
  const percent = clamp(Math.round((log.exercise / plan.exercise) * 100));
  return (
    <div className="page module-page">
      <PageIntro eyebrow="运动与探索" title="短一点，开心一点" body="幼犬运动不追求刷里程。把自由嗅闻、轻游戏和正向训练拆成小段，让身体和大脑都有恢复时间。" action="记录活动" onAction={onCheckIn} />
      <div className="exercise-stage">
        <div className="activity-ring" style={{ '--percent': `${percent * 3.6}deg` }}><div><Activity size={25} /><strong>{log.exercise}</strong><span>/ {plan.exercise} 分钟</span></div></div>
        <div className="exercise-copy"><span className="status-chip mild">还差 {Math.max(plan.exercise - log.exercise, 0)} 分钟</span><h2>今晚去闻一闻风</h2><p>选择熟悉、安静的路线，让小西自己决定在哪停留。一次 8–10 分钟就能完成今天的计划。</p><button className="primary-button" onClick={() => showNotice('已安排今晚 20:30 自由嗅闻')}>安排 20:30 嗅闻<ArrowRight size={17} /></button></div>
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

function HealthPage({ log, profile, onCheckIn, onOpenArticle, onEditProfile }) {
  const entries = new Set(log.entries || []);
  const waterLabels = { normal: '与平时相近', more: '明显变多', less: '明显变少' };
  const stoolLabels = { good: '成形', soft: '偏软', warning: '异常' };
  const skinLabels = { normal: '无异常', itch: '偶尔抓挠', warning: '红 / 湿 / 臭' };
  const moodLabels = { bright: '活跃', quiet: '比平时安静', warning: '明显虚弱' };
  const hasObservation = entries.has('water') || entries.has('health');
  const hasWarning = log.stool === 'warning' || log.skin === 'warning' || log.mood === 'warning';
  const currentWeight = latestWeight(profile);
  const latestVaccine = profile.vaccines.at(-1);
  const latestDeworming = profile.deworming.at(-1);

  return (
    <div className="page module-page">
      <PageIntro eyebrow="健康管理" title="看见变化，而不是猜测" body="长期档案保存体重、疫苗和驱虫；每日记录只填写今天真正发生的事项。系统提示只做分流，不代替检查与诊断。" action="记录健康事项" onAction={onCheckIn} />
      <div className="health-overview">
        <div className="health-status-main"><span className="pulse-orb"><HeartPulse size={27} /></span><div><span className="eyebrow">今日观察</span><h2>{hasWarning ? '有一项需要继续关注' : hasObservation ? '今天的观察已经记录' : '今天还没有健康记录'}</h2><p>{hasObservation ? '这里只展示你主动记录的事项；没填写不等于默认正常。' : '有变化时再记录即可，不需要每天机械填写全部项目。'}</p></div><span className={`status-chip ${hasWarning ? 'mild' : 'good'}`}>{hasObservation ? <Check size={14} /> : <Plus size={14} />}{hasObservation ? (hasWarning ? '关注' : '已记录') : '可选记录'}</span></div>
        <div className="health-vitals">
          <Observation icon={Droplets} label="饮水变化" value={entries.has('water') ? waterLabels[log.water] : '今天未记录'} recorded={entries.has('water')} />
          <Observation icon={Leaf} label="便便" value={entries.has('health') ? stoolLabels[log.stool] : '今天未记录'} recorded={entries.has('health')} />
          <Observation icon={ThermometerSun} label="皮肤 / 耳朵" value={entries.has('health') ? skinLabels[log.skin] : '今天未记录'} recorded={entries.has('health')} />
          <Observation icon={Activity} label="精神" value={entries.has('health') ? moodLabels[log.mood] : '今天未记录'} recorded={entries.has('health')} />
        </div>
      </div>
      <div className="two-column health-columns">
        <section className="panel record-panel">
          <div className="panel-heading"><div><span className="eyebrow">可编辑档案</span><h3>体重、疫苗与驱虫</h3></div><button className="text-button muted" onClick={onEditProfile}><PencilLine size={15} />管理档案</button></div>
          <div className="record-timeline">
            <RecordItem date={currentWeight ? formatShortDate(currentWeight.date) : '待补充'} title={currentWeight ? `体重 ${Number(currentWeight.kg).toFixed(2)} kg` : '还没有体重记录'} body={currentWeight ? `档案中共 ${profile.weights.length} 条体重记录，可继续补录历史数据。` : '添加第一次称重后，首页会自动显示趋势。'} icon={Weight} />
            <RecordItem date={latestVaccine ? formatShortDate(latestVaccine.date) : '待补充'} title={latestVaccine?.name || '还没有疫苗记录'} body={latestVaccine ? `${latestVaccine.status}${latestVaccine.nextDate ? ` · 下次 ${latestVaccine.nextDate}` : ''}${latestVaccine.note ? ` · ${latestVaccine.note}` : ''}` : '可按疫苗本逐针补充日期、状态与下次安排。'} icon={ShieldCheck} />
            <RecordItem date={latestDeworming ? formatShortDate(latestDeworming.date) : '待补充'} title={latestDeworming?.name || '还没有驱虫记录'} body={latestDeworming ? `${latestDeworming.nextDate ? `下次 ${latestDeworming.nextDate}` : '未设置下次日期'}${latestDeworming.note ? ` · ${latestDeworming.note}` : ''}` : '添加体内或体外驱虫记录，后续日期会显示在周期护理。'} icon={Bone} />
          </div>
        </section>
        <section className="panel triage-panel">
          <div className="triage-top"><span className="metric-icon coral"><Bell size={18} /></span><div><span className="eyebrow">快速分流</span><h3>这些情况不要等评分</h3></div></div>
          <div className="red-flags"><span>呼吸困难</span><span>持续呕吐</span><span>明显虚弱</span><span>血便</span><span>抽搐或昏厥</span><span>疑似触电 / 中毒</span></div>
          <p>出现任一严重或快速恶化的症状，请立即联系急诊兽医。若怀疑咬到通电电线，先断电并避免接触裸线。</p>
          <button className="urgent-button" onClick={() => onOpenArticle('emergency')}><Stethoscope size={17} />查看紧急处置清单</button>
        </section>
      </div>
      <RecurringCare profile={profile} onEditProfile={onEditProfile} />
    </div>
  );
}

function RecurringCare({ profile, onEditProfile }) {
  const nextVaccine = profile.vaccines.find((item) => item.nextDate);
  const nextDeworming = profile.deworming.find((item) => item.nextDate);
  const items = [
    { day: '每周日', icon: Search, title: '耳朵与足间检查', meta: '轻量检查红、湿、异味和分泌物', tone: 'mint', status: '日常护理' },
    { day: '每月', icon: Weight, title: '体重与体况复盘', meta: '在相近时间、相同条件下称重', tone: 'blue', status: `${profile.weights.length} 条记录` },
    { day: nextVaccine?.nextDate || nextDeworming?.nextDate || '待补充', icon: ShieldCheck, title: '疫苗 / 驱虫安排', meta: nextVaccine ? `下次疫苗：${nextVaccine.name}` : nextDeworming ? `下次驱虫：${nextDeworming.name}` : '请按疫苗本与兽医日期设置', tone: 'gold', status: nextVaccine || nextDeworming ? '已设置' : '需要日期' },
  ];
  return (
    <section className="panel recurring-care">
      <div className="panel-heading"><div><span className="eyebrow">周期护理</span><h3>接下来不会漏掉的事</h3></div><button className="text-button muted" onClick={onEditProfile}><Plus size={15} />补充日期</button></div>
      <div className="recurring-grid">
        {items.map(({ day, icon: Icon, title, meta, tone, status }) => <article key={title}><span className={`metric-icon ${tone}`}><Icon size={18} /></span><div><small>{day}</small><strong>{title}</strong><p>{meta}</p></div><em>{status}</em></article>)}
      </div>
    </section>
  );
}

function GroomingPage({ log, setLog, showNotice, onOpenArticle }) {
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
        <CareCard icon={Sparkles} title="梳毛" cadence="每天 3–5 分钟" detail="轻柔分区，打结处不要硬拽。" status={log.brushed ? '已完成' : '今天待做'} onClick={() => onOpenArticle('brushing')} />
        <CareCard icon={Droplets} title="嘴边清洁" cadence="进食饮水后" detail="擦干比反复使用清洁剂更重要。" status="今天 2 次" onClick={() => onOpenArticle('mouth-cleaning')} />
        <CareCard icon={Search} title="耳朵 / 足间" cadence="每周检查" detail="看红、湿、异味和分泌物。" status="周日待查" onClick={() => onOpenArticle('ear-paw-check')} />
        <CareCard icon={Bone} title="口腔护理" cadence="逐步建立习惯" detail="使用犬用牙膏，从触碰训练开始。" status="训练中" onClick={() => onOpenArticle('dental-care')} />
      </div>
    </div>
  );
}

function HandbookPage({ onOpenArticle }) {
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
        <div className="featured-copy"><span className="eyebrow">本月成长主题</span><h2>从“喂饱”到“会观察”</h2><p>饮食管理真正有价值的部分，不只是精确到克，而是把克数、体况、便便和食欲放在同一张图里。</p><button className="light-button" onClick={() => onOpenArticle('featured')}>开始阅读<ArrowRight size={17} /></button></div>
        <div className="featured-orbit"><span>食欲</span><span>便便</span><span>体重</span><span>克数</span><div><Utensils size={28} /></div></div>
      </div>
      <div className="guide-grid">
        {filtered.length > 0 ? filtered.map((guide, index) => <GuideCard key={guide.title} {...guide} index={String(index + 1).padStart(2, '0')} onClick={() => onOpenArticle(guide.articleId)} />) : <div className="empty-state"><Search size={28} /><h3>暂时没有匹配内容</h3><p>换一个关键词，或切换到“全部”看看。</p></div>}
      </div>
      <div className="source-note"><Info size={17} /><p><strong>关于“标准”</strong>手册会区分产品喂养表、个人计划值、成长趋势和兽医判断。不同粮型、体况和健康史不能共用一个万能数字。</p></div>
    </div>
  );
}

function GuideCard({ tag, title, body, time, accent, icon: Icon, index, onClick }) {
  return (
    <article className="guide-card">
      <div className={`guide-cover ${accent}`}><span>{index}</span><Icon size={32} /><i /></div>
      <div className="guide-card-body"><div><span className="status-chip neutral">{tag}</span><small>{time}阅读</small></div><h3>{title}</h3><p>{body}</p><button onClick={onClick}>阅读手册<ArrowRight size={16} /></button></div>
    </article>
  );
}

function Observation({ icon: Icon, label, value, recorded = true }) {
  return <div className={`observation ${recorded ? '' : 'is-empty'}`}><span><Icon size={18} /></span><div><small>{label}</small><strong>{value}</strong></div>{recorded ? <Check size={15} /> : <Minus size={15} />}</div>;
}

function ActivityCard({ icon: Icon, title, value, tag, tone }) {
  return <article className="activity-card"><span className={`metric-icon ${tone}`}><Icon size={19} /></span><small>{title}</small><strong>{value}</strong><p><Check size={14} />{tag}</p></article>;
}

function RecordItem({ date, title, body, icon: Icon }) {
  return <div className="record-item"><time>{date}</time><span><Icon size={16} /></span><div><strong>{title}</strong><p>{body}</p></div></div>;
}

function CareCard({ icon: Icon, title, cadence, detail, status, onClick }) {
  return <article className="care-card"><span className="care-icon"><Icon size={20} /></span><div className="care-head"><strong>{title}</strong><span>{status}</span></div><b>{cadence}</b><p>{detail}</p><button onClick={onClick}>查看方法<ArrowRight size={15} /></button></article>;
}

function ArticleDrawer({ article, onClose, onDone }) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div className="article-layer" role="dialog" aria-modal="true" aria-label={article.title}>
      <button className="article-backdrop" onClick={onClose} aria-label="关闭文章" />
      <article className="article-drawer">
        <header className="article-header">
          <div className="article-meta"><span>{article.tag}</span><i /><span>{article.time}</span></div>
          <button className="close-button" onClick={onClose} aria-label="关闭"><X size={20} /></button>
          <h2>{article.title}</h2>
          <p>{article.intro}</p>
        </header>

        <div className="article-body">
          <div className="article-reading-line"><span>WESTIE HANDBOOK</span><i /></div>
          {article.sections.map((section, index) => (
            <section className="article-section" key={section.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><h3>{section.title}</h3><p>{section.body}</p></div>
            </section>
          ))}

          {article.checklist && (
            <section className="article-checklist">
              <div><Check size={18} /><h3>照着做</h3></div>
              <ul>{article.checklist.map((item) => <li key={item}><span><Check size={12} /></span>{item}</li>)}</ul>
            </section>
          )}

          {article.warning && <div className="article-warning"><ShieldCheck size={19} /><p><strong>需要升级处理</strong>{article.warning}</p></div>}

          {article.source && (
            <section className="article-sources">
              <span>参考来源</span>
              {article.source.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label}<ArrowRight size={14} /></a>)}
            </section>
          )}
        </div>

        <footer className="article-footer">
          <span><BookOpen size={17} />已读到文章末尾</span>
          <button className="primary-button large" onClick={onDone}><Check size={17} />完成阅读</button>
        </footer>
      </article>
    </div>
  );
}

function CheckInModal({ current, plan, initialType, onClose, onSave }) {
  const [draft, setDraft] = useState(current);
  const [selected, setSelected] = useState(initialType ? [initialType] : []);
  const set = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));
  const choices = [
    { id: 'food', icon: Utensils, title: '饮食', hint: '今天实际吃了多少' },
    { id: 'water', icon: Droplets, title: '饮水变化', hint: '只有有观察时才记' },
    { id: 'exercise', icon: Activity, title: '活动', hint: '嗅闻、游戏或训练' },
    { id: 'weight', icon: Weight, title: '体重', hint: '称重时再补一条' },
    { id: 'health', icon: HeartPulse, title: '便便与状态', hint: '有变化或想留档时记录' },
    { id: 'care', icon: Sparkles, title: '护理 / 用药', hint: '梳毛、用药或备注' },
  ];
  const healthOptions = {
    stool: [['good', '成形'], ['soft', '偏软'], ['warning', '异常']],
    skin: [['normal', '无异常'], ['itch', '偶尔抓挠'], ['warning', '红 / 湿 / 臭']],
    mood: [['bright', '活跃'], ['quiet', '比平时安静'], ['warning', '明显虚弱']],
  };
  const toggle = (id) => setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  const hasWarning = draft.stool === 'warning' || draft.skin === 'warning' || draft.mood === 'warning';

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label="记录今天">
      <button className="modal-backdrop" onClick={onClose} aria-label="关闭" />
      <div className="modal-card record-modal">
        <div className="modal-header"><div><span className="eyebrow">按事项记录</span><h2>今天要补充哪件事？</h2><p>不需要每天填写整张表。点选今天真实发生的事项，只更新这些内容。</p></div><button className="close-button" onClick={onClose} aria-label="关闭"><X size={20} /></button></div>
        <div className="record-picker">
          {choices.map(({ id, icon: Icon, title, hint }) => <button type="button" className={selected.includes(id) ? 'active' : ''} onClick={() => toggle(id)} key={id}><span><Icon size={18} /></span><strong>{title}</strong><small>{hint}</small><i>{selected.includes(id) && <Check size={13} />}</i></button>)}
        </div>
        <div className="modal-body record-fields">
          {selected.length === 0 && <div className="record-empty"><PawPrint size={24} /><div><strong>先选一项再记录</strong><span>比如今天只称了体重，就只选“体重”。</span></div></div>}
          {selected.includes('food') && <section className="record-section"><div className="record-section-title"><Utensils size={17} /><strong>饮食</strong><span>更新今天的全天实际总量</span></div><NumberField icon={Utensils} label="全天饮食" value={draft.food} unit="g" target={`当前计划 ${plan.food} g`} onChange={(v) => set('food', v)} /></section>}
          {selected.includes('water') && <section className="record-section"><div className="record-section-title"><Droplets size={17} /><strong>饮水变化</strong><span>不要求估算毫升，和它自己平时比较</span></div><div className="choice-field"><div>{[['normal', '与平时相近'], ['more', '明显变多'], ['less', '明显变少']].map(([value, label]) => <button type="button" className={draft.water === value ? 'active' : ''} onClick={() => set('water', value)} key={value}>{draft.water === value && <Check size={14} />}{label}</button>)}</div></div></section>}
          {selected.includes('exercise') && <section className="record-section"><div className="record-section-title"><Activity size={17} /><strong>活动</strong><span>嗅闻、游戏和训练时间可合并记录</span></div><NumberField icon={Activity} label="轻度活动" value={draft.exercise} unit="分钟" target={`当前计划 ${plan.exercise} 分钟`} onChange={(v) => set('exercise', v)} /></section>}
          {selected.includes('weight') && <section className="record-section"><div className="record-section-title"><Weight size={17} /><strong>体重</strong><span>保存后同时进入长期档案</span></div><NumberField icon={Weight} label="本次体重" value={draft.weightKg ?? ''} unit="kg" target="建议在相近条件下称重" step={0.05} onChange={(v) => set('weightKg', v)} /></section>}
          {selected.includes('health') && <section className="record-section"><div className="record-section-title"><HeartPulse size={17} /><strong>便便与状态</strong><span>只记录你今天实际观察到的情况</span></div>{Object.entries(healthOptions).map(([key, options]) => <div className="choice-field" key={key}><label>{({ stool: '便便', skin: '皮肤 / 耳朵', mood: '精神状态' })[key]}</label><div>{options.map(([value, label]) => <button type="button" className={draft[key] === value ? 'active' : ''} onClick={() => set(key, value)} key={value}>{draft[key] === value && <Check size={14} />}{label}</button>)}</div></div>)}{hasWarning && <div className="form-warning"><Bell size={17} /><span><strong>记录里有需要关注的信号</strong>如果症状严重、快速恶化，或伴随呼吸异常、虚弱、持续呕吐，请直接联系兽医。</span></div>}</section>}
          {selected.includes('care') && <section className="record-section"><div className="record-section-title"><Sparkles size={17} /><strong>护理 / 用药</strong><span>把今天真正完成的护理留下来</span></div><label className="check-row"><input type="checkbox" checked={draft.brushed} onChange={(e) => set('brushed', e.target.checked)} /><span><i><Sparkles size={18} /></i><b>今天已梳毛</b><small>包括耳后、腋下和四肢检查</small></span><em><Check size={15} /></em></label><label className="text-entry"><span>用药或护理内容</span><input value={draft.medication || ''} onChange={(e) => set('medication', e.target.value)} placeholder="例如：体外驱虫、滴耳液" /></label><label className="text-entry"><span>补充备注</span><textarea value={draft.note || ''} onChange={(e) => set('note', e.target.value)} placeholder="有需要再写，不是必填" /></label></section>}
        </div>
        <div className="modal-footer"><button className="secondary-button" onClick={onClose}>稍后再记</button><button className="primary-button large" disabled={selected.length === 0} onClick={() => onSave(draft, selected)}><Check size={17} />保存所选事项</button></div>
      </div>
    </div>
  );
}

function ProfileModal({ current, onClose, onSave }) {
  const [draft, setDraft] = useState(current);
  const [tab, setTab] = useState('basic');
  const set = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));
  const updateList = (list, id, key, value) => setDraft((prev) => ({ ...prev, [list]: prev[list].map((item) => item.id === id ? { ...item, [key]: value } : item) }));
  const removeListItem = (list, id) => setDraft((prev) => ({ ...prev, [list]: prev[list].filter((item) => item.id !== id) }));
  const addWeight = () => setDraft((prev) => ({ ...prev, weights: [...prev.weights, { id: makeId('weight'), date: new Date().toISOString().slice(0, 10), kg: '' }] }));
  const addCareRecord = (list) => setDraft((prev) => ({ ...prev, [list]: [...prev[list], { id: makeId(list), name: '', date: '', status: list === 'vaccines' ? '已完成' : '', nextDate: '', note: '' }] }));

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label="编辑西高地档案">
      <button className="modal-backdrop" onClick={onClose} aria-label="关闭" />
      <div className="modal-card profile-modal">
        <div className="modal-header profile-modal-head"><div><span className="eyebrow">长期档案 · 本机保存</span><h2>西高地档案</h2><p>这里保存不会每天重复填写的信息。体重、疫苗和驱虫可以随时补录或修改。</p></div><button className="close-button" onClick={onClose} aria-label="关闭"><X size={20} /></button></div>
        <div className="profile-tabs" role="tablist">
          <button className={tab === 'basic' ? 'active' : ''} onClick={() => setTab('basic')}><PawPrint size={16} />基础资料</button>
          <button className={tab === 'weight' ? 'active' : ''} onClick={() => setTab('weight')}><Weight size={16} />体重记录 <span>{draft.weights.length}</span></button>
          <button className={tab === 'care' ? 'active' : ''} onClick={() => setTab('care')}><ShieldCheck size={16} />疫苗与驱虫 <span>{draft.vaccines.length + draft.deworming.length}</span></button>
        </div>
        <div className="modal-body profile-body">
          {tab === 'basic' && (
            <section className="profile-form-grid">
              <ProfileField label="昵称" value={draft.petName} onChange={(value) => set('petName', value)} placeholder="例如：小西" />
              <ProfileField label="品种" value={draft.breed} onChange={(value) => set('breed', value)} />
              <label className="profile-field"><span>性别</span><select value={draft.sex} onChange={(e) => set('sex', e.target.value)}><option>公犬</option><option>母犬</option><option>待确认</option></select></label>
              <ProfileField label="出生日期" type="date" value={draft.birthDate} onChange={(value) => set('birthDate', value)} />
              <ProfileField label="芯片号（可选）" value={draft.microchip} onChange={(value) => set('microchip', value)} placeholder="有芯片时再补充" wide />
              <label className="profile-field wide"><span>档案备注</span><textarea value={draft.notes} onChange={(e) => set('notes', e.target.value)} placeholder="绝育、过敏史、常用医院等长期信息" /></label>
            </section>
          )}

          {tab === 'weight' && (
            <section className="profile-record-section">
              <div className="profile-section-head"><div><strong>体重记录</strong><span>每条都可修改；首页趋势会使用最近 7 条有效记录。</span></div><button className="outline-button" onClick={addWeight}><Plus size={16} />添加体重</button></div>
              <div className="profile-record-list">
                {draft.weights.length === 0 && <ProfileEmpty icon={Weight} text="还没有体重记录" />}
                {[...draft.weights].sort((a, b) => b.date.localeCompare(a.date)).map((item) => <div className="weight-record-row" key={item.id}><label><span>日期</span><input type="date" value={item.date} onChange={(e) => updateList('weights', item.id, 'date', e.target.value)} /></label><label><span>体重</span><div><input type="number" min="0" step="0.05" value={item.kg} onChange={(e) => updateList('weights', item.id, 'kg', e.target.value)} /><em>kg</em></div></label><button className="remove-record" onClick={() => removeListItem('weights', item.id)} aria-label="删除这条体重记录"><X size={16} /></button></div>)}
              </div>
            </section>
          )}

          {tab === 'care' && (
            <div className="care-record-groups">
              <CareRecordEditor title="疫苗记录" hint="建议按疫苗本逐针填写名称和日期" list="vaccines" items={draft.vaccines} onAdd={() => addCareRecord('vaccines')} onUpdate={updateList} onRemove={removeListItem} showStatus />
              <CareRecordEditor title="驱虫记录" hint="体内、体外可以分别记录" list="deworming" items={draft.deworming} onAdd={() => addCareRecord('deworming')} onUpdate={updateList} onRemove={removeListItem} />
            </div>
          )}
        </div>
        <div className="modal-footer"><button className="secondary-button" onClick={onClose}>取消</button><button className="primary-button large" onClick={() => onSave(draft)}><Check size={17} />保存档案</button></div>
      </div>
    </div>
  );
}

function ProfileField({ label, value, onChange, type = 'text', placeholder = '', wide = false }) {
  return <label className={`profile-field ${wide ? 'wide' : ''}`}><span>{label}</span><input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></label>;
}

function ProfileEmpty({ icon: Icon, text }) {
  return <div className="profile-empty"><Icon size={21} /><span>{text}</span></div>;
}

function CareRecordEditor({ title, hint, list, items, onAdd, onUpdate, onRemove, showStatus = false }) {
  return (
    <section className="care-record-editor">
      <div className="profile-section-head"><div><strong>{title}</strong><span>{hint}</span></div><button className="outline-button" onClick={onAdd}><Plus size={16} />添加一条</button></div>
      <div className="care-record-list">
        {items.length === 0 && <ProfileEmpty icon={ShieldCheck} text={`还没有${title}`} />}
        {items.map((item) => <article className="care-record-row" key={item.id}>
          <div className="care-record-top"><ProfileField label="名称" value={item.name} onChange={(value) => onUpdate(list, item.id, 'name', value)} placeholder={list === 'vaccines' ? '例如：狂犬疫苗' : '例如：体内驱虫'} wide /><button className="remove-record" onClick={() => onRemove(list, item.id)} aria-label={`删除这条${title}`}><X size={16} /></button></div>
          <div className="care-record-fields"><ProfileField label="完成日期" type="date" value={item.date} onChange={(value) => onUpdate(list, item.id, 'date', value)} />{showStatus && <label className="profile-field"><span>状态</span><select value={item.status} onChange={(e) => onUpdate(list, item.id, 'status', e.target.value)}><option>已完成</option><option>进行中</option><option>待确认</option></select></label>}<ProfileField label="下次日期（可选）" type="date" value={item.nextDate} onChange={(value) => onUpdate(list, item.id, 'nextDate', value)} /><ProfileField label="备注（可选）" value={item.note} onChange={(value) => onUpdate(list, item.id, 'note', value)} placeholder="品牌、批次或兽医建议" /></div>
        </article>)}
      </div>
    </section>
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

function NumberField({ icon: Icon, label, value, unit, target, onChange, step = 1 }) {
  const numericValue = Number(value) || 0;
  const changeBy = (direction) => onChange(Math.max(0, Number((numericValue + direction * step).toFixed(2))));
  return (
    <div className="number-field">
      <span className="metric-icon mint"><Icon size={19} /></span>
      <div><strong>{label}</strong><small>{target}</small></div>
      <div className="stepper"><button type="button" onClick={() => changeBy(-1)}><Minus size={16} /></button><label><input type="number" value={value} min="0" step={step} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} /><span>{unit}</span></label><button type="button" onClick={() => changeBy(1)}><Plus size={16} /></button></div>
    </div>
  );
}

function MobileNav({ active, onNavigate, open, onPlan }) {
  const visible = navItems.slice(0, 5);
  return (
    <>
      <nav className="mobile-nav">{visible.map(({ id, label, icon: Icon }) => <button key={id} className={active === id ? 'active' : ''} onClick={() => onNavigate(id)}><Icon size={19} /><span>{label}</span></button>)}</nav>
      {open && <div className="mobile-menu-pop"><button onClick={() => onNavigate('handbook')}><BookOpen size={19} />手册</button><button onClick={onPlan}><Settings size={19} />设置计划</button></div>}
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
