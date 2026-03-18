import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import { getAllArticleSlugs, getArticleBySlug, ArticleFrontmatter } from '@/lib/mdx';
import ArticlePage from '@/components/articles/ArticlePage';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArticleSlugPageProps {
  frontmatter: ArticleFrontmatter;
  mdxSource: MDXRemoteSerializeResult;
  slug: string;
}

// ─── Static generation ────────────────────────────────────────────────────────

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllArticleSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ArticleSlugPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { notFound: true };
  }

  const mdxSource = await serialize(article.content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  });

  return {
    props: {
      frontmatter: article.frontmatter,
      mdxSource,
      slug,
    },
  };
};

// ─── Page component ───────────────────────────────────────────────────────────

export default function ArticleSlugPage({ frontmatter, mdxSource, slug }: ArticleSlugPageProps) {
  // Calculate read time (rough: 200 words/min)
  const wordCount = mdxSource.compiledSource.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <>
      <Head>
        <title>{frontmatter.title} | BMFFFL</title>
        {frontmatter.subtitle && <meta name="description" content={frontmatter.subtitle} />}
      </Head>
      <ArticlePage
        title={frontmatter.title}
        author={frontmatter.author || 'Flint'}
        publishedAt={frontmatter.publishedAt}
        category={frontmatter.category}
        tags={frontmatter.tags}
        readTime={readTime}
        content={<MDXRemote {...mdxSource} />}
        validAsOf={frontmatter.validAsOf}
      />
    </>
  );
}
