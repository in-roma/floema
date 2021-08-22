require('dotenv').config();

const Prismic = require('@prismicio/client');
const PrismicDOM = require('prismic-dom');

const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

const initApi = (req) => {
	return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
		accessToken: process.env.PRISMIC_ACCESS_TOKEN,
		req,
	});
};

const handleResolver = (doc) => {
	// if (doc.type === 'page') {
	// 	return '/page/' + doc.uid;
	// } else if (doc.type === 'blog_post') {
	// 	return '/blog/' + doc.uid;
	// }
	// return '/';
};

app.use((req, res, next) => {
	res.locals.ctx = {
		endpoint: process.env.PRIMSIC_ENDPOINT,
		linkResolver: handleResolver,
	};
	res.locals.PrismicDOM = PrismicDOM;
	next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
	res.render('pages/home');
});

app.get('/about', async (req, res) => {
	const api = await initApi(req);
	const meta = await api.getSingle('meta');
	const about = await api.getSingle('about');

	res.render('pages/about', { about, meta });
});

app.get('/collections', async (req, res) => {
	const api = await initApi(req);
	const meta = await api.getSingle('meta');
	const { results: collections } = await api.query(
		Prismic.Predicates.at('document.type', 'collection', {
			fetchLinks: 'product.image',
		})
	);

	collections.forEach((collection) => {
		console.log(collection.data.products);
	});

	res.render('pages/collections', { meta, collections });
});

app.get('/detail/:uid', async (req, res) => {
	const api = await initApi(req);
	const meta = await api.getSingle('meta');
	const product = await api.getByUID('product', req.params.uid, {
		fetchLinks: 'collection.title',
	});
	res.render('pages/detail', { meta, product });
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
