/**
 * Shared section icon options used across ProjectModal, Sidebar, and project detail pages.
 * Each entry maps a Lucide icon key (value) to a display label with an emoji icon prefix.
 */

export interface SectionIconOption {
  value: string;   // Lucide component key used to resolve the icon at runtime
  label: string;   // Human-readable label shown in the dropdown
  emoji: string;   // Emoji shown as icon prefix in the Select trigger & list
}

export const SECTION_ICON_OPTIONS: SectionIconOption[] = [
  // ── Education & Training ─────────────────────────────────────────────
  { value: 'GraduationCap',   label: 'Education',        emoji: '🎓' },
  { value: 'BookOpen',        label: 'Documentation',    emoji: '📖' },
  { value: 'BookMarked',      label: 'Guides',           emoji: '📚' },
  { value: 'School',          label: 'School',           emoji: '🏫' },
  { value: 'PenLine',         label: 'Training',         emoji: '✏️' },
  { value: 'ClipboardList',   label: 'Curriculum',       emoji: '📋' },

  // ── Operations & Admin ───────────────────────────────────────────────
  { value: 'ShieldAlert',     label: 'Admin / Security', emoji: '🛡️' },
  { value: 'Settings',        label: 'Settings',         emoji: '⚙️' },
  { value: 'ClipboardCheck',  label: 'Compliance',       emoji: '✅' },
  { value: 'FileCheck',       label: 'Approvals',        emoji: '📄' },
  { value: 'Lock',            label: 'Policies',         emoji: '🔐' },
  { value: 'Gavel',           label: 'Legal / HR',       emoji: '⚖️' },

  // ── Client & Student ─────────────────────────────────────────────────
  { value: 'Backpack',        label: 'Student Guides',   emoji: '🎒' },
  { value: 'Users2',          label: 'Clients / Teams',  emoji: '👥' },
  { value: 'HeartHandshake',  label: 'Onboarding',       emoji: '🤝' },
  { value: 'MessageCircle',   label: 'Support / FAQ',    emoji: '💬' },
  { value: 'Star',            label: 'Highlights',       emoji: '⭐' },

  // ── Development & Tech ───────────────────────────────────────────────
  { value: 'Code2',           label: 'Developer Specs',  emoji: '💻' },
  { value: 'Terminal',        label: 'API Docs',         emoji: '🖥️' },
  { value: 'GitBranch',       label: 'Workflows',        emoji: '🔀' },
  { value: 'Database',        label: 'Database',         emoji: '🗄️' },
  { value: 'Webhook',         label: 'Integrations',     emoji: '🔗' },
  { value: 'Bug',             label: 'Bug Reports',      emoji: '🐛' },

  // ── Business & Finance ───────────────────────────────────────────────
  { value: 'Briefcase',       label: 'Business',         emoji: '💼' },
  { value: 'BarChart2',       label: 'Analytics',        emoji: '📊' },
  { value: 'DollarSign',      label: 'Finance',          emoji: '💰' },
  { value: 'TrendingUp',      label: 'Growth',           emoji: '📈' },
  { value: 'Target',          label: 'Goals / KPIs',     emoji: '🎯' },
  { value: 'Handshake',       label: 'Partnerships',     emoji: '🫱' },

  // ── Healthcare & Wellness ────────────────────────────────────────────
  { value: 'HeartPulse',      label: 'Health',           emoji: '❤️' },
  { value: 'Stethoscope',     label: 'Medical',          emoji: '🩺' },
  { value: 'Pill',            label: 'Pharmacy',         emoji: '💊' },
  { value: 'Activity',        label: 'Wellness',         emoji: '🏃' },

  // ── Design & Creative ────────────────────────────────────────────────
  { value: 'Palette',         label: 'Design',           emoji: '🎨' },
  { value: 'Image',           label: 'Media',            emoji: '🖼️' },
  { value: 'Video',           label: 'Video',            emoji: '📹' },
  { value: 'Mic',             label: 'Podcast / Audio',  emoji: '🎙️' },

  // ── Operations & Logistics ───────────────────────────────────────────
  { value: 'Package',         label: 'Inventory',        emoji: '📦' },
  { value: 'Truck',           label: 'Logistics',        emoji: '🚚' },
  { value: 'MapPin',          label: 'Locations',        emoji: '📍' },
  { value: 'CalendarCheck',   label: 'Scheduling',       emoji: '📅' },
  { value: 'Bell',            label: 'Notifications',    emoji: '🔔' },
  { value: 'Workflow',        label: 'Processes',        emoji: '🔄' },
];

/**
 * Converts SECTION_ICON_OPTIONS to the format expected by the custom Select component.
 * NOTE: icon prop is intentionally omitted here — use getSectionIconSelectOptions()
 * from the component layer to pass a React element.
 */
export const getSectionIconSelectOptions = () =>
  SECTION_ICON_OPTIONS.map(opt => ({
    value: opt.value,
    label: `${opt.emoji}  ${opt.label}`,
  }));

/**
 * Get emoji for a given icon value key
 */
export function getSectionEmoji(iconValue: string): string {
  return SECTION_ICON_OPTIONS.find(o => o.value === iconValue)?.emoji ?? '📝';
}
