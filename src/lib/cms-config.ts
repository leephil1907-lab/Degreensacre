export type CmsFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'boolean'
  | 'select'
  | 'list'
  | 'json'
  | 'email'
  | 'url';

export type CmsField = {
  name: string;
  label: string;
  type: CmsFieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  dynamicOptions?: 'agencies';
  defaultValue?: unknown;
  placeholder?: string;
  help?: string;
  min?: number;
  max?: number;
  fullWidth?: boolean;
};

export type CmsResource = {
  table: string;
  singular: string;
  plural: string;
  description: string;
  titleField: string;
  subtitleField?: string;
  statusField?: string;
  orderBy: string;
  fields: CmsField[];
};

const stateOptions = [
  'Lagos', 'Abuja', 'FCT', 'Akwa Ibom', 'Rivers', 'Enugu', 'Delta',
  'Anambra', 'Imo', 'Abia', 'Ebonyi', 'Cross River', 'Ogun', 'Oyo',
  'Kaduna', 'Kano', 'Other',
].map((value) => ({ value, label: value }));

export const CMS_RESOURCES: Record<string, CmsResource> = {
  developments: {
    table: 'developments',
    singular: 'development',
    plural: 'Developments',
    description: 'Publish estates, unit types, prices, payment plans and project galleries.',
    titleField: 'name',
    subtitleField: 'location',
    statusField: 'is_published',
    orderBy: 'created_at',
    fields: [
      { name: 'name', label: 'Development name', type: 'text', required: true },
      { name: 'slug', label: 'URL slug', type: 'text', required: true, placeholder: 'generated-from-name', help: 'Lowercase letters, numbers and hyphens only.' },
      { name: 'developer', label: 'Developer', type: 'text', defaultValue: 'De-Greenacres Properties Limited' },
      { name: 'status', label: 'Project status', type: 'select', required: true, defaultValue: 'planning', options: ['planning', 'under-construction', 'completed', 'sold-out'].map((value) => ({ value, label: value.replaceAll('-', ' ') })) },
      { name: 'location', label: 'Location / area', type: 'text', required: true },
      { name: 'state', label: 'State', type: 'select', required: true, defaultValue: 'Lagos', options: stateOptions },
      { name: 'total_units', label: 'Total units', type: 'number', min: 0, defaultValue: 0 },
      { name: 'available_units', label: 'Available units', type: 'number', min: 0, defaultValue: 0 },
      { name: 'completion_date', label: 'Completion date', type: 'date' },
      { name: 'site_inspection', label: 'Site inspection available', type: 'boolean', defaultValue: true },
      { name: 'is_published', label: 'Visible on public website', type: 'boolean', defaultValue: true },
      { name: 'featured', label: 'Feature this development', type: 'boolean', defaultValue: false },
      { name: 'description', label: 'Description', type: 'textarea', required: true, fullWidth: true },
      { name: 'documentation', label: 'Title / documentation', type: 'text', fullWidth: true },
      { name: 'unit_types', label: 'Unit types (JSON array)', type: 'json', fullWidth: true, defaultValue: [], help: 'Example: [{"type":"3 Bedroom Terrace","bedrooms":3,"size":180,"price":85000000,"available":4}]' },
      { name: 'payment_plans', label: 'Payment plans (JSON array)', type: 'json', fullWidth: true, defaultValue: [], help: 'Example: [{"name":"Outright","description":"Full payment","duration":"Once"}]' },
      { name: 'amenities', label: 'Amenities', type: 'list', fullWidth: true, defaultValue: [], help: 'One item per line.' },
      { name: 'features', label: 'Key features', type: 'list', fullWidth: true, defaultValue: [], help: 'One item per line.' },
      { name: 'gallery', label: 'Gallery image URLs', type: 'list', required: true, fullWidth: true, defaultValue: [], help: 'One absolute https:// image URL or local /path per line. First image is the cover.' },
    ],
  },
  agencies: {
    table: 'agencies',
    singular: 'agency',
    plural: 'Agencies',
    description: 'Manage agency profiles, contact details, branding and verification status.',
    titleField: 'name',
    subtitleField: 'state',
    statusField: 'is_published',
    orderBy: 'created_at',
    fields: [
      { name: 'name', label: 'Agency name', type: 'text', required: true },
      { name: 'slug', label: 'URL slug', type: 'text', required: true, placeholder: 'generated-from-name' },
      { name: 'email', label: 'Public email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'text', required: true },
      { name: 'whatsapp', label: 'WhatsApp number', type: 'text' },
      { name: 'website', label: 'Website', type: 'url' },
      { name: 'state', label: 'State', type: 'select', required: true, defaultValue: 'Lagos', options: stateOptions },
      { name: 'city', label: 'City', type: 'text' },
      { name: 'address', label: 'Office address', type: 'text', fullWidth: true },
      { name: 'logo_url', label: 'Logo URL', type: 'url', fullWidth: true },
      { name: 'cover_image_url', label: 'Cover image URL', type: 'url', fullWidth: true },
      { name: 'description', label: 'Agency description', type: 'textarea', required: true, fullWidth: true },
      { name: 'is_published', label: 'Visible on public website', type: 'boolean', defaultValue: true },
      { name: 'is_verified', label: 'Verified agency', type: 'boolean', defaultValue: false },
      { name: 'is_featured', label: 'Featured agency', type: 'boolean', defaultValue: false },
    ],
  },
  agents: {
    table: 'agents',
    singular: 'agent',
    plural: 'Agents',
    description: 'Manage team profiles and assign each agent to an agency.',
    titleField: 'name',
    subtitleField: 'email',
    statusField: 'is_published',
    orderBy: 'created_at',
    fields: [
      { name: 'name', label: 'Agent / team name', type: 'text', required: true },
      { name: 'slug', label: 'URL slug', type: 'text', required: true, placeholder: 'generated-from-name' },
      { name: 'agency_id', label: 'Agency', type: 'select', dynamicOptions: 'agencies', help: 'Create the agency first if it is not listed.' },
      { name: 'title', label: 'Job title', type: 'text' },
      { name: 'specialization', label: 'Specialization', type: 'text' },
      { name: 'email', label: 'Public email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'text', required: true },
      { name: 'whatsapp', label: 'WhatsApp number', type: 'text', help: 'International format, for example 2347041754800.' },
      { name: 'photo_url', label: 'Profile photo URL', type: 'url', fullWidth: true },
      { name: 'bio', label: 'Biography', type: 'textarea', required: true, fullWidth: true },
      { name: 'is_published', label: 'Visible on public website', type: 'boolean', defaultValue: true },
      { name: 'is_verified', label: 'Verified agent', type: 'boolean', defaultValue: false },
      { name: 'is_featured', label: 'Featured agent', type: 'boolean', defaultValue: false },
    ],
  },
  articles: {
    table: 'articles',
    singular: 'article',
    plural: 'Insights & Articles',
    description: 'Create drafts and publish editorial guides, market analysis and investment insights.',
    titleField: 'title',
    subtitleField: 'category',
    statusField: 'status',
    orderBy: 'published_at',
    fields: [
      { name: 'title', label: 'Article title', type: 'text', required: true, fullWidth: true },
      { name: 'slug', label: 'URL slug', type: 'text', required: true, placeholder: 'generated-from-title' },
      { name: 'category', label: 'Category', type: 'select', required: true, defaultValue: 'Buying Guide', options: ['Legal', 'Investment', 'Market Analysis', 'Buying Guide', 'Selling Guide', 'Company News'].map((value) => ({ value, label: value })) },
      { name: 'author', label: 'Author', type: 'text', required: true, defaultValue: 'De-Greenacres Team' },
      { name: 'published_at', label: 'Publish date', type: 'date', required: true },
      { name: 'read_time', label: 'Reading time (minutes)', type: 'number', required: true, min: 1, max: 120, defaultValue: 5 },
      { name: 'status', label: 'Publication status', type: 'select', required: true, defaultValue: 'draft', options: ['draft', 'published', 'archived'].map((value) => ({ value, label: value })) },
      { name: 'featured', label: 'Featured article', type: 'boolean', defaultValue: false },
      { name: 'image', label: 'Cover image URL', type: 'url', required: true, fullWidth: true },
      { name: 'excerpt', label: 'Excerpt / search summary', type: 'textarea', required: true, fullWidth: true },
      { name: 'content', label: 'Article content', type: 'textarea', required: true, fullWidth: true, help: 'Plain text. Separate paragraphs with a blank line.' },
      { name: 'tags', label: 'Tags', type: 'list', fullWidth: true, defaultValue: [], help: 'One tag per line.' },
    ],
  },
  reviews: {
    table: 'reviews',
    singular: 'review',
    plural: 'Reviews',
    description: 'Create, edit, approve, reject or remove customer reviews. Only approved reviews appear publicly.',
    titleField: 'name',
    subtitleField: 'title',
    statusField: 'status',
    orderBy: 'created_at',
    fields: [
      { name: 'name', label: 'Reviewer name', type: 'text', required: true },
      { name: 'email', label: 'Reviewer email', type: 'email', required: true },
      { name: 'rating', label: 'Rating (1–5)', type: 'number', required: true, min: 1, max: 5, defaultValue: 5 },
      { name: 'status', label: 'Moderation status', type: 'select', required: true, defaultValue: 'pending', options: ['pending', 'approved', 'rejected'].map((value) => ({ value, label: value })) },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'is_verified_buyer', label: 'Verified buyer', type: 'boolean', defaultValue: false },
      { name: 'title', label: 'Review title', type: 'text', fullWidth: true },
      { name: 'message', label: 'Review', type: 'textarea', required: true, fullWidth: true },
    ],
  },
};

export const CMS_RESOURCE_NAMES = Object.keys(CMS_RESOURCES);

export function isCmsResource(value: string): value is keyof typeof CMS_RESOURCES {
  return Object.hasOwn(CMS_RESOURCES, value);
}

export function emptyCmsValues(resource: CmsResource) {
  return Object.fromEntries(
    resource.fields.map((field) => [
      field.name,
      field.defaultValue ?? (field.type === 'boolean' ? false : field.type === 'list' || field.type === 'json' ? [] : ''),
    ]),
  );
}
