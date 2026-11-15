import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { imageFor, type Project } from './data';

export function ProjectIndex({ items, href, navigate, reduced }: {
  items: Project[];
  href: (project: Project) => string;
  navigate: (path: string) => void;
  reduced: boolean | null;
}) {
  const [selected, setSelected] = useState(items[0].slug);
  const project = items.find(item => item.slug === selected) ?? items[0];


  return (
    <div className="project-index" aria-label="作品预览">
      <div className="project-index-options" role="group" aria-label="切换预览">
        {items.map(item => (
          <button key={item.slug} type="button" aria-pressed={item === project} onClick={() => setSelected(item.slug)}>
            <span>{item.name}</span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </button>
        ))}
      </div>
      <motion.a
        className="project-index-preview"
        href={href(project)}
        aria-label={`打开预览项目：${project.name}`}
        initial={reduced ? false : { clipPath: 'inset(5% 4% round 18px)' }}
        whileInView={{ clipPath: 'inset(0% round 18px)' }}
        viewport={{ once: true, amount: .2 }}
        transition={reduced ? { duration: 0 } : { duration: .65, ease: [.22, 1, .36, 1] }}
        onClick={event => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          navigate(href(project));
        }}
      >
        <div className="project-index-image" style={{ backgroundImage: `url(${imageFor(project.pages[0])})` }}>
          <img key={project.slug} src={imageFor(project.pages[0])} alt={project.name} loading="lazy" />
        </div>
        <span className="project-index-caption">{project.category}<span>查看项目 <ArrowUpRight size={16} /></span></span>
      </motion.a>
    </div>
  );
}
