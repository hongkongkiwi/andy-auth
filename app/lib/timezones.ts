export interface Timezone {
  value: string;
  label: string;
}

export const TIMEZONES: Timezone[] = [
  { value: 'UTC', label: 'UTC' },
  { value: 'GMT', label: 'GMT' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'Europe/London', label: 'British Time (BST)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Europe/Moscow', label: 'Moscow Time (MSK)' },
  { value: 'Asia/Dubai', label: 'Gulf Time (GST)' },
  { value: 'Asia/Shanghai', label: 'China Time (CST)' },
  { value: 'Asia/Tokyo', label: 'Japan Time (JST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
  { value: 'Pacific/Auckland', label: 'New Zealand Time (NZT)' }
] as const;

// Make sure the file is treated as a module
export {};
