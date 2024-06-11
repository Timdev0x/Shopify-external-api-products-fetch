import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';
import Shopify from 'shopify-api-node';

dotenv.config();

const app = express();

const shopify = new Shopify({
  shopName: process.env.shopName,
  apiKey: process.env.apiKey,
  password: process.env.password
});

const PORT = 5000;

app.get('/', (req, res) => {
  res.send('<h1>Our app is running .....</h1>');
});

async function getProducts() {
  const response = await fetch('http://fakestoreapi.com/products');
  const data = await response.json();
  return data;
}

app.get('/products', async (req, res) => {
  try {
    const products = await getProducts();
    const shopifyProducts = [];

    for (const product of products) {
      const newProduct = await shopify.product.create({
        title: product.title,
        body_html: product.description,
        variants: [{
          price: product.price
        }],
        images: [{
          src: product.image
        }],
        tags: 'demo-product, test-product'
      });
      shopifyProducts.push(newProduct);
      console.log(newProduct);
    }

    res.json(shopifyProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while fetching or creating products.');
  }
});

app.listen(PORT, () => {
  console.log(`The server is running at ${PORT}....`);
});
