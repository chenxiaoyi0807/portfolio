import { sitePath } from './site-path';

export const figmaUrl='https://www.figma.com/design/w0mHcxYlRKveU6HnJxsf5r/作品集?node-id=0-1';
export type Project={slug:string;name:string;en:string;category:string;tags:string[];intro:string;pages:number[];chapters:{page:number;title:string}[];color:string};
const range=(a:number,b:number)=>Array.from({length:b-a+1},(_,i)=>a+i);
export const projects:Project[]=[
{slug:'charging',name:'充电小程序',en:'A better way to recharge.',category:'产品体验',tags:['新能源','小程序','0—1 全流程设计'],intro:'以政务新能源出行为核心，串联站点查询、智能导航、扫码充电与订单管理，让每一次补能更清晰、便捷。',pages:range(1,14),chapters:[{page:1,title:'项目概览'},{page:2,title:'背景与调研'},{page:4,title:'原型与设计语言'},{page:7,title:'核心充电体验'},{page:10,title:'订单与服务'},{page:13,title:'细节与展示'}],color:'#bdfe00'},
{slug:'service-operations',name:'客服在线运维系统',en:'From feedback to resolution.',category:'产品体验',tags:['B 端系统','协作流程','数据看板'],intro:'将分散的 Excel 记录升级为统一的问题管理平台，围绕反馈录入、协同处理、知识沉淀与数据洞察，构建完整的运维服务闭环。',pages:range(15,26),chapters:[{page:15,title:'项目概览'},{page:17,title:'问题与用户'},{page:19,title:'策略与架构'},{page:21,title:'数据看板'},{page:22,title:'问题处理流程'},{page:25,title:'知识沉淀与复盘'}],color:'#ad9bff'},
{slug:'office-platform',name:'办公用房统一管理平台',en:'Clarity in complex systems.',category:'产品体验',tags:['G 端平台','设计系统','资产管理'],intro:'围绕办公用房管理，整合资产台账、空间查询与业务办理，以统一的设计语言和清晰的信息层级，组织复杂的管理场景。',pages:range(27,42),chapters:[{page:27,title:'项目概览'},{page:28,title:'设计思路'},{page:30,title:'设计系统'},{page:35,title:'3D 视觉语言'},{page:37,title:'业务体验设计'},{page:41,title:'AI 智能体验'}],color:'#77a9ff'},
{slug:'digital-ioc',name:'数字 IOC 可视化',en:'See the bigger picture.',category:'数字可视化',tags:['智慧园区','数字孪生','数据可视化'],intro:'以三维园区为核心，将楼宇分布、环境指标与设备状态集中呈现，建立从园区全景到楼宇设备的空间化监测体验。',pages:range(43,47),chapters:[{page:43,title:'项目概览'},{page:44,title:'业务背景'},{page:45,title:'全景总览'},{page:46,title:'设备与能耗监测'}],color:'#64dbf1'},
{slug:'digital-water',name:'数字孪生水利平台',en:'A new perspective on water.',category:'数字可视化',tags:['数字孪生','水情监测','无人机巡检'],intro:'融合三维流域场景与水文数据，连接水情监测、无人机巡检和风险预警，为大坝运行管理提供直观的信息入口。',pages:range(48,50),chapters:[{page:48,title:'项目概览'},{page:49,title:'全景监测'},{page:50,title:'巡检与预警'}],color:'#7cb7fc'},
{slug:'enterprise-agents',name:'企业场景 Agent 应用实践',en:'Beyond the conversation.',category:'AI Agent',tags:['System Prompt','MCP / Skills','Workflow'],intro:'围绕人力资源、客户服务与软件测试，拆解可执行的 Agent 工作流，连接业务工具与协作场景，让 AI 从问答走向实际任务。',pages:range(51,55),chapters:[{page:51,title:'项目概览'},{page:52,title:'提示词与边界'},{page:53,title:'HR 绩效 Agent'},{page:54,title:'客服 Agent'},{page:55,title:'自动化测试 Agent'}],color:'#e5b0ff'}
];
export const imageFor=(n:number)=>sitePath(`assets/p${n}.webp`);
