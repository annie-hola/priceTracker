'use client';

const platforms = [
  { name: 'Tiki', value: 'tiki' },
  { name: 'Lazada', value: 'lazada' },
];

type SelectPlatformProps = {
  selectedPlatform?: string;
  setSelectedPlatform?: (e: any) => void;
};

function SelectPlatform({
  selectedPlatform,
  setSelectedPlatform,
}: SelectPlatformProps) {
  return (
    <div className='mt-4'>
      <label htmlFor='countries' className='block mb-2 text-sm'>
        Select an platform
      </label>
      <select
        id='countries'
        value={selectedPlatform}
        onChange={(e) => setSelectedPlatform?.(e.target.value)}
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
      >
        <option>Choose a platform</option>
        {platforms.map((item) => (
          <option value={item?.value} key={item?.value}>
            {item?.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectPlatform;
