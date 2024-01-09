'use client';

import { scrapeAndStoreProduct } from '@/lib/actions';
import { FormEvent, useState } from 'react';
import Image from 'next/image';
import SelectPlatform from './SelectPlatform';

const PlatformImage: any = {
  lazada: '/assets/icons/lazada.svg',
  tiki: '/assets/icons/tiki.svg',
};
const PlatformImageRender = (platform: string) => PlatformImage[platform] || '';

const isValidAmazonProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if (
      hostname.includes('shopee.com') ||
      hostname.includes('shopee.') ||
      hostname.endsWith('shopee')
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
};

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchPrompt);

    // if (!isValidLink) return alert('Please provide a valid Shopee link');

    try {
      setIsLoading(true);

      // TODO
      // Scrape the product page
      const product = await scrapeAndStoreProduct(
        searchPrompt,
        selectedPlatform
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SelectPlatform
        selectedPlatform={selectedPlatform}
        setSelectedPlatform={setSelectedPlatform}
      />
      {selectedPlatform && (
        <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}>
          <input
            type='text'
            value={searchPrompt}
            onChange={(e) => setSearchPrompt(e.target.value)}
            placeholder='Enter Product link'
            className='searchbar-input'
          />

          <button
            type='submit'
            className='searchbar-btn flex flex-row gap-2 items-center'
            disabled={searchPrompt === ''}
          >
            {isLoading ? 'Searching...' : 'Search'}{' '}
            <Image
              src={PlatformImageRender(selectedPlatform)}
              alt='logo'
              width={28}
              height={28}
            />
          </button>
        </form>
      )}
    </>
  );
};

export default Searchbar;
