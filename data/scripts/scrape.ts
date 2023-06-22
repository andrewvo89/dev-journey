import { ArticleResource, BookResource, CourseResource, JnodesMap, Resource, VideoResource } from 'types/jnode';

import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import axios from 'axios';
import dayjs from 'dayjs';
import fs from 'fs';
import { jnodesMapSchema } from '../../schemas/jnode';
import path from 'path';
import { produce } from 'immer';
import puppeteer from 'puppeteer-extra';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

puppeteer.use(StealthPlugin());
const timeout = 5000;

export async function main() {
  const jsonFiles = fs
    .readdirSync(path.join(__dirname, '..', 'jnodes'))
    .filter((f) => fs.statSync(path.join(__dirname, '..', 'jnodes', f)).isFile() && f.endsWith('.json'));

  const backupFolder = dayjs().tz(process.env.TIMEZONE).format('YYYY-MM-DDTHH:mm:ssZ[Z]');
  fs.mkdirSync(path.join(__dirname, '..', 'jnodes', 'backups', backupFolder), { recursive: true });

  const newJSONs = await Promise.all(
    jsonFiles.map((jsonFile) => {
      const prevJSONStr = fs.readFileSync(path.join(__dirname, '..', 'jnodes', jsonFile), 'utf-8');
      const prevJSON = jnodesMapSchema.parse(JSON.parse(prevJSONStr));
      return scrapeAndPopulate(prevJSON);
    }),
  );

  newJSONs.forEach((newJSON, index) => {
    fs.writeFileSync(path.join(__dirname, '..', 'jnodes', jsonFiles[index]), JSON.stringify(newJSON, null, 2));
  });
}

async function resolveScrapePromises(scrapePromiseMap: Record<string, Promise<Resource>[]>) {
  const resolvedScrapes: Record<string, Resource[]> = {};
  for (const [key, promises] of Object.entries(scrapePromiseMap)) {
    resolvedScrapes[key] = await Promise.all(promises);
  }
  return resolvedScrapes;
}

async function scrapeAndPopulate(json: JnodesMap): Promise<JnodesMap> {
  const scrapePromisesMap = Object.entries(json).reduce<Record<string, Promise<Resource>[]>>(
    (scrapeMap, [key, jnode]) =>
      produce(scrapeMap, (draft) => {
        const promises: Promise<Resource>[] = [];
        for (const article of jnode.resources.articles) {
          if (article.title.length > 0) {
            continue;
          }
          promises.push(scrapeArticle(article.url));
        }
        for (const book of jnode.resources.books) {
          if (book.title.length > 0) {
            continue;
          }
          promises.push(scrapeBook(book.url));
        }
        for (const course of jnode.resources.courses) {
          if (course.title.length > 0) {
            continue;
          }
          promises.push(scrapeCourse(course.url));
        }
        for (const video of jnode.resources.videos) {
          if (video.title.length > 0) {
            continue;
          }
          promises.push(scrapeVideo(video.url));
        }
        draft[key] = promises;
      }),
    {},
  );
  const scrapeMap = await resolveScrapePromises(scrapePromisesMap);
  return Object.entries(scrapeMap).reduce<JnodesMap>(
    (prevJSON, [key, resources]) =>
      produce(prevJSON, (draft) => {
        const oldResources = draft[key].resources;
        for (const resource of resources) {
          if (resource.type === 'book') {
            oldResources.books = oldResources.books.map((b) => (b.url === resource.url ? resource : b));
          }
          if (resource.type === 'article') {
            oldResources.articles = oldResources.articles.map((a) => (a.url === resource.url ? resource : a));
          }
          if (resource.type === 'video') {
            oldResources.videos = oldResources.videos.map((v) => (v.url === resource.url ? resource : v));
          }
          if (resource.type === 'course') {
            oldResources.courses = oldResources.courses.map((c) => (c.url === resource.url ? resource : c));
          }
        }
      }),
    json,
  );
}

export async function scrapeArticle(url: string): Promise<ArticleResource> {
  try {
    const mediumLike = ['levelup.gitconnected.com', 'medium.com', 'towardsdatascience.com', 'betterprogramming.pub'];
    if (mediumLike.some((s) => url.includes(s))) {
      return medium(url);
    }
    throw new Error('Unknown article platform');
  } catch {
    return { authors: [], title: '', type: 'article', url };
  }
}

export async function scrapeBook(url: string): Promise<BookResource> {
  try {
    if (url.includes('packtpub.com')) {
      return packetpub(url);
    }
    if (url.includes('oreilly.com')) {
      return oreilly(url);
    }
    throw new Error('Unknown book platform');
  } catch {
    return { authors: [], title: '', pages: 0, type: 'book', url };
  }
}

