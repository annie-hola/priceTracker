'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';
import {
  extractCurrency,
  extractDescription,
  extractPrice,
  parseVNPrice,
} from '../utils';

export async function scrapeProduct(url: string, platform: string) {
  if (!url) return;

  // BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch the product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    // console.log('res', response);

    const scarpeDataByPlatform: any = {
      tiki: {
        title: $('.Title__TitledStyled-sc-1kxsq5b-0').text().trim(),
        currentPrice: extractPrice(
          $('.product-price__current-price'),
          $('.priceToPay span.a-price-whole'),
          $('.a.size.base.a-color-price'),
          $('.a-button-selected .a-color-base')
        ),
        originalPrice: extractPrice(
          $('.a-price.a-text-price span.a-offscreen'),
          $('#listPrice'),
          $('#priceblock_dealprice'),
          $('.a-size-base.a-color-price')
        ),
        outOfStock:
          $('#availability span').text().trim().toLowerCase() ===
          'currently unavailable',
        images: $('.webpimg-container').attr('srcset') || '{}',
        discountRate: $('.product-price__discount-rate')
          .text()
          .replace(/[-%]/g, ''),
        currency: extractCurrency($('.a-price-symbol')),
        reviewsCount: $('.review-rating__total').text().trim(),
        stars: $('.review-rating__point').text().trim(),
      },
      lazada: {},
    };
    // Extract the product title
    const title = scarpeDataByPlatform[platform].title;
    // TODO: price not have .000
    const currentPrice = scarpeDataByPlatform[platform].currentPrice;

    const originalPrice = scarpeDataByPlatform[platform].originalPrice;

    const outOfStock = scarpeDataByPlatform[platform].outOfStock;

    const images = scarpeDataByPlatform[platform].images;

    // console.log('title', title);
    const discountRate = scarpeDataByPlatform[platform].discountRate;

    const currency = scarpeDataByPlatform[platform].currency;

    const imageUrls = Object.keys(JSON.parse(images));

    const description = extractDescription($);

    const reviewsCount = scarpeDataByPlatform[platform].reviewsCount;

    const stars = scarpeDataByPlatform[platform].starts;

    // Construct data object with scraped information
    const data = {
      url,
      currency: currency || '$',
      image: imageUrls[0],
      title,
      currentPrice: parseVNPrice(currentPrice) || parseVNPrice(originalPrice),
      originalPrice: parseVNPrice(originalPrice) || parseVNPrice(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category: 'category',
      reviewsCount,
      stars,
      isOutOfStock: outOfStock,
      description,
      lowestPrice: parseVNPrice(currentPrice) || parseVNPrice(originalPrice),
      highestPrice: parseVNPrice(originalPrice) || parseVNPrice(currentPrice),
      averagePrice: parseVNPrice(currentPrice) || parseVNPrice(originalPrice),
    };

    console.log('data', data);
    return;
    return data;
  } catch (error: any) {
    console.log(error);
  }
}
