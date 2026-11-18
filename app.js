/* =========================================================================
 * 单词工坊 · 背单词工作台  v2.1.0
 * 纯前端本地版：数据存 localStorage，内置词库来自开源数据（kajweb/dict）
 * 复习算法：艾宾浩斯遗忘曲线（20分钟/1天/3天/7天/15天/30天 + 难度系数动态调整）
 *
 * v2.1.0：统一线稿图标 / 自建词书重命名+【自建】标识 / 速记跟随词书
 *         遮罩按钮合并（隐英同隐音标）/ 工具栏压缩 / 分页渲染省内存
 * ========================================================================= */

'use strict';

// ===== 版本 =====
const APP_VERSION = '3.2.2';
const APP_NAME = 'Token';
const AUTHOR_MAIL = 'YJH_9999@163.com';
const CHANGELOG = [
  {
    v: '3.2.2',
    date: '2026-11-18',
    title: '应用内更新 · 一键覆盖安装',
    items: [
      '设置页新增「检查更新」：直接读取 GitHub Releases 的最新版本号与更新说明，和当前版本比对',
      '发现新版本时弹层显示版本号、更新内容与安装包大小；原生端在后台下载并显示进度条，下载完直接调起系统安装界面',
      '首次更新若系统未允许「安装未知应用」，会跳到系统授权页，返回后点「继续安装」即可，不会重新下载',
      '点过「以后再说」的版本本次不再打扰；下次启动只在有更新的版本时提示',
      '网页版或没有原生能力时自动回退为打开下载页，覆盖安装不会影响学习记录',
    ],
  },
  {
    v: '3.2.1',
    date: '2026-11-18',
    title: '吸顶栏紧凑化 · 工具栏自动收起 · 忘记密码 · 使用时长',
    items: [
      '页头折叠重做：上划进入正题时，标题缩小的同时整条上边框一起收紧成细条（头像、上下留白同步收窄），不再只缩字',
      '速记与课程单元：向下滑自动收起「只看未掌握 · 遮罩 · 随机打乱」一整排工具，向上滑立即展开，词表一次能看到更多；点进度行也可手动收起',
      '平板横屏侧边栏改为平铺：学习 / 工具分类从上往下依次排开，不再靠抽屉或收起分组找功能',
      '平板设置页改瀑布式双列，分组按高度自动补位，右列不再空一大片；大版面（≥1100px）速记词表自动双列',
      '个人中心新增使用时长：今日用时与累计使用时长（按自然日统计，跟着账号同步到其它设备）',
      '登录卡片新增「忘记密码？」：用注册邮箱收验证码，验证通过后直接重设新密码并登录，不再需要旧密码',
    ],
  },
  {
    v: '3.2.0',
    date: '2026-11-06',
    title: '云端账户 · 全量同步 · 平板适配',
    items: [
      '新增账户系统（Supabase 登录）：支持邮箱密码登录、注册与邮箱验证码登录，不登录也能完全离线使用',
      '全量云端同步：全部设置、学习进度、速记/课程进度、自建词书、补录单词、打卡记录与个人资料（昵称/头像/简介）自动同步，换设备登录即恢复',
      '智能合并：本机与云端都有新进度时自动合并取并集；首次登录两端都有数据时可三选一（云端覆盖 / 本机覆盖 / 合并）',
      '自动同步：学习进度改动后 4 秒内静默上传，回到前台自动拉取最新；设置页可查看同步状态、手动同步、退出登录',
      '平板端优化：内容定宽居中不再拉满全屏，首页与设置页改双列，底部导航收成居中胶囊，抽屉与触控区域加大',
    ],
  },
  {
    v: '3.1.11',
    date: '2026-11-05',
    title: '图标加厚黑边 · 大标题流畅度优化',
    items: [
      '应用图标黑边加厚：图案四周留出更宽的黑色边框，更接近系统应用图标的观感',
      '折叠大标题流畅度重写：滚动全程零重排，标题缩放与毛玻璃渐显全部走合成器动画，低配手机也不卡顿',
      '毛玻璃吸顶条模糊半径微调，视觉更通透',
    ],
  },
  {
    v: '3.1.10',
    date: '2026-11-05',
    title: '折叠大标题 · 课程滑动修复 · 内存优化',
    items: [
      '修复课程版块底部内容被悬浮 Tab 栏挡住、无法滑动到底的问题',
      '页头改为折叠大标题：大标题随上划连续收缩成吸顶小标题，毛玻璃条渐显，如 iOS / 原生应用般流畅自然',
      '内存优化：切走页面时自动释放词列表的隐藏 DOM，词书合并列表增加缓存减少重复计算',
    ],
  },
  {
    v: '3.1.9',
    date: '2026-11-05',
    title: '页头灵动吸顶 · 细节打磨',
    items: [
      '应用内所有图标（包括浏览器标签页图标）统一换成 Token 原版笔记本图标',
      '首页「我的词书」面板默认收起，只显示当前词书，点击可展开完整列表',
      '修复新手教程最后一步说明卡位置不对的问题',
      '引导教程切换页面时，底部 Tab 栏同步高亮当前所在版块',
      '页头上划后缩小并固定在顶部，回到顶部平滑还原，动画更流畅灵动',
    ],
  },
  {
    v: '3.1.8',
    date: '2026-11-05',
    title: '引导式新手教程 · 图标焕新',
    items: [
      '新手教程全新升级为引导式教程：逐个高亮真实功能位置，边看边学，点「下一步」前进，只有右上角 ✕ 可以退出',
      '默认头像换成应用图标（Token 笔记本领字标），启动画面与欢迎页 Logo 同步换新',
      '应用图标改为由原图直接生成，桌面图标与应用内显示均为原构图原比例',
    ],
  },
  {
    v: '3.1.7',
    date: '2026-11-05',
    title: '结构焕新 · 胶囊导航',
    items: [
      '底部 Tab 栏改为胶囊式悬浮：圆角胶囊悬浮于内容之上，滑动指示更轻盈',
      '删除顶部白色工具条：头像入口移到每页标题左侧，页面标题即为导航中心',
      '学习与测验合并为一个版块：测验成为学习页内的子标签，入口更聚焦',
      '首页问候语按时段变化：早上好 / 上午好 / 下午好 / 晚上好，前面带上你的昵称',
      '手机状态栏与底部手势区颜色跟随应用主题（深浅色同步），不再突兀',
      '导入词书：补录单词提到最前面，各文件格式示例折叠收纳，页面更清爽',
    ],
  },
  {
    v: '3.1.6',
    date: '2026-11-05',
    title: '课程总结词库 · 细节打磨',
    items: [
      '「课程总结」加入固有词库：汇总大一上全部 6 个单元词表，可与其它词书一样速记/学习/测验',
      '应用图标不再裁剪：桌面图标四周留白，笔记本与钢笔完整显示，圆形/方形遮罩不再切边',
      '速记/课程工具栏（随机打乱、遮罩等）改为白底卡片，与页面底色层次分明',
      '课程部分隐藏的英文注释现在可以单独点击显示（此前只能随中文一起揭示）',
      '长单词的音标换行后对齐单词起始位置，不再顶到行首；继续上次按钮的▶换成同层播放图标',
      '全局圆角加大一档；右上角切换词书改为 iOS 底部弹层，词书 chips 改为整齐网格卡片',
    ],
  },
  {
    v: '3.1.5',
    date: '2026-11-05',
    title: '新图标 · 淡雅配色 · 词典衬线',
    items: [
      '应用图标焕新：黑色笔记本与钢笔的「Token」字标（自适应图标黑白双色，桌面更沉稳）',
      '配色整体转淡雅简约：主色从鲜艳系统蓝改为低饱和雾蓝，语义色（绿/橙/红/靛）同步降饱和，界面更素净耐看',
      '英文展示换 Times New Roman 衬线字体：单词、音标、例句、测验选项、词库表格，词典质感',
    ],
  },
  {
    v: '3.1.4',
    date: '2026-11-05',
    title: '交互质感打磨',
    items: [
      '侧边栏按使用规范整理：分组小标题、选中项垫底块高亮、工具组与进度卡固定底部、中间区域可滚动（入口一个不删）',
      '清空进度/删词书/删单词/清空标记等不可逆操作改用 AlertDialog 确认弹窗：点遮罩和 Esc 均不关闭，危险按钮为系统红，防误触',
      '移动端弹层（更新告知/胜利分享/教程）升级为 iOS 底部动作面板样式：全宽上滑、顶部抓手条',
      '触感升级：去掉点按灰色高亮与 300ms 点击延迟；按钮按压缩放、松手弹簧回弹；设置开关弹性形变动画',
      '次级按钮改为 iOS tinted 浅底色样式，主次层级更分明；滚动加防链收敛，更跟手',
    ],
  },
  {
    v: '3.1.3',
    date: '2026-11-05',
    title: '倒计时修复 + 界面美化',
    items: [
      '修复考试倒计时：考试当天正确显示「考试日 🎉」（此前永远显示 1 天），考试结束次日正确显示「已结束」（此前误显示为还有 0 天）',
      '切词书等提示改为单行居中：不再折行，超长自动省略，iOS 深灰磨砂胶囊样式',
      '个人中心改版：头像居中放大、昵称 / 简介 / 当前词书居中排版，「今日进度」升级为蓝紫渐变卡片',
      '配色点缀：考试倒计时大数字改为蓝→靛渐变，深浅双主题分别调校',
    ],
  },
  {
    v: '3.1.2',
    date: '2026-11-05',
    title: '流畅度专项优化',
    items: [
      '启动提速：10MB 词库脚本 defer 化不阻塞首帧，新增启动画面（Logo + 加载圈）替代白屏；首页先渲染，抽屉 / 设置页 / 更新日志推迟到空闲时段',
      '评分更跟手：学习进度加内存缓存，评分连点不再反复解析上万条记录；300ms 内连续评分合并为一次落盘，切后台 / 关闭时自动保存不丢数据',
      '启动减负：约 900KB 的 Excel 组件移出首屏，只在真正导入 / 导出 Excel 时按需加载（功能不变）',
      '整体滑动与操作更流畅，重度用户（上万条学习记录）收益最明显',
    ],
  },
  {
    v: '3.1.1',
    date: '2026-11-04',
    title: 'Apple iOS 画风焕新',
    items: [
      '全新 Apple Human Interface（iOS）设计语言：分组背景 + 纯白卡片 + hairline 细描边，告别玻璃拟态',
      '配色整体切换为 iOS 系统色：systemBlue 主强调、systemIndigo 次强调、红橙绿语义色；深色模式为 OLED 纯黑底 + 提亮系统色',
      '字体全面切换 SF / PingFang 系统栈，按钮改为 iOS 纯色填充 + 按压变暗反馈，卡片 16~20px 大圆角',
      '词书标签、输入框、弹层遮罩、Toast、滚动条等控件统一 iOS 化；胜利分享海报同步重绘为 iOS 风格',
    ],
  },
  {
    v: '3.1.0',
    date: '2026-11-04',
    title: 'Glassmorphism 玻璃拟态焕新',
    items: [
      '全局界面升级玻璃拟态设计：侧栏、顶栏、卡片、弹层改为半透明磨砂玻璃质感，配大圆角与柔和投影',
      '背景铺入暖琥珀 / 玫瑰 / 天蓝柔光色斑，玻璃的 blur 与色彩层叠相映成趣，深浅双主题各自调校',
      '性能克制的玻璃方案：磨砂只给容器级表面（不叠加到按钮、标签等小控件），翻卡用较实玻璃防 3D 叠影，滚动零重绘',
      '文字颜色与对比度体系保持不变，可读性不受影响',
    ],
  },
  {
    v: '3.0.4',
    date: '2026-10-29',
    title: '全局禁止复制',
    items: [
      '全局禁止长按选择与复制文字：不再弹出系统文字选择菜单，避免误触干扰操作',
      '输入框（搜索、昵称、导入文本等）保留正常选择与输入；「关于」页邮箱复制按钮不受影响',
    ],
  },
  {
    v: '3.0.3',
    date: '2026-10-29',
    title: '修正导出音标规则',
    items: [
      '修正上一版改反的问题：导出词库（Excel / CSV）恢复音标列（单词 / 音标 / 词性 / 释义 / 例句），与导入格式一致可再导回',
      '默写纸改为不带音标：三张表（看英文写中文 / 看中文写英文 / 答案）均去掉音标列，默写时不泄露读音提示',
    ],
  },
  {
    v: '3.0.2',
    date: '2026-10-29',
    title: '排序即时生效 · 全局同步',
    items: [
      '拖动词书松手后，01、02… 编号立即按新顺序重算，不再需要切走再切回才刷新',
      '设置页「当前词书」下拉与首页排序完全同步：顺序、角标编号一致，进设置页不再回退到默认顺序',
    ],
  },
  {
    v: '3.0.1',
    date: '2026-10-29',
    title: '导出更清爽 · 单词本去音标',
    items: [
      '导出词库（Excel / CSV）不再包含音标列，只保留 单词 / 词性 / 释义 / 例句，表格更干净',
      '默写纸的音标为默写提示、导入模板为导回格式，这两处保持不变',
    ],
  },
  {
    v: '3.0.0',
    date: '2026-10-28',
    title: '胜利时刻 · 词书随心排',
    items: [
      '右上角词书下拉更聪明：只在首页 / 速记 / 学习 / 测验 / 词库显示，课程、统计等界面不再占位',
      '胜利庆祝：一本词书「全部学完」或「全部掌握」时弹出庆祝页，彩带 + 你的头像和昵称 + 词库名称与词数，可一键保存分享图到 Download',
      '词书支持拖拽排序：首页词书标签长按拖动即可调换位置（常用词书放前面），顺序自动保存，下拉框同步',
      '自建词书角标升级：【自建】改为 01、02… 自动编号，可在设置中改回「自建」或选择不显示',
    ],
  },
  {
    v: '2.9.2',
    date: '2026-10-28',
    title: '下载彻底修好 · 导出后可一键查看',
    items: [
      '导出保存彻底重做：新增原生模块经系统 MediaStore 直写 Download 文件夹（Android 10+ 无需任何权限，必定成功），修复上一版文件找不到的问题',
      '全部导出口统一接入：默写纸、词库 Excel/CSV、导入模板、备份 JSON，保存成功后提示条附带「查看」按钮，一键调起 WPS/Office 打开',
      '失败的旧路径已移除：不再依赖 WebView 下载，文件一定落在 文件管理器 → Download 里',
    ],
  },
  {
    v: '2.9.1',
    date: '2026-10-28',
    title: '生词入本可选词书 · 默写纸存至 Download',
    items: [
      '「生词入本」可选择目标词书：默认提供「课程生词」，也可选已有自建词书或新建一本，重复收集自动去重',
      '默写纸保存到系统 Download 文件夹：首次导出会申请存储权限，之后一键直达；浏览器环境仍走常规下载',
      '默写纸入口移出工具栏：课程单元在标题行右侧「导出默写纸 ›」，速记在提示行右下角，工具栏恢复清爽',
    ],
  },
  {
    v: '2.9.0',
    date: '2026-10-28',
    title: '考试倒计时 · 生词入本 · 默写纸',
    items: [
      '考试倒计时 + 智能每日计划：设置里填入考试名与日期，首页显示倒计时，并按剩余天数预留复习余量自动推荐每日新词量，一键采用',
      '课程「生词入本」：一键把单元里 △ 不太熟 / 红圈 不认识的词收入固定的「课程生词」词书（自动去重），进入速记/学习/测验/错词本循环',
      '导出默写纸：课程单元与速记当前页一键生成 Excel，含「看英文写中文」「看中文写英文」两张练习卷和答案页，直接打印或发打印店',
    ],
  },
  {
    v: '2.8.3',
    date: '2026-10-28',
    title: '品牌焕新 · 更名 Token',
    items: [
      '应用更名为 Token，安卓桌面图标（自适应/圆形/方形）与启动屏全部换上全新的巨嘴鸟形象',
      '浏览器标签页图标同步更新；备份校验提示与导入模板、词库导出文件名改为 Token 前缀',
    ],
  },
  {
    v: '2.8.2',
    date: '2026-10-28',
    title: '返回键接管 · 界面恢复 · 性能优化',
    items: [
      '安卓返回键全面接管：二级页（统计/导入/设置）返回上一级，课程单元背诵返回课程总览；更新告知/教程/头像裁剪/个人中心抽屉打开时按返回键先关闭它们',
      '在无法返回上一级的标签页按返回键，第一次回到主页并提醒「再按一次退出」，再次按下即退出应用',
      '应用被清理后台后再次打开，自动回到上次浏览的界面（返回键临时回到主页的跳转不计入，重开仍回到之前工作的页面）',
      '性能优化：长列表与词库表格启用视口外按需渲染，窗口缩放事件节流，滑动更流畅、内存占用更低',
    ],
  },
  {
    v: '2.8.1',
    date: '2026-10-27',
    title: '新手教程 · 手势翻页焕新',
    items: [
      '教程支持整页手势翻页：在配图、标题、说明文字上左右滑动均可切换界面，点「下一步」按钮或点配图依然有效；个人中心里重看教程的弹窗模式同样支持',
      '上下滑动不再牵动界面：全屏教程改为固定布局，配图区弹性伸缩，进度圆点与「上一步 / 下一步」按钮始终钉在底部，竖滑时纹丝不动',
      '滑动翻页时不再误选文字，教程内容新增「课程」一页介绍教材同步词表，全部配图按 v2.8.0 最新界面重新生成',
      '课程词表全面校正：弃用有误的 Excel 版数据，改为逐页转录教材《新视野大学英语（第三版）》读写教程 1 词汇页（Unit 1-6 全部 490 词与短语），释义与音标以教材为准',
    ],
  },
  {
    v: '2.8.0',
    date: '2026-10-27',
    title: '课程版块 · 大学英语同步词表',
    items: [
      '新增底部「课程」版块：内置「大学英语 · 大一上」词表（外研社《新视野大学英语（第三版）》读写教程 1，共 6 个单元 486 词，含音标、词性、中文释义与英文注释）',
      '课程背诵与速记同款手感：三态标记（✓ 已掌握 / △ 不太熟 / 红圈 不认识）、遮罩自测（隐中文 / 隐英文）、随机打乱与已掌握沉底、分页与每页词数均可调',
      '单元内按板块（iExplore 1 / iExplore 2 / 短语）分页签背诵，也可选「全部」连背整单元；掌握标记按单元共享，各板块进度互通',
      '课程进度独立保存并纳入学习进度备份，换设备导出导入即可带走；词表数据来自课程官方词表整理，仅供个人学习',
    ],
  },
  {
    v: '2.7.3',
    date: '2026-10-27',
    title: '深色模式 · 底部导航彻底夜化',
    items: [
      '修复深色模式下移动端底部导航栏仍为浅米色的问题：底色、分隔线、阴影与滑动胶囊全部改为跟随主题变量',
      '深色下底栏转为近纯黑的暖夜底盘，磨砂滤镜降低饱和避免泛灰发亮，胶囊描边同步调暗，整体黑得更彻底',
      '浅色模式外观与旧版完全一致，无任何变化',
    ],
  },
  {
    v: '2.7.2',
    date: '2026-10-21',
    title: '词表管理 · 键入建库 · 不熟词收本',
    items: [
      '速记列表不再逐行显示「已掌握 / 不太熟 / 本轮已学」提示字样，只在顶部保留一处图例说明，列表更干净',
      '自建词书不用导文件了：补录单词面板新增「新建词书」，起个名字就能逐个键入单词、补上释义直接入库',
      '新增「管理词表」：随时查看任意词书的单词并删除；自建词书管理全部单词，内置词书可删除补录进去的单词',
      '速记新增「收入不熟词」：一键把 △ 不太熟和红圈不认识的词合并成一本新词书，专门用来复习；词会一直保留，熟练了也不删，随时可在词书里自行管理',
    ],
  },
  {
    v: '2.7.1',
    date: '2026-10-15',
    title: '导出词库 · 数据随时带走',
    items: [
      '新增「导出词库」：导入词库板块可把任意词书导出为 Excel 或 CSV，换设备、备份、分享给朋友都方便',
      '导出范围自选：单本词书或「全部词书」一次打包；导出 Excel 时全部词书按每本一个工作表分开',
      '导出列与导入格式完全一致（单词 / 音标 / 词性 / 释义 / 例句），词性自动从释义中拆分为独立列，随时可再导回',
      'CSV 采用 UTF-8 带 BOM 编码，Excel 双击打开中文不乱码；全部词书导出 CSV 时附「词书」列便于区分',
    ],
  },
  {
    v: '2.7.0',
    date: '2026-10-15',
    title: '三态掌握标记 · 补录单词 · 深色模式',
    items: [
      '速记标记升级为三态循环：点一下打钩＝已掌握，再点画三角＝不太熟，再点画红圈＝不认识但本轮已学，再点取消；进度条按已标记统计，打乱沉底只认「已掌握」',
      '新增「补录单词」：在导入词库板块输入单词，已有词库命中可直接一键录入（带音标释义例句），未命中则补填释义后录入，单词进入你选定的词书（内置词书也支持补录并持久保存）',
      '新增深色模式：设置里可选 跟随系统 / 浅色 / 深色，暖夜纸质配色与浅色版同一套学院词典设计语言',
      '自本版本起 Windows 桌面版（exe）停更，后续仅更新安卓 APK；已安装的桌面版仍可继续使用',
    ],
  },
  {
    v: '2.6.4',
    date: '2026-09-25',
    title: '体验修复 · 切换零闪烁',
    items: [
      '彻底修复切换界面时类似刷新的闪烁：移除视图淡入与子块入场的全部动画，切换即时显示，从机制上杜绝任何空白帧',
    ],
  },
  {
    v: '2.6.3',
    date: '2026-09-25',
    title: '体验修复 · 界面切换不再闪烁',
    items: [
      '修复切换界面时页面闪烁一下的问题：子块入场动画不再叠加透明度，仅保留轻微上浮，由视图整体单次淡入统一过渡',
      '切换动画时长微调至 0.2s，观感更跟手',
    ],
  },
  {
    v: '2.6.2',
    date: '2026-09-25',
    title: '精简速记 · 移除搜索直达',
    items: [
      '移除速记「搜索直达」功能：搜索框与跳页高亮一并下线，工具栏回归简洁；翻页仍可用省略式页码（1 2 3 … 49 50）直达任意页',
      '每页词数直接输入、遮罩三档、界面切换提速等上一版能力保持不变',
    ],
  },
  {
    v: '2.6.1',
    date: '2026-09-25',
    title: '速记体验焕新 · 搜索直达 · 翻页升级',
    items: [
      '速记遮罩改为 关 → 隐中文 → 隐英文 三档循环，去掉了把中英全部遮住的「全隐」档，背词不再两眼一抹黑',
      '速记新增「搜索直达」：输入单词或释义片段回车，自动翻到所在页并高亮定位，几千词也能秒找',
      '翻页栏升级：页码按 1 2 3 … 49 50 省略式排布，头尾页随时可达，不再只能看到附近几页',
      '每页词数支持直接输入任意数值（10–1000），速记底部与设置页同步生效',
      '界面切换动画全面提速并优化：入场更轻快利落，速记翻页增加平滑过渡',
    ],
  },
  {
    v: '2.6.0',
    date: '2026-09-25',
    title: '导入智能升级 · 词性识别 · 多工作表',
    items: [
      '自动识别「词性」列（n./v./adj. 或 名词/动词/形容词）并归一化，统一并进释义栏，如「n. 放弃；抛弃」；释义里已带词性也会自动整理',
      '一个 Excel 里的多个工作表全都能识别：勾选要导入的表，再选「合并为一个词书」或「按工作表分别导入」（每张表一本书）',
      '新增字段映射：自动识别不准时，可手动为每一列指定「单词 / 音标 / 词性 / 释义 / 例句」，预览即时刷新；支持多个释义列自动合并',
      '自动识别文件编码：UTF-8 / UTF-16 / GBK(GB18030) 都能正确读取，Excel 导出的中文 CSV 不再乱码',
      '同一文件里的重复单词自动合并（释义拼接去重、音标补全），并报告合并数量',
      '新增「粘贴导入」：从网页词典直接复制粘贴即可建词书；新增 Excel 模板下载，含示例表头与多工作表范例',
    ],
  },
  {
    v: '2.5.1',
    date: '2026-09-25',
    title: '教程全新升级 · 版本更新告知',
    items: [
      '新手教程改为全屏沉浸式：首次打开自动进入，支持左右滑动或点击图片翻页，看完即用',
      '教程配图全面高清化并预置演示数据，界面一目了然；之后从个人中心进入则以弹窗形式快速回顾',
      '新增版本更新告知：升级后首次打开自动弹出本次更新内容，可切换查看往期所有版本记录',
    ],
  },
  {
    v: '2.5.0',
    date: '2026-09-25',
    title: '新手教程 · 导入更聪明 · 词书名更清爽',
    items: [
      '新增新手教程：首次使用自动弹出，六步图文带你走遍首页、学习、速记、测验、导入与个人中心；之后可在个人中心「新手教程」随时重看',
      '导入识别更宽容：Excel/CSV 表头含「单词、英文、音标、释义、中文、意义、意思、含义」等关键词即可识别，前几行有标题行、说明行也不影响，多工作表自动挑词最多的那个',
      '自建词书名称不再强制追加【自建】后缀，完全由你重命名决定，界面更清爽',
    ],
  },
  {
    v: '2.4.0',
    date: '2026-09-25',
    title: '速记分页可调 · 学习页优化 · 音标智能补全',
    items: [
      '速记底部翻页栏新增「每页词数」下拉：翻页时顺手就能调整，与设置页共用同一项设置',
      '学习页新增「每日新词」步进器，与首页今日任务同源，改一处两边同步；长按 ± 可连续调整',
      '学习页双按钮重排：「继续上次学习」有进度时升为主按钮，「开始学习」退为次级描边，间距统一不再突兀',
      '导入词书缺音标时自动从已有词库借音标：先精确匹配，再按拼写相近（编辑距离极小）补全；找不到就留空不显示',
    ],
  },
  {
    v: '2.3.2',
    date: '2026-09-25',
    title: '底部导航丝滑重做',
    items: [
      '底部导航改为磨砂玻璃底盘 + 圆形图标格，整体更轻透，与页面质感统一',
      '新增滑动高亮胶囊：切换页面时胶囊从上一项平滑滑向当前项，不再各自跳变',
      '点击反馈重做：按下轻微回弹、图标上浮放大，全程只动 transform / opacity，60fps 不掉帧',
      '旋转屏幕或改变窗口宽度后胶囊自动重新对齐，不再错位',
    ],
  },
  {
    v: '2.3.0',
    date: '2026-09-24',
    title: '头像裁剪 · 作者的话',
    items: [
      '新增头像裁剪：选图后进入裁剪界面，可拖动、滚轮或滑块缩放，取景框所见即所得，确认后生成圆形头像',
      '设置页新增「作者的话」：本应用由作者提出想法、AI 辅助生成，欢迎通过邮箱反馈意见与建议（可一键复制）',
    ],
  },
  {
    v: '2.2.0',
    date: '2026-09-24',
    title: '个人资料与界面焕新',
    items: [
      '首次打开自动进入欢迎引导：上传头像、填写昵称、可选一句话简介，一步完成「登录」',
      '头像支持随时更换与移除：个人中心抽屉点头像、设置 → 个人资料 均可修改，图片自动压缩保存',
      '设置页新增「个人资料」分组：头像、昵称、个人简介统一管理，简介显示在个人中心',
      '界面整体美化：视图切换过渡动画、统计卡片悬停浮起、按钮渐变与按压反馈、底部导航激活胶囊、抽屉与弹窗视觉升级',
    ],
  },
  {
    v: '2.1.0',
    date: '2026-09-24',
    title: '小版本优化',
    items: [
      '导航图标整体换为统一的线稿风格：学习的实心三角改为线稿图标，修正画风不一致，导入等图标一并重绘',
      '自建词书支持重命名，名称后统一标注【自建】，与内置词书一眼区分',
      '速记词书直接跟随当前选择的词书，移除速记页内的词书切换条，界面更简洁',
      '「隐藏英文 / 隐藏中文」合并为一个遮罩按钮，点击在 关 → 隐中文 → 隐英文 → 全隐 之间切换；隐藏英文时音标一并隐藏',
      '速记工具栏压缩排版：按键更紧凑、说明文字精简，为词表腾出更多空间',
      '速记新增分页：每页词数可在设置中调整（默认 100 个/页），翻页后遮罩自动重置；只渲染当前页，长词书的内存占用大幅下降',
    ],
  },
  {
    v: '2.0.0',
    date: '2026-09-24',
    title: '大版本更新',
    items: [
      '速记板块提到首页旁边，成为一级入口；新增勾选「已掌握」、打乱时未掌握随机排前、已掌握自动沉底，所有操作实时保存，中途退出不丢进度',
      '速记工具栏改为吸顶固定，长列表滚动时「打乱 / 隐藏英文 / 隐藏中文」等按键始终可点',
      '新增个人中心抽屉：每个页面左上角头像一键唤出，内含昵称、学习情况与全部功能导航',
      '底部导航精简为「首页 / 速记 / 学习 / 测验 / 词库」五项，更符合常规 App 的手感；统计与设置收进个人中心与侧栏',
      '新增设置页：每日新词目标、自动发音、发音语速、例句开关、词书管理、数据备份与恢复、版本说明',
      '导入功能并入设置；音标列带不带 // 都能正确识别（自动剥离 / / 、[ ] 、( ) 等包裹符号），TXT 行内音标同样支持',
      '导入时自动识别「音标列」（无表头文件也能猜对列），纯中文例句自动归入中文翻译列',
      '学习统计界面重做：新增近 7 天学习量柱状图、近 5 周打卡热力、各词书进度与复习预测；首页新增学习概况小结',
      '修复：清空进度时未清理速记与每日记录；测验选项正确答案判定改用数据标记，避免同文案误判；词库筛选条件在视图间切换时保留',
    ],
  },
  {
    v: '1.x',
    date: '2026-08-30',
    title: '历史版本',
    items: [
      '等级划分改依考试真题词频（≥40 高频 / ≥10 掌握 / ≥1 了解）',
      '导入的词自动匹配内置词库，一致的词补齐音标、释义与例句',
      '词库彻底重建为累积词量模式，6 本词书共 48443 词',
      '移动端适配增强：顶部工具条 + 底部 Tab 导航',
      '支持打包为 Windows 桌面版与安卓安装包，完全离线可用',
    ],
  },
];

// ===== 常量 =====
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
// 基础复习间隔（毫秒）：首档 20 分钟用于当天巩固，之后逐级拉长
const INTERVALS_MS = [20 * MIN, 1 * DAY, 3 * DAY, 7 * DAY, 15 * DAY, 30 * DAY];
const SHORT_AGAIN = 20 * MIN; // 忘记：当天尽快再复习
const SHORT_HARD = 1 * HOUR;  // 模糊：1 小时后
const EASE_DEFAULT = 1.0; // 难度系数（简化 SM-2）：1.0 = 标准间隔
const EASE_MIN = 0.7;
const EASE_MAX = 1.5;
const TIER_NAMES = { 1: '高频', 2: '掌握', 3: '了解' };
const TIER_COLORS = { 1: 'var(--tier1)', 2: 'var(--tier2)', 3: 'var(--tier3)' };

const LEVELS = [
  { id: 'course-summary', name: '课程总结 · 大一上', short: '总结' },
  { id: 'cet4', name: '大学英语四级', short: 'CET-4' },
  { id: 'cet6', name: '大学英语六级', short: 'CET-6' },
  { id: 'tem4', name: '英语专业四级', short: 'TEM-4' },
  { id: 'tem8', name: '英语专业八级', short: 'TEM-8' },
  { id: 'ielts', name: '雅思 IELTS', short: 'IELTS' },
  { id: 'toefl', name: '托福 TOEFL', short: 'TOEFL' },
];

// v3.1.6 课程总结固有词库：把课程全部单元词表汇成一本内置词书，
// 进入正常的速记/学习/测验/错词本循环（与课程模块互不影响，标记各自独立）。
// 课程词表字段 en=英文注释，这里映射为内置词库的 e 字段；tier 统一为 2（掌握档），r 按汇总顺序。
(function buildCourseSummaryBook() {
  if (!window.COURSE_BOOKS || !window.COURSE_BOOKS[0] || !window.COURSE_BOOKS[0].units) return;
  const seen = {};
  const words = [];
  for (const unit of window.COURSE_BOOKS[0].units) {
    for (const sec of unit.sections) {
      for (const w of sec.words) {
        const k = wordKey(w.w);
        if (!k || seen[k]) continue;
        seen[k] = true;
        words.push({ w: w.w, p: w.p || '', m: w.m || '', e: w.en || '', tier: 2, r: words.length + 1 });
      }
    }
  }
  window.BUILTIN_WORDS['course-summary'] = words;
})();

const LS = {
  settings: 'wr_settings',
  progress: 'wr_progress',
  custom: 'wr_custom',
  studySession: 'wr_study_session',
  quizSession: 'wr_quiz_session',
  rote: 'wr_rote',
  daily: 'wr_daily',
  supp: 'wr_supp',   // v2.7.0 补录单词：{ bookId: [wordObj, ...] }（内置词书的追加词也存这里）
  courseRote: 'wr_course_rote',  // v2.8.0 课程背诵进度：{ unitId: { marks, orders, pages, savedAt } }
  lastView: 'wr_lastview',       // v2.8.2 上次浏览的界面：{ view, unit? }（清理后台重开后恢复）
  celebr: 'wr_celebr',           // v3.0.0 胜利庆祝记录：{ bookId: { learned: date, mastered: date } }（防重复弹出）
  usage: 'wr_usage',             // v3.2.1 使用时长：{ days: { 'YYYY-MM-DD': 毫秒 } }
};

// 二级页面（不在主导航里的页面，需要返回按钮）
const SECONDARY_VIEWS = ['stats', 'import', 'settings'];
const VIEW_TITLES = {
  home: '首页', course: '课程', rote: '速记', study: '学习', quiz: '测验',
  library: '词库', stats: '学习统计', import: '导入词书', settings: '设置',
};

// ===== 工具函数 =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function addDays(key, n) {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return todayKey(dt);
}
function cmpDay(a, b) { return a < b ? -1 : a > b ? 1 : 0; }

// 将 due 统一转为毫秒时间戳（兼容旧的 YYYY-MM-DD 字符串格式）
function dueToMs(due) {
  if (typeof due === 'number') return due;
  if (typeof due === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(due)) {
    const [y, m, d] = due.split('-').map(Number);
    return new Date(y, m - 1, d, 23, 59, 59).getTime();
  }
  return 0;
}

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 1800);
}

/* ===== AlertDialog 确认弹窗（v3.1.4）：不可逆操作专用 =====
 * 与原生 confirm 的区别（参考浮层组件规范）：
 *  - 点遮罩不关闭、按 Esc 不关闭（防误触，必须明确选择）
 *  - 危险操作确定键用系统红，文案直说后果
 * 返回 Promise<boolean>，替代 confirm() 用法：await appConfirm('…', { danger: true }) */
function appConfirm(msg, opts = {}) {
  return new Promise(resolve => {
    const mask = $('#dlgMask');
    $('#dlgTitle').textContent = opts.title || '确认操作';
    $('#dlgMsg').textContent = msg;
    const ok = $('#dlgOk');
    ok.textContent = opts.okText || '确定';
    ok.classList.toggle('dlg-danger', !!opts.danger);
    mask.classList.add('open');
    const done = v => {
      mask.classList.remove('open');
      $('#dlgCancel').onclick = $('#dlgOk').onclick = null;
      resolve(v);
    };
    $('#dlgCancel').onclick = () => done(false);
    $('#dlgOk').onclick = () => done(true);
  });
}

/* ===== 文件保存到系统 Download（v2.9.2）=====
   安卓 App 内经 MediaStore.Downloads 直写（无需存储权限），带「查看」按钮；
   浏览器 / 桌面环境回退为常规下载。 */
function nativeSaver() {
  const cap = window.Capacitor && window.Capacitor.Plugins;
  return cap ? (cap.DownloadSaver || null) : null;
}

