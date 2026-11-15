import { useLayoutEffect, useRef, useState } from 'react';
import { motion, type MotionProps, type MotionStyle, type MotionValue, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Check, MessageCircle, Phone } from 'lucide-react';
import { Doodle } from './Doodle';
import { InkHeading } from './InkHeading';
import { copyText } from './copy-text';
import { imageFor, projects, type Project } from './data';
import { sitePath } from './site-path';
import './portfolio-home.css';

const categories = ['全部', '产品体验', '数字可视化', 'AI Agent'];
const capabilities = [
  ['产品体验设计', '梳理产品架构、核心流程与界面交互。'],
  ['设计系统与视觉', '通过一致的设计语言组织复杂系统。'],
  ['数字可视化', '连接空间、设备与数据，梳理信息层级。'],
  ['AI 应用探索', '连接 Agent、业务工具与真实工作流程。'],
];

function projectHref(project: Project) {
  return sitePath(`projects/${project.slug}/`);
}

const revealEase = [.22, 1, .36, 1] as const;

function enterOnLoad(reduced: boolean | null, delay: number, rise = 18): MotionProps {
  if (reduced) return {};
  return {
    initial: { opacity: 0, y: rise },
    animate: { opacity: 1, y: 0 },
    transition: { duration: .85, delay, ease: revealEase },
  };
}

function enterOnScroll(reduced: boolean | null, delay = 0, rise = 24): MotionProps {
  if (reduced) return {};
  return {
    initial: { opacity: 0, y: rise },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: .2 },
    transition: { duration: .9, delay, ease: revealEase },
  };
}

function Opening() {
  const track = useRef<HTMLElement>(null);
  const portrait = useRef<HTMLDivElement>(null);
  const portraitInView = useInView(portrait);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  const desktopCut = useTransform(scrollYProgress, [0, .15, .9], [
    'inset(30% 43.4% round 72px)', 'inset(30% 43.4% round 72px)', 'inset(0% 0% round 0px)',
  ]);
  const mobileCut = useTransform(scrollYProgress, [0, .12, .9], [
    'inset(34% 35% round 54px)', 'inset(34% 35% round 54px)', 'inset(0% 0% round 0px)',
  ]);
  const introOpacity = useTransform(scrollYProgress, [0, .35, .6], [1, 1, 0]);
  const mediaScale = useTransform(scrollYProgress, [0, .9], [1.08, 1]);
  const mediaPan = useTransform(scrollYProgress, [0, .15, .9], ['-21%', '-21%', '0%']);
  const cover = imageFor(projects[0].pages[0]);

  return (
    <section className="folio-opening" ref={track} aria-label="陈小黑的设计作品集">
      <div className="folio-opening-screen">
        <motion.div className="folio-opening-copy" style={reduced ? undefined : { opacity: introOpacity }}>
          <motion.div className="folio-name" {...enterOnLoad(reduced, .08)}>
            <Doodle name="hey" className="folio-hey" />
            <InkHeading as="h1" lines={["I'm Chen", ' Xiao Hei.']} />
          </motion.div>
          <div className="folio-intro">
            <motion.div className="folio-intro-portrait" ref={portrait} data-moving={portraitInView} {...enterOnLoad(reduced, .59)}><Doodle name="portrait" /></motion.div>
            <motion.p {...enterOnLoad(reduced, .76)}>我是陈小黑，<br />专注于<strong>产品体验、视觉设计<br className="folio-intro-break" />与 AI 应用实践</strong>。</motion.p>
          </div>
        </motion.div>
        <motion.div className="folio-window" aria-hidden="true" {...enterOnLoad(reduced, .36, 0)}
          style={reduced ? undefined : { '--desktop-cut': desktopCut, '--mobile-cut': mobileCut } as MotionStyle & Record<`--${string}`, MotionValue<string>>}
        >
          <motion.img src={cover} alt="" fetchPriority="high" style={reduced ? undefined : { scale: mediaScale, '--opening-pan': mediaPan } as MotionStyle & Record<`--${string}`, MotionValue<string>>} />
        </motion.div>
        <motion.a className="folio-scroll" href="#work" {...enterOnLoad(reduced, 1, 8)}><ArrowDown size={16} aria-hidden="true" /> 看作品</motion.a>
      </div>
    </section>
  );
}