export async function scrapeCourse(url: string): Promise<CourseResource> {
  try {
    if (url.includes('udemy.com')) {
      return udemy(url);
    }
    if (url.includes('pluralsight.com')) {
      return pluralsight(url);
    }
    if (url.includes('coursera.org')) {
      return coursera(url);
    }
    if (url.includes('linkedin.com')) {
      return linkedin(url);
    }
    throw new Error('Unknown course platform');
  } catch {
    return { authors: [], duration: 0, title: '', platform: '', type: 'course', url };
  }
}

export async function scrapeVideo(url: string): Promise<VideoResource> {
  try {
    if (url.includes('youtu')) {
      if (url.includes('playlist?')) {
        return youtube_playlist(url);
      }
      return youtube(url);
    }
    throw new Error('Unknown video platform');
  } catch {
    return { authors: [], duration: 0, title: '', type: 'video', url };
  }
}

async function oreilly(url: string): Promise<BookResource> {
  const browser = await puppeteer.launch({ timeout, headless: 'new' });

  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });

    const title = (await page.$eval('h1.t-title', (el) => el.textContent)) ?? '';
    const authors = (await page.$$eval('span.author-name', (els) => els.map((el) => el.textContent))).reduce<string[]>(
      (prev, curr) => (curr ? [...prev, curr] : prev),
      [],
    );
    if (authors.length === 0) {
      console.info('No authors', url);
    }

    const isbn = await page.$eval('span.t-isbn', (el) => el.textContent);
    let pages = 0;
    if (isbn) {
      try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
        pages = response.data?.items?.[0]?.volumeInfo?.pageCount ?? 0;
      } catch (error) {
        pages = 0;
      }
    }
    if (pages === 0) {
      console.info('No pages', url);
    }
    return { title, authors, pages, type: 'book', url };
  } catch (error) {
    console.error(url, error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function packetpub(url: string): Promise<BookResource> {
  const browser = await puppeteer.launch({ timeout, headless: 'new' });

  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });

    const title = (await page.$eval('h1.product-page__block__contents__rhs__title', (el) => el.textContent)) ?? '';
    let authorsString =
      (await page.$eval('div.product-page__block__contents__rhs__authors', (el) => el.textContent?.trim())) ?? '';

    if (authorsString.startsWith('By ')) {
      authorsString = authorsString.substring('By '.length - 1);
    }
    const authors = authorsString.split(',').map((s) => s.trim());

    if (authors.length === 0) {
      console.info('No authors', url);
    }

    const pages = await page.$eval('dl.overview__datalist > div:nth-child(3) > dd', (el) =>
      parseInt(el.textContent ?? '0'),
    );
    if (pages === 0) {
      console.info('No pages', url);
    }
    return { title, authors, pages, type: 'book', url };
  } catch (error) {
    console.error(url, error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function medium(url: string): Promise<ArticleResource> {
  const browser = await puppeteer.launch({ timeout, headless: 'new' });

  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });

    const title = (await page.$eval('meta[data-rh="true"][property="og:title"]', (el) => el.content)) ?? '';
    const author = (await page.$eval('meta[data-rh="true"][name="author"]', (el) => el.content)) ?? '';

    return { authors: [author], title, type: 'article', url };
  } catch (error) {
    console.error(url, error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function youtube(url: string): Promise<VideoResource> {
  const browser = await puppeteer.launch({ timeout, headless: 'new' });
  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });

    const title = (await page.$eval('meta[name="title"]', (el) => el.content)) ?? '';
    const author = (await page.$eval('link[itemprop="name"]', (el) => el.getAttribute('content'))) ?? '';
    const durationString = (await page.$eval('meta[itemprop="duration"]', (el) => el.getAttribute('content'))) ?? '';
    let minutes = parseInt(durationString.split('PT')[1].split('M')[0]);
    const seconds = parseInt(durationString.split('M')[1].split('S')[0]);
    if (seconds > 0) {
      minutes += 1;
    }
    return { authors: [author], title, type: 'video', url, duration: minutes };
  } catch (error) {
    console.error(url, error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function youtube_playlist(url: string): Promise<VideoResource> {
  const browser = await puppeteer.launch({ timeout, headless: 'new' });
  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });

    const title = (await page.$eval('meta[name="title"]', (el) => el.content)) ?? '';
    const author = (await page.$eval('yt-formatted-string#owner-text > a', (el) => el.textContent)) ?? '';
    const duration = (
      await page.$$eval('span.ytd-thumbnail-overlay-time-status-renderer', (els) =>
        els.map((el) => {
          const text = String(el.textContent).trim();
          const minutes = parseInt(text.split(':')[0]);
          const seconds = parseInt(text.split(':')[1]);
          return minutes * 60 + seconds;
        }),
      )
    ).reduce<number>((prev, curr) => prev + curr, 0);
    return { authors: [author], title, type: 'video', url, duration: Math.ceil(duration / 60) };
  } catch (error) {
    console.error(url, error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function udemy(url: string): Promise<CourseResource> {
  const browser = await puppeteer.launch({ timeout, headless: 'new' });
  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForSelector('div[data-purpose="curriculum-stats"]', { timeout });

    const title = (await page.$eval('meta[name="title"]', (el) => el.content)) ?? '';
    const authors = (
      await page.$$eval('a.ud-instructor-links > span', (els) => els.map((el) => el.textContent))
    ).reduce<string[]>((prev, curr) => (curr ? [...prev, curr] : prev), []);
    const durationString =
      (await page.$eval('div[data-purpose="curriculum-stats"] > span > span', (el) => el.textContent)) ?? '';

    const hours = parseInt(durationString.split('h')[0]);
    const minutes = parseInt(durationString.split('h')[1].split('m total length')[0]);
    return { authors, title, type: 'course', url, duration: hours * 60 + minutes, platform: 'Udemy' };
  } catch (error) {
    console.error(url, error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function pluralsight(url: string): Promise<CourseResource> {
  const browser = await puppeteer.launch({ timeout, headless: 'new' });
  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForSelector('meta[property="og:title"]', { timeout });

    const title = (await page.$eval('meta[property="og:title"]', (el) => el.content)) ?? '';
    const authors = (await page.$$eval('div.author-name', (els) => els.map((el) => el.textContent?.trim()))).reduce<
      string[]
    >((prev, curr) => (curr ? [...prev, curr] : prev), []);
    const durationString = (await page.$eval('meta[name="duration"]', (el) => el.content)) ?? '';
    const hours = parseInt(durationString.split('PT')[1].split('H')[0]);
    const minutes = parseInt(durationString.split('H')[1].split('M')[0]);
    return { authors, title, type: 'course', url, duration: hours * 60 + minutes, platform: 'Pluralsight' };
  } catch (error) {
    console.error(url, error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function coursera(url: string): Promise<CourseResource> {
  const browser = await puppeteer.launch({ timeout, headless: 'new' });
  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForSelector('meta[property="og:title"][data-react-helmet="true"]', { timeout });

    const title = (await page.$eval('meta[property="og:title"][data-react-helmet="true"]', (el) => el.content)) ?? '';
    const authors = (await page.$$eval('h3.instructor-name', (els) => els.map((el) => el.textContent?.trim()))).reduce<
      string[]
    >((prev, curr) => (curr ? [...prev, curr] : prev), []);
    const duration = (
      await page.$$eval('span.duration-text > span', (els) =>
        els.map((el) => parseInt(el.textContent?.split('m')[0] ?? '0')),
      )
    ).reduce<number>((prev, curr) => prev + curr, 0);
    return { authors, title, type: 'course', url, duration, platform: 'Coursera' };
  } catch (error) {
    console.error(url, error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function linkedin(url: string): Promise<CourseResource> {
  const browser = await puppeteer.launch({ timeout, headless: 'new' });
  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });

    const title = (await page.$eval('meta[property="og:title"]', (el) => el.content)) ?? '';
    const authors = (
      await page.$$eval('li.course-instructors__list-item > a > div > h3', (els) =>
        els.map((el) => el.textContent?.trim()),
      )
    ).reduce<string[]>((prev, curr) => (curr ? [...prev, curr] : prev), []);

    const duration = await page.$eval(
      'div.aside-learning-course-card__duration',
      (el) =>
        parseInt((el.textContent ?? '').split('h ')[0]) * 60 +
        parseInt((el.textContent ?? '').split('h ')[1].split('m')[0]),
    );
    return { authors, title, type: 'course', url, duration, platform: 'LinkedIn Learning' };
  } catch (error) {
    console.error(url, error);
    throw error;
  } finally {
    await browser.close();
  }
}

// run();
// export async function run2() {
//   const resource = await packetpub('https://www.packtpub.com/product/the-kaggle-workbook/9781804611210');
//   console.log('resource', resource);
// }
// run2();