function utf8ToB64(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

let fileToastTimer = null;
function showFileToast(msg, uri, mime) {
  const t = $('#fileToast');
  if (!t) { toast(msg); return; }
  $('#fileToastMsg').textContent = msg;
  t.dataset.uri = uri || '';
  t.dataset.mime = mime || '';
  t.classList.add('show');
  clearTimeout(fileToastTimer);
  fileToastTimer = setTimeout(() => t.classList.remove('show'), 8000);
}

// 返回 true 表示已由原生插件保存；false 则调用方回退为常规下载
async function saveFileToDownload(fileName, b64, mime, okMsg) {
  const ds = nativeSaver();
  if (ds && typeof ds.saveBase64 === 'function') {
    try {
      const res = await ds.saveBase64({ name: fileName, mime, data: b64 });
      showFileToast(okMsg || `已保存到 Download/${fileName}`, res.uri || '', mime);
      return true;
    } catch (e) {
      toast('保存到 Download 失败：' + (e && e.message ? e.message : '未知错误'));
      return false;
    }
  }
  return false;
}

function speak(word) {
  try {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = 'en-US';
    u.rate = getSettings().speechRate || 0.85;
    window.speechSynthesis.speak(u);
  } catch (e) { /* 忽略发音失败 */ }
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 转义 HTML（词库/导入内容可能含特殊字符）
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// 音标归一化：用户文件里常自带 /.../ 、[...] 、(...) ，统一剥离，避免出现 //…//
function normalizePhonetic(p) {
  if (p == null) return '';
  let s = String(p).trim();
  if (!s) return '';
  // 剥离两端成对或零散的包裹符号（斜杠 / 方括号 / 圆括号 / 中文括号 / 引号）
  s = s.replace(/^[\s\/\\\[\]\(\)【】「」〔〕<>《》"']+/, '')
       .replace(/[\s\/\\\[\]\(\)【】「」〔〕<>《》"']+$/, '');
  // 内部多余的连续空格
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

// 释义归一化：去两端空白与常见分隔残留
function normalizeMeaning(m) {
  if (m == null) return '';
  return String(m).trim()
    .replace(/^[\s\-–—:：;；,，]+/, '')
    .replace(/\s+$/, '')
    .replace(/\s+/g, ' ');
}

// 例句中英分流：纯中文的例句归入中文列，其余作为英文例句
function splitExample(text) {
  const t = String(text == null ? '' : text).trim();
  if (!t) return { e: '', ec: '' };
  const cn = (t.match(/[\u4e00-\u9fff]/g) || []).length;
  const en = (t.match(/[a-zA-Z]/g) || []).length;
  if (cn > 0 && en === 0) return { e: '', ec: t };
  return { e: t, ec: '' };
}

// ===== 存储 =====
// v3.1.2：localStorage 内存缓存 —— 读一次 parse，之后直读缓存对象；
// 写时写穿（同时更新缓存与落盘），杜绝高频路径反复 JSON.parse 全量数据。
// 使用约定：所有调用方都是「拿引用 → 改 → saveJSON 落盘」或只读，共享引用安全。
const _lsCache = Object.create(null);
function loadJSON(key, def) {
  if (key in _lsCache) return _lsCache[key];
  try {
    const raw = localStorage.getItem(key);
    const val = raw ? JSON.parse(raw) : def;
    _lsCache[key] = val;
    return val;
  } catch (e) { return def; }
}
function saveJSON(key, val) {
  _lsCache[key] = val;
  try {
    localStorage.setItem(key, JSON.stringify(val));
    // v3.2.0：本地有实际改动 → 通知同步引擎排队上传（应用云端数据时不触发）
    if (SYNC_LOCAL_KEYS.has(key)) syncMarkDirty();
    return true;
  } catch (e) {
    toast('存储失败：本地空间可能已满');
    return false;
  }
}

// ===== v3.2.0：云端同步钩子 =====
// _syncApplying：正在把云端快照写进本机，此时的 saveJSON 不算「本机新改动」
let _syncApplying = false;
const SYNC_LOCAL_KEYS = new Set([
  LS.settings, LS.progress, LS.custom, LS.rote, LS.courseRote, LS.supp, LS.daily, LS.celebr,
]);
function syncMarkDirty() {
  if (_syncApplying) return;
  if (window.TokenSync) window.TokenSync.markDirty();
}

// ===== v3.2.1：使用时长统计 =====
// 思路：前台每 15 秒记一笔（间隔过长视为休眠/切后台，不计入），按自然日分桶；
// 落盘直接写 localStorage（不走 saveJSON，避免每 15 秒触发一次云端上传）。
function usageDayKey(d) {
  const t = d || new Date();
  return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
}
function getUsageDays() {
  const u = loadJSON(LS.usage, null);
  if (!u || typeof u !== 'object' || !u.days || typeof u.days !== 'object') return {};
  return u.days;
}
function writeUsageDays(days) {
  _lsCache[LS.usage] = { days };
  try { localStorage.setItem(LS.usage, JSON.stringify({ days })); } catch (e) { /* 空间满时静默 */ }
}
function usageToday() { return getUsageDays()[usageDayKey()] || 0; }
function usageTotal() {
  const days = getUsageDays();
  let sum = 0;
  for (const k in days) sum += Number(days[k]) || 0;
  return sum;
}
function addUsage(ms) {
  if (!(ms >= 1000)) return;
  if (ms > 5 * 60000) ms = 5 * 60000;         // 单次最多补 5 分钟，防异常跳变
  const days = getUsageDays();
  const k = usageDayKey();
  days[k] = (days[k] || 0) + ms;
  const keys = Object.keys(days).sort();
  while (keys.length > 120) delete days[keys.shift()];   // 只留最近 120 天
  writeUsageDays(days);
}
function fmtUsage(ms) {
  const m = Math.round((Number(ms) || 0) / 60000);
  if (m <= 0) return '—';
  if (m < 60) return m + ' 分';
  const h = m / 60;
  return (h >= 10 ? Math.round(h) : Math.round(h * 10) / 10) + ' 小时';
}
let _usageLast = 0, _usageTicks = 0;
function startUsageClock() {
  _usageLast = Date.now();
  setInterval(() => {
    const now = Date.now();
    const dt = now - _usageLast;
    _usageLast = now;
    if (document.visibilityState !== 'visible') return;
    if (dt > 90000) return;                    // 掉后台/休眠后的第一笔丢掉
    addUsage(dt);
    if (++_usageTicks % 20 === 0) syncMarkDirty();   // 约 5 分钟交给云端同步一次
    renderUsageStats();
  }, 15000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') { if (_usageLast) addUsage(Date.now() - _usageLast); _usageLast = Date.now(); }
    else { _usageLast = Date.now(); renderUsageStats(); }
  });
}
function renderUsageStats() {
  const t = $('#dUsageToday'), tot = $('#dUsageTotal');
  if (t) t.textContent = fmtUsage(usageToday());
  if (tot) tot.textContent = fmtUsage(usageTotal());
}

function getSettings() {
  const def = {
    bookId: 'cet4', dailyGoal: 20, autoPlay: true,
    examName: '', examDate: '',   // v2.9.0 考试倒计时：考试名 + 日期（YYYY-MM-DD）
    speechRate: 0.85, showExample: true, roteSinkChecked: true,
    userName: '词友', userBio: '', avatar: null, onboarded: false, tutorialSeen: false, lastSeenVersion: null,
    roteMask: 'off', roteOnlyUndone: false, rotePageSize: 100,
    theme: 'auto',   // auto | light | dark
    exportBookId: 'all', // v2.7.1 导出词库范围
    streak: 0, lastStudyDay: null,
    bookOrder: [],       // v3.0.0 词书 chips 拖拽排序：按顺序存 bookId，未记录的按默认顺序排在后面
    badgeMode: 'number', // v3.0.0 自建词书角标：number=自动编号 01/02… legacy=「自建」 hidden=不显示
  };
  return Object.assign(def, loadJSON(LS.settings, {}));
}
function saveSettings(s) { saveJSON(LS.settings, s); }

// ===== 主题（v2.7.0 深色模式）=====
let themeMedia = null; // prefers-color-scheme 监听器缓存

// v3.1.7：系统栏颜色跟随应用主题（与 CSS 变量保持一致）
const SYSBAR_COLORS = { light: '#f2f2f7', dark: '#000000' };
function syncSystemBars(resolved) {
  const color = SYSBAR_COLORS[resolved] || SYSBAR_COLORS.light;
  // PWA / 移动浏览器：theme-color meta
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', color);
  // Capacitor 原生：状态栏底色与图标明暗（Android <15 / iOS 生效；
  // Android 15+ 边到边模式下系统栏透明，透出应用背景，天然跟随主题）
  try {
    const SB = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.StatusBar;
    if (SB) {
      SB.setStyle({ style: resolved === 'dark' ? 'Dark' : 'Light' });
      SB.setBackgroundColor({ color });
    }
  } catch (e) { /* 插件不可用时静默跳过 */ }
}

function applyTheme() {
  const t = getSettings().theme || 'auto';
  const resolved = t === 'auto'
    ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : t;
  document.documentElement.dataset.theme = resolved;
  syncSystemBars(resolved);
}
function setTheme(t) {
  const s = getSettings();
  s.theme = t;
  saveSettings(s);
  applyTheme();
  syncThemeButtons();
  toast(t === 'auto' ? '主题：跟随系统' : t === 'dark' ? '主题：深色' : '主题：浅色');
}
function syncThemeButtons() {
  const t = getSettings().theme || 'auto';
  [['#themeAuto', 'auto'], ['#themeLight', 'light'], ['#themeDark', 'dark']].forEach(([sel, v]) => {
    const b = $(sel);
    if (b) b.classList.toggle('active', t === v);
  });
}
function watchSystemTheme() {
  if (!window.matchMedia) return;
  themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => { if ((getSettings().theme || 'auto') === 'auto') applyTheme(); };
  if (themeMedia.addEventListener) themeMedia.addEventListener('change', onChange);
  else if (themeMedia.addListener) themeMedia.addListener(onChange);
}

function getAllProgress() { return loadJSON(LS.progress, {}); }
function getLevelProgress(bookId) { return getAllProgress()[bookId] || {}; }

// v3.1.2：进度落盘防抖 —— 评分是高频连点操作，全量 stringify 上万条进度
// 一次 ~25ms（真机更慢）；300ms 内的连续评分合并为一次落盘，中间状态留在
// 内存缓存（loadJSON 直读），页面隐藏/关闭时强制 flush 兜底，不丢数据。
let _progressFlushTimer = 0;
function flushProgress() {
  if (_progressFlushTimer) { clearTimeout(_progressFlushTimer); _progressFlushTimer = 0; }
  try {
    localStorage.setItem(LS.progress, JSON.stringify(_lsCache[LS.progress] || {}));
    syncMarkDirty();   // v3.2.0：评分进度落盘后同样排队同步
  }
  catch (e) { toast('存储失败：本地空间可能已满'); }
}
function scheduleProgressFlush() {
  if (_progressFlushTimer) return;
  _progressFlushTimer = setTimeout(() => { _progressFlushTimer = 0; flushProgress(); }, 300);
}

function setWordState(bookId, word, state) {
  const all = getAllProgress();
  if (!all[bookId]) all[bookId] = {};
  if (state === null) delete all[bookId][word];
  else all[bookId][word] = state;
  scheduleProgressFlush();
  // v3.0.0：每次进度变化后检查是否达成「全部学完 / 全部掌握」
  if (state !== null) checkCelebration(bookId);
}

// ===== 胜利庆祝（v3.0.0）=====
// 达成判定：全部学完 = 每个单词都有进度记录；全部掌握 = 每个单词 s === 2
function getCelebrations() { return loadJSON(LS.celebr, {}); }

function checkCelebration(bookId) {
  const words = getWords(bookId);
  if (!words.length) return;
  const prog = getAllProgress()[bookId] || {};
  let learned = 0, mastered = 0;
  for (const w of words) {
    const st = prog[w.word];
    if (st) { learned++; if (st.s === 2) mastered++; }
  }
  const total = words.length;
  const celebr = getCelebrations();
  const rec = celebr[bookId] || {};
  // 先判「全部掌握」（更高成就，学完必然包含在其中），再判「全部学完」
  if (mastered >= total && !rec.mastered) {
    rec.mastered = todayKey();
    if (!rec.learned) rec.learned = rec.mastered;   // 掌握必然包含学完，同步记档防二次弹窗
    celebr[bookId] = rec; saveJSON(LS.celebr, celebr);
    showVictory(bookId, 'mastered');
  } else if (learned >= total && !rec.learned) {
    rec.learned = todayKey();
    celebr[bookId] = rec; saveJSON(LS.celebr, celebr);
    showVictory(bookId, 'learned');
  }
}

let victoryBookId = null;
function showVictory(bookId, type) {
  const meta = getBookMeta(bookId);
  if (!meta) return;
  victoryBookId = bookId;
  const s = getSettings();
  const rec = getCelebrations()[bookId] || {};
  $('#victoryTitle').textContent = type === 'mastered' ? '全部掌握！' : '全部学完！';
  $('#victorySub').textContent = type === 'mastered'
    ? '每一个单词都已掌握，这本词书被你彻底拿下 🏆'
    : '最后一个单词也学完了，坚持就是胜利 🎉';
  $('#victoryBookName').textContent = meta.name;
  $('#victoryCount').textContent = meta.count;
  $('#victoryDate').textContent = `达成于 ${todayKey()}`;
  $('#victoryUser').textContent = s.userName || '词友';
  renderAvatarFace($('#victoryAvatar'), s);
  const m = $('#victoryMask');
  m.dataset.type = type;
  m.classList.add('open');
  // 彩带重新播放
  const confetti = $('#victoryConfetti');
  confetti.innerHTML = confetti.innerHTML;
}

function closeVictory() {
  $('#victoryMask').classList.remove('open');
  victoryBookId = null;
}

// 保存分享图：canvas 绘制 → 原生插件存 Download（浏览器回退常规下载）
async function saveVictoryImage() {
  const meta = victoryBookId ? getBookMeta(victoryBookId) : null;
  if (!meta) return;
  const type = $('#victoryMask').dataset.type || 'learned';
  const s = getSettings();
  const W = 720, H = 960;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  // 背景：iOS 浅灰白渐变（v3.1.1）
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f5f5f7'); bg.addColorStop(1, '#ffffff');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // 顶部系统蓝色带（iOS 感）
  ctx.fillStyle = '#5f7e9e';
  ctx.fillRect(0, 0, W, 12);
  // 奖杯 emoji
  ctx.textAlign = 'center';
  ctx.font = '120px serif';
  ctx.fillText(type === 'mastered' ? '🏆' : '🎉', W / 2, 210);
  // 标题
  ctx.fillStyle = '#1c1c1e';
  ctx.font = '700 58px "SF Pro Display", "PingFang SC", sans-serif';
  ctx.fillText(type === 'mastered' ? '全部掌握！' : '全部学完！', W / 2, 330);
  // 词书名
  ctx.fillStyle = '#1c1c1e';
  ctx.font = '700 44px "SF Pro Display", "PingFang SC", sans-serif';
  ctx.fillText(meta.name.slice(0, 16), W / 2, 430);
  // 词数
  ctx.fillStyle = '#8e8e93';
  ctx.font = '30px "SF Pro Text", "PingFang SC", sans-serif';
  ctx.fillText(`共 ${meta.count} 个单词`, W / 2, 490);
  // 分隔线
  ctx.strokeStyle = 'rgba(60,60,67,.18)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(160, 540); ctx.lineTo(W - 160, 540); ctx.stroke();
  // 头像（圆形）
  const avY = 640, avR = 64;
  try {
    if (s.avatar) {
      const img = await new Promise((res, rej) => {
        const im = new Image();
        im.onload = () => res(im); im.onerror = rej;
        im.src = s.avatar;
      });
      ctx.save();
      ctx.beginPath(); ctx.arc(W / 2, avY, avR, 0, Math.PI * 2); ctx.clip();
      const ratio = Math.max((avR * 2) / img.width, (avR * 2) / img.height);
      const dw = img.width * ratio, dh = img.height * ratio;
      ctx.drawImage(img, W / 2 - dw / 2, avY - dh / 2, dw, dh);
      ctx.restore();
    } else {
      ctx.save();
      ctx.fillStyle = '#5f7e9e';
      ctx.beginPath(); ctx.arc(W / 2, avY, avR, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '700 56px "SF Pro Display", "PingFang SC", sans-serif';
      ctx.fillText((s.userName || '词').trim().charAt(0) || '词', W / 2, avY + 20);
      ctx.restore();
    }
  } catch (e) { /* 头像加载失败就画默认圆 */ }
  ctx.strokeStyle = 'rgba(60,60,67,.2)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(W / 2, avY, avR, 0, Math.PI * 2); ctx.stroke();
  // 昵称与日期
  ctx.fillStyle = '#1c1c1e';
  ctx.font = '700 36px "SF Pro Text", "PingFang SC", sans-serif';
  ctx.fillText((s.userName || '词友').slice(0, 12), W / 2, 760);
  ctx.fillStyle = '#8e8e93';
  ctx.font = '26px "SF Pro Text", "PingFang SC", sans-serif';
  ctx.fillText(`达成于 ${todayKey()}`, W / 2, 806);
  // 品牌角标
  ctx.font = '700 24px "SF Pro Text", "PingFang SC", sans-serif';
  ctx.fillStyle = 'rgba(60,60,67,.5)';
  ctx.fillText(`${APP_NAME} v${APP_VERSION}`, W / 2, H - 76);

  const dataUrl = cv.toDataURL('image/png');
  const b64 = dataUrl.split(',')[1];
  const fileName = `Token-${meta.name}-胜利分享.png`;
  const ds = nativeSaver();
  if (ds && typeof ds.saveBase64 === 'function') {
    try {
      const res = await ds.saveBase64({ name: fileName, mime: 'image/png', data: b64 });
      showFileToast(`分享图已保存到 Download/${fileName}`, res.uri || '', 'image/png');
      return;
    } catch (e) {
      toast('保存失败：' + (e && e.message ? e.message : '未知错误'));
      return;
    }
  }
  // 浏览器环境：常规下载
  const a = document.createElement('a');
  a.href = dataUrl; a.download = fileName;
  document.body.appendChild(a); a.click(); a.remove();
}

function getCustomLists() { return loadJSON(LS.custom, {}); }
function saveCustomLists(lists) { saveJSON(LS.custom, lists); }

// ===== 补录单词（v2.7.0）：向任意词书追加单词，内置词书通过覆盖层持久化 =====
function getSupplements() { return loadJSON(LS.supp, {}); }
// v3.1.10：补录变更版本号（getWords 合并缓存失效用）
let _suppVersion = 0;
let _wordsCache = {};
function saveSupplements(supp) { _suppVersion++; _wordsCache = {}; saveJSON(LS.supp, supp); }

// 每日学习量（用于柱状图与热力图）
function getDaily() { return loadJSON(LS.daily, {}); }
function bumpDaily(today) {
  const d = getDaily();
  d[today] = (d[today] || 0) + 1;
  // 只保留最近 180 天，避免无限增长
  const keys = Object.keys(d).sort();
  if (keys.length > 180) {
    for (const k of keys.slice(0, keys.length - 180)) delete d[k];
  }
  saveJSON(LS.daily, d);
}

// ===== 词书数据 =====
function getBookMeta(bookId) {
  const builtin = LEVELS.find(l => l.id === bookId);
  if (builtin) {
    const supp = getSupplements()[bookId];
    const words = (window.BUILTIN_WORDS[bookId] || []).concat(supp || []);
    return { id: bookId, name: builtin.name, short: builtin.short, count: words.length, custom: false };
  }
  const lists = getCustomLists();
  const cl = lists[bookId];
  if (cl) return { id: bookId, name: cl.name, short: bookBadge(bookId), count: cl.words.length, custom: true };
  return null;
}

// ===== 词书排序与自建角标（v3.0.0）=====
// 全部词书按用户拖拽顺序排列：bookOrder 里记录过的按记录顺序在前，没记录的按默认顺序补在后面
function getOrderedBookIds() {
  const lists = getCustomLists();
  const all = [...LEVELS.map(l => l.id), ...Object.keys(lists)];
  const order = (getSettings().bookOrder || []).filter(id => all.includes(id));
  const rest = all.filter(id => !order.includes(id));
  return [...order, ...rest];
}

// 自建词书角标：按排序中的序号生成 01、02…（只数自建词书）；可经设置改为「自建」或不显示
function bookBadge(bookId) {
  const mode = getSettings().badgeMode || 'number';
  if (mode === 'hidden') return '';
  if (mode === 'legacy') return '自建';
  const customIds = getOrderedBookIds().filter(id => id.startsWith('custom:'));
  const idx = customIds.indexOf(bookId);
  if (idx < 0) return '自建';
  return String(idx + 1).padStart(2, '0');
}

// 词书显示名：自建词书直接显示用户命名的名称（可随时重命名），不再强制追加【自建】后缀
function bookLabel(meta) {
  if (!meta) return '未选择词书';
  return meta.name;
}

function getWords(bookId) {
  if (bookId && bookId.startsWith('custom:')) {
    const lists = getCustomLists();
    const cl = lists[bookId];
    return cl ? cl.words : [];
  }
  // v2.7.0：内置词书合并补录的单词
  const base = window.BUILTIN_WORDS[bookId] || [];
  const supp = getSupplements()[bookId];
  if (supp && supp.length) {
    // v3.1.10 内存/性能优化：合并结果缓存（避免速记/学习/课程高频调用反复 concat
    // 几千词的大数组产生短命垃圾）；saveSupplements 时整体失效
    const c = _wordsCache[bookId];
    if (c && c.v === _suppVersion) return c.merged;
    const merged = base.concat(supp);
    _wordsCache[bookId] = { v: _suppVersion, merged };
    return merged;
  }
  return base;
}

function wordKey(w) { return String(w).trim().toLowerCase(); }

// 按 key 从词书取词对象（用于会话恢复）
function lookupWord(bookId, key) {
  const words = getWords(bookId);
  for (const w of words) {
    if (wordKey(w.w) === key) return w;
  }
  return null;
}

// ===== 内置词库全局索引（用于导入自动匹配补全） =====
let _builtinIndex = null;
function buildBuiltinIndex() {
  if (_builtinIndex) return _builtinIndex;
  const idx = {};
  for (const bookId of Object.keys(window.BUILTIN_WORDS || {})) {
    for (const w of window.BUILTIN_WORDS[bookId]) {
      const k = wordKey(w.w);
      if (!idx[k]) {
        idx[k] = { w: w.w, p: w.p || '', m: w.m || '', e: w.e || '', ec: w.ec || '', tier: w.tier, freq: w.freq, r: w.r };
      } else {
        const cur = idx[k];
        // 合并补全：优先取非空字段；tier 取更靠前（更高频）的
        if (!cur.p && w.p) cur.p = w.p;
        if (!cur.m && w.m) cur.m = w.m;
        if (!cur.e && w.e) { cur.e = w.e; cur.ec = w.ec || ''; }
        if (w.tier != null && (cur.tier == null || w.tier < cur.tier)) { cur.tier = w.tier; cur.freq = w.freq; cur.r = w.r; }
      }
    }
  }
  _builtinIndex = idx;
  return idx;
}

// 导入的词自动与内置词库匹配：一致的词补全音标/释义/例句，并同步考试频率等级
function enrichWordsFromBuiltin(words) {
  const idx = buildBuiltinIndex();
  let matched = 0;
  for (const w of words) {
    const hit = idx[wordKey(w.w)];
    if (!hit) continue;
    matched++;
    if (!w.p) w.p = hit.p;
    if (!w.m || w.m === '（未提供释义）') w.m = hit.m;
    if (!w.e && hit.e) { w.e = hit.e; w.ec = hit.ec || ''; }
    if (w.tier == null || w.tier === 3) {
      if (hit.tier != null) w.tier = hit.tier;
      if (hit.freq != null) w.freq = hit.freq;
    }
  }
  // 二级兜底：词表里查不到时，用拼写相近的词借个音标（释义不借，避免张冠李戴）
  borrowPhonetic(words);
  return matched;
}

/* 音标回填：为缺音标的词在其所属词库 + 全部内置词库中找「足够像」的词借音标
   - 只补音标，不补释义/例句，避免把别的词的意思安到这个词上
   - 判定足够严格：编辑距离 ≤1（长词）或 ≤2（≥8 字母），且首字母必须一致
   - 查不到就留空，界面自然就不显示音标行（不做占位） */
function borrowPhonetic(words) {
  const donors = [];   // 只收集有音标的词，作为音标来源
  const pushDonor = (w) => { if (w && w.w && w.p) donors.push({ key: wordKey(w.w), p: w.p }); };
  const seen = {};
  for (const bookId of Object.keys(window.BUILTIN_WORDS || {})) {
    for (const w of window.BUILTIN_WORDS[bookId]) {
      const k = wordKey(w.w);
      if (seen[k]) continue;
      seen[k] = 1;
      pushDonor(w);
    }
  }
  // 同批导入的词里已有音标的，也可作为来源
  for (const w of words) pushDonor(w);

  // 按首字母分桶，避免逐词全表扫描
  const buckets = {};
  for (const d of donors) {
    const c = d.key.charAt(0);
    if (!c) continue;
    (buckets[c] || (buckets[c] = [])).push(d);
  }

  let filled = 0;
  for (const w of words) {
    if (w.p) continue;                     // 已有音标不处理
    const key = wordKey(w.w);
    if (!key) continue;
    const c = key.charAt(0);
    const pool = buckets[c];
    if (!pool) continue;

    const limit = key.length >= 8 ? 2 : 1; // 长词容忍度稍高
    let best = null, bestDist = Infinity;
    for (const d of pool) {
      if (d.key === key) { best = d; bestDist = 0; break; }
      // 长度差太大直接跳过，省算力
      if (Math.abs(d.key.length - key.length) > limit) continue;
      const dist = editDistanceAtMost(key, d.key, limit);
      if (dist <= limit && dist < bestDist) { bestDist = dist; best = d; if (dist === 0) break; }
    }
    if (best && bestDist <= limit) { w.p = best.p; filled++; }
  }
  return filled;
}

/* 带提前退出的编辑距离：超过 max 直接返回 max+1，避免整表 DP */
function editDistanceAtMost(a, b, max) {
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > max) return max + 1;
  let prev = new Array(lb + 1);
  let cur = new Array(lb + 1);
  for (let j = 0; j <= lb; j++) prev[j] = j;
  for (let i = 1; i <= la; i++) {
    cur[0] = i;
    let rowMin = cur[0];
    for (let j = 1; j <= lb; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return max + 1;   // 整行都超了，不可能更优
    const tmp = prev; prev = cur; cur = tmp;
  }
  return prev[lb];
}

// 获取某词状态
function getWordState(bookId, word) {
  return getLevelProgress(bookId)[wordKey(word)] || null;
}

// ===== SRS 复习算法（艾宾浩斯 + 动态难度） =====
// 评分: 'again' 忘记 / 'hard' 模糊 / 'good' 认识 / 'easy' 简单
function applyGrade(bookId, word, grade) {
  const key = wordKey(word);
  const state = getWordState(bookId, key);
  const now = Date.now();
  const today = todayKey();

  // 今日学习量统计：同一天内重复评分的同一个词只记一次
  if (!state || !state.last || todayKey(new Date(state.last)) !== today) bumpDaily(today);

  const base = state || { s: 1, st: -1, due: now, n: 0, ok: 0, ease: EASE_DEFAULT };

  if (base.ease == null) base.ease = EASE_DEFAULT;
  base.n = (base.n || 0) + 1;
  base.last = now;

  if (grade === 'again') {
    base.st = 0;
    base.due = now + SHORT_AGAIN; // 当天尽快再复习
    base.s = 1;
    base.ease = Math.max(EASE_MIN, base.ease - 0.10);
    base.wrong = (base.wrong || 0) + 1;
  } else if (grade === 'hard') {
    base.st = Math.max(0, (base.st || 0) - 1);
    base.due = now + SHORT_HARD;
    base.s = 1;
    base.ease = Math.max(EASE_MIN, base.ease - 0.05);
    base.ok = (base.ok || 0) + 1;
  } else { // good / easy
    base.ok = (base.ok || 0) + 1;
    const next = (base.st || 0) + 1;
    if (next >= INTERVALS_MS.length) {
      base.s = 2; // 掌握
      base.st = INTERVALS_MS.length;
      base.due = null;
      base.masteredAt = now;
    } else {
      base.st = next;
      let iv = INTERVALS_MS[next];
      if (grade === 'easy') {
        iv = Math.round(iv * base.ease * 1.3);
        base.ease = Math.min(EASE_MAX, base.ease + 0.05);
      } else {
        iv = Math.round(iv * base.ease);
      }
      base.due = now + iv;
      base.s = 1;
    }
  }
  setWordState(bookId, key, base);
  return base;
}

// 今日任务：到期复习 + 新词
function getTodayTasks(bookId) {
  const words = getWords(bookId);
  const prog = getLevelProgress(bookId);
  const now = Date.now();
  const reviews = [];
  const news = [];

  for (const w of words) {
    const st = prog[wordKey(w.w)];
    if (!st) { news.push(w); continue; }
    if (st.s === 1 && st.due && dueToMs(st.due) <= now) reviews.push(w);
  }
  // 新词按 高频优先、词频排序
  news.sort((a, b) => (a.tier - b.tier) || (a.r - b.r));
  const goal = getSettings().dailyGoal;
  return { reviews, news: news.slice(0, goal), newsTotal: news.length };
}

// 错词本：答错/忘记过且尚未掌握的词，按错误次数降序、难度升序
function getMistakeWords(bookId) {
  const words = getWords(bookId);
  const prog = getLevelProgress(bookId);
  const result = [];
  for (const w of words) {
    const st = prog[wordKey(w.w)];
    if (st && st.s !== 2 && (st.wrong || 0) > 0) result.push(w);
  }
  result.sort((a, b) => {
    const sa = prog[wordKey(a.w)], sb = prog[wordKey(b.w)];
    return ((sb.wrong || 0) - (sa.wrong || 0)) || ((sa.ease || 1) - (sb.ease || 1));
  });
  return result;
}

function startMistakeStudy() {
  const bookId = getSettings().bookId;
  const mistakes = getMistakeWords(bookId);
  if (mistakes.length === 0) { toast('当前词书没有错词，继续保持！'); return; }
  studyBookId = bookId;
  studyQueue = mistakes.map(w => ({ word: w, type: 'review' }));
  studyIndex = 0;
  saveStudySession();
  switchView('study');
  $('#studyIntro').classList.add('hidden');
  $('#studyDone').classList.add('hidden');
  $('#studyCard').classList.remove('hidden');
  showStudyCard();
}

// ===== 导航 =====
let lastMainView = 'home';
let importFrom = 'settings';
let currentView = 'home';   // v2.8.2 当前所在视图（返回键 / 界面恢复用）

// 记录当前浏览位置（界面恢复用）；noSave 用于返回键的临时回主页跳转
function saveLastView() {
  try {
    localStorage.setItem(LS.lastView, JSON.stringify({ view: currentView, unit: courseUnitId || null }));
  } catch (e) { /* 存储失败不影响主流程 */ }
}

/* 底部导航滑动胶囊：把胶囊对齐到当前激活格
   - 用 getBoundingClientRect 相对 nav 定位，避免依赖 offsetLeft 的定位祖先
   - 注意：nav 是 position:fixed，offsetParent 恒为 null，不能用它判断可见性
   - 首帧（首次进入）不加过渡，避免从左边飞过来 */
function moveMobilePill(animate) {
  const nav = document.querySelector('.mobile-nav');
  if (!nav) return;
  // 桌面端 display:none —— 量不到尺寸，隐藏胶囊并跳过
  if (!nav.getClientRects().length) { nav.removeAttribute('data-pill'); return; }
  const active = nav.querySelector('.nav-item.active');
  if (!active) { nav.removeAttribute('data-pill'); return; }
  const navRect = nav.getBoundingClientRect();
  const rect = active.getBoundingClientRect();
  const x = rect.left - navRect.left;
  const w = rect.width;
  const prev = nav.style.transition;
  if (animate === false) {
    nav.style.transition = 'none';
    nav.querySelectorAll('.nav-item').forEach(el => { el.style.transition = 'none'; });
  }
  nav.style.setProperty('--tab-pill-x', x + 'px');
  nav.style.setProperty('--tab-pill-w', w + 'px');
  nav.setAttribute('data-pill', 'on');
  if (animate === false) {
    // 强制回流后再恢复过渡，保证后续滑动是动画的
    void nav.offsetWidth;
    nav.style.transition = prev;
    nav.querySelectorAll('.nav-item').forEach(el => { el.style.transition = ''; });
  }
}

// ===== 折叠大标题滚动进度（v3.1.10 连续插值；v3.1.11 流畅度优化） =====
// 优化原则：滚动全程布局恒定 —— 字号/内边距不再逐帧插值（每帧全页重排是卡顿根因），
// 标题缩放改走 CSS transform（合成器），padding 收紧改为越过阈值后一次性 .stuck 过渡；
// --pagehead-h 只在值变化时写入，避免每帧强制同步布局
let _headRaf = 0;
let _lastHp = -1;
let _headStuck = false;
let _lastHeadH = -1;
let _headSyncUntil = 0;
let _foldY = -1;

// v3.2.1：页头高度写入（吸顶工具栏的 top 依赖它）
function writeHeadH() {
  const head = document.querySelector('.view.active .page-head');
  const h = head ? head.offsetHeight : 0;
  if (h !== _lastHeadH) {
    _lastHeadH = h;
    document.documentElement.style.setProperty('--pagehead-h', h + 'px');
  }
}
// v3.2.1：阈值切换后 480ms 内逐帧跟随页头高度（此时头像/内边距正在过渡，高度每帧都在变），
// 否则吸顶工具栏会在过渡期间浮空，过渡结束才归位
function headSyncLoop() {
  writeHeadH();
  if (performance.now() < _headSyncUntil) requestAnimationFrame(headSyncLoop);
}

// v3.2.1：速记 / 课程单元 —— 向下滑收起工具栏（只看未掌握、遮罩…），向上滑展开
function setStickyFold(on) {
  const el = document.querySelector('.view.active .rote-sticky');
  if (!el) return false;
  const folded = el.classList.contains('folded');
  if (folded === !!on) return false;
  el.classList.toggle('folded', !!on);
  return true;
}
function updateStickyFold(y) {
  const el = document.querySelector('.view.active .rote-sticky');
  if (!el) { _foldY = y; return; }
  const dy = y - _foldY;
  _foldY = y;
  const folded = el.classList.contains('folded');
  if (y < 72) { if (folded) setStickyFold(false); return; }      // 回到顶部一定展开
  if (dy > 9 && !folded) setStickyFold(true);                    // 向下滑 → 收起
  else if (dy < -9 && folded) setStickyFold(false);              // 向上滑 → 展开
}

function updateHeadProgress() {
  _headRaf = 0;
  const y = window.scrollY || document.documentElement.scrollTop || 0;
  const p = Math.min(1, Math.max(0, y / 110));
  const rootStyle = document.documentElement.style;
  if (Math.abs(p - _lastHp) > 0.002) {
    _lastHp = p;
    rootStyle.setProperty('--hp', p.toFixed(3));
  }
  // 吸顶收紧：阈值 0.42 收紧 / 回落到 0.18 才还原（回滞防抖动），过渡由 CSS 一次性完成
  const wantStuck = p >= (_headStuck ? 0.18 : 0.42);
  if (wantStuck !== _headStuck) {
    _headStuck = wantStuck;
    document.querySelectorAll('.page-head').forEach(h => h.classList.toggle('stuck', wantStuck));
    _headSyncUntil = performance.now() + 480;
    requestAnimationFrame(headSyncLoop);
  } else {
    writeHeadH();
  }
  updateStickyFold(y);
}

function switchView(name, opts) {
  // v3.1.7：测验并入学习版块，作为学习页内的子标签
  if (name === 'quiz') { name = 'study'; setStudySub('quiz'); }
  if (!VIEW_TITLES[name]) return;
  if (!SECONDARY_VIEWS.includes(name)) lastMainView = name;
  const prevView = currentView;   // v3.1.10：记录离开前的视图
  currentView = name;
  if (name !== 'home') backExitArmed = false;   // 离开主页即解除退出待命

  // v3.1.10 内存优化：离开视图时释放重列表 DOM（几百上千节点的词行列表挂在
  // 隐藏视图上白白常驻内存）；回到该视图时 switchView 下方的 render* 会自动重建，
  // 分页/遮罩/标记等状态都保存在 JS 变量里，不受影响
  if (prevView && prevView !== name) releaseHeavyDom(prevView);

  $$('.nav-item, .drawer-item').forEach(el => el.classList.toggle('active', el.dataset.view === name));
  $$('.view').forEach(el => el.classList.toggle('active', el.id === 'view-' + name));
  moveMobilePill(true);

  // 二级页面的返回目标
  $('#viewBackStats').dataset.view = lastMainView;
  $('#viewBackSettings').dataset.view = lastMainView;
  $('#viewBackImport').dataset.view = importFrom;

  // v3.1.7：删除顶部工具条后，右上角切换词书按钮跟随当前页页头移动
  const BOOK_SELECT_VIEWS = ['home', 'rote', 'study', 'library'];
  const bookBtn = $('#bookSelectMobileBtn');
  if (bookBtn) {
    const head = document.querySelector('#view-' + name + ' .page-head');
    if (head) head.appendChild(bookBtn);
    bookBtn.classList.toggle('hidden', !BOOK_SELECT_VIEWS.includes(name));
  }

  if (name === 'home') renderHome();
  if (name === 'course') renderCourse();
  if (name === 'study') { renderStudyIntro(); if (!$('#studySubQuiz').classList.contains('hidden')) resetQuizSetup(); }
  if (name === 'rote') renderRote();
  if (name === 'library') renderLibrary();
  if (name === 'import') renderImport();
  if (name === 'stats') renderStats();
  if (name === 'settings') renderSettings();

  updateMiniProgress();
  closeDrawer();
  // 切换视图后回到顶部（移动端体验）
  window.scrollTo({ top: 0, behavior: 'auto' });
  document.querySelectorAll('.rote-sticky.folded').forEach(el => el.classList.remove('folded'));  // v3.2.1：换页重置工具栏
  _foldY = 0;
  updateHeadProgress();   // v3.1.10：同步大标题进度与吸顶栏高度（y 已为 0 时 scroll 事件可能不触发）
  if (!(opts && opts.noSave)) saveLastView();
}

// ===== 学习页子标签：学习 / 测验（v3.1.7 合并版块） =====
function setStudySub(sub) {
  const tabs = $('#studySubTabs');
  if (!tabs) return;
  tabs.querySelectorAll('.study-subtab').forEach(b => {
    const on = b.dataset.sub === sub;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  $('#studySubStudy').classList.toggle('hidden', sub !== 'study');
  $('#studySubQuiz').classList.toggle('hidden', sub !== 'quiz');
}

// ===== Android 物理返回键（v2.8.2）=====
// 层级：弹窗/教程/裁剪/抽屉 → 课程单元背诵(回总览) → 二级页(回上级) →
//       其他标签页(第一次回主页+提醒) → 主页(再按一次退出)
let backExitArmed = false;

// v3.1.10 内存优化：重列表容器（隐藏时释放其 DOM）
const HEAVY_VIEW_LISTS = { course: '#courseList', rote: '#roteList', library: '#libTableBody' };
function releaseHeavyDom(viewName) {
  const sel = HEAVY_VIEW_LISTS[viewName];
  if (!sel) return;
  const el = document.querySelector(sel);
  // 阈值保护：按 DOM 节点总数判断（行数少但每行节点多，如 38 词行 ≈ 450+ 节点）；
  // 小列表不值得清，避免切页闪动
  if (el && el.getElementsByTagName('*').length > 250) el.innerHTML = '';
}

function handleAndroidBack() {
  // 1. 打开的浮层优先关闭（与 Escape 键同层级）
  // v3.1.8 引导教程打开时返回键不退出（必须点右上角 ✕）
  if ($('#tourMask').classList.contains('open')) return;
  if ($('#whatsNewMask').classList.contains('open')) { closeWhatsNew(); return; }
  if ($('#cropperMask').classList.contains('open')) { closeCropper(); return; }
  if ($('#drawer').classList.contains('open')) { closeDrawer(); return; }

  // 2. 课程单元背诵 → 返回课程总览
  if (currentView === 'course' && courseUnitId) { closeCourseUnit(); return; }

  // 2b. v3.1.7：学习页的测验子标签 → 返回学习子标签
  if (currentView === 'study' && !$('#studySubQuiz').classList.contains('hidden')) { setStudySub('study'); return; }

  // 3. 二级页面 → 返回上一级（与页面内的返回按钮一致）
  if (SECONDARY_VIEWS.includes(currentView)) { switchView(lastMainView); return; }

  // 4. 其他标签页 → 第一次回到主页并提醒
  if (currentView !== 'home') {
    switchView('home', { noSave: true });   // 临时跳转不计入「上次界面」
    toast('已回到主页，再按一次退出应用');
    backExitArmed = true;
    return;
  }

  // 5. 主页：已提醒过 → 退出应用；否则提醒待命
  if (backExitArmed) {
    const capApp = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
    if (capApp && typeof capApp.exitApp === 'function') { capApp.exitApp(); return; }
  }
  toast('再按一次退出应用');
  backExitArmed = true;
}

// 绑定物理返回键（仅 Capacitor 环境生效；浏览器里无此插件自动跳过）
function bindAndroidBack() {
  const capApp = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
  if (capApp && typeof capApp.addListener === 'function') {
    capApp.addListener('backButton', handleAndroidBack);
  }
}

// 恢复上次浏览的界面（清理后台重开后保持原界面；外部 #hash 直达优先）
function restoreLastView() {
  let rec = null;
  try { rec = JSON.parse(localStorage.getItem(LS.lastView) || 'null'); } catch (e) { /* 忽略损坏数据 */ }
  if (!rec || !rec.view || !VIEW_TITLES[rec.view] || rec.view === 'home') return;
  switchView(rec.view);
  // 课程页恢复到单元背诵状态
  if (rec.view === 'course' && rec.unit) {
    courseUnitId = null;
    openCourseUnit(rec.unit);
  }
}

// ===== 个人中心抽屉 =====
function openDrawer() {
  renderDrawer();
  $('#drawer').classList.add('open');
  $('#drawerMask').classList.add('open');
  $('#drawer').setAttribute('aria-hidden', 'false');
  document.body.classList.add('drawer-open');
}
function closeDrawer() {
  const d = $('#drawer');
  if (!d.classList.contains('open')) return;
  d.classList.remove('open');
  $('#drawerMask').classList.remove('open');
  d.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('drawer-open');
}

/* =========================================================================
 * 头像与个人资料（v2.2.0）
 * - 头像存为裁剪后的 256×256 JPEG dataURL，放 settings.avatar
 * - 所有头像位（侧栏 / 顶栏 / 抽屉 / 设置 / 引导弹窗）统一走 renderAvatarFace
 * ========================================================================= */
function renderAvatarFace(el, s) {
  if (!el) return;
  const av = s.avatar;
  if (av) {
    el.classList.add('img');
    el.style.backgroundImage = `url("${av}")`;
    el.textContent = '';
  } else {
    // v3.1.8：默认头像换成应用图标（Token 字标），不再是昵称首字
    el.classList.add('img', 'default-logo');
    el.style.backgroundImage = 'url("data/logo.png")';
    el.textContent = '';
  }
}

function renderAllAvatars() {
  const s = getSettings();
  ['#avatarInitial', '#drawerInitial', '#setAvatarFace', '#obAvatarFace']
    .forEach(sel => renderAvatarFace($(sel), s));
  // v3.1.7：各页页头头像
  $$('[data-avatar-initial]').forEach(el => renderAvatarFace(el, s));
}

// 头像上传入口（上下文：'onboard' | 'app'）
let avatarPickCtx = 'app';
function pickAvatar(ctx) {
  avatarPickCtx = ctx || 'app';
  $('#avatarFileInput').value = '';
  $('#avatarFileInput').click();
}

/* ---------- 头像裁剪器（v2.3.0） ----------
 * 交互：拖拽平移 / 滚轮缩放 / 滑块缩放 / 重置
 * 输出：256×256 JPEG dataURL（圆形取景，所见即所得）
 */
const CROP_OUT = 256;      // 输出边长
const CROP_VIEW = 300;     // 画布显示边长
const CROP_MIN_ZOOM = 1;   // 最小缩放（保证铺满取景框）
const CROP_MAX_ZOOM = 3.2;

const cropper = {
  img: null,       // 原始 Image
  base: 1,         // 铺满取景框的基准缩放
  zoom: 1,         // 用户缩放倍率
  x: 0, y: 0,      // 图片中心相对画布中心的偏移（显示坐标）
  dragging: false,
  lastX: 0, lastY: 0,
  onDone: null,    // 确认回调
};

// 打开裁剪器：file → 读取 → 初始化
function openCropper(file, onDone) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      cropper.img = img;
      cropper.onDone = onDone || null;
      // 基准缩放：短边铺满取景框
      cropper.base = Math.max(CROP_VIEW / img.width, CROP_VIEW / img.height);
      cropper.zoom = 1;
      cropper.x = 0; cropper.y = 0;
      $('#cropperZoom').value = '100';
      const m = $('#cropperMask');
      m.classList.add('open');
      m.setAttribute('aria-hidden', 'false');
      drawCropper();
      setTimeout(() => $('#cropperOkBtn').focus(), 300);
    };
    img.onerror = () => toast('图片读取失败，请换一张试试');
    img.src = e.target.result;
  };
  reader.onerror = () => toast('文件读取失败，请重试');
  reader.readAsDataURL(file);
}

function closeCropper() {
  const m = $('#cropperMask');
  m.classList.remove('open');
  m.setAttribute('aria-hidden', 'true');
  cropper.img = null;
  cropper.onDone = null;
  cropper.dragging = false;
}

// 当前实际缩放（显示坐标下的图片尺寸）
function cropScale() { return cropper.base * cropper.zoom; }

// 把偏移限制在合理范围：图片边缘不得进入取景框内部（图片始终铺满）
function clampCropOffset() {
  if (!cropper.img) return;
  const sc = cropScale();
  const dw = cropper.img.width * sc;
  const dh = cropper.img.height * sc;
  const maxX = Math.max(0, (dw - CROP_VIEW) / 2);
  const maxY = Math.max(0, (dh - CROP_VIEW) / 2);
  cropper.x = Math.max(-maxX, Math.min(maxX, cropper.x));
  cropper.y = Math.max(-maxY, Math.min(maxY, cropper.y));
}

// 绘制画布：底图 + 暗角 + 圆形取景框
function drawCropper() {
  const canvas = $('#cropperCanvas');
  const g = canvas.getContext('2d');
  const sc = cropScale();
  const dw = cropper.img.width * sc;
  const dh = cropper.img.height * sc;
  const dx = (CROP_VIEW - dw) / 2 + cropper.x;
  const dy = (CROP_VIEW - dh) / 2 + cropper.y;

  g.clearRect(0, 0, CROP_VIEW, CROP_VIEW);
  g.fillStyle = '#1c1913';
  g.fillRect(0, 0, CROP_VIEW, CROP_VIEW);
  g.imageSmoothingQuality = 'high';
  g.drawImage(cropper.img, dx, dy, dw, dh);

  // 暗角：只保留圆形区域明亮
  const r = CROP_VIEW / 2;
  g.save();
  g.fillStyle = 'rgba(28, 25, 19, .62)';
  g.beginPath();
  g.rect(0, 0, CROP_VIEW, CROP_VIEW);
  g.arc(r, r, r, 0, Math.PI * 2, true);
  g.fill();
  g.restore();
}

// 导出裁剪结果
function cropExport() {
  const sc = cropScale();
  const dw = cropper.img.width * sc;
  const dh = cropper.img.height * sc;
  const dx = (CROP_VIEW - dw) / 2 + cropper.x;
  const dy = (CROP_VIEW - dh) / 2 + cropper.y;
  // 取景框在图片原图坐标中的区域
  const sx = (0 - dx) / sc;
  const sy = (0 - dy) / sc;
  const sSize = CROP_VIEW / sc;

  const out = document.createElement('canvas');
  out.width = CROP_OUT; out.height = CROP_OUT;
  const g = out.getContext('2d');
  g.imageSmoothingQuality = 'high';
  // 先铺白底，避免透明 PNG 转 JPEG 变黑
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, CROP_OUT, CROP_OUT);
  g.drawImage(cropper.img, sx, sy, sSize, sSize, 0, 0, CROP_OUT, CROP_OUT);
  try { return out.toDataURL('image/jpeg', 0.9); }
  catch (e) { return null; }
}

function cropperReset() {
  cropper.zoom = 1;
  cropper.x = 0; cropper.y = 0;
  $('#cropperZoom').value = '100';
  drawCropper();
}

function cropperConfirm() {
  if (!cropper.img) return;
  const dataUrl = cropExport();
  const cb = cropper.onDone;
  if (!dataUrl) { toast('裁剪失败，请重试'); return; }
  closeCropper();
  if (cb) cb(dataUrl);
}

function setAvatar(dataUrl) {
  const s = getSettings();
  s.avatar = dataUrl;
  saveSettings(s);
  renderAllAvatars();
  $('#setAvatarRemove').classList.toggle('hidden', !dataUrl);
}

function removeAvatar() {
  setAvatar(null);
  toast('已恢复默认头像');
}

// ===== 首次使用引导 =====
function maybeShowOnboard() {
  const s = getSettings();
  if (s.onboarded) return false;
  // 预填昵称/简介，方便回跳修改
  $('#obName').value = '';
  $('#obBio').value = '';
  renderAvatarFace($('#obAvatarFace'), s);
  openOnboard();
  setTimeout(() => $('#obName').focus(), 380);
  return true;
}

function openOnboard() {
  const m = $('#onboardMask');
  m.classList.add('open');
  m.setAttribute('aria-hidden', 'false');
}

function closeOnboard() {
  const m = $('#onboardMask');
  m.classList.remove('open');
  m.setAttribute('aria-hidden', 'true');
  // 引导弹窗期间底部导航被遮住，关闭后重新对齐胶囊
  requestAnimationFrame(() => moveMobilePill(false));
}

function onboardDone() {
  const name = ($('#obName').value || '').trim().slice(0, 12);
  const bio = ($('#obBio').value || '').trim().slice(0, 60);
  const s = getSettings();
  if (!name) { toast('先给自己起个昵称吧'); $('#obName').focus(); return; }
  s.userName = name;
  s.userBio = bio;
  s.onboarded = true;
  saveSettings(s);
  renderAllAvatars();
  renderDrawer();
  renderSettingsValues();
  closeOnboard();
  toast(`欢迎，${name}！今天也要加油背单词`);
  // 首次使用：资料设置完后紧接着进入新手教程
  setTimeout(maybeShowTutorial, 450);
}

function onboardSkip() {
  const s = getSettings();
  s.onboarded = true; // 用户明确选择跳过，不再打扰；之后可在设置 → 个人资料补全
  const name = ($('#obName').value || '').trim().slice(0, 12);
  if (name) { s.userName = name; }
  const bio = ($('#obBio').value || '').trim().slice(0, 60);
  if (bio) s.userBio = bio;
  saveSettings(s);
  renderAllAvatars();
  renderDrawer();
  renderSettingsValues();
  closeOnboard();
  toast('随时可在 设置 → 个人资料 完善资料');
  // 首次使用：资料设置完后紧接着进入新手教程
  setTimeout(maybeShowTutorial, 450);
}

// ===== 引导式新手教程（v3.1.8：spotlight 挖孔高亮，逐功能带逛） =====
// 规则：点「下一步」前进；只有右上角 ✕ 能退出（Esc / 物理返回键 / 点遮罩均不退出）
const TOUR_STEPS = [
  {
    center: true,
    title: '欢迎来到 Token 👋',
    desc: '花一分钟带你认识每个功能：接下来会逐个高亮它们的位置，点「下一步」继续前进。随时可以点右上角 ✕ 退出；之后也能在个人中心「新手教程」重新查看。',
  },
  {
    view: 'home',
    sel: ['#homeTaskBreakdown'],
    pad: 14,
    title: '今日任务 · 每天该背什么',
    desc: '这里实时汇总今天的待复习与新词任务：点「− / ＋」调整每日新词量，「开始今日学习」一键进入；旁边四个数字卡分别是词库总量、已学习、复习中与已掌握。',
  },
  {
    view: 'home',
    sel: ['#view-home .page-avatar'],
    title: '个人中心 · 一切从这里开始',
    desc: '点击左上角头像拉出个人中心抽屉：学习统计、词库切换、导入词书、数据备份和全部设置都在里面；本教程也可以随时在抽屉里的「新手教程」重新打开。',
  },
  {
    view: 'home',
    sel: ['#bookSelectMobileBtn', '.sidebar #bookSelect'],
    title: '切换词书 · 一键换目标',
    desc: '点这里打开词书列表：内置四六级、专四专八、雅思托福和课程词表，也可以选择你导入或新建的词书；当前词书带 ✓ 标记，切换后所有功能都会跟着切换。',
  },
  {
    view: 'study',
    sel: ['#studySubTabs'],
    title: '学习 · 卡片学习与测验',
    desc: '学习页包含两个子标签：「学习」是卡片模式——翻卡看释义、标记认识与否，按遗忘曲线安排复习，学一半退出也能「继续上次」；「测验」从当前词书抽词出四选一选择题，答错立即纠正，成绩计入统计。',
  },
  {
    view: 'rote',
    sel: ['.rote-sticky'],
    title: '速记 · 考前快速过词',
    desc: '这一排是速记工具箱：逐行勾选已掌握的词；「随机打乱」打散顺序防止背位置，「遮罩」盖住英文或中文自查记忆；底部翻页栏可调每页词数，进度自动保存。',
  },
  {
    view: 'course',
    sel: ['#courseBookCard'],
    title: '课程 · 教材同步词表',
    desc: '这里内置大学英语教材配套词表（大一上 · 外研社《新视野大学英语·第三版》），按单元划分；点进单元即可背诵，被盖住的释义/注释点一下就显示，掌握进度按单元记录、随时续背。',
  },
  {
    view: 'import',
    sel: ['#dropzone'],
    title: '导入 · 自建专属词书',
    desc: '把网上的词表变成自己的词书：支持 Excel / CSV / TXT / JSON / Markdown，拖文件进来或直接粘贴即可，表头自动识别、音标缺失自动补全；上方「补录单词」可逐个追加生词，「下载 Excel 模板」里有标准格式示例。',
  },
  {
    center: true,
    title: '准备完毕，开始吧！ 🎉',
    desc: '先去首页点「开始今日学习」完成第一组任务吧。背词贵在每天坚持——祝学习顺利！以后想重温本教程，点左上角头像 → 「新手教程」即可。',
  },
];
let tourStep = 0;
let tourActive = false;

function maybeShowTutorial() {
  const s = getSettings();
  if (s.tutorialSeen) return false;
  openTour();
  return true;
}

function openTour() {
  tourActive = true;
  tourStep = 0;
  document.body.classList.add('tour-open');
  const m = $('#tourMask');
  m.classList.add('open');
  m.setAttribute('aria-hidden', 'false');
  renderTour();
}

function closeTour(markSeen) {
  tourActive = false;
  const m = $('#tourMask');
  m.classList.remove('open');
  m.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('tour-open');
  $('#tourHole').style.opacity = '0';
  if (markSeen) {
    const s = getSettings();
    s.tutorialSeen = true;
    // 看完/退出教程后，本版本也不再弹更新告知（新用户两弹只留一弹）
    s.lastSeenVersion = APP_VERSION;
    saveSettings(s);
  }
}

function tourFindTarget(step) {
  for (const sel of step.sel || []) {
    const el = document.querySelector(sel);
    if (el && el.getClientRects().length) return el;
  }
  return null;
}

function renderTour() {
  const step = TOUR_STEPS[tourStep];
  const last = tourStep === TOUR_STEPS.length - 1;
  $('#tourStepLabel').textContent = `第 ${tourStep + 1} 步 · 共 ${TOUR_STEPS.length} 步`;
  $('#tourTitle').textContent = step.title;
  $('#tourDesc').textContent = step.desc;
  $('#tourPrevBtn').classList.toggle('hidden', tourStep === 0);
  $('#tourNextBtn').textContent = last ? '开始使用 ✓' : '下一步';
  $('#tourDots').innerHTML = TOUR_STEPS.map((_, i) =>
    `<span class="tour-dot ${i === tourStep ? 'active' : ''}"></span>`).join('');

  const hole = $('#tourHole');
  const card = $('#tourCard');
  const mask = $('#tourMask');
  if (step.center) {
    mask.classList.add('center-dim');
    hole.style.opacity = '0';
    // v3.1.9 修复：清掉上一步 spotlight 定位残留的行内坐标，
    // 否则 inline top/left 会覆盖 .tour-card.center 的居中定位，导致末步卡片跑位
    card.style.top = '';
    card.style.left = '';
    card.style.bottom = '';
    card.style.width = '';
    card.classList.add('center');
    return;
  }
  mask.classList.remove('center-dim');
  card.classList.remove('center');
  // 切到目标视图并等一帧渲染完成后定位挖孔与说明卡
  if (step.view && currentView !== step.view) switchView(step.view, { noSave: true });
  requestAnimationFrame(() => setTimeout(() => positionTour(step), 40));
}

function positionTour(step) {
  if (!tourActive) return;
  const el = tourFindTarget(step);
  const hole = $('#tourHole');
  const card = $('#tourCard');
  const mask = $('#tourMask');
  if (!el) {           // 目标缺失（理论上不会）：退化为居中卡
    mask.classList.add('center-dim');
    hole.style.opacity = '0';
    card.classList.add('center');
    return;
  }
  mask.classList.remove('center-dim');
  card.classList.remove('center');
  // 目标太靠边时先滚动到视口中部，保证挖孔与说明卡都有位置
  let r = el.getBoundingClientRect();
  const vh0 = window.innerHeight;
  if (r.top < 80 || r.bottom > vh0 - 80) {
    window.scrollTo({ top: window.scrollY + r.top + r.height / 2 - vh0 * 0.42, behavior: 'instant' });
    r = el.getBoundingClientRect();
  }
  const pad = step.pad != null ? step.pad : 10;
  hole.style.opacity = '1';
  hole.style.top = (r.top - pad) + 'px';
  hole.style.left = (r.left - pad) + 'px';
  hole.style.width = (r.width + pad * 2) + 'px';
  hole.style.height = (r.height + pad * 2) + 'px';

  // 说明卡定位：优先目标下方，放不下放上方，再不行就近吸附
  // v3.1.9：教程期间底部 Tab 浮于遮罩之上，底部定位需预留其高度
  const vw = window.innerWidth, vh = window.innerHeight;
  const navEl = document.querySelector('.mobile-nav');
  const navH = (navEl && navEl.getClientRects().length) ? navEl.offsetHeight + 20 : 0;
  const cw = Math.min(340, vw - 24);
  card.style.width = cw + 'px';
  const ch = card.offsetHeight;
  let top;
  if (r.bottom + 14 + ch < vh - navH - 10) top = r.bottom + 14;
  else if (r.top - 14 - ch > 10) top = r.top - 14 - ch;
  else top = Math.max(10, Math.min(vh - ch - navH - 10, r.bottom + 14));
  card.style.top = top + 'px';
  card.style.bottom = 'auto';
  let left = r.left + r.width / 2 - cw / 2;
  left = Math.max(12, Math.min(vw - cw - 12, left));
  card.style.left = left + 'px';
}

// ===== 版本更新告知（每次升级后首次打开弹出；可查看往期） =====
function markVersionSeen() {
  const s = getSettings();
  if (s.lastSeenVersion !== APP_VERSION) {
    s.lastSeenVersion = APP_VERSION;
    saveSettings(s);
  }
}

function maybeShowWhatsNew() {
  const s = getSettings();
  if (s.lastSeenVersion === APP_VERSION) return false;
  // 全新安装（从未引导过）不弹：紧接着的新手教程就是最好的欢迎
  if (!s.onboarded && s.lastSeenVersion == null) { markVersionSeen(); return false; }
  openWhatsNew();
  return true;
}

function openWhatsNew() {
  renderWhatsNew('current');
  const m = $('#whatsNewMask');
  m.classList.add('open');
  m.setAttribute('aria-hidden', 'false');
}

function closeWhatsNew() {
  const m = $('#whatsNewMask');
  m.classList.remove('open');
  m.setAttribute('aria-hidden', 'true');
  markVersionSeen();
  // 升级后若还没看过新手教程，紧跟着补上
  setTimeout(maybeShowTutorial, 380);
}

function renderWhatsNew(view) {
  $('#wnTabCurrent').classList.toggle('active', view === 'current');
  $('#wnTabHistory').classList.toggle('active', view === 'history');
  const grp = CHANGELOG.find(g => g.v === APP_VERSION) || CHANGELOG[0];
  $('#wnVer').textContent = `v${grp.v} 更新内容`;
  $('#wnDate').textContent = grp.date;
  if (view === 'current') {
    $('#wnBody').innerHTML = `
      <div class="wn-title">${esc(grp.title)}</div>
      <ul class="wn-list">${grp.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
  } else {
    $('#wnBody').innerHTML = CHANGELOG.map(g => `
      <div class="cl-group">
        <div class="cl-head"><span class="cl-ver">v${g.v}</span><span class="cl-date">${g.date}</span><span class="cl-title">${g.title}</span></div>
        <ul class="cl-list">${g.items.map(i => `<li>${i}</li>`).join('')}</ul>
      </div>`).join('');
  }
}

function renderDrawer() {
  const s = getSettings();
  renderAllAvatars();
  renderUsageStats();   // v3.2.1：今日用时 / 累计使用时长
  if ($('#drawerName') !== document.activeElement) $('#drawerName').value = s.userName || '词友';
  $('#userNameSide').textContent = s.userName || '词友';
  $('#drawerVersion').textContent = `${APP_NAME} v${APP_VERSION}`;

  // 个人简介（有则显示）
  const bio = $('#drawerBio');
  if (s.userBio) {
    bio.textContent = s.userBio;
    bio.classList.remove('hidden');
  } else {
    bio.classList.add('hidden');
  }

  const meta = getBookMeta(s.bookId);
  const bookName = bookLabel(meta);
  $('#drawerBookName').textContent = bookName;
  $('#userBookName').textContent = bookName;

  const tasks = getTodayTasks(s.bookId);
  const done = getTodayDoneCount(s.bookId);
  const total = Math.max(done, tasks.reviews.length + tasks.news.length);
  $('#drawerTodayDone').textContent = done;
  $('#drawerTodayTotal').textContent = total;
  $('#drawerTodayFill').style.width = total ? Math.min(100, done / total * 100) + '%' : '0%';
  $('#drawerStreak').textContent = `连续打卡 ${s.streak || 0} 天`;

  const stats = computeOverallStats();
  $('#dLearned').textContent = stats.totalLearned;
  $('#dMastered').textContent = stats.mastered;
  $('#dAccuracy').textContent = stats.nSum ? Math.round(stats.okSum / stats.nSum * 100) + '%' : '—';
}

// 今日已学词数（当天有评分记录的词）
function getTodayDoneCount(bookId) {
  const prog = getLevelProgress(bookId);
  const today = todayKey();
  let done = 0;
  for (const key in prog) {
    const st = prog[key];
    if (st && st.last && todayKey(new Date(st.last)) === today) done++;
  }
  return done;
}

// 全局学习统计
function computeOverallStats() {
  const allProg = getAllProgress();
  let totalLearned = 0, mastered = 0, okSum = 0, nSum = 0;
  for (const bookId in allProg) {
    for (const key in allProg[bookId]) {
      const st = allProg[bookId][key];
      totalLearned++;
      if (st.s === 2) mastered++;
      okSum += st.ok || 0;
      nSum += st.n || 0;
    }
  }
  return { totalLearned, mastered, okSum, nSum };
}

// ===== 首页 =====
function renderBookSwitcher() {
  const cur = getSettings().bookId;
  const lists = getCustomLists();
  // v3.0.0：按用户拖拽顺序渲染 chips，自建词书角标显示 01、02…（可在设置中改为「自建」或隐藏）
  const books = getOrderedBookIds().map(id => {
    const builtin = LEVELS.find(l => l.id === id);
    if (builtin) return { id, name: builtin.name, short: builtin.short };
    return { id, name: lists[id].name, short: bookBadge(id) };
  });
  $('#homeBookSwitcher').innerHTML = books.map(b => `
    <button class="book-chip ${b.id === cur ? 'active' : ''}" data-book="${b.id}" draggable="false">
      <span class="book-chip-short">${esc(b.short)}</span>
      <span class="book-chip-name">${esc(b.name)}</span>
    </button>`).join('');
  // v3.1.9：折叠面板头部 —— 词书总数 + 当前词书名
  const countEl = $('#homeBookPanelCount');
  const curEl = $('#homeBookPanelCur');
  if (countEl) countEl.textContent = books.length;
  if (curEl) {
    const curBook = books.find(b => b.id === cur);
    curEl.textContent = curBook ? curBook.name : '';
  }
}

// ===== 首页词书面板折叠（v3.1.9：默认收起只看当前词书，状态记忆在 settings） =====
function initBookPanel() {
  const panel = $('#homeBookPanel');
  const head = $('#homeBookPanelHead');
  if (!panel || !head) return;
  const apply = (open) => {
    panel.classList.toggle('open', open);
    head.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  apply(!!getSettings().bookPanelOpen);   // 默认收起
  head.addEventListener('click', () => {
    const on = !panel.classList.contains('open');
    apply(on);
    const s = getSettings();
    s.bookPanelOpen = on;
    saveSettings(s);
  });
}

// ===== 词书 chips 拖拽排序（v3.0.0）=====
// 鼠标按下即拖；触摸需长按 280ms 进入拖拽（避免与页面滚动冲突）。
// 拖动时指针经过其他 chip 即实时换位，松手把顺序写入 settings.bookOrder。
let chipDragSuppressClick = false;
function bindChipDrag() {
  const wrap = $('#homeBookSwitcher');
  if (!wrap) return;
  let drag = null; // { chip, id, offX, offY, baseL, baseT, tx, ty, moved, pending, timer, lx, ly, pid }

  // chip 当前布局位置（去掉 transform 的影响）
  const layoutBase = (chip, tx, ty) => {
    const r = chip.getBoundingClientRect();
    return { left: r.left - tx, top: r.top - ty };
  };

  const startDrag = (pos, chip) => {
    drag.chip = chip; drag.id = chip.dataset.book;
    drag.moved = false; drag.tx = 0; drag.ty = 0;
    const r = chip.getBoundingClientRect();
    drag.offX = pos.clientX - r.left;
    drag.offY = pos.clientY - r.top;
    const b = layoutBase(chip, 0, 0);
    drag.baseL = b.left; drag.baseT = b.top;
    chip.classList.add('dragging');
    document.documentElement.classList.add('drag-lock');
    if (chip.setPointerCapture) { try { chip.setPointerCapture(drag.pid); } catch (_) { /* 忽略 */ } }
    if (navigator.vibrate) { try { navigator.vibrate(15); } catch (_) { /* 忽略 */ } }
  };

  const moveDrag = (e) => {
    const dx = e.clientX - drag.offX - drag.baseL;
    const dy = e.clientY - drag.offY - drag.baseT;
    if (!drag.moved && Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
    drag.moved = true;
    e.preventDefault();
    drag.tx = dx; drag.ty = dy;
    drag.chip.style.transform = `translate(${dx}px, ${dy}px)`;
    // 指针下是谁就实时换位：按索引前后插入（从后往前拖 → 插到目标前；从前往后拖 → 插到目标后）
    // 拖动中的 chip 会盖住指针，需临时关掉其命中检测才能探到底下的目标
    drag.chip.style.pointerEvents = 'none';
    const under = document.elementFromPoint(e.clientX, e.clientY);
    drag.chip.style.pointerEvents = '';
    const other = under && under.closest ? under.closest('.book-chip') : null;
    if (other && other !== drag.chip) {
      const chips = [...other.parentNode.querySelectorAll('.book-chip')];
      const fromIdx = chips.indexOf(drag.chip);
      const toIdx = chips.indexOf(other);
      if (fromIdx !== toIdx) {
        other.parentNode.insertBefore(drag.chip, fromIdx > toIdx ? other : other.nextSibling);
        const b = layoutBase(drag.chip, drag.tx, drag.ty);
        drag.baseL = b.left; drag.baseT = b.top;
      }
    }
  };

  const endDrag = () => {
    if (!drag) return;
    const d = drag;
    drag = null;
    clearTimeout(d.timer);
    if (d.chip) {
      d.chip.classList.remove('dragging');
      d.chip.style.transform = '';
    }
    document.documentElement.classList.remove('drag-lock');
    if (d.moved) {
      chipDragSuppressClick = true;
      setTimeout(() => { chipDragSuppressClick = false; }, 300);
      const order = [...wrap.querySelectorAll('.book-chip')].map(c => c.dataset.book);
      const s = getSettings();
      s.bookOrder = order;
      saveSettings(s);
      renderBookSwitcher();   // v3.0.2：立即按新顺序重算 01/02… 角标
      refreshBookSelect();    // v3.0.2：设置页等三处下拉同步新顺序
      toast('词书顺序已保存');
    }
  };

  wrap.addEventListener('pointerdown', (e) => {
    const chip = e.target.closest('.book-chip');
    if (!chip || drag) return;
    if (e.button !== undefined && e.button !== 0) return;
    if (e.pointerType === 'touch') {
      // 触摸：长按 280ms 才进入拖拽，期间可正常滚动页面
      drag = { pending: true, chip, lx: e.clientX, ly: e.clientY, pid: e.pointerId, moved: false };
      drag.timer = setTimeout(() => {
        if (drag && drag.pending) {
          drag.pending = false;
          startDrag({ clientX: drag.lx, clientY: drag.ly }, chip);
        }
      }, 280);
    } else {
      drag = { pending: false, chip, lx: e.clientX, ly: e.clientY, pid: e.pointerId };
      startDrag(e, chip);
    }
  });
  wrap.addEventListener('pointermove', (e) => {
    if (!drag) return;
    if (drag.pending) { drag.lx = e.clientX; drag.ly = e.clientY; return; }
    moveDrag(e);
  });
  const onUp = () => {
    if (drag && drag.pending) { clearTimeout(drag.timer); drag = null; return; }
    endDrag();
  };
  wrap.addEventListener('pointerup', onUp);
  wrap.addEventListener('pointercancel', onUp);
  // 拖拽激活时阻止页面滚动（触摸场景）
  document.addEventListener('touchmove', (e) => {
    if (drag && !drag.pending && drag.moved) e.preventDefault();
  }, { passive: false });
}

function changeGoal(delta) {
  const s = getSettings();
  s.dailyGoal = Math.max(5, Math.min(200, (s.dailyGoal || 20) + delta));
  saveSettings(s);
  renderHome();
  renderSettingsValues();
  updateMiniProgress();
  // 同步学习页：目标变了，今日任务拆解与步进器都要跟着刷新
  if ($('#view-study').classList.contains('active')) renderStudyIntro();
}
/* 步进器每次点 ±5；长按可连续调整 */
function bindGoalStepper(minusSel, plusSel, getCur) {
  const step = (sel, d) => {
    const el = $(sel);
    if (!el) return;
    let timer = null, delay = null, count = 0;
    const fire = () => { changeGoal(d); el.classList.add('pressed'); setTimeout(() => el.classList.remove('pressed'), 140); };
    el.addEventListener('pointerdown', () => {
      count = 0;
      delay = setTimeout(() => { timer = setInterval(() => { count++; fire(); }, 90); }, 420);
    });
    const stop = () => {
      clearTimeout(delay); clearInterval(timer);
      timer = null; delay = null;
    };
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => el.addEventListener(ev, stop));
    el.addEventListener('click', () => { if (count === 0) fire(); stop(); });
    return el;
  };
  step(minusSel, -5);
  step(plusSel, 5);
}

/* ===== 考试倒计时 + 智能每日计划（v2.9.0）=====
   原理：按「剩余天数 × 85%（预留复习高峰）」均摊剩余新词，给出建议每日新词量 */
function daysUntil(dateStr) {
  const [y, m, d] = String(dateStr || '').split('-').map(Number);
  if (!y || !m || !d) return NaN;
  // v3.1.3：按自然日差计算（此前用 23:59:59 + ceil，考试当天算 1 天导致
  // 「考试日」分支永远不触发，考完次日又误显示为 0 天）
  const exam = new Date(y, m - 1, d);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((exam - today) / 86400000);
}

function smartDailyTarget(days, remaining) {
  const effDays = Math.max(1, Math.floor(days * 0.85));
  return Math.max(5, Math.min(200, Math.ceil(remaining / effDays)));
}

function renderExamCard() {
  const card = $('#examCard');
  if (!card) return;
  const s = getSettings();
  if (!s.examDate) {
    // 未设置：展示幽灵引导卡，点击去设置
    card.classList.remove('hidden');
    card.classList.add('ghost');
    card.innerHTML = `
      <div class="exam-meta">
        <div class="exam-name">📅 设定考试倒计时</div>
        <div class="exam-sub">在 设置 → 学习设置 里填入考试名与日期，开启倒计时与智能每日计划 ›</div>
      </div>`;
    return;
  }
  const name = (s.examName || '考试').trim();
  const days = daysUntil(s.examDate);
  if (isNaN(days)) { card.classList.add('hidden'); return; }
  // v3.1.3：正常显示路径此前从未移除初始 hidden——设置考试后首页永远不显示倒计时卡
  card.classList.remove('hidden');
  card.classList.remove('ghost');

  if (days < 0) {
    card.innerHTML = `
      <div class="exam-days"><span class="exam-emoji">✓</span><small>已结束</small></div>
      <div class="exam-meta">
        <div class="exam-name">${esc(name)}已结束</div>
        <div class="exam-sub">辛苦了！可在 设置 → 学习设置 清除或设置下一场考试</div>
      </div>`;
    return;
  }

  const remaining = getTodayTasks(s.bookId).newsTotal;
  if (days === 0 || remaining === 0) {
    card.innerHTML = `
      <div class="exam-days">${days === 0 ? '<span class="exam-emoji">🎉</span>' : days}<small>${days === 0 ? '考试日' : '天'}</small></div>
      <div class="exam-meta">
        <div class="exam-name">距离${esc(name)}${days === 0 ? '就是今天，全力以赴！' : '还有 ' + days + ' 天'}</div>
        <div class="exam-sub">${remaining === 0 ? '词库已全部学完，保持复习节奏，祝考试顺利！' : '词库还剩 ' + remaining + ' 个新词，抓紧最后冲刺'}</div>
      </div>`;
    return;
  }

  const target = smartDailyTarget(days, remaining);
  const isCurrent = (s.dailyGoal || 20) === target;
  card.innerHTML = `
    <div class="exam-days">${days}<small>天</small></div>
    <div class="exam-meta">
      <div class="exam-name">距离${esc(name)}还有 ${days} 天</div>
      <div class="exam-sub">词库剩 ${remaining} 个新词 · 预留复习余量后，建议每日新词 <b>${target}</b> 个</div>
    </div>
    <button class="btn ${isCurrent ? 'btn-outline' : 'btn-primary'} exam-apply" id="examApplyBtn"${isCurrent ? ' disabled' : ''}>${isCurrent ? '已是建议量' : '采用建议'}</button>`;
}

function applyExamSuggestion() {
  const s = getSettings();
  const days = daysUntil(s.examDate);
  if (isNaN(days) || days <= 0) return;
  const remaining = getTodayTasks(s.bookId).newsTotal;
  const target = smartDailyTarget(days, remaining);
  s.dailyGoal = target;
  saveSettings(s);
  $('#goalValue').textContent = target;
  $('#studyGoalValue').textContent = target;
  $('#setGoalValue').textContent = target;
  renderExamCard();
  toast(`已把每日新词设为 ${target} 个，冲！`);
}

function saveExamSetting() {
  const s = getSettings();
  s.examName = $('#setExamName').value.trim().slice(0, 12);
  s.examDate = $('#setExamDate').value;
  saveSettings(s);
  renderHome();
}

function renderHome() {
  const s = getSettings();
  const bookId = s.bookId;
  const meta = getBookMeta(bookId);
  const prog = getLevelProgress(bookId);
  const words = getWords(bookId);

  // v3.1.7：问候语 = 昵称 + 时段
  const h = new Date().getHours();
  const period = h < 5 ? '夜深了' : h < 9 ? '早上好' : h < 12 ? '上午好' : h < 14 ? '中午好' : h < 18 ? '下午好' : '晚上好';
  const greet = $('#greetTitle');
  if (greet) greet.textContent = `${s.userName || '词友'}，${period}`;

  renderExamCard();
  renderBookSwitcher();
  $('#goalValue').textContent = s.dailyGoal;

  let learned = 0, mastered = 0, reviewing = 0;
  for (const w of words) {
    const st = prog[wordKey(w.w)];
    if (!st) continue;
    learned++;
    if (st.s === 2) mastered++;
    else reviewing++;
  }

  $('#homeTotalWords').textContent = meta ? meta.count : 0;
  $('#homeLearned').textContent = learned;
  $('#homeReviewing').textContent = reviewing;
  $('#homeMastered').textContent = mastered;

  const tasks = getTodayTasks(bookId);
  $('#homeDueBadge').textContent = tasks.reviews.length > 0 ? `${tasks.reviews.length} 个待复习` : '无到期复习';
  $('#homeTaskBreakdown').innerHTML = `
    <div class="task-chip review"><div class="num">${tasks.reviews.length}</div><div class="lbl">到期复习</div></div>
    <div class="task-chip new"><div class="num">${tasks.news.length}</div><div class="lbl">今日新词</div></div>
  `;

  // 词书概况（分层）
  const total = meta ? meta.count : 1;
  const tiers = { 1: 0, 2: 0, 3: 0 };
  for (const w of words) tiers[w.tier] = (tiers[w.tier] || 0) + 1;
  $('#homeBookOverview').innerHTML = [1, 2, 3].map(t => `
    <div class="tier-row">
      <span class="tier-dot t${t}"></span>
      <span class="tier-name">${TIER_NAMES[t]}</span>
      <div class="tier-bar"><div class="tier-bar-fill" style="width:${(tiers[t] / Math.max(1, total) * 100).toFixed(1)}%;background:${TIER_COLORS[t]}"></div></div>
      <span class="tier-num">${tiers[t]}</span>
    </div>`).join('');

  // 错词本入口
  $('#mistakeCount').textContent = getMistakeWords(bookId).length;

  // 学习概况（首页小卡）
  const stats = computeOverallStats();
  const today = getTodayDoneCount(bookId);
  $('#homeMiniStats').innerHTML = `
    <div class="mini-stat"><div class="ms-num">${s.streak || 0}</div><div class="ms-lbl">连续打卡</div></div>
    <div class="mini-stat"><div class="ms-num accent-green">${stats.totalLearned}</div><div class="ms-lbl">累计学习</div></div>
    <div class="mini-stat"><div class="ms-num accent-blue">${stats.mastered}</div><div class="ms-lbl">已掌握</div></div>
    <div class="mini-stat"><div class="ms-num accent-orange">${today}</div><div class="ms-lbl">今日学习</div></div>
  `;
  $('#homeWeekChart').innerHTML = buildBarChart(7);
}

// ===== 学习（背诵 + 复习） =====
let studyQueue = [];
let studyIndex = 0;
let studyBookId = null;

function renderStudyIntro() {
  const s = getSettings();
  const bookId = s.bookId;
  const tasks = getTodayTasks(bookId);
  $('#studyPlan').innerHTML = `
    <div class="task-breakdown">
      <div class="task-chip review"><div class="num">${tasks.reviews.length}</div><div class="lbl">到期复习</div></div>
      <div class="task-chip new"><div class="num">${tasks.news.length}</div><div class="lbl">今日新词</div></div>
    </div>`;
  $('#optAutoPlay').checked = s.autoPlay;
  $('#studyGoalValue').textContent = s.dailyGoal;
  $('#studyIntro').classList.remove('hidden');
  $('#studyCard').classList.add('hidden');
  $('#studyDone').classList.add('hidden');

  // 检测未完成的学习会话
  const sess = loadJSON(LS.studySession, null);
  const hasSession = sess && sess.kind === 'study' && sess.index < sess.words.length;
  $('#studyResumeBtn').classList.toggle('hidden', !hasSession);
  // 有未完成会话时，把「继续」放主位、「开始」降为次级，避免两个大按钮挤在一起
  $('#studyActions').classList.toggle('has-resume', !!hasSession);
  if (hasSession) $('#resumeCount').textContent = sess.words.length - sess.index;
}

// ===== 学习会话持久化 =====
function saveStudySession() {
  if (!studyQueue || studyQueue.length === 0) return;
  saveJSON(LS.studySession, {
    kind: 'study',
    bookId: studyBookId,
    words: studyQueue.map(i => wordKey(i.word.w)),
    types: studyQueue.map(i => i.type),
    index: studyIndex,
  });
}
function clearStudySession() { localStorage.removeItem(LS.studySession); }
function clearQuizSession() { localStorage.removeItem(LS.quizSession); }

function resumeStudy() {
  const sess = loadJSON(LS.studySession, null);
  if (!sess || sess.kind !== 'study') return;
  studyBookId = sess.bookId;
  studyQueue = [];
  for (let i = 0; i < sess.words.length; i++) {
    const w = lookupWord(sess.bookId, sess.words[i]);
    if (w) studyQueue.push({ word: w, type: sess.types[i] || 'review' });
  }
  if (studyQueue.length === 0) { clearStudySession(); toast('上次的单词已不存在'); return; }
  studyIndex = Math.min(sess.index || 0, studyQueue.length);
  if (studyIndex >= studyQueue.length) { clearStudySession(); return; }
  $('#studyIntro').classList.add('hidden');
  $('#studyDone').classList.add('hidden');
  $('#studyCard').classList.remove('hidden');
  showStudyCard();
}

function startStudy() {
  const bookId = getSettings().bookId;
  const tasks = getTodayTasks(bookId);
  const queue = [];
  for (const w of tasks.reviews) queue.push({ word: w, type: 'review' });
  for (const w of tasks.news) queue.push({ word: w, type: 'new' });

  if (queue.length === 0) {
    $('#studyIntro').classList.remove('hidden');
    toast('今日没有需要学习的单词');
    return;
  }
  studyBookId = bookId;
  studyQueue = queue;
  studyIndex = 0;
  saveStudySession();
  $('#studyIntro').classList.add('hidden');
  $('#studyDone').classList.add('hidden');
  $('#studyCard').classList.remove('hidden');
  showStudyCard();
}

function showStudyCard() {
  const item = studyQueue[studyIndex];
  const w = item.word;
  $('#flashWord').textContent = w.w;
  $('#flashPhonetic').textContent = w.p ? `/${w.p}/` : '';
  $('#flashMeaning').textContent = w.m;
  const posMatch = String(w.m || '').match(/^([a-z]+\.)\s*/i);
  $('#flashPos').textContent = posMatch ? posMatch[1] : '';

  const showEx = getSettings().showExample && (!!w.e || !!w.ec);
  $('#flashExample').classList.toggle('hidden', !showEx || !w.e);
  $('#flashExampleCn').classList.toggle('hidden', !showEx || !w.ec);
  $('#flashExample').textContent = w.e || '';
  $('#flashExampleCn').textContent = w.ec || '';

  // 重置卡片（翻回正面）
  $('#gradeButtons').classList.add('hidden');
  $('#flashcard').classList.remove('revealed');

  const total = studyQueue.length;
  $('#studyProgressText').textContent = `${studyIndex + 1} / ${total}`;
  $('#studyProgressFill').style.width = `${((studyIndex) / total * 100)}%`;

  if (getSettings().autoPlay) speak(w.w);
}

function revealCard() {
  if ($('#flashcard').classList.contains('revealed')) return;
  $('#flashcard').classList.add('revealed');
  $('#gradeButtons').classList.remove('hidden');
}

function gradeCurrent(grade) {
  const item = studyQueue[studyIndex];
  applyGrade(studyBookId, item.word.w, grade);
  studyIndex++;
  if (studyIndex >= studyQueue.length) {
    clearStudySession();
    finishStudy();
  } else {
    saveStudySession();
    showStudyCard();
  }
}

function finishStudy() {
  markStudiedToday();
  $('#studyCard').classList.add('hidden');
  $('#studyDone').classList.remove('hidden');
  const n = studyQueue.filter(i => i.type === 'new').length;
  const r = studyQueue.length - n;
  $('#studyDoneSummary').textContent = `本次复习 ${r} 个、新学 ${n} 个单词。坚持就是胜利！`;
  renderHome();
  renderDrawer();
  updateMiniProgress();
}

// ===== 测验 =====
let quizQueue = [];
let quizIndex = 0;
let quizBookId = null;
let quizCorrectCount = 0;
let quizWrongList = [];
let quizType = 'word2cn';
let currentSpellWord = null;
let quizAnswered = false;

function resetQuizSetup() {
  $('#quizSetup').classList.remove('hidden');
  $('#quizArea').classList.add('hidden');
  $('#quizResult').classList.add('hidden');
  // 检测未完成的自测会话
  const sess = loadJSON(LS.quizSession, null);
  const hasSession = sess && sess.kind === 'quiz' && sess.index < sess.words.length;
  $('#quizResumeBtn').classList.toggle('hidden', !hasSession);
  if (hasSession) $('#quizResumeCount').textContent = sess.words.length - sess.index;
}

function saveQuizSession() {
  if (!quizQueue || quizQueue.length === 0) return;
  saveJSON(LS.quizSession, {
    kind: 'quiz',
    bookId: quizBookId,
    quizType: quizType,
    words: quizQueue.map(w => wordKey(w.w)),
    index: quizIndex,
    correct: quizCorrectCount,
    wrong: quizWrongList.map(w => wordKey(w.w)),
  });
}

function resumeQuiz() {
  const sess = loadJSON(LS.quizSession, null);
  if (!sess || sess.kind !== 'quiz') return;
  quizBookId = sess.bookId;
  quizType = sess.quizType || 'word2cn';
  quizQueue = [];
  for (const key of sess.words) {
    const w = lookupWord(sess.bookId, key);
    if (w) quizQueue.push(w);
  }
  if (quizQueue.length === 0) { clearQuizSession(); toast('上次测验的单词已不存在'); return; }
  quizIndex = Math.min(sess.index || 0, quizQueue.length);
  if (quizIndex >= quizQueue.length) { clearQuizSession(); return; }
  quizCorrectCount = sess.correct || 0;
  quizWrongList = (sess.wrong || []).map(k => lookupWord(sess.bookId, k)).filter(Boolean);
  $('#quizSetup').classList.add('hidden');
  $('#quizResult').classList.add('hidden');
  $('#quizArea').classList.remove('hidden');
  showQuizQuestion();
}

function startQuiz() {
  const bookId = getSettings().bookId;
  const scope = $('#quizScope').value;
  const count = parseInt($('#quizCount').value, 10);
  const type = $('#quizType').value;
  quizBookId = bookId;
  quizType = type;

  const words = getWords(bookId);
  const prog = getLevelProgress(bookId);
  const now = Date.now();
  let pool = [];
  for (const w of words) {
    const st = prog[wordKey(w.w)];
    if (scope === 'new' && st) continue;
    if (scope === 'learning' && (!st || st.s !== 1)) continue;
    if (scope === 'review' && (!st || st.s !== 1 || !st.due || dueToMs(st.due) > now)) continue;
    pool.push(w);
  }
  if (pool.length === 0) { toast('该范围内暂无单词'); return; }

  quizQueue = shuffle(pool).slice(0, count);
  quizIndex = 0;
  quizCorrectCount = 0;
  quizWrongList = [];
  quizAnswered = false;
  saveQuizSession();

  $('#quizSetup').classList.add('hidden');
  $('#quizResult').classList.add('hidden');
  $('#quizArea').classList.remove('hidden');
  showQuizQuestion();
}

function showQuizQuestion() {
  const w = quizQueue[quizIndex];
  const total = quizQueue.length;
  quizAnswered = false;
  $('#quizProgressText').textContent = `${quizIndex + 1} / ${total}`;
  $('#quizProgressFill').style.width = `${(quizIndex / total * 100)}%`;
  $('#quizFeedback').classList.add('hidden');
  $('#quizNextBtn').classList.add('hidden');

  // 拼写测试：显示释义 + 音标提示，手动输入英文
  if (quizType === 'spell') {
    currentSpellWord = w;
    $('#quizPrompt').textContent = w.m;
    $('#quizSub').textContent = w.p ? `音标提示：/${w.p}/` : '请输入对应的英文单词';
    $('#quizOptions').classList.add('hidden');
    $('#quizSpell').classList.remove('hidden');
    const input = $('#spellInput');
    input.value = '';
    setTimeout(() => input.focus(), 0);
    return;
  }

  $('#quizSpell').classList.add('hidden');
  $('#quizOptions').classList.remove('hidden');

  const allWords = getWords(quizBookId);
  // 生成 3 个干扰项
  const distractors = shuffle(allWords.filter(x => wordKey(x.w) !== wordKey(w.w) && x.m)).slice(0, 3);
  if (distractors.length < 3) {
    // 干扰项不足时从所有词库补
    for (const lvl of Object.keys(window.BUILTIN_WORDS)) {
      if (distractors.length >= 3) break;
      for (const x of window.BUILTIN_WORDS[lvl]) {
        if (distractors.length >= 3) break;
        if (wordKey(x.w) !== wordKey(w.w) && !distractors.some(d => d.m === x.m)) distractors.push(x);
      }
    }
  }

  let prompt, sub, options;
  if (quizType === 'word2cn') {
    prompt = w.w;
    sub = w.p ? `/${w.p}/` : '';
    options = shuffle([w, ...distractors].map(x => ({ text: x.m, correct: wordKey(x.w) === wordKey(w.w) })));
  } else {
    prompt = w.m;
    sub = '';
    options = shuffle([w, ...distractors].map(x => ({ text: x.w, correct: wordKey(x.w) === wordKey(w.w) })));
  }

  $('#quizPrompt').textContent = prompt;
  $('#quizSub').textContent = sub;
  const box = $('#quizOptions');
  box.innerHTML = '';
  options.forEach((opt, i) => {
    const btn = document.createElement('div');
    btn.className = 'quiz-option';
    // 用数据标记正确答案，避免同文案导致的误判
    btn.dataset.correct = opt.correct ? '1' : '0';
    btn.innerHTML = `<span class="quiz-opt-key">${String.fromCharCode(65 + i)}.</span>${esc(opt.text)}`;
    btn.addEventListener('click', () => answerQuiz(btn, w));
    box.appendChild(btn);
  });
}

function submitSpell() {
  if (quizType !== 'spell' || !currentSpellWord) return;
  if (quizAnswered) return; // 防止重复提交
  quizAnswered = true;
  const w = currentSpellWord;
  const val = $('#spellInput').value.trim().toLowerCase().replace(/\s+/g, ' ');
  const target = wordKey(w.w);
  const correct = val === target;
  const fb = $('#quizFeedback');
  fb.classList.remove('hidden');

  if (correct) {
    quizCorrectCount++;
    fb.textContent = '✔ 拼写正确';
    fb.className = 'quiz-feedback ok';
    applyGrade(quizBookId, w.w, 'good');
  } else {
    quizWrongList.push(w);
    fb.textContent = `✘ 拼写错误，正确答案是：${w.w}`;
    fb.className = 'quiz-feedback no';
    applyGrade(quizBookId, w.w, 'again');
  }
  saveQuizSession();
  $('#quizNextBtn').classList.remove('hidden');
  $('#spellInput').blur();
}

function answerQuiz(btn, w) {
  if (quizAnswered) return;
  quizAnswered = true;
  const opts = $$('#quizOptions .quiz-option');
  opts.forEach(o => o.classList.add('disabled'));
  const fb = $('#quizFeedback');
  fb.classList.remove('hidden');

  // 高亮正确项（依赖数据标记，不依赖文案比对）
  opts.forEach(o => { if (o.dataset.correct === '1') o.classList.add('correct'); });

  const correct = btn.dataset.correct === '1';
  if (correct) {
    quizCorrectCount++;
    fb.textContent = '✔ 回答正确';
    fb.className = 'quiz-feedback ok';
    applyGrade(quizBookId, w.w, 'good');
  } else {
    btn.classList.add('wrong');
    quizWrongList.push(w);
    fb.textContent = `✘ 回答错误，正确答案是：${w.w} — ${w.m}`;
    fb.className = 'quiz-feedback no';
    applyGrade(quizBookId, w.w, 'again');
  }
  saveQuizSession();
  $('#quizNextBtn').classList.remove('hidden');
}

function nextQuiz() {
  quizIndex++;
  if (quizIndex >= quizQueue.length) {
    clearQuizSession();
    finishQuiz();
  } else {
    saveQuizSession();
    showQuizQuestion();
  }
}

function finishQuiz() {
  markStudiedToday();
  $('#quizArea').classList.add('hidden');
  $('#quizResult').classList.remove('hidden');
  const total = quizQueue.length;
  $('#quizCorrect').textContent = quizCorrectCount;
  $('#quizWrong').textContent = total - quizCorrectCount;
  $('#quizAccuracy').textContent = total ? Math.round(quizCorrectCount / total * 100) + '%' : '0%';
  $('#quizReviewList').innerHTML = quizWrongList.map(w => `
    <div class="quiz-review-row">
      <span class="w">${esc(w.w)}</span>
      <span class="m">${esc(w.m)}</span>
      <span class="mark no">✘</span>
    </div>`).join('') || '<p class="muted">全部答对，太棒了！</p>';
}

/* =========================================================================
 * 速记（v2.1 重构）
 * - 词书直接跟随当前选择的词书，页内不再放置切换条
 * - 遮罩按钮合并「隐藏中文 / 隐藏英文」：关 → 隐中文 → 隐英文(音标同隐)，三档循环
 * - 分页渲染：只画当前页，翻页后遮罩重置，长词书内存占用大幅下降
 * - 顺序 / 勾选 / 页码按词书持久化，任何操作即时保存
 * ========================================================================= */
let roteWords = [];        // 当前展示顺序的词对象（整本词书）
let roteBookId = null;     // 跟随 getSettings().bookId
let roteMask = 'off';      // off | cn | en
let roteOnlyUndone = false;
let roteMarks = {};        // { wordKey: 1|2|3 }  1=已掌握(✓) 2=不太熟(△) 3=不认识·本轮已学(红圈)
let roteOrder = [];        // [wordKey, ...]
let roteRevealed = {};     // { wordKey: { en, cn } }（仅当前页，翻页即清空）
let rotePage = 1;
let roteSavedAt = null;

const ROTE_MASK_ORDER = ['off', 'cn', 'en'];
const ROTE_MASK_LABEL = { off: '遮罩 · 关', cn: '遮罩 · 隐中文', en: '遮罩 · 隐英文' };

// 三态标记：点击循环 空 → 1 → 2 → 3 → 空
const MARK_META = {
  1: { cls: 'done', label: '已掌握' },
  2: { cls: 'half', label: '不太熟' },
  3: { cls: 'seen', label: '不认识·本轮已学' },
};
const MARK_SVG = {
  0: '',
  1: '<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 4.6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  2: '<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 3.2L13.6 12.4H2.4Z" fill="currentColor"/></svg>',
  3: '<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><circle cx="8" cy="8" r="4.6" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>',
};

function getRoteStore() { return loadJSON(LS.rote, {}); }

function loadRoteState(bookId) {
  const store = getRoteStore();
  const rec = store[bookId] || {};
  // v2.7.0：勾选升级为三态标记；旧存档 checked:{k:true} 迁移为 marks:{k:1}
  roteMarks = rec.marks ? Object.assign({}, rec.marks) : {};
  if (!rec.marks && rec.checked) {
    for (const k in rec.checked) if (rec.checked[k]) roteMarks[k] = 1;
  }
  roteOrder = Array.isArray(rec.order) ? rec.order : [];
  roteSavedAt = rec.savedAt || null;
  rotePage = Math.max(1, parseInt(rec.page, 10) || 1);
}

function saveRoteState() {
  const store = getRoteStore();
  const s = getSettings();
  // 保留其它词书的状态
  store[roteBookId] = {
    marks: roteMarks,
    // 兼容旧版本备份/回滚：把「已掌握」同步写一份二态 checked
    checked: Object.fromEntries(Object.entries(roteMarks).filter(([, v]) => v === 1).map(([k]) => [k, true])),
    order: roteWords.map(w => wordKey(w.w)),
    page: rotePage,
    savedAt: Date.now(),
  };
  // 速记偏好同步进设置
  s.roteMask = roteMask;
  s.roteOnlyUndone = roteOnlyUndone;
  saveSettings(s);
  saveJSON(LS.rote, store);
  roteSavedAt = store[roteBookId].savedAt;
  renderRoteProgress();
}

// 按持久化的 order 重建展示顺序；新词（不在 order 中）按原顺序追加
function buildRoteWords() {
  const words = getWords(roteBookId);
  const byKey = {};
  for (const w of words) byKey[wordKey(w.w)] = w;

  const list = [];
  const seen = {};
  for (const k of roteOrder) {
    if (byKey[k] && !seen[k]) { list.push(byKey[k]); seen[k] = true; }
  }
  // 词书更新后新增的词 / 或从未保存过顺序
  const rest = words.filter(w => !seen[wordKey(w.w)]);
  if (rest.length) {
    rest.sort((a, b) => ((a.tier || 3) - (b.tier || 3)) || ((a.r || 0) - (b.r || 0)));
    list.push(...rest);
  }
  roteWords = list;
  // order 同步（剔除已删除的词）
  roteOrder = list.map(w => wordKey(w.w));
}

function renderRote() {
  const s = getSettings();
  // 词书直接跟随当前词书；若词书已被删除则回退到内置四级
  roteBookId = getBookMeta(s.bookId) ? s.bookId : 'cet4';

  // 兼容旧版本遗留的 roteHideEn / roteHideCn 设置与已移除的「全隐」档
  roteMask = ROTE_MASK_ORDER.includes(s.roteMask)
    ? s.roteMask
    : (s.roteMask === 'all' || (s.roteHideEn && s.roteHideCn) ? 'cn' : s.roteHideEn ? 'en' : s.roteHideCn ? 'cn' : 'off');
  roteOnlyUndone = !!s.roteOnlyUndone;
  roteRevealed = {};

  loadRoteState(roteBookId);
  buildRoteWords();
  syncRoteButtons();
  renderRoteList();
  renderRoteProgress();
}

function syncRoteButtons() {
  const mask = $('#roteMaskBtn'), only = $('#roteOnlyUndone');
  mask.textContent = ROTE_MASK_LABEL[roteMask];
  mask.classList.toggle('active', roteMask !== 'off');
  only.textContent = roteOnlyUndone ? '显示全部' : '只看未掌握';
  only.classList.toggle('active', roteOnlyUndone);
}

function renderRoteProgress() {
  const total = roteWords.length;
  let marked = 0, mastered = 0;
  for (const w of roteWords) {
    const m = roteMarks[wordKey(w.w)] || 0;
    if (m) marked++;
    if (m === 1) mastered++;
  }
  $('#roteDoneCount').textContent = marked;
  $('#roteTotalCount').textContent = total;
  $('#roteProgressFill').style.width = total ? (marked / total * 100).toFixed(1) + '%' : '0%';
  // 保存状态提示（含当前词书与三态说明）
  const meta = getBookMeta(roteBookId);
  const when = roteSavedAt ? formatTime(roteSavedAt) : null;
  $('#roteHintText').textContent = `词书「${meta ? meta.name : '—'}」 · 点方框循环：✓ 已掌握 → △ 不太熟 → 红圈 不认识 · ${when ? '已自动保存（' + when + '）' : '所有操作自动保存'}`;
  // 标题数字旁标注已掌握数
  const doneLabel = $('#roteDoneLabel');
  if (doneLabel) doneLabel.textContent = marked === mastered ? '已标记' : `已标记（含已掌握 ${mastered}）`;
}

function formatTime(ts) {
  const d = new Date(ts);
  const today = todayKey();
  const hm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  return todayKey(d) === today ? `今天 ${hm}` : `${todayKey(d)} ${hm}`;
}

// 「只看未掌握」过滤后的完整列表（分页在此之上进行）：未打钩 或 标记为 △/红圈 的都算未掌握
function roteFilteredWords() {
  return roteOnlyUndone ? roteWords.filter(w => (roteMarks[wordKey(w.w)] || 0) !== 1) : roteWords;
}

function renderRoteList() {
  const body = $('#roteList');
  const pager = $('#rotePager');
  const list = roteFilteredWords();
  const size = Math.min(ROTE_PAGE_MAX, Math.max(ROTE_PAGE_MIN, parseInt(getSettings().rotePageSize, 10) || 100));
  const totalPages = Math.max(1, Math.ceil(list.length / size));
  if (rotePage > totalPages) rotePage = totalPages;
  if (rotePage < 1) rotePage = 1;

  const start = (rotePage - 1) * size;
  const pageWords = list.slice(start, start + size);

  if (list.length === 0) {
    body.innerHTML = roteOnlyUndone
      ? '<p class="muted rote-empty">没有「未掌握」的单词了：整本词书都已是 ✓ 已掌握，太棒了！点「显示全部」可以回顾。</p>'
      : '<p class="muted rote-empty">当前词书没有单词。</p>';
    pager.classList.add('hidden');
    pager.innerHTML = '';
  } else {
    // 只渲染当前页，翻页后遮罩重置（roteRevealed 已清空）
    const frag = document.createDocumentFragment();
    pageWords.forEach((w, idx) => {
      const k = wordKey(w.w);
      const rev = roteRevealed[k] || {};
      const mk = roteMarks[k] || 0;
      const mkMeta = MARK_META[mk];
      const enMasked = roteMask === 'en' && !rev.en;
      const cnMasked = roteMask === 'cn' && !rev.cn;
      const phon = w.p ? '/' + esc(w.p) + '/' : '';

      const row = document.createElement('div');
      row.className = 'rote-item' + (mkMeta ? ' ' + mkMeta.cls : '');
      row.dataset.k = k;
      row.innerHTML = `
        <button class="rote-check" data-act="check" role="checkbox" aria-checked="${mk === 1}"
          aria-label="${esc(w.w)}：${mkMeta ? mkMeta.label : '未标记'}，点击切换"
          title="${mkMeta ? mkMeta.label + '（点击切换）' : '点击标记为已掌握'}">${MARK_SVG[mk] || ''}</button>
        <div class="rote-index">${start + idx + 1}</div>
        <div class="rote-ew"><div class="rote-en ${enMasked ? 'masked' : ''}" data-part="en" data-w="${esc(k)}">${enMasked ? '••••••' : esc(w.w)}</div><div class="rote-phon ${enMasked ? 'masked' : ''}" data-part="phon" data-w="${esc(k)}">${enMasked ? '••••' : phon}</div></div>
        <div class="rote-cn ${cnMasked ? 'masked' : ''}" data-part="cn" data-w="${esc(k)}">${cnMasked ? '••••••' : esc(w.m)}</div>`;
      // v2.7.2：行内不再放「已掌握/不太熟/本轮已学」角标，说明统一放顶部图例
      frag.appendChild(row);
    });
    body.innerHTML = '';
    body.appendChild(frag);
    // 翻页 / 重绘时列表轻快浮入（强制回流重启动画）
    body.classList.remove('turn');
    void body.offsetWidth;
    body.classList.add('turn');
  }

  // 分页信息（吸顶栏）+ 翻页按钮（列表底部）
  $('#rotePageInfo').textContent = list.length === 0
    ? ''
    : `共 ${list.length} 词 · 第 ${rotePage}/${totalPages} 页 · 每页 ${size}`;
  // 省略式页码：1 2 3 … 49 50，头尾随时可达；词少时只留「每页词数」输入
  let html = '';
  if (totalPages > 1) {
    html += `<button class="page-btn" data-page="${rotePage - 1}" ${rotePage <= 1 ? 'disabled' : ''}>‹ 上一页</button>`;
    for (const p of rotePageList(rotePage, totalPages)) {
      html += p === '…'
        ? '<span class="page-ellipsis" aria-hidden="true">…</span>'
        : `<button class="page-btn ${p === rotePage ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }
    html += `<button class="page-btn" data-page="${rotePage + 1}" ${rotePage >= totalPages ? 'disabled' : ''}>下一页 ›</button>`;
  }
  // 底部一并呈现「每页词数」输入，翻页顺手可调
  html += `<span class="page-size-wrap"><span class="page-size-label">每页</span>${pageSizeInputHTML(size)}<span class="page-size-label">词</span></span>`;
  pager.classList.remove('hidden');
  pager.innerHTML = html;
}

/* 省略式页码序列：头尾页常驻，当前页 ±1 展开，其余用 … 折叠
   例：第 1 页 → 1 2 3 4 … 49 50；第 25 页 → 1 … 24 25 26 … 50 */
function rotePageList(cur, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (cur <= 3) return [1, 2, 3, 4, '…', total - 1, total];
  if (cur >= total - 2) return [1, 2, '…', total - 3, total - 2, total - 1, total];
  return [1, '…', cur - 1, cur, cur + 1, '…', total];
}

/* 速记/设置通用的「每页词数」输入框：可直接键入任意数值 */
const ROTE_PAGE_MIN = 10, ROTE_PAGE_MAX = 1000;
function pageSizeInputHTML(cur, id) {
  return `<input type="number" class="page-size-input"${id ? ` id="${id}"` : ''} `
    + `min="${ROTE_PAGE_MIN}" max="${ROTE_PAGE_MAX}" step="10" value="${cur}" `
    + `inputmode="numeric" aria-label="每页词数">`;
}

// 翻页：遮罩重置 + 只渲染新一页 + 页码持久化
function roteGotoPage(p) {
  rotePage = p;
  roteRevealed = {};
  saveRoteState();
  renderRoteList();
}

/* 统一修改「速记每页词数」：设置页与速记分页栏共用
   - 只改设置并回到第一页，不立刻重渲染（避免连续输入时列表跳动） */
function setRotePageSize(n, opts) {
  n = Math.min(ROTE_PAGE_MAX, Math.max(ROTE_PAGE_MIN, parseInt(n, 10) || 100));
  const s = getSettings();
  if (s.rotePageSize === n) { if (opts && opts.silent !== true) toast(`速记每页 ${n} 词`); return; }
  s.rotePageSize = n;
  saveSettings(s);
  // 同步所有入口（设置页输入框 / 速记底部输入框）
  const selSet = $('#setRotePageSize');
  if (selSet && String(selSet.value) !== String(n)) selSet.value = String(n);
  $$('#rotePager .page-size-input').forEach(inp => { if (String(inp.value) !== String(n)) inp.value = String(n); });
  if ($('#view-rote').classList.contains('active')) { rotePage = 1; roteRevealed = {}; saveRoteState(); renderRoteList(); }
  if (!opts || opts.silent !== true) toast(`速记每页 ${n} 词`);
}

/* 搜索直达已按用户要求在 v2.6.2 移除；翻页改用省略式页码直达任意页 */

// 三态标记循环：空 → ✓已掌握 → △不太熟 → 红圈不认识 → 空（即时反馈，不立即重排）
function roteToggleCheck(k) {
  const cur = roteMarks[k] || 0;
  const next = cur >= 3 ? 0 : cur + 1;
  if (next === 0) delete roteMarks[k];
  else roteMarks[k] = next;

  const row = $(`#roteList .rote-item[data-k="${cssEscape(k)}"]`);
  if (row) {
    const meta = MARK_META[next];
    row.classList.remove('done', 'half', 'seen');
    if (meta) row.classList.add(meta.cls);
    const btn = row.querySelector('.rote-check');
    if (btn) {
      btn.innerHTML = MARK_SVG[next] || '';
      btn.setAttribute('aria-checked', next === 1 ? 'true' : 'false');
      btn.title = meta ? meta.label + '（点击切换）' : '点击标记为已掌握';
    }
    // v2.7.2：行内角标已移除，状态由行底色与方框图形表达
  }
  saveRoteState();
  if (roteOnlyUndone && next !== 1) renderRoteList(); // 标为已掌握时行沉入过滤视图外，需重绘
}

function cssEscape(s) {
  return String(s).replace(/["\\]/g, '\\$&');
}

// 打乱：未掌握随机排前，已掌握沉底（可在设置关闭沉底）；△/红圈算未掌握
function roteShuffle() {
  const sink = getSettings().roteSinkChecked !== false;
  const undone = [];
  const done = [];
  for (const w of roteWords) {
    if (roteMarks[wordKey(w.w)] === 1) done.push(w);
    else undone.push(w);
  }
  roteWords = sink ? [...shuffle(undone), ...done] : shuffle(roteWords);
  rotePage = 1;
  roteRevealed = {};
  saveRoteState();
  renderRoteList();
  const n = undone.length;
  toast(sink ? `已打乱：${n} 个未掌握随机排序，${done.length} 个已掌握沉到底部` : '已随机打乱全部单词');
}

/* 收入不熟词（v2.7.2）：把 △ 不太熟 / 红圈 不认识的词合并成一本新词书，专供复习。
   词会一直保留在新书里（熟练后也不自动删除），可随时在「管理词表」里自行增删。 */
function collectUnfamiliar() {
  const picked = [];
  const seen = {};
  for (const w of roteWords) {
    const m = roteMarks[wordKey(w.w)];
    if (m === 2 || m === 3) {
      const k = wordKey(w.w);
      if (!seen[k]) { seen[k] = true; picked.push(w); }
    }
  }
  if (!picked.length) { toast('当前没有 △ 不太熟或红圈 不认识的词'); return; }
  const srcName = (getBookMeta(roteBookId) || {}).name || '当前词书';
  const name = prompt(
    `把 ${picked.length} 个不熟词收入新词书，起个名字（最长 24 字）：`,
    `不熟词 ${todayKey()}`
  );
  if (name === null) return; // 用户取消
  const bookName = name.trim().slice(0, 24) || `不熟词 ${todayKey()}`;
  const lists = getCustomLists();
  const id = 'custom:col-' + Date.now().toString(36);
  lists[id] = {
    id,
    name: bookName,
    createdAt: todayKey(),
    words: picked.map(w => ({ w: w.w, p: w.p || '', m: w.m || '', e: w.e || '', ec: w.ec || '', tier: 3 })),
  };
  saveCustomLists(lists);
  refreshBookSelect();
  renderCustomLists();
  renderHome();
  toast(`已把 ${picked.length} 个不熟词收入「${bookName}」，词会一直保留，熟练后可自行删除`);
  if (confirm(`不熟词已收入「${bookName}」（${picked.length} 词，来自「${srcName}」）。\n\n要不要现在切换到这本词书开始复习？`)) {
    setBook(id);
  }
}

// 恢复顺序：按词书原始顺序（层级 + 词频）
function roteRestore() {
  const words = getWords(roteBookId).slice();
  words.sort((a, b) => ((a.tier || 3) - (b.tier || 3)) || ((a.r || 0) - (b.r || 0)));
  roteWords = words;
  rotePage = 1;
  roteRevealed = {};
  saveRoteState();
  renderRoteList();
  toast('已恢复词书原始顺序');
}

async function roteClearChecks() {
  const n = Object.keys(roteMarks).length;
  if (n === 0) { toast('当前没有标记任何单词'); return; }
  if (!await appConfirm(`确定清空 ${n} 个单词的掌握标记吗？（✓/△/红圈 全部清空，立即保存）`, { danger: true, okText: '清空' })) return;
  roteMarks = {};
  saveRoteState();
  renderRoteList();
  toast('已清空全部标记');
}

// 遮罩循环切换：关 → 隐中文 → 隐英文（v2.6.1 起移除「全隐」档）
function roteCycleMask() {
  const i = ROTE_MASK_ORDER.indexOf(roteMask);
  roteMask = ROTE_MASK_ORDER[(i + 1) % ROTE_MASK_ORDER.length];
  roteRevealed = {};
  syncRoteButtons();
  saveRoteState();
  renderRoteList();
  toast({
    off: '遮罩已关闭，中英全部显示',
    cn: '已隐藏中文释义，点击灰块显示',
    en: '已隐藏英文与音标，点击灰块显示',
  }[roteMask]);
}

// 点击灰块显示 / 再点隐藏；隐藏英文时音标一并隐藏与显示
function roteTogglePart(k, part) {
  const rev = roteRevealed[k] || {};
  rev[part] = !rev[part];
  roteRevealed[k] = rev;

  const row = $(`#roteList .rote-item[data-k="${cssEscape(k)}"]`);
  if (!row) return;
  const w = roteWords.find(x => wordKey(x.w) === k);
  if (!w) return;

  const enHidden = roteMask === 'en' && !rev.en;
  const cnHidden = roteMask === 'cn' && !rev.cn;

  const enEl = row.querySelector('[data-part="en"]');
  if (enEl) {
    enEl.classList.toggle('masked', enHidden);
    enEl.textContent = enHidden ? '••••••' : w.w;
  }
  const phEl = row.querySelector('[data-part="phon"]');
  if (phEl) {
    phEl.classList.toggle('masked', enHidden);
    phEl.textContent = enHidden ? '••••' : (w.p ? '/' + w.p + '/' : '');
  }
  const cnEl = row.querySelector('[data-part="cn"]');
  if (cnEl) {
    cnEl.classList.toggle('masked', cnHidden);
    cnEl.textContent = cnHidden ? '••••••' : w.m;
  }
}

/* =========================================================================
 * 课程（v2.8.0）：大学英语教材配套词表
 * - 课程页列出教材单元，进入单元后按板块（iExplore 1 / iExplore 2 / 短语）背诵
 * - 背诵方式与速记一致：三态标记、遮罩、打乱沉底、分页、自动保存
 * - 进度按单元独立存储（marks 单元内共享，板块页签只是同一单元的不同视图）
 * ========================================================================= */
let courseUnitId = null;   // null = 课程总览；否则为单元背诵模式
let courseSection = '__all';
let courseWords = [];
let courseMarks = {};
let courseOrders = {};     // { sectionKey: [wordKey, ...] }
let coursePages = {};      // { sectionKey: pageNum }
let courseMask = 'off';
let courseOnlyUndone = false;
let courseRevealed = {};
let coursePage = 1;
let courseSavedAt = null;
const COURSE_ALL = '__all';

function getCourseBook() { return (window.COURSE_BOOKS || [])[0] || null; }
function getCourseUnit(id) { const b = getCourseBook(); return b ? b.units.find(u => u.id === id) : null; }
function getCourseStore() { return loadJSON(LS.courseRote, {}); }
function courseStoreKey(sec) { return sec; }

// 某单元的已标记/已掌握数（用于总览进度条）
function courseUnitProgress(unitId, totalWords) {
  const rec = getCourseStore()[unitId];
  let marked = 0, mastered = 0;
  if (rec && rec.marks) {
    for (const k in rec.marks) { marked++; if (rec.marks[k] === 1) mastered++; }
  }
  return { marked: Math.min(marked, totalWords), mastered: Math.min(mastered, totalWords) };
}

// 课程总览
function renderCourseHome() {
  $('#courseHome').classList.remove('hidden');
  $('#courseStudy').classList.add('hidden');
  const book = getCourseBook();
  const wrap = $('#courseUnits');
  if (!book) { wrap.innerHTML = '<p class="muted rote-empty">课程词库尚未加载。</p>'; return; }

  let totalWords = 0, totalMarked = 0, totalMastered = 0;
  const cards = book.units.map((u) => {
    const n = u.sections.reduce((acc, s) => acc + s.words.length, 0);
    totalWords += n;
    const p = courseUnitProgress(u.id, n);
    totalMarked += p.marked; totalMastered += p.mastered;
    const pct = n ? Math.min(100, p.marked / n * 100) : 0;
    return `
      <button class="course-unit" data-unit="${u.id}">
        <span class="course-unit-no">${u.id.replace('u', 'U')}</span>
        <span class="course-unit-mid">
          <span class="course-unit-title">${esc(u.title)}</span>
          <span class="course-unit-sub">共 ${n} 词 · ${u.sections.map(s => `${esc(s.name)} ${s.words.length}`).join(' · ')}</span>
          <span class="course-unit-bar"><span class="course-unit-fill" style="width:${pct.toFixed(1)}%"></span></span>
        </span>
        <span class="course-unit-stat">
          <span class="course-unit-mastered">${p.mastered} ✓</span>
          <span class="course-unit-total">已掌握 / ${n}</span>
        </span>
        <span class="course-unit-arrow" aria-hidden="true">›</span>
      </button>`;
  }).join('');

  $('#courseBookCard').innerHTML = `
    <span class="course-book-cover"><svg class="ic"><use href="#ic-cap"/></svg></span>
    <span class="course-book-mid">
      <div class="course-book-name">${esc(book.name)}</div>
      <div class="course-book-src">${esc(book.textbook)}</div>
    </span>
    <span class="course-book-stat">
      <div class="course-book-nums">${totalMastered} / ${totalWords}</div>
      <div class="course-book-lbl">已掌握（已标记 ${totalMarked}）</div>
    </span>`;
  wrap.innerHTML = cards;
}

// 进入单元背诵模式
function openCourseUnit(unitId) {
  const unit = getCourseUnit(unitId);
  if (!unit) return;
  courseUnitId = unitId;
  courseSection = unit.sections.length ? unit.sections[0].name : COURSE_ALL;
  const s = getSettings();
  courseMask = ROTE_MASK_ORDER.includes(s.courseMask) ? s.courseMask : 'off';
  courseOnlyUndone = false;
  loadCourseState(unitId);
  renderCourseStudy();
  saveLastView();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function closeCourseUnit() {
  if (courseUnitId) { saveCourseState(); courseUnitId = null; }
  renderCourseHome();
  saveLastView();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function loadCourseState(unitId) {
  const rec = getCourseStore()[unitId] || {};
  courseMarks = rec.marks ? Object.assign({}, rec.marks) : {};
  courseOrders = rec.orders ? Object.assign({}, rec.orders) : {};
  coursePages = rec.pages ? Object.assign({}, rec.pages) : {};
  courseSavedAt = rec.savedAt || null;
  coursePage = Math.max(1, parseInt(coursePages[courseStoreKey(courseSection)], 10) || 1);
}

function saveCourseState() {
  if (!courseUnitId) return;
  const store = getCourseStore();
  const key = courseStoreKey(courseSection);
  courseOrders[key] = courseWords.map(w => wordKey(w.w));
  coursePages[key] = coursePage;
  store[courseUnitId] = {
    marks: courseMarks,
    orders: courseOrders,
    pages: coursePages,
    savedAt: Date.now(),
  };
  const s = getSettings();
  s.courseMask = courseMask;
  saveSettings(s);
  saveJSON(LS.courseRote, store);
  courseSavedAt = store[courseUnitId].savedAt;
  renderCourseProgress();
}

// 课程视图入口：按当前状态决定画总览还是单元背诵
function renderCourse() {
  if (courseUnitId && getCourseUnit(courseUnitId)) {
    renderCourseStudy();
  } else {
    courseUnitId = null;
    renderCourseHome();
  }
}

// 当前板块过滤下的完整词列表
function courseSectionWords(unit) {
  if (courseSection === COURSE_ALL) return unit.sections.reduce((acc, s) => acc.concat(s.words), []);
  const s = unit.sections.find(x => x.name === courseSection);
  return s ? s.words.slice() : [];
}

// 按持久化顺序重建展示顺序；新词按原顺序追加
function buildCourseWords() {
  const unit = getCourseUnit(courseUnitId);
  const words = courseSectionWords(unit);
  const byKey = {};
  for (const w of words) byKey[wordKey(w.w)] = w;

  const list = [];
  const seen = {};
  const saved = courseOrders[courseStoreKey(courseSection)] || [];
  for (const k of saved) {
    if (byKey[k] && !seen[k]) { list.push(byKey[k]); seen[k] = true; }
  }
  const rest = words.filter(w => !seen[wordKey(w.w)]);
  list.push(...rest);
  courseWords = list;
  courseOrders[courseStoreKey(courseSection)] = list.map(w => wordKey(w.w));
}

function renderCourseStudy() {
  const unit = getCourseUnit(courseUnitId);
  if (!unit) { renderCourseHome(); return; }
  $('#courseHome').classList.add('hidden');
  $('#courseStudy').classList.remove('hidden');

  $('#courseUnitHead').innerHTML = `
    <div class="course-unit-head-main">
      <div class="course-unit-head-title">${esc(unit.title)}</div>
      <div class="course-unit-head-sub">${esc(getCourseBook().name)} · ${esc(getCourseBook().textbook)}</div>
    </div>
    <button class="link-btn" id="courseDictation">导出默写纸 ›</button>`;

  renderCourseTabs(unit);
  syncCourseButtons();
  buildCourseWords();
  renderCourseList();
  renderCourseProgress();
}

function renderCourseTabs(unit) {
  const tabs = [{ key: COURSE_ALL, name: '全部', n: unit.sections.reduce((a, s) => a + s.words.length, 0) }]
    .concat(unit.sections.map(s => ({ key: s.name, name: s.name, n: s.words.length })));
  $('#courseTabs').innerHTML = tabs.map(t => `
    <button class="course-tab ${t.key === courseSection ? 'active' : ''}" data-sec="${esc(t.key)}" role="tab" aria-selected="${t.key === courseSection}">
      ${esc(t.name)}<span class="ct-n">${t.n}</span>
    </button>`).join('');
}

function courseSetSection(sec) {
  if (sec === courseSection) return;
  // 保存当前板块的页码，切换后恢复目标板块的页码
  courseOrders[courseStoreKey(courseSection)] = courseWords.map(w => wordKey(w.w));
  coursePages[courseStoreKey(courseSection)] = coursePage;
  courseSection = sec;
  coursePage = Math.max(1, parseInt(coursePages[courseStoreKey(sec)], 10) || 1);
  courseRevealed = {};
  saveCourseState();
  buildCourseWords();
  renderCourseTabs(getCourseUnit(courseUnitId));
  renderCourseList();
  renderCourseProgress();
}

function syncCourseButtons() {
  const mask = $('#courseMaskBtn'), only = $('#courseOnlyUndone');
  mask.textContent = ROTE_MASK_LABEL[courseMask];
  mask.classList.toggle('active', courseMask !== 'off');
  only.textContent = courseOnlyUndone ? '显示全部' : '只看未掌握';
  only.classList.toggle('active', courseOnlyUndone);
}

function renderCourseProgress() {
  const unit = getCourseUnit(courseUnitId);
  if (!unit) return;
  const total = unit.sections.reduce((a, s) => a + s.words.length, 0);
  let marked = 0, mastered = 0;
  for (const k in courseMarks) { marked++; if (courseMarks[k] === 1) mastered++; }
  $('#courseDoneCount').textContent = marked;
  $('#courseTotalCount').textContent = total;
  $('#courseProgressFill').style.width = total ? Math.min(100, marked / total * 100).toFixed(1) + '%' : '0%';
  const when = courseSavedAt ? formatTime(courseSavedAt) : null;
  $('#courseHint').textContent = `单元「${unit.title}」 · 点方框循环：✓ 已掌握 → △ 不太熟 → 红圈 不认识 · ${when ? '已自动保存（' + when + '）' : '所有操作自动保存'}`;
  const doneLabel = $('#courseDoneLabel');
  if (doneLabel) doneLabel.textContent = marked === mastered ? '已标记' : `已标记（含已掌握 ${mastered}）`;
}

function courseFilteredWords() {
  return courseOnlyUndone ? courseWords.filter(w => (courseMarks[wordKey(w.w)] || 0) !== 1) : courseWords;
}

function renderCourseList() {
  const body = $('#courseList');
  const pager = $('#coursePager');
  const list = courseFilteredWords();
  const size = Math.min(ROTE_PAGE_MAX, Math.max(ROTE_PAGE_MIN, parseInt(getSettings().rotePageSize, 10) || 100));
  const totalPages = Math.max(1, Math.ceil(list.length / size));
  if (coursePage > totalPages) coursePage = totalPages;
  if (coursePage < 1) coursePage = 1;

  const start = (coursePage - 1) * size;
  const pageWords = list.slice(start, start + size);

  if (list.length === 0) {
    body.innerHTML = courseOnlyUndone
      ? '<p class="muted rote-empty">没有「未掌握」的单词了：这个板块都已是 ✓ 已掌握，太棒了！点「显示全部」可以回顾。</p>'
      : '<p class="muted rote-empty">当前板块没有单词。</p>';
    pager.classList.add('hidden');
    pager.innerHTML = '';
  } else {
    const frag = document.createDocumentFragment();
    pageWords.forEach((w, idx) => {
      const k = wordKey(w.w);
      const rev = courseRevealed[k] || {};
      const mk = courseMarks[k] || 0;
      const mkMeta = MARK_META[mk];
      const enMasked = courseMask === 'en' && !rev.en;
      const cnMasked = courseMask === 'cn' && !rev.cn;
      // v3.1.6：英文注释跟随中文遮罩，但可单独点击揭示（rev.note）
      const noteMasked = courseMask === 'cn' && !rev.cn && !rev.note;
      const phon = w.p ? '/' + esc(w.p) + '/' : '';
      const note = w.en ? `<div class="rote-note ${noteMasked ? 'masked' : ''}" data-part="note" data-w="${esc(k)}">${noteMasked ? '••••••' : esc(w.en)}</div>` : '';

      const row = document.createElement('div');
      row.className = 'rote-item' + (mkMeta ? ' ' + mkMeta.cls : '');
      row.dataset.k = k;
      row.innerHTML = `
        <button class="rote-check" data-act="check" role="checkbox" aria-checked="${mk === 1}"
          aria-label="${esc(w.w)}：${mkMeta ? mkMeta.label : '未标记'}，点击切换"
          title="${mkMeta ? mkMeta.label + '（点击切换）' : '点击标记为已掌握'}">${MARK_SVG[mk] || ''}</button>
        <div class="rote-index">${start + idx + 1}</div>
        <div class="rote-ew"><div class="rote-en ${enMasked ? 'masked' : ''}" data-part="en" data-w="${esc(k)}">${enMasked ? '••••••' : esc(w.w)}</div><div class="rote-phon ${enMasked ? 'masked' : ''}" data-part="phon" data-w="${esc(k)}">${enMasked ? '••••' : phon}</div></div>
        <div class="rote-cn ${cnMasked ? 'masked' : ''}" data-part="cn" data-w="${esc(k)}">${cnMasked ? '••••••' : esc(w.m)}</div>${note}`;
      frag.appendChild(row);
    });
    body.innerHTML = '';
    body.appendChild(frag);
    body.classList.remove('turn');
    void body.offsetWidth;
    body.classList.add('turn');
  }

  $('#coursePageInfo').textContent = list.length === 0
    ? ''
    : `共 ${list.length} 词 · 第 ${coursePage}/${totalPages} 页 · 每页 ${size}`;
  let html = '';
  if (totalPages > 1) {
    html += `<button class="page-btn" data-page="${coursePage - 1}" ${coursePage <= 1 ? 'disabled' : ''}>‹ 上一页</button>`;
    for (const p of rotePageList(coursePage, totalPages)) {
      html += p === '…'
        ? '<span class="page-ellipsis" aria-hidden="true">…</span>'
        : `<button class="page-btn ${p === coursePage ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }
    html += `<button class="page-btn" data-page="${coursePage + 1}" ${coursePage >= totalPages ? 'disabled' : ''}>下一页 ›</button>`;
  }
  html += `<span class="page-size-wrap"><span class="page-size-label">每页</span>${pageSizeInputHTML(size)}<span class="page-size-label">词</span></span>`;
  pager.classList.remove('hidden');
  pager.innerHTML = html;
}

function courseGotoPage(p) {
  coursePage = p;
  courseRevealed = {};
  saveCourseState();
  renderCourseList();
}

// 三态标记循环（与速记一致；标记按单元共享，跨板块同步）
function courseToggleCheck(k) {
  const cur = courseMarks[k] || 0;
  const next = cur >= 3 ? 0 : cur + 1;
  if (next === 0) delete courseMarks[k];
  else courseMarks[k] = next;

  const row = $(`#courseList .rote-item[data-k="${cssEscape(k)}"]`);
  if (row) {
    const meta = MARK_META[next];
    row.classList.remove('done', 'half', 'seen');
    if (meta) row.classList.add(meta.cls);
    const btn = row.querySelector('.rote-check');
    if (btn) {
      btn.innerHTML = MARK_SVG[next] || '';
      btn.setAttribute('aria-checked', next === 1 ? 'true' : 'false');
      btn.title = meta ? meta.label + '（点击切换）' : '点击标记为已掌握';
    }
  }
  saveCourseState();
  if (courseOnlyUndone && next !== 1) renderCourseList();
}

// 点击灰块显示 / 再点隐藏；英文注释随中文一起显隐，也可单独点击揭示（v3.1.6）
function courseTogglePart(k, part) {
  const rev = courseRevealed[k] || {};
  rev[part] = !rev[part];
  courseRevealed[k] = rev;

  const row = $(`#courseList .rote-item[data-k="${cssEscape(k)}"]`);
  if (!row) return;
  const w = courseWords.find(x => wordKey(x.w) === k);
  if (!w) return;

  const enHidden = courseMask === 'en' && !rev.en;
  const cnHidden = courseMask === 'cn' && !rev.cn;
  // 注释：中文已揭示或注释被单独点开时显示；否则跟随中文遮罩
  const noteHidden = courseMask === 'cn' && !rev.cn && !rev.note;

  const enEl = row.querySelector('[data-part="en"]');
  if (enEl) {
    enEl.classList.toggle('masked', enHidden);
    enEl.textContent = enHidden ? '••••••' : w.w;
  }
  const phEl = row.querySelector('[data-part="phon"]');
  if (phEl) {
    phEl.classList.toggle('masked', enHidden);
    phEl.textContent = enHidden ? '••••' : (w.p ? '/' + w.p + '/' : '');
  }
  const cnEl = row.querySelector('[data-part="cn"]');
  if (cnEl) {
    cnEl.classList.toggle('masked', cnHidden);
    cnEl.textContent = cnHidden ? '••••••' : w.m;
  }
  const noteEl = row.querySelector('[data-part="note"]');
  if (noteEl) {
    noteEl.classList.toggle('masked', noteHidden);
    noteEl.textContent = noteHidden ? '••••••' : (w.en || '');
  }
}

function courseCycleMask() {
  const i = ROTE_MASK_ORDER.indexOf(courseMask);
  courseMask = ROTE_MASK_ORDER[(i + 1) % ROTE_MASK_ORDER.length];
  courseRevealed = {};
  syncCourseButtons();
  saveCourseState();
  renderCourseList();
  toast({
    off: '遮罩已关闭，中英全部显示',
    cn: '已隐藏中文与英文注释，点击灰块显示；注释可单独点开',
    en: '已隐藏英文与音标，点击灰块显示',
  }[courseMask]);
}

// 打乱：未掌握随机排前，已掌握沉底（与速记共用沉底设置）
function courseShuffle() {
  const sink = getSettings().roteSinkChecked !== false;
  const undone = [];
  const done = [];
  for (const w of courseWords) {
    if (courseMarks[wordKey(w.w)] === 1) done.push(w);
    else undone.push(w);
  }
  courseWords = sink ? [...shuffle(undone), ...done] : shuffle(courseWords);
  coursePage = 1;
  courseRevealed = {};
  saveCourseState();
  renderCourseList();
  const n = undone.length;
  toast(sink ? `已打乱：${n} 个未掌握随机排序，${done.length} 个已掌握沉到底部` : '已随机打乱全部单词');
}

/* 课程生词入本（v2.9.1）：把 △ 不太熟 / 红圈 不认识的词收入任选的自建词书
   （默认提供固定的「课程生词」），进入正常的速记/学习/测验/错词本循环；重复收集自动去重。 */
let coursePickWords = [];   // 选择器打开期间暂存的待收入生词

function openCourseCollectPicker() {
  const picked = [];
  const seen = {};
  for (const w of courseWords) {
    const k = wordKey(w.w);
    const m = courseMarks[k];
    if ((m === 2 || m === 3) && !seen[k]) { seen[k] = true; picked.push(w); }
  }
  if (!picked.length) { toast('本单元还没有 △ 不太熟或红圈 不认识的词'); return; }
  coursePickWords = picked;

  const lists = getCustomLists();
  const fixed = [], others = [];
  for (const id in lists) {
    const o = { id, name: lists[id].name, count: lists[id].words.length, fixed: !!lists[id].courseMistakes };
    (o.fixed ? fixed : others).push(o);
  }
  others.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
  const items = [...fixed, ...others].map(o => `
    <button class="course-pick-item" data-id="${o.id}">
      <span class="cp-name">${esc(o.name)}${o.fixed ? '<span class="cp-tag">课程生词</span>' : ''}</span>
      <span class="cp-count">${o.count} 词</span>
    </button>`).join('');
  $('#coursePickList').innerHTML = items +
    `<button class="course-pick-item cp-new" data-id="__new__"><span class="cp-name">＋ 新建词书…</span><span class="cp-count">收纳为新词书</span></button>`;
  $('#coursePickSub').textContent = `本单元共 ${picked.length} 个生词（△ 不太熟 / 红圈 不认识），收入后可在速记、学习、测验中复习。`;
  $('#coursePickMask').classList.add('open');
}

function closeCoursePick() {
  $('#coursePickMask').classList.remove('open');
  coursePickWords = [];
}

function courseCollectInto(target) {
  const picked = coursePickWords;
  if (!picked.length) { closeCoursePick(); return; }
  const lists = getCustomLists();
  let id = target, bookName = '';
  if (target === '__new__') {
    const name = prompt(`把 ${picked.length} 个生词收入新词书，起个名字（最长 24 字）：`, `课程生词 ${todayKey()}`);
    if (name === null) return;   // 取消命名，选择器保持打开
    bookName = name.trim().slice(0, 24) || `课程生词 ${todayKey()}`;
    id = 'custom:col-' + Date.now().toString(36);
    lists[id] = { id, name: bookName, createdAt: todayKey(), words: [] };
  } else if (!lists[target]) { closeCoursePick(); return; }
  else bookName = lists[target].name;

  const exist = {};
  lists[id].words.forEach(w => { exist[wordKey(w.w)] = true; });
  let merged = 0;
  for (const w of picked) {
    if (!exist[wordKey(w.w)]) { lists[id].words.push({ w: w.w, p: w.p || '', m: w.m || '', e: w.en || '' }); merged++; }
  }
  const total = lists[id].words.length;
  saveCustomLists(lists);
  refreshBookSelect();
  renderCustomLists();
  renderHome();
  closeCoursePick();
  const detail = merged === picked.length ? `${merged} 个生词` : `新增 ${merged} 个（${picked.length - merged} 个已在）`;
  toast(`已把${detail}收入「${bookName}」，共 ${total} 词`);
  if (merged > 0 && confirm(`生词已收入「${bookName}」（共 ${total} 词）。\n\n要不要现在切换到这本词书开始复习？`)) {
    setBook(id);
  }
}

// 恢复顺序：板块内按词表原始顺序（教材词表顺序）
function courseRestore() {
  const unit = getCourseUnit(courseUnitId);
  courseWords = courseSectionWords(unit);
  coursePage = 1;
  courseRevealed = {};
  saveCourseState();
  renderCourseList();
  toast('已恢复词表原始顺序');
}

async function courseClearChecks() {
  const n = Object.keys(courseMarks).length;
  if (n === 0) { toast('当前单元没有标记任何单词'); return; }
  if (!await appConfirm(`确定清空本单元 ${n} 个单词的掌握标记吗？（✓/△/红圈 全部清空，立即保存）`, { danger: true, okText: '清空' })) return;
  courseMarks = {};
  saveCourseState();
  renderCourseList();
  toast('已清空本单元全部标记');
}

// ===== 词库浏览 =====
let libPage = 1;
const LIB_PAGE_SIZE = 50;function renderLibrary() {
  // 保留上次的筛选条件，仅重置到第 1 页
  libPage = 1;
  renderLibraryTable();
}

function renderLibraryTable() {
  const bookId = getSettings().bookId;
  const words = getWords(bookId);
  const prog = getLevelProgress(bookId);
  const search = $('#libSearch').value.trim().toLowerCase();
  const activeChip = $('#tierFilters .tier-chip.active');
  const tier = activeChip ? activeChip.dataset.tier : 'all';
  const status = $('#libStatus').value;

  let filtered = words.filter(w => {
    if (tier !== 'all' && String(w.tier) !== tier) return false;
    if (search && !(String(w.w).toLowerCase().includes(search) || String(w.m).toLowerCase().includes(search))) return false;
    const st = prog[wordKey(w.w)];
    if (status === 'new' && st) return false;
    if (status === 'learning' && (!st || st.s !== 1)) return false;
    if (status === 'mastered' && (!st || st.s !== 2)) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / LIB_PAGE_SIZE));
  if (libPage > totalPages) libPage = totalPages;
  const start = (libPage - 1) * LIB_PAGE_SIZE;
  const pageWords = filtered.slice(start, start + LIB_PAGE_SIZE);

  $('#libCount').textContent = `共 ${filtered.length} 个单词`;

  const body = $('#libTableBody');
  body.innerHTML = pageWords.map(w => {
    const st = prog[wordKey(w.w)];
    let statusHtml = '<span class="tag st-new">未学习</span>';
    if (st && st.s === 2) statusHtml = '<span class="tag st-mastered">已掌握</span>';
    else if (st) statusHtml = '<span class="tag st-learning">学习中</span>';
    return `<tr>
      <td class="w-word">${esc(w.w)}</td>
      <td class="w-phon">${w.p ? '/' + esc(w.p) + '/' : ''}</td>
      <td class="w-mean">${esc(w.m)}</td>
      <td><span class="tag ${w.tier != null ? 'tier' + w.tier : 'tier0'}" title="${w.tier != null ? (w.freq != null ? '近5年真题出现 ' + w.freq + ' 次' : '考试频率未知') : '来自课程词表'}">${w.tier != null ? TIER_NAMES[w.tier] : '课程'}</span></td>
      <td>${statusHtml}</td>
    </tr>`;
  }).join('');

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const box = $('#libPagination');
  let html = `<button class="page-btn" data-page="${libPage - 1}" ${libPage <= 1 ? 'disabled' : ''}>‹</button>`;
  const start = Math.max(1, libPage - 2);
  const end = Math.min(totalPages, libPage + 2);
  for (let i = start; i <= end; i++) {
    html += `<button class="page-btn ${i === libPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  html += `<button class="page-btn" data-page="${libPage + 1}" ${libPage >= totalPages ? 'disabled' : ''}>›</button>`;
  box.innerHTML = html;
}

// ===== 导入 =====
let pendingImport = null;    // 预览中的词数组（待确认）
let pendingWorkbook = null;  // Excel 多工作表：{ file, sheets: [{ name, rows, cols, words }] }
let pendingTable = null;     // 当前表格来源：{ rows, headerRow, cols }（供「字段映射」重算）

function copyExample(kind) {
  const el = $('#example-' + kind);
  if (!el) return;
  const text = el.textContent;
  const done = () => toast('范例已复制，可粘贴到文件测试');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}

function fallbackCopy(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); done(); } catch (e) { toast('复制失败，请手动选择复制'); }
  document.body.removeChild(ta);
}

function renderImport() {
  renderCustomLists();
  populateSuppBookSelect();
  populateExportBookSelect();
}

// ===== 补录单词（v2.7.0）=====
let suppHit = null;        // 最近一次查找命中的词对象
let suppHitSource = '';    // 命中词来源词书名

function populateSuppBookSelect() {
  const sel = $('#suppBookSelect');
  if (!sel) return;
  const s = getSettings();
  let opts = LEVELS.map(l => `<option value="${l.id}">${esc(l.short)} · ${esc(l.name)}（内置）</option>`);
  const lists = getCustomLists();
  for (const id in lists) opts.push(`<option value="${id}">${esc(lists[id].name)}</option>`);
  sel.innerHTML = opts.join('');
  // 记住的选择 → 否则当前词书 → 否则第一个内置
  const want = s.suppBookId;
  sel.value = (want && (LEVELS.some(l => l.id === want) || lists[want])) ? want
    : (getBookMeta(s.bookId) ? s.bookId : (LEVELS[0] && LEVELS[0].id));
  s.suppBookId = sel.value;
  saveSettings(s);
}

function saveSuppBookChoice() {
  const sel = $('#suppBookSelect');
  if (!sel || !sel.value) return;
  const s = getSettings();
  s.suppBookId = sel.value;
  saveSettings(s);
}

function suppBookDisplayName(bookId) {
  const meta = getBookMeta(bookId);
  return meta ? meta.name : bookId;
}

function suppSearch() {
  const inp = $('#suppWord');
  const q = wordKey(inp.value || '');
  const box = $('#suppResult');
  suppHit = null;
  suppHitSource = '';
  if (!q) { box.innerHTML = '<p class="muted supp-note">先输入要补录的单词。</p>'; inp.focus(); return; }
  if (!/^[a-zA-Z]/.test(q)) { box.innerHTML = '<p class="muted supp-note">请输入以字母开头的英文单词。</p>'; return; }

  // 全词库检索：内置 → 自建，精确匹配（大小写/首尾空格不敏感）
  const targets = [
    ...LEVELS.map(l => ({ id: l.id, name: `${l.short} · ${l.name}`, words: window.BUILTIN_WORDS[l.id] || [] })),
    ...Object.entries(getCustomLists()).map(([id, cl]) => ({ id, name: cl.name, words: cl.words })),
  ];
  let hit = null, src = '';
  outer:
  for (const t of targets) {
    for (const w of t.words) {
      if (wordKey(w.w) === q) { hit = w; src = t.name; break outer; }
    }
  }

  const bookName = suppBookDisplayName($('#suppBookSelect').value);
  if (hit) {
    suppHit = hit;
    suppHitSource = src;
    box.innerHTML = `
      <div class="supp-hit">
        <div class="supp-hit-word">${esc(hit.w)}${hit.p ? `<span class="supp-hit-phon">/${esc(hit.p)}/</span>` : ''}</div>
        <div class="supp-hit-mean">${esc(hit.m)}</div>
        <div class="supp-hit-src">来自词库：${esc(src)}</div>
        <div class="supp-hit-actions">
          <button class="btn btn-primary" id="suppAddFoundBtn2">录入到「${esc(bookName)}」</button>
        </div>
      </div>`;
    $('#suppAddFoundBtn2').addEventListener('click', () => suppAddFound());
  } else {
    box.innerHTML = `
      <div class="supp-manual">
        <p class="supp-note">词库中没有「${esc(inp.value.trim())}」，补全释义后即可录入到「${esc(bookName)}」。</p>
        <div class="form-row"><label>释义（必填，可含词性，如 n. 能力）</label>
          <textarea id="suppMeaning" class="input" rows="2" placeholder="n. 能力；才能"></textarea></div>
        <div class="form-row supp-inline"><label>音标（可选）</label>
          <input type="text" id="suppPhon" class="input" placeholder="ə'bɪləti"></div>
        <div class="form-row supp-inline"><label>例句（可选）</label>
          <input type="text" id="suppExample" class="input" placeholder="She has the ability to solve problems."></div>
        <div class="supp-hit-actions">
          <button class="btn btn-primary" id="suppAddManualBtn2">录入到「${esc(bookName)}」</button>
        </div>
      </div>`;
    $('#suppAddManualBtn2').addEventListener('click', () => suppAddManual());
    $('#suppMeaning').focus();
  }
}

// 追加单词到目标词书（自建直接写入；内置写覆盖层，全部去重）
function suppAppendTo(bookId, wordObj) {
  if (bookId.startsWith('custom:')) {
    const lists = getCustomLists();
    const cl = lists[bookId];
    if (!cl) return { ok: false, msg: '目标词书不存在' };
    if (cl.words.some(w => wordKey(w.w) === wordKey(wordObj.w))) return { ok: false, msg: `「${wordObj.w}」已在该词书中` };
    cl.words.push(wordObj);
    saveCustomLists(lists);
    return { ok: true };
  }
  const supp = getSupplements();
  const arr = supp[bookId] || [];
  const base = window.BUILTIN_WORDS[bookId] || [];
  if (base.some(w => wordKey(w.w) === wordKey(wordObj.w)) || arr.some(w => wordKey(w.w) === wordKey(wordObj.w))) {
    return { ok: false, msg: `「${wordObj.w}」已在该词书中` };
  }
  arr.push(wordObj);
  supp[bookId] = arr;
  saveSupplements(supp);
  return { ok: true };
}

function suppAfterAdd(word, bookId) {
  const bookName = suppBookDisplayName(bookId);
  $('#suppResult').innerHTML = `<p class="supp-ok">✓「${esc(word)}」已录入「${esc(bookName)}」</p>`;
  $('#suppWord').value = '';
  $('#suppWord').focus();
  refreshBookSelect();
  renderCustomLists();
  renderHome();
}

function suppAddFound() {
  if (!suppHit) return;
  const bookId = $('#suppBookSelect').value;
  const res = suppAppendTo(bookId, suppHit);
  if (!res.ok) { toast(res.msg); return; }
  suppAfterAdd(suppHit.w, bookId);
  toast(`已录入「${suppHit.w}」`);
  suppHit = null;
}

function suppAddManual() {
  const meaningEl = $('#suppMeaning');
  const wordRaw = ($('#suppWord').value || '').trim();
  const m = normalizeMeaning(meaningEl ? meaningEl.value.trim() : '');
  if (!wordRaw || !/^[a-zA-Z]/.test(wordRaw)) { toast('请先在上方输入单词'); return; }
  if (!m || m === '（未提供释义）') { toast('释义为必填项'); meaningEl && meaningEl.focus(); return; }
  const p = normalizePhonetic(($('#suppPhon') && $('#suppPhon').value) || '');
  const rawEx = ($('#suppExample') && $('#suppExample').value) || '';
  const split = splitExample(rawEx);
  const bookId = $('#suppBookSelect').value;
  const obj = { w: wordRaw, p, m, e: split.e, ec: split.ec, tier: 3 };
  const res = suppAppendTo(bookId, obj);
  if (!res.ok) { toast(res.msg); return; }
  suppAfterAdd(wordRaw, bookId);
  toast(`已录入「${wordRaw}」`);
}

// 同时刷新导入页与设置页里的「我的词书」列表
function renderCustomLists() {
  const lists = getCustomLists();
  const ids = Object.keys(lists);
  const cur = getSettings().bookId;

  const html = ids.length === 0
    ? '<p class="muted">暂无自建词书，导入文件后会自动出现在这里。</p>'
    : ids.map(id => {
      const cl = lists[id];
      const active = cur === id;
      return `<div class="custom-list-item" data-id="${esc(id)}">
        <div class="cl-main">
          <div class="cl-name">${esc(cl.name)} ${active ? '<span class="tag st-mastered">使用中</span>' : ''}</div>
          <div class="cl-count">${cl.words.length} 词 · 创建于 ${esc(cl.createdAt)}</div>
        </div>
        <div class="cl-actions">
          <button class="cl-action" data-act="words">单词</button>
          <button class="cl-action" data-act="rename">重命名</button>
          ${active ? '' : '<button class="cl-action" data-act="use">使用</button>'}
          <button class="cl-action danger" data-act="del">删除</button>
        </div>
      </div>`;
    }).join('');

  ['#customLists', '#setListsBox'].forEach(sel => {
    const box = $(sel);
    if (box) box.innerHTML = html;
  });
  // 词书增删改名后，导出范围 / 管理词表的下拉同步刷新
  populateExportBookSelect();
  populateManageBookSelect();
}

// ---- 导入状态复位 ----
function resetImportUI() {
  pendingWorkbook = null;
  pendingTable = null;
  pendingImport = null;
  $('#sheetPickerPanel').classList.add('hidden');
  $('#importPreviewPanel').classList.add('hidden');
  $('#importMapWrap').classList.add('hidden');
  $('#importMapGrid').classList.add('hidden');
  $('#importTip').textContent = '';
}

// ---- v3.1.2：XLSX 库（~900KB）按需加载，启动不再同步解析它 ----
// 只有真正用到 Excel 导入/导出时才注入 <script>；返回是否可用。
let _xlsxPromise = null;
function ensureXLSX() {
  if (window.XLSX) return Promise.resolve(true);
  if (!_xlsxPromise) {
    _xlsxPromise = new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = 'lib/xlsx.full.min.js';
      s.onload = () => resolve(true);
      s.onerror = () => { _xlsxPromise = null; resolve(false); };
      document.head.appendChild(s);
    });
  }
  return _xlsxPromise;
}

// ---- 文本编码自适应：UTF-8 / UTF-16(BOM) / GB18030（Excel 中文 CSV 常见） ----
function decodeText(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const tryDecode = (enc) => {
    try { return new TextDecoder(enc, { fatal: false }).decode(bytes); } catch (e) { return null; }
  };
  if (bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xFE) {
    const t = tryDecode('utf-16le');
    if (t != null) return { text: t.charCodeAt(0) === 0xFEFF ? t.slice(1) : t, enc: 'UTF-16LE' };
  }
  if (bytes.length >= 2 && bytes[0] === 0xFE && bytes[1] === 0xFF) {
    const t = tryDecode('utf-16be');
    if (t != null) return { text: t.charCodeAt(0) === 0xFEFF ? t.slice(1) : t, enc: 'UTF-16BE' };
  }
  let text = tryDecode('utf-8') || '';
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  // UTF-8 解码出大量替换字符 → 多半是 GBK 系编码
  const bad = (text.match(/\uFFFD/g) || []).length;
  if (bad >= 2 && bad / Math.max(1, text.length) > 0.002) {
    const gbk = tryDecode('gb18030');
    if (gbk && (gbk.match(/\uFFFD/g) || []).length < bad) return { text: gbk, enc: 'GB18030' };
  }
  return { text, enc: 'UTF-8' };
}

// ---- Excel 多工作表：逐表解析出词，保留 rows / cols 供后续手动映射 ----
function parseXlsxSheets(content) {
  const wb = XLSX.read(content instanceof Uint8Array ? content : new Uint8Array(content), { type: 'array' });
  const out = [];
  for (const name of wb.SheetNames) {
    const sheet = wb.Sheets[name];
    if (!sheet) continue;
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    if (!rows || !rows.length) continue;
    const built = buildColumns(rows);
    const words = extractWords(rows, built);
    if (!words.length) continue;
    out.push(Object.assign({ name, words }, built));
  }
  return out;
}

// ---- 多工作表选择面板 ----
function renderSheetPicker(sheets) {
  const total = sheets.reduce((n, s) => n + s.words.length, 0);
  $('#sheetPickerCount').textContent = `${sheets.length} 个工作表 · 共 ${total} 词`;
  $('#sheetList').innerHTML = sheets.map(s => `
    <label class="sheet-item">
      <input type="checkbox" data-sheet="${esc(s.name)}" checked>
      <span class="sheet-name">${esc(s.name)}</span>
      <span class="sheet-count">${s.words.length} 词</span>
    </label>`).join('');
  $('#sheetPickerPanel').classList.remove('hidden');
  $('#sheetPickerPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function pickedSheets() {
  if (!pendingWorkbook) return [];
  const names = [...document.querySelectorAll('#sheetList input[type="checkbox"]')]
    .filter(el => el.checked).map(el => el.dataset.sheet);
  return pendingWorkbook.sheets.filter(s => names.indexOf(s.name) >= 0);
}

// 合并所选工作表 → 进入预览（可改名 + 手动映射不适用，直接成书待确认）
function sheetMergeImport() {
  const wb = pendingWorkbook;
  const picked = pickedSheets();
  if (!picked.length) { toast('请至少勾选一个工作表'); return; }
  const words = [];
  for (const s of picked) for (const w of s.words) words.push(w);
  resetImportUI();
  prepareImport(words, wb.file);
}

// 所选工作表各自成书（工作表名即词书名）
function sheetSplitImport() {
  const picked = pickedSheets();
  if (!picked.length) { toast('请至少勾选一个工作表'); return; }
  const lists = getCustomLists();
  const created = [];
  for (const s of picked) {
    const d = dedupeWords(s.words);
    enrichWordsFromBuiltin(d.words);
    const id = 'custom:' + Date.now() + ':' + Math.random().toString(36).slice(2, 7);
    lists[id] = { name: s.name || '未命名工作表', words: d.words, createdAt: todayKey() };
    created.push({ id, count: d.words.length });
  }
  saveCustomLists(lists);
  pendingWorkbook = null;
  $('#sheetPickerPanel').classList.add('hidden');
  $('#fileInput').value = '';
  $('#importTip').textContent = '';
  renderCustomLists();
  const st = getSettings();
  st.bookId = created[0].id;
  saveSettings(st);
  refreshBookSelect();
  const total = created.reduce((n, c) => n + c.count, 0);
  toast(`已按工作表导入 ${created.length} 本词书，共 ${total} 词`);
  renderHome();
}

// ---- 统一收尾：去重合并 → 内置词库匹配补全 → 生成预览 ----
function prepareImport(words, filename) {
  const d = dedupeWords(words);
  const matched = enrichWordsFromBuiltin(d.words);
  pendingImport = d.words;
  showImportPreview(d.words, filename, { matched, merged: d.merged });
  $('#importTip').textContent = '';
}

function handleFile(file) {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      resetImportUI();
      if (ext === 'xlsx' || ext === 'xls') {
        if (!await ensureXLSX()) { $('#importTip').textContent = 'Excel 组件加载失败，请重试'; return; }
        const sheets = parseXlsxSheets(e.target.result);
        if (!sheets.length) { $('#importTip').textContent = '未能解析出有效单词，请检查文件格式'; return; }
        if (sheets.length === 1) {
          pendingTable = sheets[0];
          renderMappingUI();
          prepareImport(sheets[0].words, file.name);
          return;
        }
        pendingWorkbook = { file: file.name, sheets };
        renderSheetPicker(sheets);
        return;
      }
      const { text, enc } = decodeText(e.target.result);
      const parsed = parseFile(ext, text, file.name);
      const words = parsed.words;
      if (!words || words.length === 0) {
        $('#importTip').textContent = '未能解析出有效单词，请检查文件格式';
        return;
      }
      pendingTable = parsed.table || null;
      if (pendingTable) renderMappingUI();
      prepareImport(words, file.name);
      if (enc !== 'UTF-8') $('#importTip').textContent = `已按 ${enc} 编码读取文件`;
    } catch (err) {
      $('#importTip').textContent = '解析失败：' + err.message;
    }
  };
  reader.onerror = () => { $('#importTip').textContent = '读取文件失败'; };
  // 统一按二进制读取，再自行解码（兼容 GBK / UTF-16 等非 UTF-8 编码）
  reader.readAsArrayBuffer(file);
}

// ===== 词性归一化 =====
// 中文词性 / 英文全称 / 缩写 统一成标准缩写，便于与释义拼成一行
const POS_MAP = {
  n: 'n.', noun: 'n.', 名词: 'n.',
  v: 'v.', verb: 'v.', 动词: 'v.',
  vt: 'vt.', 及物动词: 'vt.',
  vi: 'vi.', 不及物动词: 'vi.',
  adj: 'adj.', adjective: 'adj.', 形容词: 'adj.',
  adv: 'adv.', adverb: 'adv.', 副词: 'adv.',
  prep: 'prep.', preposition: 'prep.', 介词: 'prep.',
  pron: 'pron.', pronoun: 'pron.', 代词: 'pron.',
  conj: 'conj.', conjunction: 'conj.', 连词: 'conj.',
  num: 'num.', numeral: 'num.', 数词: 'num.',
  art: 'art.', article: 'art.', 冠词: 'art.',
  int: 'int.', interj: 'int.', interjection: 'int.', 感叹词: 'int.', 叹词: 'int.',
  aux: 'aux.', auxiliary: 'aux.', 助动词: 'aux.',
  abbr: 'abbr.', abbreviation: 'abbr.', 缩写: 'abbr.',
  pl: 'pl.', plural: 'pl.', 复数: 'pl.',
  phr: 'phr.', phrase: 'phr.', 短语: 'phr.',
};

// 整格就是一个词性标记（用于判断某列是不是「词性」列）
const POS_CELL_RE = new RegExp(
  '^(?:[（(\\[【]?\\s*)?' +
  '(?:n|v|vt|vi|adj|adv|prep|pron|conj|num|art|int|interj|aux|abbr|pl|phr|noun|verb|adjective|adverb|preposition|pronoun|conjunction|numeral|article|interjection|auxiliary|名词|动词|及物动词|不及物动词|形容词|副词|介词|代词|连词|数词|冠词|感叹词|叹词|助动词|缩写|复数|短语)' +
  '(?:\\s*[\\/、|]\\s*(?:n|v|vt|vi|adj|adv|prep|pron|conj|num|art|int|aux|abbr|pl|phr|名词|动词|形容词|副词|介词|代词|连词|数词|冠词))*' +
  '\\s*[.．。]?\\s*[）)\\]】]?\\s*$', 'i');

// 词性归一化：入参可能是「n.」「N」「noun」「名词」「n./v.」「动 名」
function normalizePos(raw) {
  if (raw == null) return '';
  let s = String(raw).trim();
  if (!s) return '';
  s = s.replace(/[（(\[【《「]/g, ' ').replace(/[）)\]】》」]/g, ' ');
  s = s.replace(/[，,、；;｜|/／]+/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  if (!s) return '';
  const out = [];
  for (const tok of s.split(' ')) {
    const t = tok.replace(/^[.．。:：]+/, '').replace(/[.．。:：]+$/, '').trim();
    if (!t) continue;
    const hit = POS_MAP[t.toLowerCase()];
    if (hit && out.indexOf(hit) < 0) out.push(hit);
  }
  return out.join('/');
}

// 从释义文本里剥离「行首词性」，如「(n.) 放弃」「n. 放弃」「名词 放弃」
function extractLeadingPos(meaning) {
  const t = String(meaning == null ? '' : meaning).trim();
  if (!t) return { pos: '', rest: '' };
  const RE = /^[（(\[【]?\s*([a-zA-Z]{1,7}|[\u4e00-\u9fff]{1,3})\s*[.．。]?\s*[）)\]】]?\s*(?:[.。:：、,，;；]\s*)?/;
  const found = [];
  let cur = t, guard = 0;
  while (guard++ < 3) {
    const m = cur.match(RE);
    if (!m) break;
    const norm = normalizePos(m[1]);
    if (!norm) break;
    const rest = cur.slice(m[0].length);
    if (!rest.trim()) break;
    // 必须「带标记」或「后接中文」，避免把 art of war、nice day 这类正常英文当词性
    const marked = /[（(\[【）)\]】.。:：、,，;；]/.test(m[0]) || /[\u4e00-\u9fff]/.test(m[1]);
    const cnNext = /[\u4e00-\u9fff]/.test(rest.trim().charAt(0));
    if (!marked && !cnNext) break;
    found.push(norm);
    cur = rest;
  }
  if (!found.length) return { pos: '', rest: t };
  return { pos: found.filter((v, i) => found.indexOf(v) === i).join('/'), rest: cur.trim() };
}

// 词性 + 词义 → 合并成一行放进释义栏：「n. 放弃；抛弃」
function composeMeaning(posRaw, meaningRaw) {
  const m0 = normalizeMeaning(meaningRaw);
  const ex = extractLeadingPos(m0);
  const ownPos = normalizePos(posRaw);
  const pos = ownPos || ex.pos;
  const rest = ex.rest;
  if (!pos) return m0;
  if (!rest) return ownPos || m0;
  return pos + ' ' + rest;
}

// 判断某列是否像音标（用于无表头文件的列猜测）
function looksLikePhoneticColumn(rows, colIndex) {
  let hit = 0, total = 0;
  for (const r of rows.slice(0, 12)) {
    if (!r || r.length <= colIndex) continue;
    const c = String(r[colIndex] || '').trim();
    if (!c) continue;
    total++;
    if (/^[\/\[]/.test(c) || /[ˈˌəæɪʊɔʌθðʃʒŋɒɜː]/.test(c) || /^[a-z:,'\s]+$/i.test(c) && /[':ˌˈ]/.test(c)) hit++;
  }
  return total > 0 && hit / total >= 0.6;
}

// 判断某列是不是「词性」列
function looksLikePosColumn(rows, colIndex) {
  let hit = 0, total = 0;
  for (const r of rows.slice(0, 15)) {
    if (!r || r.length <= colIndex) continue;
    const c = String(r[colIndex] == null ? '' : r[colIndex]).trim();
    if (!c) continue;
    total++;
    if (POS_CELL_RE.test(c)) hit++;
  }
  return total >= 2 && hit / total >= 0.6;
}

// 表头关键词（小写匹配）：命中即认定该列角色
const HEADER_RULES = {
  pos: /词性|词类|词态|实词|part\s*of\s*speech|^p\.?o\.?s\.?$|^pos\b/,
  p: /phonetic|音标|pronunc|发音|读音|ipa|注音|transcription|美音|英音/,
  m: /释义|词义|中文|翻译|translation|trans\b|解释|paraphrase|意义|意思|含义|定义|def(?:inition|ine)?\b|汉语|注解|注释|meaning/,
  w: /word|单词|词汇|英文|英语|english|vocab|term|生词|词语|拼写|spelling/,
  e: /example|例句|sentence|句子|用例|示范句/,
};
// 匹配优先级：更具体的角色优先，避免「英文释义」被判成单词列
const HEADER_ORDER = ['pos', 'p', 'm', 'w', 'e'];

// 判断某一行像不像表头行：返回 { w: [列], p: [列], pos: [列], m: [列], e: [列] }，不像则 null
// 释义 / 例句允许多列（如「释义1/释义2」「英文例句/中文例句」），会在提取时合并
function detectHeaderRow(row) {
  if (!row || row.length === 0) return null;
  const cols = { w: [], p: [], pos: [], m: [], e: [] };
  let hits = 0;
  for (let i = 0; i < row.length; i++) {
    const c = String(row[i] == null ? '' : row[i]).trim().toLowerCase();
    if (!c) continue;
    for (const key of HEADER_ORDER) {
      if (HEADER_RULES[key].test(c)) { cols[key].push(i); hits++; break; }
    }
  }
  // 至少命中 2 个关键词才算表头（「我的词汇表」这类标题行只会命中 1 个）
  if (hits < 2) return null;
  if (!cols.w.length && !cols.m.length) return null;
  return cols;
}

// 确定表格的列角色：优先找表头行；没有表头就按内容猜（逐列判断词性 / 音标 / 释义）
function buildColumns(rows) {
  for (let r = 0; r < Math.min(8, rows.length); r++) {
    const cols = detectHeaderRow(rows[r]);
    if (cols) return { rows, headerRow: r, cols };
  }
  const cols = { w: [0], p: [], pos: [], m: [], e: [] };
  let n = 0;
  for (const r of rows) if (r) n = Math.max(n, r.length);
  for (let i = 1; i < n; i++) {
    if (!cols.pos.length && looksLikePosColumn(rows, i)) { cols.pos.push(i); continue; }
    if (!cols.p.length && looksLikePhoneticColumn(rows, i)) { cols.p.push(i); continue; }
    cols.m.push(i);
  }
  if (!cols.m.length && n > 1) cols.m.push(1);
  return { rows, headerRow: -1, cols };
}

// 按列角色把二维表格转成单词数组
function extractWords(rows, built) {
  const words = [];
  if (!rows || !rows.length) return words;
  const cols = built.cols;
  const start = built.headerRow >= 0 ? built.headerRow + 1 : 0;
  const wi = cols.w.length ? cols.w[0] : -1;
  const pi = cols.p.length ? cols.p[0] : -1;
  const posi = cols.pos.length ? cols.pos[0] : -1;
  for (let r = start; r < rows.length; r++) {
    const row = rows[r];
    if (!row) continue;
    const w = wi >= 0 ? String(row[wi] == null ? '' : row[wi]).trim() : '';
    if (!w || !/^[a-zA-Z][a-zA-Z\s'\-.]*$/.test(w)) continue;
    const meanParts = cols.m.map(i => normalizeMeaning(row[i])).filter(Boolean);
    const posRaw = posi >= 0 ? String(row[posi] == null ? '' : row[posi]).trim() : '';
    const exParts = cols.e.map(i => String(row[i] == null ? '' : row[i]).trim()).filter(Boolean);
    const { e, ec } = splitExample(exParts.join(' '));
    const m = composeMeaning(posRaw, meanParts.join('；')) || '（未提供释义）';
    words.push({
      w,
      p: pi >= 0 ? normalizePhonetic(row[pi]) : '',
      pos: normalizePos(posRaw),
      m, e, ec, tier: 3, r: words.length + 1,
    });
  }
  return words;
}

function rowsToWords(rows, override) {
  return extractWords(rows, override || buildColumns(rows));
}

function parseFile(ext, content, filename) {
  const text = content;
  if (ext === 'json') {
    const data = JSON.parse(text);
    const arr = Array.isArray(data) ? data : (Array.isArray(data.words) ? data.words : []);
    const words = arr.map((x, i) => {
      const rawEx = String(x.e || x.example || x.sentence || '').trim();
      const split = splitExample(rawEx);
      const pos = normalizePos(x.pos || x.partOfSpeech || x.part || '');
      const rawM = x.m || x.meaning || x.translation || x.paraphrase || '';
      return {
        w: String(x.w || x.word || x.headWord || '').trim(),
        p: normalizePhonetic(x.p || x.phonetic || x.usphone || x.ukphone || ''),
        pos,
        m: composeMeaning(pos, rawM) || '',
        e: split.e,
        ec: String(x.ec || x.exampleCn || split.ec || '').trim(),
        tier: Number(x.tier) || 3,
        freq: x.freq,
        r: i + 1,
      };
    }).filter(x => x.w && /^[a-zA-Z]/.test(x.w));
    return { words, table: null };
  }

  if (ext === 'md' || ext === 'markdown') {
    const lines = text.split(/\r?\n/);
    // Markdown 表格优先
    const tblRows = [];
    for (const line of lines) {
      const t = line.trim();
      if (/^\|.*\|$/.test(t)) {
        const cells = t.slice(1, -1).split('|').map(c => c.trim());
        if (cells.every(c => /^:?-+:?$/.test(c))) continue; // 分隔行
        tblRows.push(cells);
      }
    }
    if (tblRows.length > 0) {
      const built = buildColumns(tblRows);
      return { words: extractWords(tblRows, built), table: built };
    }
    // 列表形式：- word /phonetic/ meaning
    const words = [];
    for (const line of lines) {
      const t = line.trim().replace(/^[-*•]\s*/, '');
      if (!t || /^#/.test(t)) continue;
      const parsed = parseWordLine(t);
      if (parsed) words.push({ ...parsed, tier: 3, r: words.length + 1 });
    }
    return { words, table: null };
  }

  if (ext === 'csv' || ext === 'tsv') {
    // 支持引号包裹、双引号转义；分隔符按扩展名或内容密度自动判断
    const delim = ext === 'tsv' ? '\t' : guessDelimiter(text);
    const rows = parseDelimited(text, delim);
    const built = buildColumns(rows);
    return { words: extractWords(rows, built), table: built };
  }

  // txt 等：逐行解析
  const words = [];
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const t = line.trim();
    if (!t || /^#/.test(t)) continue;
    const parsed = parseWordLine(t);
    if (parsed) words.push({ ...parsed, tier: 3, r: words.length + 1 });
  }
  return { words, table: null };
}

function guessDelimiter(text) {
  const head = text.split(/\r?\n/).slice(0, 5).join('\n');
  const count = (ch) => (head.match(new RegExp('\\' + ch, 'g')) || []).length;
  return count('\t') > count(',') ? '\t' : ',';
}

function parseDelimited(text, delim) {
  const rows = [];
  const lines = String(text).split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim()) continue;
    const cells = [];
    let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (ch === delim && !inQ) { cells.push(cur); cur = ''; }
      else cur += ch;
    }
    cells.push(cur);
    rows.push(cells.map(c => c.replace(/^"|"$/g, '').trim()));
  }
  return rows;
}

// ===== 重复词合并 / 释义拼接 =====
function partKey(t) {
  const m = t.match(/^[（(\[【]?\s*(?:[a-zA-Z]{1,7}|[\u4e00-\u9fff]{1,3})\s*[.．。]?\s*[）)\]】]?\s*(?:[.:：、,，]\s*)?/);
  let rest = m ? t.slice(m[0].length).trim() : t;
  if (!rest) rest = t;
  return rest.toLowerCase();
}

function mergeMeaning(a, b) {
  const clean = (x) => String(x == null ? '' : x).replace(/（未提供释义）/g, '').trim();
  const na = clean(a), nb = clean(b);
  if (!na) return nb;
  if (!nb) return na;
  if (na === nb) return na;
  const seen = new Set();
  const parts = [];
  for (const raw of (na + '；' + nb).split(/[；;\n]+/)) {
    const t = raw.trim();
    if (!t) continue;
    const k = partKey(t);
    if (seen.has(k)) continue;
    seen.add(k); parts.push(t);
  }
  return parts.join('；');
}

function dedupeWords(words) {
  const map = new Map();
  const out = [];
  let merged = 0;
  for (const w of words) {
    const k = wordKey(w.w);
    if (!k) continue;
    const cur = map.get(k);
    if (!cur) { const c = Object.assign({}, w); map.set(k, c); out.push(c); continue; }
    merged++;
    if (!cur.p && w.p) cur.p = w.p;
    if (!cur.pos && w.pos) cur.pos = w.pos;
    cur.m = mergeMeaning(cur.m, w.m) || cur.m;
    if (!cur.e && w.e) { cur.e = w.e; cur.ec = w.ec || ''; }
    else if (!cur.ec && w.ec) cur.ec = w.ec;
    if (cur.tier == null && w.tier != null) cur.tier = w.tier;
  }
  out.forEach((w, i) => { w.r = i + 1; });
  return { words: out, merged };
}

// 解析单行：「单词 [音标] [词性] 释义」，兼容 tab / 多空格 / 单空格 / 无释义
function parseWordLine(t) {
  const pack = (w, p, rawM) => {
    const m0 = normalizeMeaning(rawM || '');
    const ex = extractLeadingPos(m0);
    return {
      w: String(w).trim(),
      p: p || '',
      pos: ex.pos,
      m: composeMeaning('', m0) || '（未提供释义）',
      e: '', ec: '',
    };
  };
  // 1) 单词 + 音标 +（词性）+ 释义（音标带 / / 或 [ ] 或 ( )，内容不含中文）
  const mph = t.match(/^([a-zA-Z][a-zA-Z'\-.]*(?:\s[a-zA-Z][a-zA-Z'\-.]*){0,2})\s+(?:\/([^\/\u4e00-\u9fff]+)\/|\[([^\]\u4e00-\u9fff]+)\]|\(([^)\u4e00-\u9fff]+)\))\s*[-–—:：]?\s*(.*)$/);
  if (mph) {
    const inner = mph[2] || mph[3] || mph[4] || '';
    const asPos = normalizePos(inner);
    // 括号里其实是词性（如「abandon (n.) 放弃」），不要当成音标
    if (asPos) return pack(mph[1], '', asPos + ' ' + (mph[5] || ''));
    return pack(mph[1], normalizePhonetic(inner), mph[5]);
  }
  // 2) tab 或多个空格分隔
  const parts = t.split(/\t+|\s{2,}/).map(s => s.trim()).filter(Boolean);
  if (parts.length >= 2 && /^[a-zA-Z]/.test(parts[0]) && !/^[a-zA-Z][a-zA-Z'\-.]*\s[a-zA-Z]/.test(parts[0])) {
    return pack(parts[0], '', parts.slice(1).join(' '));
  }
  // 3) 单词 + 词性 + 中文释义（如「abandon n. 放弃」），词性会被剥离并归一化
  const mp = t.match(/^([a-zA-Z][a-zA-Z'\-.]*)\s+(.+)$/);
  if (mp) {
    const ex = extractLeadingPos(normalizeMeaning(mp[2]));
    if (ex.pos && /[\u4e00-\u9fff]/.test(ex.rest)) return pack(mp[1], '', mp[2]);
  }
  // 4) 单词 + 中文释义
  const m2 = t.match(/^([a-zA-Z][a-zA-Z'\-.]*(?:\s[a-zA-Z][a-zA-Z'\-.]*){0,2})\s+([\u4e00-\u9fff].*)$/);
  if (m2) return pack(m2[1], '', m2[2]);
  // 5) 只有单词
  const m3 = t.match(/^([a-zA-Z][a-zA-Z\s'\-.]*)$/);
  if (m3) return pack(m3[1], '', '');
  return null;
}

// 预览统计与表格刷新（首次展示 / 手动映射后都走这里）
function updatePreviewTable(words, info) {
  info = info || {};
  $('#importPreviewCount').textContent = `${words.length} 词`;
  const withPhon = words.filter(w => w.p).length;
  const withPos = words.filter(w => w.pos).length;
  const withEx = words.filter(w => w.e || w.ec).length;
  const bits = [];
  if (info.merged) bits.push(`合并重复 <b>${info.merged}</b> 个`);
  bits.push(`音标 ${withPhon} 个`);
  bits.push(`词性 ${withPos} 个`);
  bits.push(`例句 ${withEx} 个`);
  let lead;
  if (info.matched > 0) {
    lead = `已自动匹配 <b>${info.matched}</b> 个与内置词库一致的词，补全音标 / 释义 / 例句并同步考试频率等级。`;
  } else {
    lead = '未匹配到内置词库中的词，将按导入内容原样保存。';
  }
  const matchTip = $('#importMatchTip');
  matchTip.innerHTML = `${lead}<br><span class="muted">${bits.join(' · ')}</span>`;
  matchTip.classList.remove('hidden');
  $('#importPreviewBody').innerHTML = words.slice(0, 100).map(w =>
    `<tr><td class="w-word">${esc(w.w)}</td><td class="w-phon">${w.p ? '/' + esc(w.p) + '/' : ''}</td><td class="w-mean">${esc(w.m)}</td><td class="w-ex">${esc(w.e || w.ec || '')}</td></tr>`
  ).join('');
}

function showImportPreview(words, filename, info, keepName) {
  if (!keepName) $('#importName').value = String(filename || '').replace(/\.[^.]+$/, '');
  updatePreviewTable(words, info);
  $('#importPreviewPanel').classList.remove('hidden');
  if (!keepName) $('#importPreviewPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== 字段映射（手动纠正自动识别结果） =====
const ROLE_LABELS = [['w', '单词'], ['p', '音标'], ['pos', '词性'], ['m', '释义'], ['e', '例句'], ['x', '忽略']];

function roleOfCol(cols, i) {
  for (const k of ['w', 'p', 'pos', 'm', 'e']) if (cols[k] && cols[k].indexOf(i) >= 0) return k;
  return 'x';
}

function updateMapSummary() {
  if (!pendingTable) return;
  const { cols } = pendingTable;
  const used = ['w', 'p', 'pos', 'm', 'e'].filter(k => cols[k] && cols[k].length);
  if (!used.length) { $('#importMapSummary').textContent = '未识别到字段'; return; }
  $('#importMapSummary').textContent = used.map(k => {
    const label = ROLE_LABELS.find(r => r[0] === k)[1];
    const idxs = cols[k].map(i => i + 1).join('、');
    return `${label}：第 ${idxs} 列`;
  }).join(' · ');
}

function renderMappingUI() {
  const wrap = $('#importMapWrap'), grid = $('#importMapGrid');
  if (!pendingTable) { wrap.classList.add('hidden'); return; }
  const { rows, headerRow, cols } = pendingTable;
  let nCol = 0;
  for (const r of rows) if (r) nCol = Math.max(nCol, r.length);
  nCol = Math.min(nCol, 12);
  const headerCells = headerRow >= 0 ? rows[headerRow] : null;
  let html = '';
  for (let i = 0; i < nCol; i++) {
    const label = headerCells && headerCells[i] ? String(headerCells[i]).trim() : `第 ${i + 1} 列`;
    let sample = '';
    for (let r = (headerRow >= 0 ? headerRow + 1 : 0); r < rows.length; r++) {
      const v = rows[r] && rows[r][i];
      if (v != null && String(v).trim()) { sample = String(v).trim(); break; }
    }
    html += `<div class="map-row">
      <div class="map-col"><span class="map-idx">${i + 1}</span><span class="map-label" title="${esc(label)}">${esc(label)}</span></div>
      <select class="input map-select" data-col="${i}">${ROLE_LABELS.map(([v, t]) =>
        `<option value="${v}"${roleOfCol(cols, i) === v ? ' selected' : ''}>${t}</option>`).join('')}</select>
      <div class="map-sample" title="${esc(sample)}">${esc(sample.slice(0, 24))}</div>
    </div>`;
  }
  grid.innerHTML = html;
  grid.classList.add('hidden');
  $('#importMapToggle').textContent = '展开调整';
  updateMapSummary();
  wrap.classList.remove('hidden');
}

// 应用手动映射 → 重新提取并刷新预览
function applyMapping() {
  if (!pendingTable) return;
  const cols = { w: [], p: [], pos: [], m: [], e: [] };
  document.querySelectorAll('#importMapGrid .map-select').forEach(sel => {
    const role = sel.value, i = parseInt(sel.dataset.col, 10);
    if (role !== 'x' && cols[role]) cols[role].push(i);
  });
  pendingTable.cols = cols;
  const d = dedupeWords(extractWords(pendingTable.rows, pendingTable));
  const matched = enrichWordsFromBuiltin(d.words);
  pendingImport = d.words;
  updatePreviewTable(d.words, { matched, merged: d.merged });
  updateMapSummary();
}

// ===== 粘贴导入 / 模板下载 =====
function parsePastedText() {
  const area = $('#pasteArea');
  const text = area ? area.value : '';
  if (!text.trim()) { toast('请先粘贴内容'); return; }
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l && !/^#/.test(l));
  if (!lines.length) { toast('没有可解析的内容'); return; }
  const rows = lines.map(l => l.split(/\t|\s{2,}/).map(c => c.trim()));
  const multi = rows.filter(r => r.length >= 2).length;
  resetImportUI();
  if (rows.length >= 2 && multi >= rows.length * 0.5) {
    // 看起来是带列结构的表格（从 Excel / 网页表格复制）
    const built = buildColumns(rows);
    pendingTable = built;
    renderMappingUI();
    prepareImport(extractWords(rows, built), '粘贴导入');
  } else {
    const words = [];
    for (const l of lines) {
      const parsed = parseWordLine(l);
      if (parsed) words.push({ ...parsed, tier: 3, r: words.length + 1 });
    }
    if (!words.length) { $('#importTip').textContent = '未能从粘贴内容中解析出单词'; return; }
    prepareImport(words, '粘贴导入');
  }
}

// 生成一份含示例表头与多工作表的模板，照填即可导入
async function downloadTemplate() {
  if (!await ensureXLSX()) { toast('Excel 组件加载失败，请重试'); return; }
  try {
    const s1 = [
      ['单词', '音标', '词性', '释义', '例句'],
      ['abandon', "ə'bændən", 'v.', '放弃；抛弃', 'He abandoned his car in the snow.'],
      ['ability', "ə'bɪləti", 'n.', '能力；才能', 'She has the ability to solve problems.'],
      ['absolute', "'æbsəluːt", 'adj.', '绝对的；完全的', 'You must have absolute trust in her.'],
      ['achieve', "ə'tʃiːv", 'vt.', '实现；达到', 'He achieved his goal at last.'],
    ];
    const s2 = [
      ['单词', '词性', '释义'],
      ['benefit', 'n./v.', '利益；好处 / 有益于'],
      ['capable', 'adj.', '有能力的；能干的'],
      ['decline', 'v./n.', '下降；衰退 / 谢绝'],
    ];
    const s3 = [
      ['单词', '中文'],
      ['abandon', '放弃'],
      ['ability', '能力'],
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s1), 'Unit 1');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s2), 'Unit 2');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s3), '极简两列');
    const saved = await saveFileToDownload(
      'Token-导入模板.xlsx', XLSX.write(wb, { bookType: 'xlsx', type: 'base64' }),
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '导入模板已保存到 Download/Token-导入模板.xlsx'
    );
    if (!saved) { XLSX.writeFile(wb, 'Token-导入模板.xlsx'); toast('模板已下载，照着它填就能导入'); }
  } catch (e) {
    toast('模板生成失败：' + e.message);
  }
}

// ===== 导出词库（v2.7.1）=====
function populateExportBookSelect() {
  const sel = $('#exportBookSelect');
  if (!sel) return;
  const s = getSettings();
  const opts = ['<option value="all">全部词书</option>']
    .concat(LEVELS.map(l => `<option value="${l.id}">${esc(l.short)} · ${esc(l.name)}（内置）</option>`))
    .concat(Object.entries(getCustomLists()).map(([id, cl]) => `<option value="${id}">${esc(cl.name)}</option>`));
  sel.innerHTML = opts.join('');
  const want = s.exportBookId;
  sel.value = (want && (want === 'all' || LEVELS.some(l => l.id === want) || getCustomLists()[want]))
    ? want : 'all';
  s.exportBookId = sel.value;
  saveSettings(s);
}

function saveExportBookChoice() {
  const sel = $('#exportBookSelect');
  if (!sel || !sel.value) return;
  const s = getSettings();
  s.exportBookId = sel.value;
  saveSettings(s);
}

// 按当前选择收集要导出的词书 [{ id, name, words }]；内置词书含补录进去的单词
function collectExportBooks() {
  const sel = $('#exportBookSelect');
  const id = sel ? sel.value : 'all';
  if (id === 'all') {
    const out = LEVELS.map(l => ({ id: l.id, name: l.name, words: getWords(l.id) }));
    for (const [cid, cl] of Object.entries(getCustomLists())) {
      out.push({ id: cid, name: cl.name, words: cl.words || [] });
    }
    return out;
  }
  const meta = getBookMeta(id);
  if (!meta) return [];
  return [{ id, name: meta.name, words: getWords(id) }];
}

// 释义拆分：开头词性拆到「词性」列（如「adv. 突然地」→ 词性 adv. / 释义 突然地）
function splitPosMeaning(m) {
  const ex = extractLeadingPos(m);
  return [ex.pos, ex.rest || ''];
}

function exportBookLabel() {
  const sel = $('#exportBookSelect');
  const id = sel ? sel.value : 'all';
  if (id === 'all') return '全部词书';
  const meta = getBookMeta(id);
  return meta ? meta.name : '词库';
}

function exportFileName(ext) {
  const label = exportBookLabel().replace(/[\\/:*?"<>|]/g, '').trim().slice(0, 40) || '词库';
  return `Token-词库-${label}-${todayKey()}.${ext}`;
}

async function exportLibraryXlsx() {
  if (!await ensureXLSX()) { toast('Excel 组件加载失败，请重试'); return; }
  const books = collectExportBooks();
  const total = books.reduce((n, b) => n + b.words.length, 0);
  if (!total) { toast('没有可导出的单词'); return; }
  try {
    const wb = XLSX.utils.book_new();
    const used = {};
    for (const b of books) {
      // v3.0.3：词库导出保留音标列（与导入格式一致，可再导回）
      const aoa = [['单词', '音标', '词性', '释义', '例句']];
      for (const w of b.words) {
        const [pos, mean] = splitPosMeaning(w.m);
        aoa.push([w.w || '', w.p || '', pos, mean, w.e || '']);
      }
      // Excel 工作表名：去非法字符、最长 31 字符、重名加序号
      let name = String(b.name).replace(/[\\/?*[\]:]/g, ' ').trim().slice(0, 31) || '词书';
      if (used[name]) { name = name.slice(0, 28) + '-' + (++used[name]); }
      else used[name] = 1;
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), name);
    }
    const fname = exportFileName('xlsx');
    const saved = await saveFileToDownload(
      fname, XLSX.write(wb, { bookType: 'xlsx', type: 'base64' }),
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      `词库已保存到 Download/${fname}`
    );
    if (!saved) { XLSX.writeFile(wb, fname); toast(`已导出 ${books.length} 本词书，共 ${total} 词`); }
  } catch (e) {
    toast('导出失败：' + e.message);
  }
}

function csvCell(v) {
  const t = String(v == null ? '' : v);
  return /[",\r\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
}

/* 默写纸导出：一个工作簿三张表——看英文写中文 / 看中文写英文 / 答案。
   安卓 App 内保存到系统 Download 文件夹；浏览器环境走常规下载。 */
async function exportDictationSheet(words, title) {
  if (!await ensureXLSX()) { toast('Excel 组件加载失败，请重试'); return; }
  if (!words.length) { toast('当前没有可导出的单词'); return; }
  const safeTitle = String(title).replace(/[\\/?*[\]:]/g, ' ').trim().slice(0, 24) || '词表';
  const fileName = `Token-默写纸-${safeTitle}-${todayKey()}.xlsx`;
  try {
    const wb = XLSX.utils.book_new();

    // v3.0.3：默写纸去掉音标列（默写时不能看到读音提示）
    let aoa = [['序号', '单词', '释义（默写区）']];
    words.forEach((w, i) => aoa.push([i + 1, w.w, '']));
    const ws1 = XLSX.utils.aoa_to_sheet(aoa);
    ws1['!cols'] = [{ wch: 6 }, { wch: 22 }, { wch: 44 }];
    XLSX.utils.book_append_sheet(wb, ws1, '看英文写中文');

    aoa = [['序号', '中文释义', '单词（默写区）']];
    words.forEach((w, i) => aoa.push([i + 1, w.m || '', '']));
    const ws2 = XLSX.utils.aoa_to_sheet(aoa);
    ws2['!cols'] = [{ wch: 6 }, { wch: 44 }, { wch: 26 }];
    XLSX.utils.book_append_sheet(wb, ws2, '看中文写英文');

    aoa = [['序号', '单词', '释义']];
    words.forEach((w, i) => aoa.push([i + 1, w.w, w.m || '']));
    const ws3 = XLSX.utils.aoa_to_sheet(aoa);
    ws3['!cols'] = [{ wch: 6 }, { wch: 22 }, { wch: 44 }];
    XLSX.utils.book_append_sheet(wb, ws3, '答案');

    const b64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
    const saved = await saveFileToDownload(
      fileName, b64, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      `默写纸已保存到 Download/${fileName}`
    );
    if (!saved) {
      XLSX.writeFile(wb, fileName);
      toast(`已导出默写纸（${words.length} 词）：2 张练习卷 + 答案`);
    }
  } catch (e) {
    toast('导出失败：' + e.message);
  }
}

// 课程单元默写纸：当前板块（选「全部」时为整单元）
function exportCourseDictation() {
  const unit = getCourseUnit(courseUnitId);
  const sec = courseSection === COURSE_ALL ? '全部' : courseSection;
  exportDictationSheet(courseWords, `${unit ? unit.title : '课程'}·${sec}`);
}

// 速记默写纸：当前词书当前页的词
function exportRoteDictation() {
  const list = roteFilteredWords();
  const size = Math.min(ROTE_PAGE_MAX, Math.max(ROTE_PAGE_MIN, parseInt(getSettings().rotePageSize, 10) || 100));
  const totalPages = Math.max(1, Math.ceil(list.length / size));
  const page = Math.min(rotePage, totalPages);
  const pageWords = list.slice((page - 1) * size, page * size);
  const bookName = (getBookMeta(roteBookId) || {}).name || '词书';
  exportDictationSheet(pageWords, `${bookName} 第${page}页`);
}

async function exportLibraryCsv() {
  const books = collectExportBooks();
  const total = books.reduce((n, b) => n + b.words.length, 0);
  if (!total) { toast('没有可导出的单词'); return; }
  const multi = books.length > 1;
  // v3.0.3：词库导出保留音标列（与导入格式一致，可再导回）
  const head = multi ? ['词书', '单词', '音标', '词性', '释义', '例句']
                     : ['单词', '音标', '词性', '释义', '例句'];
  const lines = [head.join(',')];
  for (const b of books) {
    for (const w of b.words) {
      const [pos, mean] = splitPosMeaning(w.m);
      const cells = multi ? [b.name, w.w || '', w.p || '', pos, mean, w.e || '']
                          : [w.w || '', w.p || '', pos, mean, w.e || ''];
      lines.push(cells.map(csvCell).join(','));
    }
  }
  // UTF-8 带 BOM：Excel 双击打开中文不乱码
  const saved = await saveFileToDownload(
    exportFileName('csv'), utf8ToB64('\ufeff' + lines.join('\r\n')), 'text/csv',
    `CSV 已保存到 Download/${exportFileName('csv')}`
  );
  if (!saved) {
    const blob = new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = exportFileName('csv');
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 300);
    toast(`已导出 ${books.length} 本词书，共 ${total} 词`);
  }
}

// ===== 新建词书 · 键入建库（v2.7.2）=====
// 不用导文件：起个书名建空词书，再在补录面板逐个键入单词即可入库
function suppCreateBook() {
  const name = prompt('新词书名称（最长 24 字）：', '');
  if (name === null) return;
  const bookName = name.trim().slice(0, 24);
  if (!bookName) { toast('未输入名称，已取消'); return; }
  const lists = getCustomLists();
  const id = 'custom:man-' + Date.now().toString(36);
  lists[id] = { id, name: bookName, createdAt: todayKey(), words: [] };
  saveCustomLists(lists);
  const s = getSettings();
  s.suppBookId = id; // 补录面板直接选中新书，键入单词即可录入
  saveSettings(s);
  populateSuppBookSelect();
  populateExportBookSelect();
  populateManageBookSelect();
  renderCustomLists();
  renderHome();
  toast(`已创建「${bookName}」，在下方键入单词即可录入`);
}

// ===== 管理词表（v2.7.2）：查看并删除单词 =====
function populateManageBookSelect() {
  const sel = $('#manageBookSelect');
  if (!sel) return;
  const cur = sel.value;
  const opts = LEVELS.map(l => `<option value="${l.id}">${esc(l.short)} · ${esc(l.name)}（内置）</option>`)
    .concat(Object.entries(getCustomLists()).map(([id, cl]) => `<option value="${id}">${esc(cl.name)}</option>`));
  sel.innerHTML = opts.join('');
  sel.value = (cur && (LEVELS.some(l => l.id === cur) || getCustomLists()[cur]))
    ? cur
    : (LEVELS[0] && LEVELS[0].id);
  renderManageList();
}

// 当前管理词书可管理的词：自建=全部单词；内置=补录进去的（内置原始词不可删除）
function manageWords() {
  const sel = $('#manageBookSelect');
  const id = sel ? sel.value : '';
  if (!id) return { id: '', name: '', words: [], builtin: false };
  if (id.startsWith('custom:')) {
    const cl = getCustomLists()[id];
    return cl ? { id, name: cl.name, words: cl.words, builtin: false } : { id: '', name: '', words: [], builtin: false };
  }
  const meta = getBookMeta(id);
  return { id, name: meta ? meta.name : id, words: getSupplements()[id] || [], builtin: true };
}

const MANAGE_MAX = 80; // 一屏最多渲染行数，多的话用过滤缩小范围

function renderManageList() {
  const box = $('#manageList');
  if (!box) return;
  const info = manageWords();
  const count = $('#manageCount');
  const q = wordKey($('#manageFilter') ? $('#manageFilter').value : '');
  const all = info.words;
  const list = q
    ? all.filter(w => wordKey(w.w).includes(q) || String(w.m || '').toLowerCase().includes(q))
    : all;
  if (count) count.textContent = info.builtin ? `补录 ${all.length} 词` : `${all.length} 词`;
  if (!list.length) {
    box.innerHTML = `<p class="muted mg-empty">${q ? '没有匹配的单词。'
      : info.builtin ? '这本书还没有补录过单词；内置原始词不可删除。'
      : '这本词书还没有单词，可在上方「补录单词」里键入。'}</p>`;
    return;
  }
  const rows = list.slice(0, MANAGE_MAX).map(w => `
    <div class="mg-row" data-w="${esc(w.w)}">
      <div class="mg-word">${esc(w.w)}${w.p ? `<span class="mg-phon">/${esc(w.p)}/</span>` : ''}</div>
      <div class="mg-mean">${esc(w.m || '')}</div>
      <button class="mg-del" data-act="del" title="删除该单词">删除</button>
    </div>`).join('');
  box.innerHTML = rows + (list.length > MANAGE_MAX
    ? `<p class="muted mg-empty">只显示前 ${MANAGE_MAX} 个，输入单词或释义可过滤。</p>` : '');
}

async function manageDelete(wordRaw) {
  const info = manageWords();
  const k = wordKey(wordRaw);
  const w = info.words.find(x => wordKey(x.w) === k);
  if (!w) return;
  if (!await appConfirm(`从「${info.name}」删除「${w.w}」？\n${info.builtin ? '将从补录记录中移除。' : '该词的学习记录也会一并清除。'}`, { danger: true, okText: '删除' })) return;
  if (info.builtin) {
    const supp = getSupplements();
    supp[info.id] = info.words.filter(x => wordKey(x.w) !== k);
    saveSupplements(supp);
  } else {
    const lists = getCustomLists();
    if (lists[info.id]) {
      lists[info.id].words = lists[info.id].words.filter(x => wordKey(x.w) !== k);
      saveCustomLists(lists);
    }
  }
  // 词删了，对应学习进度一并清掉
  const all = getAllProgress();
  if (all[info.id] && all[info.id][k]) {
    delete all[info.id][k];
    saveJSON(LS.progress, all);
  }
  renderManageList();
  renderCustomLists();
  renderHome();
  toast(`已从「${info.name}」删除「${w.w}」`);
}

function confirmImport() {
  if (!pendingImport || pendingImport.length === 0) return;
  const name = $('#importName').value.trim() || '导入词书';
  const lists = getCustomLists();
  const id = 'custom:' + Date.now();
  lists[id] = { name, words: pendingImport, createdAt: todayKey() };
  saveCustomLists(lists);
  const count = lists[id].words.length;
  pendingImport = null;
  pendingTable = null;
  $('#importPreviewPanel').classList.add('hidden');
  $('#importMapWrap').classList.add('hidden');
  $('#fileInput').value = '';
  renderCustomLists();
  // 切换到新词书
  const s = getSettings();
  s.bookId = id;
  saveSettings(s);
  refreshBookSelect();
  toast(`已导入「${name}」共 ${count} 词`);
  renderHome();
}

function cancelImport() {
  pendingImport = null;
  pendingTable = null;
  pendingWorkbook = null;
  $('#importPreviewPanel').classList.add('hidden');
  $('#importMapWrap').classList.add('hidden');
  $('#sheetPickerPanel').classList.add('hidden');
  $('#fileInput').value = '';
  $('#importTip').textContent = '';
  toast('已取消导入');
}

// ===== 统计 =====
function getStreak() {
  const s = getSettings();
  return { last: s.lastStudyDay || null, streak: s.streak || 0 };
}
function markStudiedToday() {
  const s = getSettings();
  const today = todayKey();
  if (s.lastStudyDay === today) return;
  const yest = addDays(today, -1);
  s.streak = (s.lastStudyDay === yest) ? (s.streak || 0) + 1 : 1;
  s.lastStudyDay = today;
  saveSettings(s);
}

// 生成近 n 天柱状图 HTML（首页与统计页共用）
function buildBarChart(n) {
  const daily = getDaily();
  const days = [];
  const today = new Date();
  let max = 0;
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const k = todayKey(d);
    const v = daily[k] || 0;
    if (v > max) max = v;
    days.push({ k, v, label: k.slice(5).replace('-', '/'), isToday: i === 0 });
  }
  const denom = Math.max(1, max);
  return days.map(d => `
    <div class="bar-col">
      <div class="bar-num">${d.v || ''}</div>
      <div class="bar-track"><div class="bar-fill ${d.isToday ? 'today' : ''}" style="height:${Math.max(d.v ? 6 : 0, d.v / denom * 100)}%"></div></div>
      <div class="bar-lbl">${d.isToday ? '今天' : d.label}</div>
    </div>`).join('');
}

// 近 5 周打卡热力
function buildHeatmap() {
  const daily = getDaily();
  const boxes = [];
  const today = new Date();
  // 起点回退到 34 天前，并对齐到周一
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 34);
  const wd = (start.getDay() + 6) % 7; // 0 = 周一
  start.setDate(start.getDate() - wd);
  // 终点：本周周日
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  end.setDate(end.getDate() + (6 - ((end.getDay() + 6) % 7)));

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const k = todayKey(d);
    const v = daily[k] || 0;
    const future = d > today;
    let lv = 0;
    if (v > 0) lv = 1;
    if (v >= 10) lv = 2;
    if (v >= 30) lv = 3;
    if (v >= 60) lv = 4;
    boxes.push(`<div class="hm-cell lv${future ? 'future' : lv}" title="${k}：${future ? '未到' : v + ' 词'}"></div>`);
  }
  return `<div class="hm-grid">${boxes.join('')}</div>
    <div class="hm-legend"><span>少</span><i class="hm-cell lv0"></i><i class="hm-cell lv1"></i><i class="hm-cell lv2"></i><i class="hm-cell lv3"></i><i class="hm-cell lv4"></i><span>多</span></div>`;
}

function renderStats() {
  const s = getSettings();
  $('#statStreak').textContent = s.streak || 0;

  const stats = computeOverallStats();
  $('#statTotalLearned').textContent = stats.totalLearned;
  $('#statMastered').textContent = stats.mastered;
  $('#statAccuracy').textContent = stats.nSum ? Math.round(stats.okSum / stats.nSum * 100) + '%' : '—';

  const daily = getDaily();
  const todayCount = daily[todayKey()] || 0;
  $('#statTodayBadge').textContent = `今日 ${todayCount} 词`;
  $('#statsDailyChart').innerHTML = buildBarChart(7);
  $('#statsHeatmap').innerHTML = buildHeatmap();

  // 各词书进度
  const lists = getCustomLists();
  const books = [...LEVELS, ...Object.keys(lists).map(id => ({ id, name: lists[id].name }))];
  $('#statsByBook').innerHTML = books.map(b => {
    const words = getWords(b.id);
    const prog = getLevelProgress(b.id);
    let m = 0, learning = 0;
    for (const w of words) {
      const st = prog[wordKey(w.w)];
      if (st && st.s === 2) m++;
      else if (st) learning++;
    }
    const pct = words.length ? (m / words.length * 100) : 0;
    const pctL = words.length ? (learning / words.length * 100) : 0;
    return `<div class="sb-row">
      <span class="sb-name">${esc(b.name)}</span>
      <div class="sb-bar">
        <div class="sb-bar-fill" style="width:${pct.toFixed(1)}%"></div>
        <div class="sb-bar-learning" style="left:${pct.toFixed(1)}%;width:${pctL.toFixed(1)}%"></div>
      </div>
      <span class="sb-nums">${m} / ${words.length}</span>
    </div>`;
  }).join('') + '<div class="sb-legend"><i class="sb-dot mastered"></i>已掌握<i class="sb-dot learning"></i>学习中</div>';

  // 未来复习计划（未来 7 天累计到期数量）
  const nowDate = new Date();
  const forecast = {};
  for (let i = 1; i <= 7; i++) {
    const d = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + i);
    forecast[todayKey(d)] = 0;
  }
  const endTimes = Object.keys(forecast).map(k => {
    const [y, m, d] = k.split('-').map(Number);
    return new Date(y, m - 1, d, 23, 59, 59).getTime();
  });
  const curBook = s.bookId;
  const prog = getLevelProgress(curBook);
  for (const key in prog) {
    const st = prog[key];
    if (st.s === 1 && st.due) {
      const dueMs = dueToMs(st.due);
      Object.keys(forecast).forEach((d, idx) => {
        if (dueMs <= endTimes[idx]) forecast[d]++;
      });
    }
  }
  const meta = getBookMeta(curBook);
  $('#statsForecast').innerHTML = Object.keys(forecast).map(d => {
    const day = d.slice(5).replace('-', '/');
    return `<div class="forecast-chip"><div class="d">${day}</div><div class="n">${forecast[d]}</div></div>`;
  }).join('') + `<p class="muted forecast-note">以上为当前词书「${esc(meta ? meta.name : '—')}」的预计到期数量。</p>`;
}

// ===== 设置 =====
function renderSettings() {
  renderSettingsValues();
  renderCustomLists();
  renderChangelog();
}

function renderSettingsValues() {
  const s = getSettings();
  syncThemeButtons();
  $('#setGoalValue').textContent = s.dailyGoal;
  $('#setAutoPlay').checked = !!s.autoPlay;
  $('#setShowExample').checked = s.showExample !== false;
  $('#setRoteSinkChecked').checked = s.roteSinkChecked !== false;
  $('#setSpeechRate').value = String(s.speechRate || 0.85);
  $('#aboutVersion').textContent = `${APP_NAME} v${APP_VERSION}`;
  if (!_updInfo) updSetStatus(`当前 v${APP_VERSION} · 点此检查更新`);
  // 个人资料
  if (document.activeElement !== $('#setUserName')) $('#setUserName').value = s.userName || '词友';
  if (document.activeElement !== $('#setUserBio')) $('#setUserBio').value = s.userBio || '';
  renderAvatarFace($('#setAvatarFace'), s);
  $('#setAvatarRemove').classList.toggle('hidden', !s.avatar);
  // 词书下拉：v3.0.2 与首页 chips 同序同角标（拖拽排序后进设置页不再回退到默认顺序）
  const sel = $('#setBookSelect');
  sel.innerHTML = bookOptionsHtml();
  sel.value = s.bookId;
  $('#setRotePageSize').value = String(s.rotePageSize || 100);
  $('#setBadgeMode').value = s.badgeMode || 'number';
  $('#setExamName').value = s.examName || '';
  $('#setExamDate').value = s.examDate || '';
}

function renderChangelog() {
  $('#changelogBox').innerHTML = CHANGELOG.map(g => `
    <div class="cl-group">
      <div class="cl-head"><span class="cl-ver">v${g.v}</span><span class="cl-date">${g.date}</span><span class="cl-title">${g.title}</span></div>
      <ul class="cl-list">${g.items.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>`).join('');
}

// ===== 数据备份与恢复 =====
async function exportProgress() {
  const data = {
    app: 'wordrecite',
    version: 2,
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    settings: getSettings(),
    progress: getAllProgress(),
    custom: getCustomLists(),
    rote: loadJSON(LS.rote, {}),
    courseRote: loadJSON(LS.courseRote, {}),
    supp: getSupplements(),
    daily: getDaily(),
  };
  const bname = `wordrecite-backup-${todayKey()}.json`;
  const saved = await saveFileToDownload(
    bname, utf8ToB64(JSON.stringify(data, null, 2)), 'application/json',
    `备份已保存到 Download/${bname}`
  );
  if (!saved) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = bname;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  setBackupStatus(`已导出备份文件（${todayKey()}）`);
  toast('进度已导出');
}

function setBackupStatus(msg) {
  $('#backupStatus').textContent = msg;
  $('#setBackupStatus').textContent = msg;
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data || data.app !== 'wordrecite') {
        setBackupStatus('导入失败：不是有效的 Token 备份文件');
        return;
      }
      const counts = mergeProgress(data);
      setBackupStatus(`导入成功：恢复 ${counts.progress} 条学习记录、${counts.custom} 个自定义词书、${counts.rote} 本速记进度${counts.course ? `、${counts.course} 个课程单元` : ''}`);
      toast('进度已导入');
      refreshBookSelect();
      renderHome();
      renderDrawer();
      updateMiniProgress();
    } catch (err) {
      setBackupStatus('导入失败：' + err.message);
    }
  };
  reader.onerror = () => { setBackupStatus('读取文件失败'); };
  reader.readAsText(file, 'utf-8');
}

function mergeProgress(data) {
  // 合并设置（导入文件优先，但昵称保持本机）
  if (data.settings) {
    const local = getSettings();
    const merged = Object.assign({}, local, data.settings);
    // 昵称 / 头像 / 简介属于本机个人资料，保持本机设置不被覆盖
    merged.userName = local.userName;
    merged.avatar = local.avatar;
    merged.userBio = local.userBio;
    merged.onboarded = local.onboarded || !!merged.userName;
    merged.tutorialSeen = local.tutorialSeen || merged.tutorialSeen;
    merged.lastSeenVersion = local.lastSeenVersion || merged.lastSeenVersion;
    saveSettings(merged);
  }
  // 合并学习进度（相同单词以导入文件为准，保留双方独有）
  if (data.progress) {
    const all = getAllProgress();
    for (const bookId in data.progress) {
      if (!all[bookId]) all[bookId] = {};
      Object.assign(all[bookId], data.progress[bookId]);
    }
    saveJSON(LS.progress, all);
  }
  // 合并自定义词书
  if (data.custom) {
    const lists = getCustomLists();
    Object.assign(lists, data.custom);
    saveCustomLists(lists);
  }
  // 合并速记进度与每日记录（v2 新增）
  if (data.rote) {
    const rote = loadJSON(LS.rote, {});
    for (const b in data.rote) {
      rote[b] = Object.assign({}, rote[b] || {}, data.rote[b]);
    }
    saveJSON(LS.rote, rote);
  }
  // 合并补录单词（v2.7.0：按词书去重合并）
  if (data.supp) {
    const supp = getSupplements();
    for (const b in data.supp) {
      const incoming = data.supp[b] || [];
      const existing = supp[b] || [];
      const keys = new Set(existing.map(w => wordKey(w.w)));
      for (const w of incoming) {
        if (!keys.has(wordKey(w.w))) { existing.push(w); keys.add(wordKey(w.w)); }
      }
      supp[b] = existing;
    }
    saveSupplements(supp);
  }
  // 合并课程背诵进度（v2.8.0：按单元合并）
  if (data.courseRote) {
    const cr = loadJSON(LS.courseRote, {});
    for (const u in data.courseRote) {
      cr[u] = Object.assign({}, cr[u] || {}, data.courseRote[u]);
    }
    saveJSON(LS.courseRote, cr);
  }
  if (data.daily) {
    const daily = getDaily();
    for (const k in data.daily) daily[k] = Math.max(daily[k] || 0, data.daily[k] || 0);
    saveJSON(LS.daily, daily);
  }
  let pcount = 0;
  for (const b in (data.progress || {})) pcount += Object.keys(data.progress[b] || {}).length;
  const ccount = Object.keys(data.custom || {}).length;
  const rcount = Object.keys(data.rote || {}).length;
  const courseCount = Object.keys(data.courseRote || {}).length;
  return { progress: pcount, custom: ccount, rote: rcount, course: courseCount };
}

async function clearProgress() {
  if (!await appConfirm('确定要清空所有学习进度吗？此操作不可撤销，建议先导出备份。', { danger: true, okText: '清空' })) return;
  // 学习进度与打卡记录一并清除，但保留昵称与偏好设置
  localStorage.removeItem(LS.progress);
  localStorage.removeItem(LS.daily);
  localStorage.removeItem(LS.rote);
  localStorage.removeItem(LS.courseRote);
  localStorage.removeItem(LS.studySession);
  localStorage.removeItem(LS.quizSession);
  const s = getSettings();
  s.streak = 0;
  s.lastStudyDay = null;
  saveSettings(s);
  // 速记内存态一并复位
  roteWords = []; roteMarks = {}; roteOrder = [];
  rotePage = 1; roteSavedAt = null; roteRevealed = {};
  refreshBookSelect();
  renderHome();
  renderDrawer();
  renderSettings();
  if ($('#view-rote').classList.contains('active')) renderRote();
  updateMiniProgress();
  setBackupStatus('已清空所有学习进度与打卡记录（昵称与偏好设置保留）');
  toast('进度已清空');
}

// =========================================================================
// v3.2.0 · 云端账户与同步（Supabase）
//   引擎在 sync.js：登录 / 注册 / 验证码 / 推送 / 拉取 / 冲突选择
//   这里负责：快照的构建、应用、合并，以及账户卡片与抽屉状态
// =========================================================================

function buildSyncSnapshot() {
  return {
    app: 'wordrecite',
    version: 2,
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    settings: getSettings(),
    progress: getAllProgress(),
    custom: getCustomLists(),
    rote: loadJSON(LS.rote, {}),
    courseRote: loadJSON(LS.courseRote, {}),
    supp: getSupplements(),
    daily: getDaily(),
    celebr: getCelebrations(),
    usage: getUsageDays(),   // v3.2.1：按天分桶的使用时长
  };
}

// 是否有「值得同步」的学习数据（只改过昵称不算，避免新设备首次登录被弹窗打扰）
function hasLocalLearningData() {
  const prog = getAllProgress();
  for (const b in prog) if (Object.keys(prog[b] || {}).length) return true;
  if (Object.keys(getCustomLists()).length) return true;
  if (Object.keys(loadJSON(LS.rote, {})).length) return true;
  if (Object.keys(loadJSON(LS.courseRote, {})).length) return true;
  if (Object.keys(getDaily()).length) return true;
  return false;
}

// 用云端快照整体替换本机（保留本机专属状态：版本提示、教程已读、引导完成）
function applySyncSnapshot(data) {
  if (!data || typeof data !== 'object') return;
  // 丢弃尚未落盘的旧进度防抖任务，否则 300ms 后会把旧数据写回去
  if (_progressFlushTimer) { clearTimeout(_progressFlushTimer); _progressFlushTimer = 0; }
  _syncApplying = true;
  try {
    const local = getSettings();
    if (data.settings) {
      const s = Object.assign({}, local, data.settings);
      s.lastSeenVersion = local.lastSeenVersion;
      s.tutorialSeen = local.tutorialSeen || !!data.settings.tutorialSeen;
      s.onboarded = local.onboarded || !!data.settings.onboarded;
      saveSettings(s);
    }
    if (data.progress) saveJSON(LS.progress, data.progress);
    if (data.custom) saveCustomLists(data.custom);
    if (data.rote) saveJSON(LS.rote, data.rote);
    if (data.courseRote) saveJSON(LS.courseRote, data.courseRote);
    if (data.supp) saveSupplements(data.supp);
    if (data.daily) saveJSON(LS.daily, data.daily);
    if (data.celebr) saveJSON(LS.celebr, data.celebr);
    if (data.usage && typeof data.usage === 'object') writeUsageDays(data.usage);
  } finally {
    _syncApplying = false;
  }
  // 速记内存态作废，切回速记页时按新数据重建
  roteWords = []; roteMarks = {}; roteOrder = []; roteSavedAt = null; roteRevealed = {};
  refreshAfterSync();
}

// 合并云端快照到本机（进度取并集，设置以云端为底但保留本机个人资料）
function mergeSyncSnapshot(remote) {
  if (!remote || typeof remote !== 'object') return;
  if (_progressFlushTimer) { clearTimeout(_progressFlushTimer); _progressFlushTimer = 0; }
  _syncApplying = true;
  try {
    mergeProgress(remote);
    if (remote.celebr) {
      const cur = getCelebrations();
      for (const b in remote.celebr) cur[b] = Object.assign({}, remote.celebr[b] || {}, cur[b] || {});
      saveJSON(LS.celebr, cur);
    }
    // v3.2.1：使用时长按天取较大值（两端设备各自的计时相加会重复计，取 max 更稳）
    if (remote.usage && typeof remote.usage === 'object') {
      const cur = getUsageDays();
      let changed = false;
      for (const d in remote.usage) {
        const v = Number(remote.usage[d]) || 0;
        if (v > (Number(cur[d]) || 0)) { cur[d] = v; changed = true; }
      }
      if (changed) writeUsageDays(cur);
    }
  } finally {
    _syncApplying = false;
  }
  roteWords = []; roteMarks = {}; roteOrder = []; roteSavedAt = null; roteRevealed = {};
  refreshAfterSync();
}

function refreshAfterSync() {
  refreshBookSelect();
  applyTheme();
  renderHome();
  renderDrawer();
  renderAllAvatars();
  renderSettingsValues();
  renderCustomLists();
  updateMiniProgress();
  if (currentView === 'rote') renderRote();
  else if (currentView === 'course') renderCourse();
  else if (currentView === 'library') renderLibraryTable();
  else if (currentView === 'stats') renderStats();
  renderAccountUI();
}

function timeAgoCN(ts) {
  const d = Math.max(0, Date.now() - ts);
  if (d < 60000) return '刚刚';
  if (d < 3600000) return Math.floor(d / 60000) + ' 分钟前';
  if (d < 86400000) return Math.floor(d / 3600000) + ' 小时前';
  return Math.floor(d / 86400000) + ' 天前';
}

function syncStatusText(st) {
  if (!st || !st.user) return '未登录';
  if (!st.online) return '离线中 · 联网后自动同步';
  if (st.syncing) return '正在同步…';
  if (st.error) return '同步失败：' + st.error;
  if (st.dirty) return '有改动待上传';
  if (st.lastSyncTime) return '已同步 · ' + timeAgoCN(st.lastSyncTime);
  return '等待首次同步';
}

// 账户卡片 / 抽屉状态刷新（登录、同步、离线任何变化都会走这里）
function renderAccountUI(st) {
  if (!window.TokenSync) return;
  st = st || window.TokenSync.getState();
  const logged = !!st.user;
  const out = $('#acctLoggedOut'), inn = $('#acctLoggedIn');
  if (out) out.classList.toggle('hidden', logged);
  if (inn) inn.classList.toggle('hidden', !logged);
  const dot = $('#acctDot');
  if (dot) {
    const cls = st.error ? 'err' : st.syncing ? 'busy' : st.dirty ? 'pending' : st.online ? 'ok' : 'off';
    dot.className = 'acct-dot ' + cls;
  }
  if (logged) {
    const email = st.user.email || '已登录';
    if ($('#acctEmailShow')) $('#acctEmailShow').textContent = email;
    if ($('#acctStatus')) $('#acctStatus').textContent = syncStatusText(st);
    if ($('#acctAutoSync')) $('#acctAutoSync').checked = st.auto !== false;
  }
  const drawerText = $('#drawerAccountText'), drawerDot = $('#drawerAcctDot');
  if (drawerText) {
    drawerText.textContent = logged
      ? (st.error ? '同步失败 · 点此查看' : st.syncing ? '正在同步…' : `已登录 · ${st.lastSyncTime ? timeAgoCN(st.lastSyncTime) + '同步' : '待同步'}`)
      : '未登录 · 点此开启云端同步';
  }
  if (drawerDot) {
    drawerDot.className = 'da-dot ' + (logged ? (st.error ? 'err' : st.online ? 'ok' : 'off') : '');
  }
}

function setAcctHint(msg, type) {
  const el = $('#acctHint');
  if (!el) return;
  el.textContent = msg || '';
  el.className = 'acct-hint' + (type ? ' ' + type : '');
}

function openSyncChoice() {
  const m = $('#syncChoiceMask');
  if (m) { m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); }
}
function closeSyncChoice() {
  const m = $('#syncChoiceMask');
  if (m) { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); }
}

function bindSyncEvents() {
  if (!window.TokenSync) return;

  const emailVal = () => ($('#acctEmail').value || '').trim();
  const pwdVal = () => $('#acctPwd').value || '';
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // v3.2.1：忘记密码面板（登录面板 ↔ 重置面板）
  const resetHint = (msg, type) => {
    const el = $('#acctResetHint');
    if (!el) return;
    el.textContent = msg || '';
    el.className = 'acct-hint' + (type ? ' ' + type : '');
  };
  const showReset = (on) => {
    $('#acctLoginPanel').classList.toggle('hidden', on);
    $('#acctResetPanel').classList.toggle('hidden', !on);
    if (on) {
      const e = $('#acctResetEmail');
      if (e && !e.value) e.value = emailVal();       // 带上登录框里填的邮箱
      resetHint('');
      setTimeout(() => {
        const t = ($('#acctResetEmail').value || '').trim() ? $('#acctResetCode') : $('#acctResetEmail');
        if (t) t.focus({ preventScroll: true });
      }, 80);
    }
  };
  $('#acctModeBtn').addEventListener('click', () => showReset(true));
  $('#acctResetBack').addEventListener('click', () => {
    showReset(false);
    setAcctHint('');
    setTimeout(() => { const e = $('#acctEmail'); if (e && !e.value) e.value = ($('#acctResetEmail').value || '').trim(); }, 60);
  });

  // 验证码倒计时（按按钮 id 各记一个定时器）
  const _cdTimers = {};
  const startCountdown = (btn) => {
    const key = btn.id || 'default';
    if (_cdTimers[key]) clearInterval(_cdTimers[key]);
    let left = 60;
    btn.textContent = `${left}s 后重发`;
    _cdTimers[key] = setInterval(() => {
      left--;
      if (left <= 0) {
        clearInterval(_cdTimers[key]); _cdTimers[key] = 0;
        btn.disabled = false; btn.textContent = '发送验证码';
      } else btn.textContent = `${left}s 后重发`;
    }, 1000);
  };

  const runAuth = async (btn, busyText, fn) => {
    const old = btn.textContent;
    btn.disabled = true; btn.textContent = busyText;
    setAcctHint('正在连接云端…', 'busy');
    let r;
    try { r = await fn(); } catch (e) { r = { ok: false, message: String(e && e.message || e) }; }
    btn.disabled = false; btn.textContent = old;
    if (r && r.message) setAcctHint(r.message, r.ok ? 'ok' : 'err');
    else if (r && r.ok) setAcctHint('', '');
    return r;
  };

  $('#acctLoginBtn').addEventListener('click', async () => {
    const email = emailVal();
    if (!validEmail(email)) return setAcctHint('请填写正确的邮箱地址', 'err');
    const pwd = pwdVal();
    if (pwd.length < 6) return setAcctHint('密码至少 6 位', 'err');
    const r = await runAuth($('#acctLoginBtn'), '登录中…', () => window.TokenSync.signIn(email, pwd));
    if (r && r.ok) { toast('登录成功'); setAcctHint(''); }
  });

  $('#acctSignupBtn').addEventListener('click', async () => {
    const email = emailVal();
    if (!validEmail(email)) return setAcctHint('请填写正确的邮箱地址', 'err');
    const pwd = pwdVal();
    if (pwd.length < 6) return setAcctHint('密码至少 6 位', 'err');
    const r = await runAuth($('#acctSignupBtn'), '注册中…', () => window.TokenSync.signUp(email, pwd));
    if (r && r.ok && r.signedIn) { toast('注册成功，已登录'); }
    else if (r && r.ok) { toast('注册成功，请查收验证邮件'); }
  });

  $('#acctResetSend').addEventListener('click', async () => {
    const email = ($('#acctResetEmail').value || '').trim();
    if (!validEmail(email)) return resetHint('请先填写注册时用的邮箱', 'err');
    const btn = $('#acctResetSend');
    if (btn.disabled) return;
    btn.disabled = true; btn.textContent = '发送中…';
    const r = await window.TokenSync.resetPassword(email);
    resetHint(r.message, r.ok ? 'ok' : 'err');
    if (r.ok) startCountdown(btn);
    else { btn.disabled = false; btn.textContent = '发送验证码'; }
  });

  $('#acctResetBtn').addEventListener('click', async () => {
    const email = ($('#acctResetEmail').value || '').trim();
    if (!validEmail(email)) return resetHint('请先填写注册时用的邮箱', 'err');
    const code = ($('#acctResetCode').value || '').trim();
    if (!code) return resetHint('请填写邮箱里收到的验证码', 'err');
    const p1 = $('#acctResetPwd').value || '';
    const p2 = $('#acctResetPwd2').value || '';
    if (p1.length < 6) return resetHint('新密码至少 6 位', 'err');
    if (p1 !== p2) return resetHint('两次输入的新密码不一致', 'err');
    const btn = $('#acctResetBtn');
    const old = btn.textContent;
    btn.disabled = true; btn.textContent = '重设中…';
    resetHint('正在验证…', 'busy');
    let r;
    try { r = await window.TokenSync.confirmReset(email, code, p1); } catch (e) { r = { ok: false, message: String(e && e.message || e) }; }
    btn.disabled = false; btn.textContent = old;
    if (r.ok) {
      resetHint(r.message || '密码已重设', 'ok');
      toast('密码已重设，已登录');
      $('#acctResetPwd').value = ''; $('#acctResetPwd2').value = ''; $('#acctResetCode').value = '';
      showReset(false);
      renderAccountUI();
    } else {
      resetHint(r.message || '重设失败', 'err');
    }
  });

  $('#acctSyncBtn').addEventListener('click', async () => {
    const btn = $('#acctSyncBtn');
    if (btn.disabled) return;
    btn.disabled = true; btn.textContent = '同步中…';
    const r = await window.TokenSync.syncNow({ reason: 'manual' });
    btn.disabled = false; btn.textContent = '立即同步';
    toast(r.message || (r.ok ? '同步完成' : '同步失败'));
    renderAccountUI();
  });

  $('#acctSignoutBtn').addEventListener('click', async () => {
    if (!await appConfirm('退出后本机数据仍保留，但不再自动同步到云端。确定退出登录吗？', { okText: '退出登录' })) return;
    await window.TokenSync.signOut();
    setAcctHint('');
    toast('已退出登录');
    renderAccountUI();
  });

  $('#acctAutoSync').addEventListener('change', (e) => {
    window.TokenSync.setAuto(e.target.checked);
    toast(e.target.checked ? '已开启自动同步' : '已关闭自动同步');
  });

  $('#acctPullBtn').addEventListener('click', async () => {
    if (!await appConfirm('将用云端记录覆盖本机当前全部数据，本机尚未同步的改动会丢失。确定继续吗？', { danger: true, okText: '覆盖本机' })) return;
    const r = await window.TokenSync.pullForce();
    toast(r.message || (r.ok ? '已恢复' : '恢复失败'));
    renderAccountUI();
  });

  // 冲突三选一
  $('#syncChoiceMask').addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-choice]');
    if (!btn) return;
    closeSyncChoice();
    const r = await window.TokenSync.resolveConflict(btn.dataset.choice);
    toast(r.message || (r.ok ? '已处理' : '处理失败'));
    renderAccountUI();
  });

  // 抽屉里的账户入口 → 设置页账户卡片
  $('#drawerAccountBtn').addEventListener('click', () => {
    closeDrawer();
    switchView('settings');
    setTimeout(() => {
      const card = $('#acctLoggedOut').closest('.set-group') || $('#acctLoggedIn').closest('.set-group');
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (!window.TokenSync.getState().user) $('#acctEmail').focus({ preventScroll: true });
    }, 260);
  });
}

function initSyncIntegration() {
  if (!window.TokenSync) return;
  bindSyncEvents();
  renderAccountUI();
  window.TokenSync.init({
    getSnapshot: buildSyncSnapshot,
    applySnapshot: applySyncSnapshot,
    mergeSnapshot: mergeSyncSnapshot,
    hasLocalData: hasLocalLearningData,
    onChange: (st) => {
      renderAccountUI(st);
      if (st.conflict) openSyncChoice();
    },
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.TokenSync) window.TokenSync.handleResume();
  });
  // 每分钟刷新一次「x 分钟前」的相对时间显示
  setInterval(() => {
    const st = window.TokenSync.getState();
    if (st.user && currentView === 'settings') renderAccountUI(st);
  }, 60000);
}

// ===== 词书下拉同步（三处：侧边栏 / 移动端顶栏 / 设置页） =====
// 下拉选项 HTML：与首页 chips 同一顺序、同一角标（v3.0.2 抽出共用，设置页不再自行重建）
function bookOptionsHtml() {
  return getOrderedBookIds().map(id => {
    const meta = getBookMeta(id);
    const tag = meta.short && meta.short !== '自建' ? meta.short + ' · ' : '';
    return `<option value="${id}">${tag}${esc(meta.name)}</option>`;
  }).join('');
}

function refreshBookSelect() {
  const s = getSettings();
  const html = bookOptionsHtml();
  ['#bookSelect', '#setBookSelect'].forEach(sel => {
    const el = $(sel);
    if (el) { el.innerHTML = html; el.value = s.bookId; }
  });
  // v3.1.6：移动端顶栏改为按钮 + 底部弹层，按钮直接显示当前词书名
  const btn = $('#bookSelectMobileBtn');
  if (btn) {
    const meta = getBookMeta(s.bookId);
    btn.textContent = meta ? bookLabel(meta) : '选择词书';
  }
  renderBookSheetList();
}

// ===== 切换词书弹层（v3.1.6）：移动端顶栏右上角入口，iOS 底部动作面板 =====
function renderBookSheetList() {
  const list = $('#bookSheetList');
  if (!list) return;
  const cur = getSettings().bookId;
  list.innerHTML = getOrderedBookIds().map(id => {
    const meta = getBookMeta(id);
    if (!meta) return '';
    const tag = meta.short ? `<span class="cp-tag">${esc(meta.short)}</span>` : '';
    return `<button class="course-pick-item ${id === cur ? 'active' : ''}" data-id="${esc(id)}">
      <span class="cp-name">${esc(meta.name)}${tag}</span>
      <span class="cp-count">${meta.count} 词</span>
    </button>`;
  }).join('');
}

function openBookSheet() {
  renderBookSheetList();
  $('#bookSheetSub').textContent = `选择要学习的词书，共 ${getOrderedBookIds().length} 本`;
  $('#bookSheetMask').classList.add('open');
}

function closeBookSheet() {
  $('#bookSheetMask').classList.remove('open');
}

function setBook(bookId) {
  const s = getSettings();
  if (s.bookId === bookId) return;
  s.bookId = bookId;
  saveSettings(s);
  refreshBookSelect();
  renderHome();
  renderDrawer();
  updateMiniProgress();
  // 速记页若正在展示，词书立即跟随切换
  if ($('#view-rote').classList.contains('active')) renderRote();
  const meta = getBookMeta(bookId);
  if (meta) toast(`已切换到「${bookLabel(meta)}」`);
}

function updateMiniProgress() {
  const s = getSettings();
  const tasks = getTodayTasks(s.bookId);
  const total = tasks.reviews.length + tasks.news.length;
  const done = getTodayDoneCount(s.bookId);
  $('#miniDone').textContent = done;
  $('#miniTotal').textContent = Math.max(done, total);
  $('#miniBar').style.width = total ? Math.min(100, done / total * 100) + '%' : '0%';
  $('#miniStreak').textContent = s.streak || 0;
}

// ===== 事件绑定 =====
function bindEvents() {
  // ---- v3.0.4 全局禁止复制：拦截长按菜单 / 选择 / 复制 / 拖拽（输入框除外）----
  // 「关于」页复制按钮走 navigator.clipboard 或临时 textarea（属 input/textarea，不受影响）
  const inEditable = (t) => !!(t && t.closest && t.closest('input, textarea'));
  document.addEventListener('contextmenu', (e) => { if (!inEditable(e.target)) e.preventDefault(); });
  document.addEventListener('selectstart', (e) => { if (!inEditable(e.target)) e.preventDefault(); });
  document.addEventListener('copy', (e) => { if (!inEditable(e.target)) e.preventDefault(); });
  document.addEventListener('cut', (e) => { if (!inEditable(e.target)) e.preventDefault(); });
  document.addEventListener('dragstart', (e) => { if (!inEditable(e.target)) e.preventDefault(); });

  // ---- 导航：统一用事件委托处理所有 [data-view] ----
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-view]');
    if (!el) return;
    // 抽屉里的按钮额外关闭抽屉
    switchView(el.dataset.view);
  });

  // ---- 个人中心入口（v3.1.7：每页页头头像 + 侧栏入口） ----
  $('#avatarBtn').addEventListener('click', openDrawer);
  $$('.page-avatar').forEach(b => b.addEventListener('click', openDrawer));
  $('#drawerCloseBtn').addEventListener('click', closeDrawer);
  $('#drawerMask').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // v3.1.4 AlertDialog 打开时 Esc 不生效（防误触，必须明确点按钮）
      if ($('#dlgMask').classList.contains('open')) return;
      // v3.1.8 引导教程打开时 Esc 不退出（必须点右上角 ✕）
      if ($('#tourMask').classList.contains('open')) return;
      // 弹窗优先关闭（更新告知标记为已读）
      if ($('#victoryMask').classList.contains('open')) { closeVictory(); return; }
      if ($('#whatsNewMask').classList.contains('open')) { closeWhatsNew(); return; }
      if ($('#cropperMask').classList.contains('open')) { closeCropper(); return; }
      if ($('#coursePickMask').classList.contains('open')) { closeCoursePick(); return; }
      closeDrawer();
    }
  });

  // 文件提示条：查看已保存的文件（v2.9.2）
  $('#fileToastView').addEventListener('click', () => {
    const t = $('#fileToast');
    const uri = t.dataset.uri || '';
    const mime = t.dataset.mime || 'application/octet-stream';
    t.classList.remove('show');
    const ds = nativeSaver();
    if (ds && uri && typeof ds.openSaved === 'function') {
      ds.openSaved({ uri, mime }).catch(() => toast('未找到可以打开该文件的应用，可在文件管理器的 Download 里找到它'));
    }
  });

  // ---- 引导式新手教程（v3.1.8）----
  $('#tourNextBtn').addEventListener('click', () => {
    if (tourStep >= TOUR_STEPS.length - 1) { closeTour(true); toast('教程完成，开始体验吧！'); }
    else { tourStep++; renderTour(); }
  });
  $('#tourPrevBtn').addEventListener('click', () => { if (tourStep > 0) { tourStep--; renderTour(); } });
  // 唯一退出口：右上角 ✕（遮罩点击 / Esc / 返回键均不退出）
  $('#tourExitBtn').addEventListener('click', () => closeTour(true));
  window.addEventListener('resize', () => { if (tourActive && tourStep < TOUR_STEPS.length) positionTour(TOUR_STEPS[tourStep]); });
  $('#drawerTutorialBtn').addEventListener('click', () => { closeDrawer(); setTimeout(openTour, 260); });

  // ---- 版本更新告知 ----
  $('#wnOkBtn').addEventListener('click', closeWhatsNew);
  $('#wnCloseBtn').addEventListener('click', closeWhatsNew);
  $('#whatsNewMask').addEventListener('click', (e) => { if (e.target === $('#whatsNewMask')) closeWhatsNew(); });
  $('#wnTabCurrent').addEventListener('click', () => renderWhatsNew('current'));
  $('#wnTabHistory').addEventListener('click', () => renderWhatsNew('history'));
  // 昵称编辑（blur 时静默保存，点按钮时给提示，避免双重 toast）
  const saveName = (silent) => {
    const v = ($('#drawerName').value || '').trim().slice(0, 12) || '词友';
    const s = getSettings();
    if (s.userName === v) { $('#drawerName').value = v; return; }
    s.userName = v;
    saveSettings(s);
    $('#drawerName').value = v;
    renderDrawer();
    if (!silent) toast('昵称已保存');
  };
  $('#drawerRenameBtn').addEventListener('click', () => saveName(false));
  $('#drawerName').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); saveName(false); }
  });
  $('#drawerName').addEventListener('blur', () => saveName(true));

  // ---- 头像与个人资料（v2.2.0） ----
  // 抽屉头像点击 = 直接更换头像
  $('#drawerAvatarBtn').addEventListener('click', () => pickAvatar('app'));
  // 设置页：更换 / 移除
  $('#setAvatarBtn').addEventListener('click', () => pickAvatar('app'));
  $('#setAvatarChange').addEventListener('click', () => pickAvatar('app'));
  $('#setAvatarRemove').addEventListener('click', async () => {
    if (await appConfirm('确定移除自定义头像，恢复默认首字头像吗？', { okText: '移除' })) removeAvatar();
  });
  // 全局头像文件选择 → 先进入裁剪器
  $('#avatarFileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!/^image\//.test(file.type)) { toast('请选择图片文件'); return; }
    if (file.size > 12 * 1024 * 1024) { toast('图片太大（>12MB），请换一张'); return; }
    openCropper(file, (dataUrl) => {
      setAvatar(dataUrl);
      if (avatarPickCtx === 'onboard') {
        // 引导中选完头像，焦点回到昵称输入
        $('#obName').focus();
      } else {
        toast('头像已更新');
      }
    });
  });

  // ---- 头像裁剪器交互（v2.3.0） ----
  const stage = $('#cropperStage');
  const canvas = $('#cropperCanvas');
  const startDrag = (px, py) => {
    if (!cropper.img) return;
    cropper.dragging = true;
    cropper.lastX = px; cropper.lastY = py;
    canvas.classList.add('grabbing');
  };
  const moveDrag = (px, py) => {
    if (!cropper.dragging) return;
    cropper.x += px - cropper.lastX;
    cropper.y += py - cropper.lastY;
    cropper.lastX = px; cropper.lastY = py;
    clampCropOffset();
    drawCropper();
  };
  const endDrag = () => { cropper.dragging = false; canvas.classList.remove('grabbing'); };

  // 鼠标
  stage.addEventListener('mousedown', (e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); });
  window.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
  window.addEventListener('mouseup', endDrag);
  // 触摸
  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) startDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  stage.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) { e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY); }
  }, { passive: false });
  stage.addEventListener('touchend', endDrag);
  // 滚轮缩放（以取景框中心为锚点）
  stage.addEventListener('wheel', (e) => {
    if (!cropper.img) return;
    e.preventDefault();
    setCropZoom(cropper.zoom * (e.deltaY < 0 ? 1.08 : 0.926));
  }, { passive: false });

  function setCropZoom(z) {
    const next = Math.max(CROP_MIN_ZOOM, Math.min(CROP_MAX_ZOOM, z));
    if (next === cropper.zoom) return;
    // 以画布中心为锚点缩放，保证视觉稳定
    cropper.zoom = next;
    $('#cropperZoom').value = String(Math.round(next * 100));
    clampCropOffset();
    drawCropper();
  }
  $('#cropperZoom').addEventListener('input', (e) => setCropZoom(parseInt(e.target.value, 10) / 100));
  $('#cropperZoomIn').addEventListener('click', () => setCropZoom(cropper.zoom * 1.18));
  $('#cropperZoomOut').addEventListener('click', () => setCropZoom(cropper.zoom / 1.18));
  $('#cropperReset').addEventListener('click', cropperReset);
  $('#cropperOkBtn').addEventListener('click', cropperConfirm);
  $('#cropperCancelBtn').addEventListener('click', closeCropper);
  $('#cropperCloseBtn').addEventListener('click', closeCropper);
  $('#cropperMask').addEventListener('click', (e) => { if (e.target === $('#cropperMask')) closeCropper(); });

  // 设置页昵称（回车/失焦保存）
  const saveSettingsName = () => {
    const v = ($('#setUserName').value || '').trim().slice(0, 12);
    if (!v) { $('#setUserName').value = getSettings().userName || '词友'; return; }
    const s = getSettings();
    if (s.userName === v) return;
    s.userName = v;
    saveSettings(s);
    renderDrawer();
    renderAllAvatars();
    toast('昵称已保存');
  };
  $('#setUserName').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); }
  });
  $('#setUserName').addEventListener('blur', saveSettingsName);
  // 设置页简介
  const saveSettingsBio = () => {
    const v = ($('#setUserBio').value || '').trim().slice(0, 60);
    const s = getSettings();
    if (s.userBio === v) return;
    s.userBio = v;
    saveSettings(s);
    renderDrawer();
  };
  $('#setUserBio').addEventListener('blur', saveSettingsBio);

  // ---- 首次使用引导 ----
  $('#obAvatarBtn').addEventListener('click', () => pickAvatar('onboard'));
  $('#obDoneBtn').addEventListener('click', onboardDone);
  $('#obSkipBtn').addEventListener('click', onboardSkip);
  $('#obName').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); onboardDone(); }
  });
  $('#obBio').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onboardDone(); }
  });

  // ---- 每日新词步进器：首页 / 学习页 / 设置页三处同源 ----
  [['#goalMinus', '#goalPlus'], ['#studyGoalMinus', '#studyGoalPlus'], ['#setGoalMinus', '#setGoalPlus']]
    .forEach(([m, p]) => bindGoalStepper(m, p));

  // ---- 首页 ----
  $('#homeStartBtn').addEventListener('click', () => { switchView('study'); startStudy(); });
  $('#mistakeBtn').addEventListener('click', startMistakeStudy);
  $('#homeRoteBtn').addEventListener('click', () => switchView('rote'));

  $('#homeBookSwitcher').addEventListener('click', (e) => {
    if (chipDragSuppressClick) return;   // v3.0.0 拖拽结束时抑制误触点击
    const chip = e.target.closest('.book-chip');
    if (!chip) return;
    setBook(chip.dataset.book);
  });
  bindChipDrag();
  initBookPanel();   // v3.1.9：首页词书面板折叠

  // v3.1.10/11：折叠大标题 —— 滚动进度连续插值
  // 进度 p = scrollY/110 写入根元素 --hp (0~1)；CSS 端标题缩放/毛玻璃透明度走合成器，
  // padding 收紧由 .stuck 一次性过渡（详见 updateHeadProgress 注释）
  window.addEventListener('scroll', () => {
    if (!_headRaf) _headRaf = requestAnimationFrame(updateHeadProgress);
  }, { passive: true });
  // v3.2.1：点进度行也能收起/展开速记工具栏（不知道上滑手势时的兜底）
  document.querySelectorAll('.rote-sticky-top').forEach(top => {
    top.setAttribute('title', '点击收起 / 展开工具栏');
    top.addEventListener('click', () => {
      const bar = top.closest('.rote-sticky');
      if (!bar) return;
      bar.classList.toggle('folded');
    });
  });
  // v3.1.11：.stuck 的 padding-top 过渡（320ms）通常发生在滚动事件停止之后，
  // 过渡结束时页头高度已变，必须再同步一次 --pagehead-h，否则吸顶工具栏会错位
  document.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'padding-top' && e.target && e.target.classList && e.target.classList.contains('page-head')) {
      updateHeadProgress();
    }
  });

  // 胜利分享弹层（v3.0.0）
  $('#victoryClose').addEventListener('click', closeVictory);
  $('#victoryCloseBtn').addEventListener('click', closeVictory);
  $('#victorySave').addEventListener('click', saveVictoryImage);

  // 词书下拉（侧边栏 / 设置页）；移动端顶栏改为底部弹层（v3.1.6）
  ['#bookSelect', '#setBookSelect'].forEach(sel => {
    const el = $(sel);
    if (el) el.addEventListener('change', (e) => setBook(e.target.value));
  });
  $('#bookSelectMobileBtn').addEventListener('click', openBookSheet);
  $('#bookSheetCancel').addEventListener('click', closeBookSheet);
  $('#bookSheetMask').addEventListener('click', (e) => { if (e.target === $('#bookSheetMask')) closeBookSheet(); });
  $('#bookSheetList').addEventListener('click', (e) => {
    const item = e.target.closest('.course-pick-item');
    if (!item) return;
    closeBookSheet();
    setBook(item.dataset.id);
  });

  // 每日目标调节由上方 bindGoalStepper 统一接管（首页 / 学习页 / 设置页）

  // ---- 学习 ----
  $('#studyBeginBtn').addEventListener('click', startStudy);
  $('#studyResumeBtn').addEventListener('click', resumeStudy);
  $('#flashcard').addEventListener('click', revealCard);
  $('#flashSpeaker').addEventListener('click', (e) => { e.stopPropagation(); speak($('#flashWord').textContent); });
  $$('.grade-btn').forEach(btn => btn.addEventListener('click', () => gradeCurrent(btn.dataset.grade)));
  $('#optAutoPlay').addEventListener('change', (e) => {
    const s = getSettings(); s.autoPlay = e.target.checked; saveSettings(s);
    renderSettingsValues();
  });

  // ---- 测验 ----
  // v3.1.7：学习页子标签（学习 / 测验）
  $$('#studySubTabs .study-subtab').forEach(b => b.addEventListener('click', () => setStudySub(b.dataset.sub)));
  $('#quizStartBtn').addEventListener('click', startQuiz);
  $('#quizResumeBtn').addEventListener('click', resumeQuiz);
  $('#quizNextBtn').addEventListener('click', nextQuiz);
  $('#quizAgainBtn').addEventListener('click', resetQuizSetup);
  $('#spellSubmitBtn').addEventListener('click', submitSpell);
  $('#spellInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); submitSpell(); }
  });

  // ---- 速记 ----
  $('#roteMaskBtn').addEventListener('click', roteCycleMask);
  $('#roteOnlyUndone').addEventListener('click', () => {
    roteOnlyUndone = !roteOnlyUndone;
    rotePage = 1;
    roteRevealed = {};
    syncRoteButtons();
    saveRoteState();
    renderRoteList();
  });
  $('#roteShuffle').addEventListener('click', roteShuffle);
  $('#roteRestore').addEventListener('click', roteRestore);
  $('#roteResetChecks').addEventListener('click', roteClearChecks);
  $('#roteList').addEventListener('click', (e) => {
    const chk = e.target.closest('.rote-check');
    if (chk) {
      const row = chk.closest('.rote-item');
      if (row) roteToggleCheck(row.dataset.k);
      return;
    }
    const el = e.target.closest('[data-part]');
    if (!el) return;
    // 音标跟随英文：点音标等同于点英文灰块
    roteTogglePart(el.dataset.w, el.dataset.part === 'phon' ? 'en' : el.dataset.part);
  });
  $('#rotePager').addEventListener('click', (e) => {
    const btn = e.target.closest('.page-btn');
    if (!btn || btn.disabled) return;
    roteGotoPage(parseInt(btn.dataset.page, 10));
  });
  // 速记底部「每页词数」：翻页时顺手调整（直接输入任意数值，回车或失焦生效）
  $('#rotePager').addEventListener('change', (e) => {
    const inp = e.target.closest('.page-size-input');
    if (inp) setRotePageSize(inp.value);
  });
  // 搜索直达已移除（v2.6.2）

  // ---- 课程（v2.8.0） ----
  $('#courseUnits').addEventListener('click', (e) => {
    const card = e.target.closest('.course-unit');
    if (card) openCourseUnit(card.dataset.unit);
  });
  $('#courseBackBtn').addEventListener('click', closeCourseUnit);
  $('#courseTabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.course-tab');
    if (tab) courseSetSection(tab.dataset.sec);
  });
  $('#courseMaskBtn').addEventListener('click', courseCycleMask);
  $('#courseCollect').addEventListener('click', openCourseCollectPicker);
  // 默写纸入口：课程头部（动态渲染）走委托，速记提示行走直绑
  $('#courseUnitHead').addEventListener('click', (e) => {
    if (e.target.closest('#courseDictation')) exportCourseDictation();
  });
  // 生词入本选择器
  $('#coursePickList').addEventListener('click', (e) => {
    const item = e.target.closest('.course-pick-item');
    if (item) courseCollectInto(item.dataset.id);
  });
  $('#coursePickCancel').addEventListener('click', closeCoursePick);
  $('#coursePickMask').addEventListener('click', (e) => { if (e.target === $('#coursePickMask')) closeCoursePick(); });
  $('#courseOnlyUndone').addEventListener('click', () => {
    courseOnlyUndone = !courseOnlyUndone;
    coursePage = 1;
    courseRevealed = {};
    syncCourseButtons();
    saveCourseState();
    renderCourseList();
  });
  $('#courseShuffle').addEventListener('click', courseShuffle);
  $('#courseRestore').addEventListener('click', courseRestore);
  $('#courseResetChecks').addEventListener('click', courseClearChecks);
  $('#courseList').addEventListener('click', (e) => {
    const chk = e.target.closest('.rote-check');
    if (chk) {
      const row = chk.closest('.rote-item');
      if (row) courseToggleCheck(row.dataset.k);
      return;
    }
    const el = e.target.closest('[data-part]');
    if (!el) return;
    // 音标跟随英文：点音标等同于点英文灰块；英文注释随中文显隐
    courseTogglePart(el.dataset.w, (el.dataset.part === 'phon' || el.dataset.part === 'note') ? (el.dataset.part === 'note' ? 'note' : 'en') : el.dataset.part);
  });
  $('#coursePager').addEventListener('click', (e) => {
    const btn = e.target.closest('.page-btn');
    if (!btn || btn.disabled) return;
    courseGotoPage(parseInt(btn.dataset.page, 10));
  });
  $('#coursePager').addEventListener('change', (e) => {
    const inp = e.target.closest('.page-size-input');
    if (inp) setRotePageSize(inp.value, { silent: true });
  });

  // ---- 词库 ----
  $('#libSearch').addEventListener('input', () => { libPage = 1; renderLibraryTable(); });
  $('#libStatus').addEventListener('change', () => { libPage = 1; renderLibraryTable(); });
  $$('#tierFilters .tier-chip').forEach(chip => chip.addEventListener('click', () => {
    $$('#tierFilters .tier-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    libPage = 1;
    renderLibraryTable();
  }));
  $('#libPagination').addEventListener('click', (e) => {
    const btn = e.target.closest('.page-btn');
    if (!btn || btn.disabled) return;
    libPage = parseInt(btn.dataset.page, 10);
    renderLibraryTable();
  });

  // ---- 导入 ----
  $('#pickFileBtn').addEventListener('click', () => $('#fileInput').click());
  $('#fileInput').addEventListener('change', (e) => { if (e.target.files[0]) handleFile(e.target.files[0]); });
  $('.import-examples').addEventListener('click', (e) => {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;
    copyExample(btn.dataset.copy);
    const orig = btn.textContent;
    btn.textContent = '已复制';
    setTimeout(() => { btn.textContent = orig; }, 1200);
  });
  const dz = $('#dropzone');
  dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('dragover'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
  dz.addEventListener('drop', (e) => {
    e.preventDefault();
    dz.classList.remove('dragover');
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });
  $('#importConfirmBtn').addEventListener('click', confirmImport);
  $('#importCancelBtn').addEventListener('click', cancelImport);

  // 多工作表
  $('#sheetMergeBtn').addEventListener('click', sheetMergeImport);
  $('#sheetSplitBtn').addEventListener('click', sheetSplitImport);
  $('#sheetCancelBtn').addEventListener('click', () => {
    pendingWorkbook = null;
    $('#sheetPickerPanel').classList.add('hidden');
    $('#fileInput').value = '';
    toast('已取消导入');
  });

  // 字段映射
  $('#importMapToggle').addEventListener('click', () => {
    const grid = $('#importMapGrid');
    const open = grid.classList.toggle('hidden') === false;
    $('#importMapToggle').textContent = open ? '收起' : '展开调整';
  });
  $('#importMapGrid').addEventListener('change', (e) => {
    if (e.target.classList.contains('map-select')) applyMapping();
  });

  // 粘贴导入 / 模板下载
  $('#pasteParseBtn').addEventListener('click', parsePastedText);
  $('#tplDownloadBtn').addEventListener('click', downloadTemplate);

  // 主题切换（v2.7.0）
  $('#themeAuto').addEventListener('click', () => setTheme('auto'));
  $('#themeLight').addEventListener('click', () => setTheme('light'));
  $('#themeDark').addEventListener('click', () => setTheme('dark'));

  // 补录单词（v2.7.0）：结果区按钮为动态渲染，各自就地绑定
  $('#suppSearchBtn').addEventListener('click', suppSearch);
  $('#suppWord').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); suppSearch(); }
  });
  $('#suppBookSelect').addEventListener('change', () => saveSuppBookChoice());

  // 导出词库（v2.7.1）
  $('#exportBookSelect').addEventListener('change', saveExportBookChoice);
  $('#exportXlsxBtn').addEventListener('click', exportLibraryXlsx);
  $('#exportCsvBtn').addEventListener('click', exportLibraryCsv);

  // 新建词书 + 管理词表（v2.7.2）
  $('#suppNewBookBtn').addEventListener('click', suppCreateBook);
  $('#manageBookSelect').addEventListener('change', renderManageList);
  $('#manageFilter').addEventListener('input', renderManageList);
  $('#manageList').addEventListener('click', (e) => {
    const btn = e.target.closest('.mg-del');
    if (!btn) return;
    const row = btn.closest('.mg-row');
    if (row && row.dataset.w) manageDelete(row.dataset.w);
  });

  // 收入不熟词（v2.7.2）
  $('#roteCollect').addEventListener('click', collectUnfamiliar);
  $('#roteDictation').addEventListener('click', exportRoteDictation);

  // 「我的词书」列表（导入页 + 设置页共用逻辑）
  document.addEventListener('click', async (e) => {
    const act = e.target.closest('.cl-action');
    if (!act) return;
    const item = act.closest('.custom-list-item');
    if (!item) return;
    const id = item.dataset.id;
    const lists = getCustomLists();
    if (!lists[id]) return;
    if (act.dataset.act === 'use') {
      setBook(id);
      renderCustomLists();
    } else if (act.dataset.act === 'words') {
      // 打开「管理词表」并定位到这本词书
      populateManageBookSelect();
      const sel = $('#manageBookSelect');
      if (sel) { sel.value = id; renderManageList(); }
      const panel = $('#managePanel');
      if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      toast(`正在管理「${lists[id].name}」的词表`);
    } else if (act.dataset.act === 'rename') {
      const nn = (prompt('修改词书名称（最长 24 字）', lists[id].name) || '').trim().slice(0, 24);
      if (!nn || nn === lists[id].name) return;
      lists[id].name = nn;
      saveCustomLists(lists);
      refreshBookSelect();
      renderSettingsValues();
      renderCustomLists();
      renderHome();
      renderDrawer();
      toast(`词书已重命名为「${nn}」`);
    } else if (act.dataset.act === 'del') {
      if (await appConfirm(`确定删除词书「${lists[id].name}」吗？该词书的学习记录也会被清除。`, { danger: true, okText: '删除' })) {
        delete lists[id];
        saveCustomLists(lists);
        const s = getSettings();
        if (s.bookId === id) { s.bookId = 'cet4'; saveSettings(s); }
        if (roteBookId === id) roteBookId = null;
        refreshBookSelect();
        renderCustomLists();
        renderHome();
        toast('已删除');
      }
    }
  });

  // ---- 设置 ----
  $('#setAutoPlay').addEventListener('change', (e) => {
    const s = getSettings(); s.autoPlay = e.target.checked; saveSettings(s);
    $('#optAutoPlay').checked = s.autoPlay;
  });
  $('#setShowExample').addEventListener('change', (e) => {
    const s = getSettings(); s.showExample = e.target.checked; saveSettings(s);
  });
  $('#setRoteSinkChecked').addEventListener('change', (e) => {
    const s = getSettings(); s.roteSinkChecked = e.target.checked; saveSettings(s);
    toast(e.target.checked ? '打乱时已掌握的词会沉到底部' : '打乱时全部单词混合排序');
  });
  $('#setRotePageSize').addEventListener('change', (e) => {
    setRotePageSize(e.target.value);
  });
  // 考试倒计时（v2.9.0）
  $('#setExamName').addEventListener('change', saveExamSetting);
  $('#setExamDate').addEventListener('change', saveExamSetting);
  $('#setExamClear').addEventListener('click', () => {
    const s = getSettings(); s.examName = ''; s.examDate = ''; saveSettings(s);
    renderSettingsValues(); renderHome();
    toast('已清除考试倒计时');
  });
  // 首页倒计时卡：采用建议 / 幽灵卡跳设置
  $('#examCard').addEventListener('click', (e) => {
    if (e.target.closest('#examApplyBtn')) { applyExamSuggestion(); return; }
    if ($('#examCard').classList.contains('ghost')) switchView('settings');
  });
  $('#setSpeechRate').addEventListener('change', (e) => {
    const s = getSettings(); s.speechRate = parseFloat(e.target.value) || 0.85; saveSettings(s);
    speak('workshop');
  });
  // 自建词书角标（v3.0.0）
  $('#setBadgeMode').addEventListener('change', (e) => {
    const s = getSettings(); s.badgeMode = e.target.value; saveSettings(s);
    renderBookSwitcher();
    refreshBookSelect();
    toast('角标样式已更新');
  });
  $('#setImportBtn').addEventListener('click', () => { importFrom = 'settings'; switchView('import'); });
  $('#setStatsBtn').addEventListener('click', () => switchView('stats'));
  $('#setExportBtn').addEventListener('click', exportProgress);
  $('#setImportProgressBtn').addEventListener('click', () => $('#setImportProgressInput').click());
  $('#setImportProgressInput').addEventListener('change', (e) => {
    if (e.target.files[0]) importProgress(e.target.files[0]);
  });
  $('#setClearBtn').addEventListener('click', clearProgress);
  $('#changelogToggle').addEventListener('click', () => {
    const box = $('#changelogBox');
    const open = box.classList.toggle('hidden');
    $('#changelogArrow').classList.toggle('open', !open);
    if (!open) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // 作者邮箱一键复制
  $('#copyMailBtn').addEventListener('click', () => {
    const addr = AUTHOR_MAIL;
    const done = () => toast(`邮箱已复制：${addr}`);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(addr).then(done).catch(() => fallbackCopy(addr, done));
    } else {
      fallbackCopy(addr, done);
    }
  });

  function fallbackCopy(text, done) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    } catch (e) { toast('复制失败，请手动选择邮箱地址'); }
  }

  // ---- 数据备份（统计页） ----
  $('#exportBtn').addEventListener('click', exportProgress);
  $('#importBtn').addEventListener('click', () => $('#importProgressInput').click());
  $('#importProgressInput').addEventListener('change', (e) => {
    if (e.target.files[0]) importProgress(e.target.files[0]);
  });
  $('#clearBtn').addEventListener('click', clearProgress);

  // ---- 键盘快捷键（仅学习卡片可见时生效） ----
  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (!$('#view-study').classList.contains('active')) return;
    if (!$('#studyCard').classList.contains('hidden')) {
      if (e.code === 'Space') { e.preventDefault(); revealCard(); }
      else if (e.key === '1') gradeCurrent('again');
      else if (e.key === '2') gradeCurrent('hard');
      else if (e.key === '3') gradeCurrent('good');
      else if (e.key === '4') gradeCurrent('easy');
    }
  });
}

// ===== 初始化 =====
// =========================================================================
// v3.2.2：应用内更新
// 检查 GitHub Releases 最新 tag → 应用内下载 APK → 调起系统安装器（覆盖安装，记录不丢）
// 没有原生插件时（网页 / 浏览器）自动回退为「打开下载页」。
// =========================================================================
const UPD_REPO = 'YJH9999/EN_learn';
const UPD_API = 'https://api.github.com/repos/' + UPD_REPO + '/releases/latest';
const UPD_SKIP_KEY = 'wr_updskip';     // 点过「以后再说」的版本号（本机，不同步）
let _updInfo = null;                   // 最近一次查到的版本信息
let _updFileUri = '';                  // 已下载好的安装包（授权后重试时复用）
let _updBusy = false;
let _updListenerBound = false;

const isNativeApp = () => !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
const capPlugin = (n) => (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins[n]) || null;

function cmpVersion(a, b) {
  const pa = String(a).split('.').map(n => parseInt(n, 10) || 0);
  const pb = String(b).split('.').map(n => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const x = pa[i] || 0, y = pb[i] || 0;
    if (x !== y) return x > y ? 1 : -1;
  }
  return 0;
}

async function fetchLatestRelease() {
  const res = await fetch(UPD_API, { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const d = await res.json();
  const assets = d.assets || [];
  const apk = assets.find(a => /\.apk$/i.test(a.name || '')) || assets[0] || null;
  return {
    ver: String(d.tag_name || '').replace(/^v/i, ''),
    notes: String(d.body || '').replace(/\r/g, '').trim(),
    url: apk ? apk.browser_download_url : d.html_url,
    size: apk ? (apk.size || 0) : 0,
    page: d.html_url,
  };
}

function updSetStatus(text) {
  const el = $('#updateStatusText');
  if (el) el.textContent = text;
}

function openUpdateDialog(info, manual) {
  _updInfo = info;
  _updFileUri = '';
  $('#updTitle').textContent = 'v' + info.ver;
  $('#updSub').textContent = `当前 v${APP_VERSION}` + (info.size ? ` · 安装包约 ${(info.size / 1048576).toFixed(1)} MB` : '');
  $('#updNotes').textContent = info.notes || '这一版修复了若干问题、优化了细节，建议更新。';
  $('#updBadge').textContent = manual ? '可更新' : '发现新版本';
  $('#updProgressWrap').classList.add('hidden');
  $('#updBar').style.width = '0%';
  $('#updPct').textContent = '0%';
  $('#updTip').textContent = isNativeApp()
    ? '覆盖安装不会影响学习记录；下载完成后会直接弹出系统安装界面。'
    : '将打开下载页获取最新安装包。';
  const btn = $('#updNow');
  btn.disabled = false;
  btn.textContent = '立即更新';
  $('#updMask').classList.add('open');
  $('#updMask').setAttribute('aria-hidden', 'false');
}

function closeUpdateDialog() {
  $('#updMask').classList.remove('open');
  $('#updMask').setAttribute('aria-hidden', 'true');
}

async function checkUpdate(opts) {
  const manual = !!(opts && opts.manual);
  if (_updBusy) return;
  _updBusy = true;
  if (manual) updSetStatus('正在检查…');
  try {
    const info = await fetchLatestRelease();
    _updBusy = false;
    if (!info.ver) throw new Error('未找到可用版本');
    const newer = cmpVersion(info.ver, APP_VERSION) > 0;
    if (!newer) {
      updSetStatus(`已是最新版本 v${APP_VERSION}`);
      if (manual) toast('已经是最新版本了');
      return;
    }
    updSetStatus(`发现新版本 v${info.ver}`);
    if (!manual) {
      let skip = '';
      try { skip = localStorage.getItem(UPD_SKIP_KEY) || ''; } catch (e) { /* 隐私模式忽略 */ }
      if (skip === info.ver) return;      // 这版用户点过「以后再说」，本次启动不再弹
    }
    openUpdateDialog(info, manual);
  } catch (e) {
    _updBusy = false;
    updSetStatus('检查失败，点此重试');
    if (manual) toast('检查更新失败：' + ((e && e.message) || e));
  }
}

// 把已下载的安装包交给系统安装器；未授权「安装未知应用」时会跳系统设置
async function runInstall(fileUri) {
  const btn = $('#updNow');
  btn.disabled = true;
  btn.textContent = '正在调起安装…';
  try {
    const r = await capPlugin('DownloadSaver').installApk({ path: fileUri });
    if (r && r.needPermission) {
      $('#updTip').textContent = '已打开系统设置：请允许「Token」安装应用，返回后点「继续安装」即可（安装包已下载好，不会重新下）。';
      btn.disabled = false;
      btn.textContent = '继续安装';
      return;
    }
    $('#updTip').textContent = '已调起系统安装界面，按提示完成安装即可。';
    btn.textContent = '已开始安装';
    setTimeout(closeUpdateDialog, 1400);
  } catch (e) {
    btn.disabled = false;
    btn.textContent = '重试安装';
    $('#updTip').textContent = '安装失败：' + ((e && e.message) || e);
  }
}

async function downloadAndInstall() {
  const info = _updInfo;
  if (!info) return;
  const FS = capPlugin('Filesystem');
  const DS = capPlugin('DownloadSaver');

  // 没有原生能力（网页版 / 权限被限制）：交给浏览器下载
  if (!isNativeApp() || !FS || !DS) {
    window.open(info.url, '_blank');
    $('#updTip').textContent = '已打开下载页，下载完成后点击安装包即可覆盖更新。';
    return;
  }

  // 已经下好（比如刚去授权「安装未知应用」回来）：直接装，不再重复下载
  if (_updFileUri) return runInstall(_updFileUri);

  const btn = $('#updNow');
  const path = 'updates/Token-v' + info.ver + '.apk';
  const setPct = (p) => {
    const pct = Math.max(0, Math.min(100, Math.round(p)));
    $('#updBar').style.width = pct + '%';
    $('#updPct').textContent = pct + '%';
  };

  btn.disabled = true;
  btn.textContent = '下载中…';
  $('#updProgressWrap').classList.remove('hidden');
  setPct(0);

  try {
    if (!_updListenerBound && FS.addListener) {
      _updListenerBound = true;
      FS.addListener('progress', (st) => {
        if (st && st.contentLength > 0) setPct((st.bytes / st.contentLength) * 100);
      });
    }
    // 缓存里已有同尺寸文件就跳过多余的第二次下载
    let need = true;
    try {
      const st = await FS.stat({ path, directory: 'CACHE' });
      if (st && st.size && info.size && Math.abs(st.size - info.size) < 2048) need = false;
    } catch (e) { /* 不存在，正常下载 */ }

    if (need) {
      await FS.downloadFile({
        url: info.url,
        path,
        directory: 'CACHE',
        progress: true,
        recursive: true,
        connectTimeout: 30000,
        readTimeout: 180000,
      });
    }
    setPct(100);
    const got = await FS.getUri({ path, directory: 'CACHE' });
    _updFileUri = got.uri;
    await runInstall(_updFileUri);
  } catch (e) {
    btn.disabled = false;
    btn.textContent = '重新下载';
    $('#updTip').textContent = '下载失败：' + ((e && e.message) || e) + '。可直接打开下载页手动安装。';
  }
}

function bindUpdateEvents() {
  const later = $('#updLater');
  if (later) later.addEventListener('click', () => {
    if (_updInfo && !_updFileUri) {
      try { localStorage.setItem(UPD_SKIP_KEY, _updInfo.ver); } catch (e) { /* ignore */ }
    }
    closeUpdateDialog();
  });
  const now = $('#updNow');
  if (now) now.addEventListener('click', downloadAndInstall);
  const chk = $('#checkUpdateBtn');
  if (chk) chk.addEventListener('click', () => checkUpdate({ manual: true }));
}

function initUpdateChecker() {
  bindUpdateEvents();
  // 原生端启动 4 秒后静默查一次（不打扰使用，有新版才弹）；网页端只在手动点「检查更新」时查
  if (isNativeApp()) setTimeout(() => { checkUpdate({ manual: false }); }, 4000);
}

function init() {
  if (!window.BUILTIN_WORDS) {
    document.body.innerHTML = '<p style="padding:40px;text-align:center">词库数据加载失败，请确认 data/words.js 存在。</p>';
    return;
  }
  refreshBookSelect();
  applyTheme();
  watchSystemTheme();
  bindEvents();
  syncThemeButtons();
  renderHome();

  // v3.2.0：云端账户（会话恢复 + 自动同步）在首屏之后接入，不阻塞渲染
  try { initSyncIntegration(); } catch (e) { console.warn('sync init failed', e); }

  // v3.2.1：使用时长计时（每 15 秒一笔，按自然日累计）
  startUsageClock();

  // v3.2.2：应用内更新（原生端启动后静默检查一次，设置页可手动检查）
  try { initUpdateChecker(); } catch (e) { console.warn('update check init failed', e); }

  // v3.1.2：启动画面淡出移除（HTML/CSS 就绪即显示，主脚本就绪后离开）
  const boot = $('#bootSplash');
  if (boot) { boot.classList.add('done'); setTimeout(() => boot.remove(), 280); }

  // v3.1.2：启动分帧 —— 首帧只渲染首页必需部分，非首屏内容
  //（抽屉、设置页、关于页更新日志、头像）推迟到空闲时段，缩短可交互时间
  const idle = window.requestIdleCallback || (fn => setTimeout(fn, 80));
  idle(() => {
    renderDrawer();
    renderSettingsValues();
    renderChangelog();
    renderAllAvatars();
    updateMiniProgress();
  });

  // 支持 #rote / #settings 这类直达链接（也便于从外部唤起指定页面）；
  // 没有直达链接时恢复上次浏览的界面（清理后台重开后保持原界面，v2.8.2）
  const hash = (location.hash || '').replace(/^#/, '');
  if (hash && VIEW_TITLES[hash] && hash !== 'home') switchView(hash);
  else restoreLastView();

  // Android 物理返回键接管（v2.8.2）
  bindAndroidBack();

  // v3.1.2：防抖落盘兜底 —— 切后台/关闭页面时把待写进度强制落盘
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushProgress();
  });
  window.addEventListener('beforeunload', flushProgress);
  window.addEventListener('pagehide', flushProgress);

  // 底部导航胶囊：首帧无动画就位，之后随窗口变化重新对齐（rAF 节流，v2.8.2）
  requestAnimationFrame(() => moveMobilePill(false));
  let pillRAF = 0;
  window.addEventListener('resize', () => {
    if (pillRAF) return;
    pillRAF = requestAnimationFrame(() => { pillRAF = 0; moveMobilePill(false); });
  }, { passive: true });
  window.addEventListener('orientationchange', () => setTimeout(() => moveMobilePill(false), 260));

  // 首次使用（未完成引导）→ 弹出登录界面：头像 + 昵称 + 简介
  // 老用户：版本升级后弹出「更新内容」告知；关闭后如未看过新手教程会补看
  if (!maybeShowOnboard()) {
    if (!maybeShowWhatsNew()) maybeShowTutorial();
  }
}

document.addEventListener('DOMContentLoaded', init);
