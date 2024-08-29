import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
	const gamedevPost = await getCollection('gamedev');
	const writingPost = await getCollection('writing');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: [...gamedevPost.map((post) => ({
			...post.data,
			link: `/gamedev/${post.slug}/`,
		})), ...writingPost.map((post) => ({
			...post.data,
			link: `/writing/${post.slug}/`,
		}))]
	});
}
