import xml from 'xml';
import { Meteor } from 'meteor/meteor';
import { JsonRoutes } from 'meteor/simple:json-routes';
// import Documents from '../../api/Documents/Documents';
import { iso } from '../../libs/dates.js';

const baseUrl = Meteor.absoluteUrl();

// NOTE: Slashes are omitted at front because it comes with baseUrl.
const routes = [
  { base: 'signup' },
  { base: 'login' },

  { base: 'verify-email' },
  { base: 'recover-password' },
  { base: 'reset-password' },

  { base: 'terms' },
  { base: 'privacy' },

  // {
  //   base: 'documents',
  //   collection: Documents,
  //   // NOTE: Edit this query to limit what you publish.
  //   query: {},
  //   projection: { fields: { _id: 1, createdAt: 1 }, sort: { createdAt: -1 } },
  // },
];

const sitemap = {
  urlset: [{ _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' } }],
};

routes.forEach(({ base, collection, query, projection }) => {
  const currentDateTime = new Date().toISOString();
  const urlTemplate = (path, date, priority) => ({
    url: [
      { loc: `${baseUrl}${path}` },
      { lastmod: iso(date) },
      { changefreq: 'monthly' },
      { priority },
    ],
  });

  sitemap.urlset.push(urlTemplate(base, currentDateTime, '1.0'));

  if (collection) {
    const items = collection.find(query, projection).fetch();
    if (items.length > 0) {
      items.forEach(({ _id, createdAt }) => {
        sitemap.urlset.push(urlTemplate(`${base}/${_id}`, createdAt, 0.5));
      });
    }
  }
});

JsonRoutes.add('GET', '/sitemap.xml', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/xml' });
  response.end(xml(sitemap, { declaration: { standalone: 'yes', encoding: 'utf-8' } }));
});
