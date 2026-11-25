import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const readPage = (route = '') =>
  readFileSync(new URL(`../dist/${route}index.html`, import.meta.url), 'utf8');

test('посетитель находит Prosto Apps на главной и открывает веб-версию', () => {
  const home = readPage();
  assert.match(home, /<html lang="ru"/);
  assert.match(home, /href="\/products\/prosto-apps\/"[^>]*>.*?<h3[^>]*>Prosto Apps<\/h3>/s);

  const product = readPage('products/prosto-apps/');
  assert.match(product, /<h1[^>]*>Prosto Apps<\/h1>/);
  assert.match(product, /href="https:\/\/prostodot\.github\.io\/releases\/apps-web\/"[^>]*>Открыть веб-версию<\/a>/);
});

test('первая публикация доступна в блоге и со страницы связанного продукта', () => {
  const postLink = /href="\/blog\/site-launch\/"[^>]*>Открылся сайт Prosto\.<\/a>/;
  assert.match(readPage('blog/'), postLink);
  assert.match(readPage('products/prosto-apps/'), postLink);

  const post = readPage('blog/site-launch/');
  assert.match(post, /<h1[^>]*>Открылся сайт Prosto\.<\/h1>/);
  assert.match(post, /<time[^>]*datetime="2026-11-26"/);
  const relatedProducts = post.match(/<section[^>]*aria-labelledby="related-products"[^>]*>(.*?)<\/section>/s)?.[1] ?? '';
  assert.match(relatedProducts, /href="\/products\/prosto-apps\/"[^>]*>Prosto Apps<\/a>/);
});