function Works({ reduced }: { reduced: boolean | null }) {
  const [category, setCategory] = useState(categories[0]);
  const [selected, setSelected] = useState(projects[0]);
  const cover = imageFor(selected.pages[0]);
  const portraitCover = selected.category !== '产品体验';
  const visible = projects.filter(project => category === categories[0] || project.category === category);

  function changeCategory(next: string) {
    setCategory(next);
    if (next !== categories[0] && selected.category !== next) {
      setSelected(projects.find(project => project.category === next)!);
    }
  }

  return (
    <section id="work" className="folio-work" aria-labelledby="folio-work-title">
      <div className="folio-wrap">
        <div className="folio-work-bar">
          <InkHeading as="h2" id="folio-work-title" lines={[<>精选作品<span className="folio-work-count">（06）</span></>]} />
          <motion.div className="folio-filters" role="group" aria-label="作品分类" {...enterOnScroll(reduced, .16, 10)}>
            {categories.map(item => (
              <button key={item} type="button" aria-pressed={category === item} onClick={() => changeCategory(item)}>
                {item}
              </button>
            ))}
          </motion.div>
        </div>
        <motion.div className="folio-stage" {...enterOnScroll(reduced, .08)}>
          <a className="folio-preview" href={projectHref(selected)} aria-label={`查看项目：${selected.name}`}>
            <div className={portraitCover ? "folio-preview-media is-portrait" : "folio-preview-media"} style={{ backgroundImage: `url(${cover})` }}>
              <img key={selected.slug} src={cover} alt={selected.name} loading="lazy" />
            </div>
            <span className="folio-view-case">查看项目 <ArrowUpRight size={16} aria-hidden="true" /></span>
          </a>
          <motion.div className="folio-projects" role="group" aria-label="切换作品预览" {...enterOnScroll(reduced, .22, 14)}>
            {visible.map(project => (
              <button key={project.slug} type="button" aria-pressed={project === selected}
                onClick={() => setSelected(project)}
                onPointerEnter={event => { if (event.pointerType === 'mouse') setSelected(project); }}>
                <span>{project.name}</span><ArrowUpRight size={17} aria-hidden="true" />
              </button>
            ))}
          </motion.div>
          <motion.div className="folio-project-summary" aria-live="polite" {...enterOnScroll(reduced, .24, 10)}>
            <span>{selected.category}</span>
            <p>{selected.intro}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Contact({ reduced }: { reduced: boolean | null }) {
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section, { amount: .15 });
  const [notice, setNotice] = useState<{ text: string; copied: boolean } | null>(null);

  async function copyWeChat() {
    try {
      await copyText('potatoandle');
      setNotice({ text: '微信号已复制：potatoandle', copied: true });
    } catch {
      setNotice({ text: '请手动复制微信号：potatoandle', copied: false });
    }
  }

  return (
    <section id="contact" ref={section} className="folio-contact" aria-labelledby="folio-contact-title">
      <motion.div className="folio-contact-doodles" data-moving={inView} aria-hidden="true" {...enterOnScroll(reduced, .28, 0)}>
        <Doodle name="portrait" className="folio-sketch-portrait" />
        <Doodle name="pencil" className="folio-sketch-pencil" />
        <Doodle name="chat" className="folio-sketch-chat" />
        <Doodle name="spark" className="folio-sketch-spark" />
      </motion.div>
      <InkHeading as="h2" id="folio-contact-title" lines={['让好的想法，', '成为好的体验。']} />
      <motion.div className="folio-contact-actions" {...enterOnScroll(reduced, .2, 14)}>
        <button type="button" onClick={copyWeChat}><MessageCircle size={21} aria-hidden="true" /> 获取微信联系方式</button>
        <a href="tel:13524542838"><Phone size={21} aria-hidden="true" /> 135 2454 2838</a>
      </motion.div>
      <p className="folio-contact-status" role="status">{notice?.copied && <Check size={16} aria-hidden="true" />}{notice?.text}</p>
      <footer className="folio-footer"><span>© {new Date().getFullYear()} CHEN XIAO HEI</span><a href="#top">回到顶部 ↑</a></footer>
    </section>
  );
}

export function PortfolioHome() {
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (root.hasAttribute('data-home-reload')) {
      // Position the opening before showing the mounted React tree.
      window.scrollTo({ top: 0, behavior: 'instant' });
      root.removeAttribute('data-home-reload');
      return;
    }

    const anchor = window.location.hash.slice(1);
    if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: 'instant' });
  }, []);

  return (
    <div id="top" className="folio">
      <a className="skip" href="#main">跳转到内容</a>
      <header className="folio-nav">
        <nav aria-label="主导航">
          <a href="#work">作品</a>
          <a href="#top"><Doodle name="portrait" /> 陈小黑</a>
          <a href="#contact">联系</a>
        </nav>
      </header>
      <main id="main">
        <Opening />
        <Works reduced={reduced} />
        <section id="about" className="folio-about folio-wrap">
          <Doodle name="spark" className="folio-about-sketch" />
          <InkHeading as="h2" lines={['界面之外，', '看见真实需求。']} />
          <motion.p {...enterOnScroll(reduced, .15)}>我是陈小黑，专注于产品体验、视觉设计与 AI 应用实践。我从业务目标与用户问题出发，梳理信息架构、核心流程与关键交互，把复杂业务转化为清晰、连贯的产品体验。</motion.p>
          <motion.a href="#expertise" {...enterOnScroll(reduced, .27, 10)}>设计能力 <ArrowDown size={16} aria-hidden="true" /></motion.a>
        </section>
        <section id="expertise" className="folio-expertise folio-wrap">
          <InkHeading as="h2" lines={['让体验、视觉与 AI', <>落在真实业务里<span className="folio-expertise-accent">。</span></>]} />
          <div className="folio-capabilities">
            {capabilities.map(([title, text], index) => (
              <motion.div key={title} {...enterOnScroll(reduced, .09 * index, 16)}><h3>{title}</h3><p>{text}</p></motion.div>
            ))}
          </div>
        </section>
        <Contact reduced={reduced} />
      </main>
    </div>
  );
}
