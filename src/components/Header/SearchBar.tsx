import { Link } from 'react-router-dom';
import Select, { GroupBase, OptionProps, Props, components } from 'react-select';

import './SearchBar.css';

export type Option = {
  value: string;
  label: string;
};

const CustomOption = ({ children, ...props }: OptionProps<Option, false, GroupBase<Option>>) => {
  return (
    <components.Option {...props}>
      <Link to={`${props.data.value}`} className='flex h-full w-full p-2.5'>
        {children}
      </Link>
    </components.Option>
  );
};

const SearchBar = ({ options, onChange, ...props }: Props<Option, false, GroupBase<Option>>) => {
  return (
    <Select
      options={options}
      onChange={onChange}
      unstyled
      classNamePrefix='react-search-bar'
      className='react-select__container'
      menuPlacement='auto'
      isClearable
      styles={{
        control: (baseStyle, { isFocused }) => ({
          ...baseStyle,
          outline: isFocused ? '2px auto #4285F4' : 'unset',
          boxSizing: 'content-box',
        }),
        dropdownIndicator: (baseStyle) => ({
          ...baseStyle,
          display: 'hidden',
        }),
      }}
      classNames={{
        container: () =>
          'flex w-full flex-1 shrink-[2] md:w-[300px] lg:w-[400px] rounded-lg border border-[#CCC]',
        control: () =>
          'flex flex-[2] rounded-lg hover:cursor-text items-center justify-center px-3 py-2 text-xs font-medium lg:text-sm 3xl:px-5 3xl:py-3 3xl:text-base',
        placeholder: () => 'hidden',
        menu: () => 'rounded-lg border border-[#CCC] p-2.5 my-2 z-[100] bg-white',
        valueContainer: () => 'flex flex-1',
        option: () =>
          'text-sm font-normal w-full h-full hover:bg-[#F1F1F1] cursor-pointer rounded-lg',
      }}
      components={{ Option: CustomOption }}
      {...props}
    />
  );
};

export default SearchBar;
