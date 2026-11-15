import { useRef, useState } from 'react';
import { motion, type MotionStyle, type MotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Check, MessageCircle, Phone, X } from 'lucide-react';
import { Doodle } from './Doodle';
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

function Opening() {
  const track = useRef<HTMLElement>(null);
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
          <div className="folio-name">
            <Doodle name="hey" className="folio-hey" />
            <h1>I'm Chen<br /> Xiao Hei.</h1>
          </div>
          <div className="folio-intro">
            <Doodle name="portrait" />
            <p>我是陈小黑，<br />专注于<strong>产品体验、视觉设计<br className="folio-intro-break" />与 AI 应用实践</strong>。</p>
          </div>
        </motion.div>
        <motion.div className="folio-window" aria-hidden="true"
          style={reduced ? undefined : { '--desktop-cut': desktopCut, '--mobile-cut': mobileCut } as MotionStyle & Record<`--${string}`, MotionValue<string>>}
        >
          <motion.img src={cover} alt="" fetchPriority="high" style={reduced ? undefined : { scale: mediaScale, '--opening-pan': mediaPan } as MotionStyle & Record<`--${string}`, MotionValue<string>>} />
        </motion.div>
        <a className="folio-scroll" href="#work"><ArrowDown size={16} aria-hidden="true" /> 看作品</a>
      </div>
    </section>
  );
}

function Works() {
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
          <h2 id="folio-work-title">精选作品<span>（06）</span></h2>
          <div className="folio-filters" role="group" aria-label="作品分类">
            {categories.map(item => (
              <button key={item} type="button" aria-pressed={category === item} onClick={() => changeCategory(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="folio-stage">
          <a className="folio-preview" href={projectHref(selected)} aria-label={`查看项目：${selected.name}`}>
            <div className={portraitCover ? "folio-preview-media is-portrait" : "folio-preview-media"} style={{ backgroundImage: `url(${cover})` }}>
              <img key={selected.slug} src={cover} alt={selected.name} loading="lazy" />
            </div>
            <span className="folio-view-case">查看项目 <ArrowUpRight size={16} aria-hidden="true" /></span>
          </a>
          <div className="folio-projects" role="group" aria-label="切换作品预览">
            {visible.map(project => (
              <button key={project.slug} type="button" aria-pressed={project === selected}
                onClick={() => setSelected(project)}
                onPointerEnter={event => { if (event.pointerType === 'mouse') setSelected(project); }}>
                <span>{project.name}</span><ArrowUpRight size={17} aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="folio-project-summary" aria-live="polite">
            <span>{selected.category}</span>
            <p>{selected.intro}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
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
    <section id="contact" className="folio-contact" aria-labelledby="folio-contact-title">
      <div className="folio-contact-doodles" aria-hidden="true">
        <Doodle name="portrait" className="folio-sketch-portrait" />
        <Doodle name="pencil" className="folio-sketch-pencil" />
        <Doodle name="chat" className="folio-sketch-chat" />
        <Doodle name="spark" className="folio-sketch-spark" />
      </div>
      <h2 id="folio-contact-title">让好的想法，<br />成为好的体验。</h2>
      <div className="folio-contact-actions">
        <button type="button" onClick={copyWeChat}><MessageCircle size={21} aria-hidden="true" /> 获取微信联系方式</button>
        <a href="tel:13524542838"><Phone size={21} aria-hidden="true" /> 135 2454 2838</a>
      </div>
      <p className="folio-contact-status" role="status">{notice?.copied && <Check size={16} aria-hidden="true" />}{notice?.text}</p>
      <footer className="folio-footer"><span>© {new Date().getFullYear()} CHEN XIAO HEI</span><a href="#top">回到顶部 ↑</a></footer>
    </section>
  );
}

export function PortfolioHome() {
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
        <Works />
        <section id="about" className="folio-about folio-wrap">
          <Doodle name="spark" className="folio-about-sketch" />
          <h2>界面之外，<br />看见真实需求。</h2>
          <p>我是陈小黑，专注于产品体验、视觉设计与 AI 应用实践。我从业务目标与用户问题出发，梳理信息架构、核心流程与关键交互，把复杂业务转化为清晰、连贯的产品体验。</p>
          <a href="#expertise">设计能力 <ArrowDown size={16} aria-hidden="true" /></a>
        </section>
        <section id="expertise" className="folio-expertise folio-wrap">
          <h2>让体验、视觉与 AI<br />落在真实业务里<span>。</span></h2>
          <div className="folio-capabilities">
            {capabilities.map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}
          </div>
        </section>
        <Contact />
      </main>
    </div>
  );
}
