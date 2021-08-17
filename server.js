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
	initApi(req).then((api) => {
		api.query(
			Prismic.Predicates.any('document.type', ['about', 'meta'])
		).then((response) => {
			const { results } = response;
			const [about, meta] = results;
			console.log('this is about: ', about, 'this is meta:', meta);
			res.render('pages/about', { about, meta });
		});
	});
	// res.render('pages/about');
});

app.get('/collections', (req, res) => {
	res.render('pages/collections');
});

app.get('/detail/:id', (req, res) => {
	res.render('pages/detail');
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
