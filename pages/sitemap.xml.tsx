import { fetchMeetupEvents } from '../modules/meetup/api';
import _uniq from 'lodash/uniq';
import { GetServerSideProps } from 'next';

function generateSiteMap(years: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://lyonjs.org</loc>
     </url>
     <url>
       <loc>https://lyonjs.org/about</loc>
     </url>
     <url>
       <loc>https://lyonjs.org/code-de-conduite</loc>
     </url>
     <url>
       <loc>https://lyonjs.org/evenements-precedents/2023</loc>
     </url>
     ${years.map((year) => `<url><loc>https://lyonjs.org/evenements-precedents/${year}</loc></url>`)}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps<{}> = async ({ res }) => {
  const { pastEvents } = await fetchMeetupEvents();
  const yearsFromEvents: string[] = pastEvents
    .map((event) => new Date(event.dateTime).getFullYear())
    .map((year) => year.toString());
  const years = _uniq(yearsFromEvents);

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(years);

  res.setHeader('Content-Type', 'text/xml');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
