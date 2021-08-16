require('dotenv').config();

const Prismic = require('@prismicio/client');
var PrismicDOM = require('prismic-dom');

const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

const initApi = (req) => {
	return Prismic.getApi(process.env.PRIMSIC_ENDPOINT, {
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

	return '/';
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

app.get('/about', (req, res) => {
	initApi(req).then((api) => {
		api.query(Prismic.Predicates.at('document.type', 'about')).then(
			(response) => {
				const { results } = response;
				const { about } = results;
				console.log(about);
				res.render('pages/about');
			}
		);
	});
	res.render('pages/about');
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
