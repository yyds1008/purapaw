// resources.js - declarative config for the generic admin CRUD.
// Each resource has: label, singular, fields [{name,label,type,options}].
module.exports = {
  products: {
    label: 'Products', singular: 'Product',
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'badge', label: 'Badge', type: 'text' },
      { name: 'imageUrl', label: 'Image URL', type: 'url' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'features', label: 'Features (one per line)', type: 'list' },
      { name: 'sortOrder', label: 'Sort order', type: 'number' },
      { name: 'isActive', label: 'Active', type: 'checkbox' }
    ]
  },
  healthItems: {
    label: 'Health Litter', singular: 'Health Item',
    fields: [
      { name: 'icon', label: 'Icon (fa name)', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' }
    ]
  },
  whyPoints: {
    label: 'Why Choose Us', singular: 'Why Point',
    fields: [
      { name: 'icon', label: 'Icon (fa name)', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' }
    ]
  },
  services: {
    label: 'OEM Services', singular: 'Service',
    fields: [
      { name: 'icon', label: 'Icon (fa name)', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' }
    ]
  },
  processSteps: {
    label: 'Process', singular: 'Step',
    fields: [
      { name: 'step', label: 'Step no.', type: 'number' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' }
    ]
  },
  highlights: {
    label: 'Feature Highlights', singular: 'Highlight',
    fields: [
      { name: 'icon', label: 'Icon (fa name)', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' }
    ]
  },
  testimonials: {
    label: 'Testimonials', singular: 'Testimonial',
    fields: [
      { name: 'author', label: 'Author', type: 'text' },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'company', label: 'Company', type: 'text' },
      { name: 'content', label: 'Content', type: 'textarea' },
      { name: 'rating', label: 'Rating (1-5)', type: 'number' },
      { name: 'avatarUrl', label: 'Avatar URL', type: 'url' }
    ]
  },
  blogPosts: {
    label: 'Blog', singular: 'Post',
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'imageUrl', label: 'Image URL', type: 'url' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { name: 'content', label: 'Content', type: 'textarea' },
      { name: 'author', label: 'Author', type: 'text' },
      { name: 'publishDate', label: 'Date', type: 'text' }
    ]
  },
  inquiries: {
    label: 'Inquiries', singular: 'Inquiry', readOnly: true,
    fields: []
  }
};
