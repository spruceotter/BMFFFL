import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

export interface ArticleFrontmatter {
  title: string;
  subtitle?: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  category: string;
  featured?: boolean;
  validAsOf?: string;
  status?: string;
}

export interface ArticleData {
  slug: string;
  frontmatter: ArticleFrontmatter;
  content: string;  // raw MDX/markdown content string
}

/** Get all article slugs from the articles directory */
export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((f) => f.replace(/\.(mdx|md)$/, ''));
}

/** Get article data by slug */
export function getArticleBySlug(slug: string): ArticleData | null {
  const mdxPath = path.join(ARTICLES_DIR, `${slug}.mdx`);
  const mdPath  = path.join(ARTICLES_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as ArticleFrontmatter,
    content,
  };
}

/** Get all articles with frontmatter (for listing pages) */
export function getAllArticles(): ArticleData[] {
  return getAllArticleSlugs()
    .map(getArticleBySlug)
    .filter((a): a is ArticleData => a !== null)
    .sort((a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime()
    );
}
